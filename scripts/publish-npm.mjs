#!/usr/bin/env node
/**
 * Publish dsh-cot-peek to npm and sync market.json in one shot.
 *
 * Token sources, in order:
 *   1. NPM_TOKEN environment variable
 *   2. ~/.dsh/secrets/npm-publish-token   (chmod 600, never inside the repo)
 *
 * The token is only written into a throwaway .npmrc inside a temp directory, so
 * nothing lands in the repository or in the user's global npm config.
 *
 * Usage:
 *   node scripts/publish-npm.mjs            # publish + update market.json
 *   node scripts/publish-npm.mjs --no-git   # skip the commit/push step
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir, homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const { name, version } = pkg;
const registry = 'https://registry.npmjs.org';

function resolveToken() {
  if (process.env.NPM_TOKEN && process.env.NPM_TOKEN.trim() !== '') {
    return { token: process.env.NPM_TOKEN.trim(), from: 'NPM_TOKEN env' };
  }
  const file = join(homedir(), '.dsh', 'secrets', 'npm-publish-token');
  if (!existsSync(file)) return null;
  const mode = (statSync(file).mode & 0o777).toString(8);
  if (!['600', '400'].includes(mode)) {
    console.warn(`[publish] warning: ${file} has mode ${mode}, expected 600/400`);
  }
  return { token: readFileSync(file, 'utf8').trim(), from: file };
}

const resolved = resolveToken();
if (resolved === null || resolved.token === '') {
  console.error('[publish] no npm token found.');
  console.error('  create a Granular Access Token with "Bypass two-factor authentication"');
  console.error('  and save it to ~/.dsh/secrets/npm-publish-token (chmod 600).');
  process.exit(1);
}
console.log(`[publish] using token from ${resolved.from}; publishing ${name}@${version}`);

async function waitForVersion(attempts = 24) {
  for (let i = 1; i <= attempts; i += 1) {
    try {
      const response = await fetch(`${registry}/${name}/${version}?t=${Date.now()}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) return true;
    } catch {
      /* keep polling */
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return false;
}

// --- publish ---------------------------------------------------------------
const tempDir = mkdtempSync(join(tmpdir(), 'dsh-npm-publish-'));
const tempNpmrc = join(tempDir, '.npmrc');
writeFileSync(tempNpmrc, `//registry.npmjs.org/:_authToken=${resolved.token}\n`, { mode: 0o600 });
try {
  execFileSync('npm', ['publish', '--access', 'public'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NPM_CONFIG_USERCONFIG: tempNpmrc },
  });
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

// --- wait for the registry to serve it -------------------------------------
console.log('[publish] waiting for npm to serve the new version...');
if (!(await waitForVersion())) {
  console.error(`[publish] ${name}@${version} never became available; market.json left untouched.`);
  process.exit(1);
}
console.log(`[publish] ${name}@${version} is live`);

// --- sync market.json ------------------------------------------------------
const packument = await (
  await fetch(`${registry}/${name}?t=${Date.now()}`, { signal: AbortSignal.timeout(15000) })
).json();
const publishedAtRaw = Math.floor(new Date(packument.time?.[version]).getTime() / 1000);
// The registry can briefly omit `time` for a fresh version; a NaN here used to
// serialise as null and made the whole market index invalid. Fall back to now.
const publishedAt =
  Number.isInteger(publishedAtRaw) && publishedAtRaw > 0 ? publishedAtRaw : Math.floor(Date.now() / 1000);

const marketPath = join(root, 'market.json');
const market = JSON.parse(readFileSync(marketPath, 'utf8'));
const plugin = market.plugins.find((entry) => entry.name === name);
if (plugin === undefined) {
  console.error(`[publish] ${name} is missing from market.json`);
  process.exit(1);
}
const byVersion = new Map(plugin.versions.map((entry) => [entry.version, entry]));
byVersion.set(version, {
  version,
  publishTimestamp: publishedAt,
  source: { type: 'npm' },
  engines: { dsh: pkg.engines?.dsh ?? '>=0.2.0' },
});
plugin.versions = [...byVersion.values()].sort((left, right) =>
  right.version.localeCompare(left.version, undefined, { numeric: true }),
);
writeFileSync(marketPath, JSON.stringify(market, null, 2) + '\n', 'utf8');
console.log(`[publish] market.json now lists ${plugin.versions.map((v) => v.version).join(', ')}`);

// --- commit + push ---------------------------------------------------------
if (!process.argv.includes('--no-git')) {
  execFileSync('git', ['add', '-A'], { cwd: root, stdio: 'inherit' });
  execFileSync('git', ['commit', '-m', `chore(release): ${name}@${version}`], {
    cwd: root,
    stdio: 'inherit',
  });
  execFileSync('git', ['push'], { cwd: root, stdio: 'inherit' });
  console.log('[publish] committed and pushed');
}

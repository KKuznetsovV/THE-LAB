#!/usr/bin/env node
// Build gate for THE LAB monorepo.
// Usage: node scripts/check.mjs [--only=frontend,lib] [--skip-install]
// For every package that exists (in dependency order) it installs deps if needed,
// then runs `build` (required), `lint` (if defined) and `test` (if defined).
// Exits 1 if any step fails. Works on macOS, Linux and Windows.

import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = ['lib', 'identity-service', 'content-service', 'media-service', 'frontend'];

const args = process.argv.slice(2);
const onlyArg = args.find((a) => a.startsWith('--only='));
const only = onlyArg ? onlyArg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean) : null;
const skipInstall = args.includes('--skip-install');
const isCI = Boolean(process.env.CI);

function run(cmd, cmdArgs, cwd) {
  const started = Date.now();
  const result = spawnSync(cmd, cmdArgs, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '1' },
  });
  return { ok: result.status === 0, ms: Date.now() - started };
}

const results = [];
let failed = false;

const targets = PACKAGES.filter((name) => (only ? only.includes(name) : true));

for (const name of targets) {
  const dir = join(ROOT, name);
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) {
    results.push({ name, step: '-', status: 'absent', ms: 0 });
    continue;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const scripts = pkg.scripts ?? {};
  console.log(`\n██ ${name}`);

  if (!skipInstall) {
    const needsInstall = isCI || !existsSync(join(dir, 'node_modules'));
    if (needsInstall) {
      const hasLock = existsSync(join(dir, 'package-lock.json'));
      const r = run('npm', hasLock ? ['ci'] : ['install'], dir);
      results.push({ name, step: hasLock ? 'npm ci' : 'npm install', status: r.ok ? 'ok' : 'FAIL', ms: r.ms });
      if (!r.ok) { failed = true; continue; }
    }
  }

  if (!scripts.build) {
    console.error(`  ${name}: missing "build" script`);
    results.push({ name, step: 'build', status: 'FAIL (no script)', ms: 0 });
    failed = true;
    continue;
  }

  for (const step of ['build', 'lint', 'test']) {
    if (!scripts[step]) continue;
    const r = run('npm', ['run', step], dir);
    results.push({ name, step, status: r.ok ? 'ok' : 'FAIL', ms: r.ms });
    if (!r.ok) { failed = true; break; }
  }
}

console.log('\n── THE LAB build gate ──');
const present = results.filter((r) => r.status !== 'absent');
if (present.length === 0) {
  console.log('No packages yet — nothing to build. Gate passes.');
} else {
  for (const r of results) {
    const time = r.ms ? `${(r.ms / 1000).toFixed(1)}s` : '';
    console.log(`${r.status.padEnd(16)} ${r.name.padEnd(18)} ${r.step.padEnd(12)} ${time}`);
  }
}
console.log(failed ? '\nGATE: RED ✖' : '\nGATE: GREEN ✔');
process.exit(failed ? 1 : 0);

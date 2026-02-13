#!/usr/bin/env node
/**
 * copy-web.js — copies source files into www/ for Capacitor native builds.
 * Tests always run against the source directory (port 3000), not www/.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'www');

function mkdirp(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  mkdirp(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(src, dest);
    } else {
      copyFile(src, dest);
    }
  }
}

// Clean www/
if (fs.existsSync(OUT)) {
  fs.rmSync(OUT, { recursive: true, force: true });
}
mkdirp(OUT);

// Copy HTML files
for (const file of ['index.html', 'sw.js', 'manifest.json']) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    copyFile(src, path.join(OUT, file));
    console.log(`Copied ${file}`);
  }
}

// Copy directories
for (const dir of ['games', 'js', 'icons']) {
  copyDir(path.join(ROOT, dir), path.join(OUT, dir));
  console.log(`Copied ${dir}/`);
}

console.log(`\nWeb assets copied to www/`);

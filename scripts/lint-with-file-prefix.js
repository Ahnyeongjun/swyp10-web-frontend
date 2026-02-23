#!/usr/bin/env node
// USAGE: NextJS Lint는 --file로 직접 파일 명단을 전달 필요
import { execSync } from 'child_process';
import path from 'path';

const files = process.argv.slice(2);
if (files.length === 0) {
  process.exit(0);
}

const fileArgs = files
  .map(f => `--file "${path.relative(process.cwd(), f)}"`)
  .join(' ');

const command = `yarn exec next lint ${fileArgs}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}

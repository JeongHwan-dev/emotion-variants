/**
 * @filename: .lintstagedrc.js
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
  '*': [
    () => {
      const { spawnSync } = require('node:child_process');

      try {
        const res = spawnSync('gitleaks', ['version'], {
          stdio: 'ignore',
        });

        if (res.error || res.status !== 0) {
          throw res.error || new Error('gitleaks not found');
        }
      } catch {
        console.error('\n❌ gitleaks is not installed. Please install it to continue:\n');
        console.error('  macOS: brew install gitleaks');
        console.error('  Linux: See https://github.com/gitleaks/gitleaks#installation');
        console.error('  Windows: choco install gitleaks\n');
        process.exit(1);
      }

      return 'gitleaks protect --staged --redact';
    },
  ],
  '*.{js,jsx,mjs,ts,tsx,mts}': ['pnpm check:fix'],
  '*.{json,css,md}': ['pnpm format:fix'],
};

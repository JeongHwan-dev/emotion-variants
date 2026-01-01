module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          {
            type: 'breaking',
            release: 'major',
          },
          {
            type: 'feat',
            release: 'minor',
          },
          {
            type: 'fix',
            release: 'patch',
          },
          {
            type: 'hotfix',
            release: 'patch',
          },
          {
            type: 'perf',
            release: 'patch',
          },
          {
            type: 'revert',
            release: 'patch',
          },
          {
            type: 'docs',
            release: 'patch',
          },
          {
            type: 'style',
            release: false,
          },
          {
            type: 'refactor',
            release: 'patch',
          },
          {
            type: 'test',
            release: false,
          },
          {
            type: 'chore',
            release: 'patch',
          },
          {
            type: 'ci',
            release: false,
          },
          {
            type: 'remove',
            release: 'patch',
          },
          {
            type: 'release',
            release: 'patch',
          },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            {
              type: 'breaking',
              section: '💥 Breaking Changes',
            },
            {
              type: 'feat',
              section: '✨ Features',
            },
            {
              type: 'fix',
              section: '🐛 Bug Fixes',
            },
            {
              type: 'hotfix',
              section: '🚑 Hot Fixes',
            },
            {
              type: 'perf',
              section: '⚡️ Performance Improvements',
            },
            {
              type: 'revert',
              section: '⏪️ Reverts',
            },
            {
              type: 'docs',
              section: '📝 Documentation',
            },
            {
              type: 'style',
              section: '💄 Styles',
            },
            {
              type: 'refactor',
              section: '♻️ Code Refactoring',
            },
            {
              type: 'test',
              section: '✅ Tests',
            },
            {
              type: 'chore',
              section: '🔧 Miscellaneous Chores',
            },
            {
              type: 'ci',
              section: '👷 CI',
            },
            {
              type: 'remove',
              section: '🗑️ Removals',
            },
          ],
        },
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        // biome-ignore lint/suspicious/noTemplateCurlyInString: semantic-release template syntax
        message: 'release: bump to v${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        releasedLabels: ['🏷️ released'],
      },
    ],
  ],
};

/**
 * Single source of truth for label definitions
 *
 * Modifying this file will automatically synchronize the following files:
 * - .github/labels/labels.json (used by sync-labels-to-github workflow)
 * - .github/labels/labeler.yml (for GitHub Actions labeler)
 * - commitizen.config.mjs (commit type selection list)
 *
 * Auto-sync: When this file is changed in a PR, GitHub Actions will automatically update related files and add a commit.
 */

export const LABELS = [
  {
    value: 'feat',
    description: 'New feature or enhancement',
    emoji: '✨',
    color: '#FFD700',
    isCommitType: true,
  },
  {
    value: 'fix',
    description: 'Bug fix',
    emoji: '🐛',
    color: '#FF6B6B',
    isCommitType: true,
  },
  {
    value: 'hotfix',
    description: 'Hotfix',
    emoji: '🚑',
    color: '#FF4444',
    isCommitType: true,
  },
  {
    value: 'breaking',
    description: 'Breaking change',
    emoji: '💥',
    color: '#C40948',
    isCommitType: true,
  },
  {
    value: 'perf',
    description: 'Performance improvement',
    emoji: '⚡',
    color: '#FDB813',
    isCommitType: true,
  },
  {
    value: 'refactor',
    description: 'Code refactoring',
    emoji: '♻️',
    color: '#2ECC71',
    isCommitType: true,
  },
  {
    value: 'docs',
    description: 'Documentation update',
    emoji: '📝',
    color: '#4169E1',
    isCommitType: true,
  },
  {
    value: 'test',
    description: 'Test code addition or modification',
    emoji: '✅',
    color: '#00FF00',
    isCommitType: true,
  },
  {
    value: 'style',
    description: 'Code style update',
    emoji: '💄',
    color: '#FF69B4',
    isCommitType: true,
  },
  {
    value: 'chore',
    description: 'Build, package updates, or other non-functional changes',
    emoji: '🔧',
    color: '#808080',
    isCommitType: true,
  },
  {
    value: 'ci',
    description: 'CI/CD configuration changes',
    emoji: '👷',
    color: '#FF8C00',
    isCommitType: true,
  },
  {
    value: 'remove',
    description: 'Remove unused code or files',
    emoji: '🗑️',
    color: '#FF7F50',
    isCommitType: true,
  },
  {
    value: 'revert',
    description: 'Revert previous commit',
    emoji: '⏪',
    color: '#9370DB',
    isCommitType: true,
  },
];

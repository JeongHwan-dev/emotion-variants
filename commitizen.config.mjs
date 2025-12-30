import { LABELS } from './.github/labels/labels.config.mjs';

const MAX_COMMIT_MESSAGE_LENGTH = 100;

const MAX_SCOPE_LENGTH = 50;

const COMMIT_TYPES = Object.freeze(
  LABELS.filter(({ isCommitType }) => isCommitType).map(({ description, emoji, value }) => ({
    description,
    emoji,
    value,
  })),
);

const COMMIT_TYPE_CHOICES = Object.freeze(
  COMMIT_TYPES.map(({ description, emoji, value }) => ({
    name: `${emoji} ${value.padEnd(10, ' ')}: ${description}`,
    value,
  })),
);

const COMMIT_QUESTIONS = [
  {
    choices: COMMIT_TYPE_CHOICES,
    message: '1️⃣ Select commit type:',
    name: 'type',
    type: 'list',
  },
  {
    message: '2️⃣ Enter commit scope:',
    name: 'scope',
    type: 'input',
    validate: (input) => {
      const trimmedScopeLength = input.trim().length;

      if (trimmedScopeLength === 0) {
        return 'Scope is required.';
      }

      if (trimmedScopeLength > MAX_SCOPE_LENGTH) {
        return `Scope must be ${MAX_SCOPE_LENGTH} characters or less.`;
      }

      return true;
    },
  },
  {
    message: '3️⃣ Enter commit message:',
    name: 'subject',
    type: 'input',
    validate: (input) => {
      const trimmedMessageLength = input.trim().length;

      if (trimmedMessageLength === 0) {
        return 'Commit message is required.';
      }

      if (trimmedMessageLength > MAX_COMMIT_MESSAGE_LENGTH) {
        return `Commit message must be ${MAX_COMMIT_MESSAGE_LENGTH} characters or less.`;
      }

      return true;
    },
  },
  {
    message: '4️⃣ Enter commit description (optional, press Enter to skip):',
    name: 'description',
    type: 'input',
  },
];

const config = {
  prompter: (cz, commit) => {
    cz.prompt(COMMIT_QUESTIONS).then(({ description, scope, subject, type }) => {
      const trimmedScope = scope.trim();
      const trimmedDescription = description?.trim();
      const baseCommitMessage = `${type}(${trimmedScope}): ${subject}`;
      const commitMessage =
        trimmedDescription?.length > 0
          ? `${baseCommitMessage}\n\n${trimmedDescription}`
          : baseCommitMessage;
      const divider = '-'.repeat(50);

      cz.prompt([
        {
          default: true,
          message: `✅ Commit message is as follows. Proceed with commit?\n${divider}\n${commitMessage}\n${divider}\n`,
          name: 'confirmCommit',
          type: 'confirm',
        },
      ]).then(({ confirmCommit }) => {
        if (confirmCommit) {
          commit(commitMessage);

          return;
        }

        console.log('❌ Commit cancelled.');
      });
    });
  },
};

export default config;

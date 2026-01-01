/**
 * Script to automatically generate label configuration files
 * Generates labels.json and labeler.yml based on labels.config.mjs.
 * Does not write files if there are no changes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LABELS } from '../labels/labels.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_NAMES = Object.freeze({
  LABELER_YML: 'labeler.yml',
  LABELS_JSON: 'labels.json',
});

const ROOT_DIRECTORY = path.resolve(__dirname, '../..');
const GITHUB_DIRECTORY = path.join(ROOT_DIRECTORY, '.github');
const LABELS_DIRECTORY = path.join(GITHUB_DIRECTORY, 'labels');
const LABELS_JSON_PATH = path.join(LABELS_DIRECTORY, FILE_NAMES.LABELS_JSON);
const LABELER_YML_PATH = path.join(LABELS_DIRECTORY, FILE_NAMES.LABELER_YML);

/**
 * Combines emoji and value to generate a label name.
 * @param {string} emoji - Label emoji
 * @param {string} value - Label value
 * @returns {string} Label name combining emoji and value
 */
const formatLabelName = (emoji, value) => {
  return `${emoji} ${value}`;
};

/**
 * Converts label array to JSON file format string.
 * @param {Array<{color: string, description: string, emoji: string, value: string}>} labels - Label array to convert
 * @returns {string} JSON format string
 */
const formatLabelsToJsonString = (labels) => {
  const labelsForJson = labels.map(({ color, description, emoji, value }) => ({
    name: formatLabelName(emoji, value),
    description,
    color,
  }));

  return `${JSON.stringify(labelsForJson, null, 2)}\n`;
};

/**
 * Converts label array to YAML file format string.
 * @param {Array<{emoji: string, value: string}>} labels - Label array to convert
 * @returns {string} YAML format string (release uses title pattern, others use head-branch pattern)
 */
const formatLabelsToYamlString = (labels) => {
  const labelerYml = labels
    .map(({ emoji, value }) => {
      const labelName = formatLabelName(emoji, value);
      const pattern = value === 'release' ? `title: ['^release:']` : `head-branch: ['${value}/']`;

      return `${labelName}:\n  - ${pattern}`;
    })
    .join('\n\n');

  return `${labelerYml}\n`;
};

const newLabelsJsonContent = formatLabelsToJsonString(LABELS);
const newLabelerYmlContent = formatLabelsToYamlString(LABELS);

/**
 * Safely reads a file. Returns an empty string if the file does not exist or reading fails.
 * @param {string} filePath - File path to read
 * @returns {string} File content or empty string
 */
const readFileSafe = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
};

const existingLabelsJson = readFileSafe(LABELS_JSON_PATH);
const existingLabelerYml = readFileSafe(LABELER_YML_PATH);

/**
 * Writes file only when there are changes.
 * @param {string} filePath - File path to write
 * @param {string} newContent - New file content
 * @param {string} existingContent - Existing file content
 * @returns {boolean} Whether the file was changed
 */
const writeFileIfChanged = (filePath, newContent, existingContent) => {
  if (existingContent !== newContent) {
    fs.writeFileSync(filePath, newContent);

    return true;
  }

  return false;
};

const hasLabelsJsonChanged = writeFileIfChanged(
  LABELS_JSON_PATH,
  newLabelsJsonContent,
  existingLabelsJson,
);

const hasLabelerYmlChanged = writeFileIfChanged(
  LABELER_YML_PATH,
  newLabelerYmlContent,
  existingLabelerYml,
);

const CONSOLE_MESSAGES = Object.freeze({
  SKIPPED: 'ℹ️ No changes.',
  SUCCESS: `✅ ${FILE_NAMES.LABELS_JSON} and ${FILE_NAMES.LABELER_YML} have been successfully generated.`,
});

const hasChanges = hasLabelsJsonChanged || hasLabelerYmlChanged;
const message = hasChanges ? CONSOLE_MESSAGES.SUCCESS : CONSOLE_MESSAGES.SKIPPED;

console.log(message);

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import process from 'node:process';
import { defineConfig } from 'allure';
import { latestRunFolder } from './scripts/allure/report-folders.mjs';
import report from './src/config/report.config.json' with { type: 'json' };

/** Current local date and time, e.g. "2026-11-20_14-35-08". Used as the report folder name. */
const timestamp = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `${date}_${time}`;
};

/** Feature file name of a test, e.g. "login" from "e2e-framework:test/features/ui/login.feature#...". */
const specName = (fullName = '') => basename(fullName.split('#')[0], '.feature') || 'unknown';

/** Feature files that ran in the last test run, read from the Allure result files. */
const specsInLastRun = () => {
  if (!existsSync(report.resultsDir)) return [];
  const specs = readdirSync(report.resultsDir)
    .filter((file) => file.endsWith('-result.json'))
    .map((file) => JSON.parse(readFileSync(join(report.resultsDir, file), 'utf8')))
    .map((result) => specName(result.fullName));
  return [...new Set(specs)];
};

/** A single-file report that shows only the tests of one feature file. */
const reportFor = (spec) => ({
  import: '@allurereport/plugin-awesome',
  options: {
    reportName: spec,
    singleFile: true,
    filter: (result) => specName(result.fullName) === spec,
  },
});

/**
 * Folder of the newest report, for "allure open": the latest run folder (it has the overview
 * page), or the only feature folder inside it when a single feature ran.
 */
const latestReport = () => {
  const lastRun = latestRunFolder();
  if (existsSync(join(lastRun, 'index.html'))) return lastRun;
  return join(lastRun, readdirSync(lastRun)[0]);
};

/** Where a new report is written: <timestamp>/ with one <feature>/ folder per feature. */
const newReport = (specs) => {
  const runFolder = `${report.reportsDir}/${timestamp()}`;
  // Allure puts each report in a subfolder named after it only when there are several,
  // so a single report gets its feature folder here.
  return specs.length === 1 ? `${runFolder}/${specs[0]}` : runFolder;
};

const specs = specsInLastRun();
const isOpen = process.argv.includes('open');

export default defineConfig({
  name: 'E2E test report',
  resultsDir: report.resultsDir,
  output: isOpen ? latestReport() : newReport(specs),
  historyPath: report.historyFile,
  plugins: Object.fromEntries(specs.map((spec) => [spec, reportFor(spec)])),
});

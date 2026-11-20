const { rmSync } = require('node:fs');
const report = require('./src/config/report.config.json');

// Start every run with empty Allure results, so the report shows only this run.
rmSync(report.resultsDir, { recursive: true, force: true });

// Feature files named on the command line run alone; otherwise every feature runs.
const featuresGiven = process.argv.some((arg) => arg.includes('.feature'));

const common = {
  paths: featuresGiven ? [] : ['test/features/**/*.feature'],
  require: ['src/support/**/*.ts', 'test/step-definitions/**/*.ts'],
  requireModule: ['ts-node/register', 'tsconfig-paths/register'],
  format: [
    'progress-bar',
    'summary',
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: { snippetInterface: 'async-await', resultsDir: report.resultsDir },
  parallel: Number(process.env.PARALLEL ?? 1),
  retry: Number(process.env.RETRY ?? 0),
};

module.exports = { default: common };

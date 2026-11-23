// Runs Cucumber, then always builds the Allure report, also when tests fail.
// Usage (through package.json): npm run test:ui -- test/features/ui/login.feature
// Every argument is passed on to Cucumber unchanged.
import { spawnSync } from 'node:child_process';
import console from 'node:console';
import { existsSync, readdirSync } from 'node:fs';
import process from 'node:process';
import report from '../src/config/report.config.json' with { type: 'json' };

const CUCUMBER = 'node_modules/@cucumber/cucumber/bin/cucumber.js';

// Started with node directly (no shell), so arguments like --tags "not @2fa" stay intact.
const tests = spawnSync(process.execPath, [CUCUMBER, ...process.argv.slice(2)], {
  stdio: 'inherit',
});
const testsExitCode = tests.status ?? 1;

// No results means no scenario matched, so there is nothing to report.
const hasResults = existsSync(report.resultsDir) && readdirSync(report.resultsDir).length > 0;
let reportExitCode = 0;
if (hasResults) {
  console.log('\nGenerating Allure report...');
  reportExitCode = spawnSync('npm', ['run', 'report:allure'], {
    stdio: 'inherit',
    shell: true,
  }).status;
}

// The tests decide the result; a failed report only fails a run whose tests passed.
process.exitCode = testsExitCode || (reportExitCode ?? 1);

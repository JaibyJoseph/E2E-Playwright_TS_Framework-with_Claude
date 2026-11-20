import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import report from '../../src/config/report.config.json' with { type: 'json' };

/** Newest run folder, e.g. "reports/allure-report/2026-11-20_14-24-29". Timestamps sort by name. */
export const latestRunFolder = () => {
  const runs = existsSync(report.reportsDir) ? readdirSync(report.reportsDir).sort() : [];
  if (!runs.length) throw new Error('No Allure report yet. Run "npm run report:allure" first.');
  return join(report.reportsDir, runs.at(-1));
};

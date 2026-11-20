// Runs after "allure generate". Allure links each feature on the overview page to "<feature>/",
// which a browser only opens through a web server. Pointing the links at "<feature>/index.html"
// lets the overview open each feature's test cases straight from disk.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { latestRunFolder } from './report-folders.mjs';

const overviewPage = join(latestRunFolder(), 'index.html');

// Only present when several features ran; a single feature has no overview page.
if (existsSync(overviewPage)) {
  const html = readFileSync(overviewPage, 'utf8');
  const linked = html.replace(/"href":"([\w.-]+)\/"/g, '"href":"$1/index.html"');
  writeFileSync(overviewPage, linked);
}

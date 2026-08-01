import testRegistry from './test-registry.mjs';

const smokeTests = [...new Map(
  testRegistry
    .filter((entry) => entry.status === 'active' && entry.smokeScript)
    .map((entry) => [entry.smokeScript, entry]),
).values()];

if (process.argv.includes('--paths')) {
  console.log(smokeTests.map((entry) => entry.smokeScript).join('\n'));
} else if (process.argv.includes('--json')) {
  console.log(JSON.stringify(smokeTests, null, 2));
} else {
  for (const entry of smokeTests) {
    console.log(`${entry.id}\t${entry.route}\t${entry.smokeScript}`);
  }
}


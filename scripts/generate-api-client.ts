import { execSync } from 'node:child_process';

const scriptArgs = new Set(process.argv.slice(2));

if (scriptArgs.size > 1) {
  console.error('Just 1 argument is allowed: assertNoChanges');
  process.exit(1);
}

// 1. OpenAPI Schema aus NestJS exportieren
execSync('npx nx run api:export-schema --output-style=stream', {
  stdio: 'inherit',
  env: { ...process.env, NX_DAEMON: 'false' },
});

// 2. API Client generieren
execSync('npx nx run api-client:generate --output-style=stream --skip-nx-cache', {
  stdio: 'inherit',
  env: { ...process.env, NX_DAEMON: 'false' },
});

// 3. Generierten Code formatieren
execSync('npx nx format:write --uncommitted --output-style=stream --skip-nx-cache', {
  stdio: 'inherit',
  env: { ...process.env, NX_DAEMON: 'false' },
});

if (
  scriptArgs.has('assertNoChanges') ||
  scriptArgs.has('assert-no-changes') ||
  scriptArgs.has('assertNoChanges=true')
) {
  assertNoChanges();
}

export function assertNoChanges() {
  const gitResult = execSync('git status --porcelain');
  if (gitResult.length > 0) {
    console.error();
    console.error('⚠️ Assertion failed: there were uncommitted changes after generating the API client:');
    console.error(gitResult.toString());
    console.error();
    console.error("Please run 'npm run generate' locally and commit the changes.");
    console.error();
    process.exit(1);
  }
}

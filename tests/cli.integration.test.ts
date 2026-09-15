// tests/cli.integration.test.ts
// Use require to avoid TypeScript error when @types/execa is not installed
// @ts-ignore
const { execa } = require('execa');
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
// Jest globals are provided by the test environment in this project. Avoid importing
// from '@jest/globals' because some Jest setups do not include that package.

const CLI_BIN = path.resolve(__dirname, '../dist/cli.js'); // Path to compiled binary/script

describe('RampX (rpx) CLI Integration Tests', () => {
  let tempDir: string;

  beforeEach(() => {
    // Create an isolated temporary directory for every test run
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rpx-test-'));
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('scaffolds a project structure successfully via non-interactive flags', async () => {
    const projectPath = path.join(tempDir, 'my-clean-app');

    // Run rpx with non-interactive flags
    const result = await execa('node', [
      CLI_BIN,
      'init',
      '--name', 'my-clean-app',
      '--framework', 'flutter',
      '--pattern', 'clean',
      '--yes'
    ], {
      cwd: tempDir,
      reject: false // Prevent throwing on error so we can assert status codes manually
    });

    // 1. Verify Exit Code
    expect(result.exitCode).toBe(0);

    // 2. Verify Output Text
    expect(result.stdout).toContain('Project scaffolded successfully');

    // 3. Verify Folder Architecture Generation
    expect(fs.existsSync(path.join(projectPath, 'lib/domain'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'lib/data'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'lib/presentation'))).toBe(true);
    expect(fs.existsSync(path.join(projectPath, 'README.md'))).toBe(true);
  });

  it('fails gracefully and returns exit code 1 on unknown flags', async () => {
    const result = await execa('node', [
      CLI_BIN,
      'init',
      '--invalid-flag'
    ], {
      cwd: tempDir,
      reject: false
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/unknown option/i);
  });

  it('prevents overwriting an existing directory without explicit confirmation', async () => {
    const existingFolder = path.join(tempDir, 'existing-app');
    fs.mkdirSync(existingFolder, { recursive: true });
    fs.writeFileSync(path.join(existingFolder, 'file.txt'), 'content');

    const result = await execa('node', [
      CLI_BIN,
      'init',
      '--name', 'existing-app',
      '--framework', 'node'
    ], {
      cwd: tempDir,
      reject: false,
      env: { CI: 'true' } // Force non-TTY environment
    });

    // Should abort or fail because terminal is non-interactive and dir exists
    expect(result.exitCode).not.toBe(0);
    expect(result.stderr + result.stdout).toMatch(/already exists/i);
  });
});
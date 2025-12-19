// commands/init/index.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { execSync } from 'child_process';
import boxen from 'boxen';
import { patterns } from './patterns.js';
import { createTemplate } from './templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validate project type
 */
const validateType = (type) => {
  const validTypes = ['flutter', 'laravel', 'node'];
  if (!validTypes.includes(type)) {
    console.log(chalk.red.bold('\n❌ Invalid project type!\n'));
    console.log(chalk.yellow('Valid types: ') + chalk.cyan(validTypes.join(', ')));
    process.exit(1);
  }
};

/**
 * Validate project name
 */
const validateName = (name) => {
  const nameRegex = /^[a-z0-9_-]+$/;
  if (!nameRegex.test(name)) {
    console.log(chalk.red.bold('\n❌ Invalid project name!\n'));
    console.log(chalk.yellow('Use only lowercase letters, numbers, hyphens, and underscores'));
    process.exit(1);
  }
};

/**
 * Check if directory exists
 */
const checkDirectoryExists = async (projectPath, projectName) => {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red.bold('\n❌ Error: ') + chalk.white(`Directory "${projectName}" already exists!\n`));
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Cancel and choose a different name', value: 'cancel' },
          { name: 'Remove existing directory and continue', value: 'remove' },
        ],
      },
    ]);

    if (action === 'cancel') {
      console.log(chalk.yellow('\n👋 Cancelled. No changes made.\n'));
      process.exit(0);
    } else {
      const spinner = ora('Removing existing directory...').start();
      fs.removeSync(projectPath);
      spinner.succeed(chalk.green('Directory removed'));
    }
  }
};

/**
 * Select project pattern interactively
 */
/**
 * Select project pattern interactively
 * Shows the available patterns first
 */
const selectPattern = async (type, providedPattern) => {
  const typePatterns = patterns[type];
  
  if (!typePatterns) {
    console.log(chalk.red(`\n❌ No patterns available for ${type}\n`));
    process.exit(1);
  }

  // If pattern provided via flag, validate it
  if (providedPattern) {
    if (!typePatterns[providedPattern]) {
      console.log(chalk.red.bold('\n❌ Invalid pattern!\n'));
      console.log(chalk.yellow('Available patterns for ') + chalk.cyan(type) + ':');
      Object.keys(typePatterns).forEach(key => {
        console.log(chalk.cyan(`  • ${key}`) + chalk.gray(` - ${typePatterns[key].description}`));
      });
      console.log();
      process.exit(1);
    }
    return providedPattern;
  }

  // Show list of available patterns before prompt
  console.log(chalk.blue.bold(`\n📌 Available patterns for ${type}:\n`));
  Object.entries(typePatterns).forEach(([key, value]) => {
    let line = `${chalk.cyan.bold(key)} ─ ${value.description}`;
    if (value.recommended) line += chalk.yellow.bold(' ⭐ RECOMMENDED');
    console.log(line);
  });
  console.log(); // empty line

  // Interactive selection
  const choices = Object.entries(typePatterns).map(([key, value]) => ({
    name: `${chalk.cyan.bold(key)} ${chalk.gray('─')} ${value.description}` + (value.recommended ? chalk.yellow.bold(' ⭐ RECOMMENDED') : ''),
    value: key,
    short: key,
  }));

  const { selectedPattern } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPattern',
      message: 'Select a project structure pattern:',
      choices,
      pageSize: 10,
    },
  ]);

  console.log();
  return selectedPattern;
};


/**
 * Create project structure
 */
const createProjectStructure = async (projectPath, type, pattern, projectName) => {
  const spinner = ora('Creating project structure...').start();
  
  try {
    // Create base directory
    fs.ensureDirSync(projectPath);
    
    // Create template based on type and pattern
    await createTemplate(projectPath, type, pattern, projectName);
    
    spinner.succeed(chalk.green('Project structure created'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project structure'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};

/**
 * Initialize git repository
 */
const initGit = (projectPath, skipGit) => {
  if (skipGit) {
    console.log(chalk.gray('⊘ Skipping git initialization'));
    return;
  }

  const spinner = ora('Initializing git repository...').start();
  
  try {
    execSync('git init', { cwd: projectPath, stdio: 'ignore' });
    
    // Create .gitignore
    const gitignoreContent = getGitignoreContent();
    fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignoreContent);
    
    spinner.succeed(chalk.green('Git initialized'));
  } catch (error) {
    spinner.warn(chalk.yellow('Git initialization skipped (git not found)'));
  }
};

/**
 * Install dependencies
 */
const installDependencies = (projectPath, type, skipInstall) => {
  if (skipInstall) {
    console.log(chalk.gray('⊘ Skipping dependency installation'));
    return;
  }

  const spinner = ora('Installing dependencies...').start();
  spinner.text = chalk.cyan('This may take a few minutes...');
  
  try {
    switch (type) {
      case 'node':
        execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
        break;
      case 'laravel':
        execSync('composer install', { cwd: projectPath, stdio: 'ignore' });
        break;
      case 'flutter':
        execSync('flutter pub get', { cwd: projectPath, stdio: 'ignore' });
        break;
    }
    spinner.succeed(chalk.green('Dependencies installed'));
  } catch (error) {
    spinner.warn(chalk.yellow('Dependencies installation skipped (tool not found)'));
  }
};

/**
 * Get .gitignore content based on project type
 */
const getGitignoreContent = () => {
  return `# Dependencies
node_modules/
vendor/
.pub-cache/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build
build/
dist/
*.log
`;
};

/**
 * Display success message
 */
const displaySuccess = (projectName, type, pattern, options) => {
  console.log();
  console.log(
    boxen(
      chalk.green.bold('✨ Project created successfully!\n\n') +
      chalk.white(`${chalk.bold('Project:')} ${projectName}\n`) +
      chalk.white(`${chalk.bold('Type:')} ${type}\n`) +
      chalk.white(`${chalk.bold('Pattern:')} ${pattern}\n\n`) +
      chalk.cyan.bold('🚀 Next steps:\n\n') +
      chalk.white(`  cd ${projectName}\n`) +
      getNextStepsForType(type, options),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      }
    )
  );
};

/**
 * Get next steps based on project type
 */
const getNextStepsForType = (type, options) => {
  const steps = [];
  
  if (options.install === false) {
    switch (type) {
      case 'node':
        steps.push('  npm install');
        break;
      case 'laravel':
        steps.push('  composer install');
        break;
      case 'flutter':
        steps.push('  flutter pub get');
        break;
    }
  }
  
  switch (type) {
    case 'node':
      steps.push('  npm run dev');
      break;
    case 'laravel':
      steps.push('  php artisan serve');
      break;
    case 'flutter':
      steps.push('  flutter run');
      break;
  }
  
  return steps.join('\n') + '\n';
};

/**
 * Main init command
 */
export default async function initCommand(type, name, options) {
  try {
    // Validate inputs
    validateType(type);
    validateName(name);
    
    const projectPath = path.join(process.cwd(), name);
    
    // Check if directory exists
    await checkDirectoryExists(projectPath, name);
    
    // Select pattern (interactive or from flag)
    const pattern = options.yes 
      ? Object.keys(patterns[type])[0] // Use first pattern if --yes
      : await selectPattern(type, options.pattern);
    
    console.log(chalk.blue('📦 Creating project...\n'));
    console.log(chalk.gray('  Name:    ') + chalk.white.bold(name));
    console.log(chalk.gray('  Type:    ') + chalk.white.bold(type));
    console.log(chalk.gray('  Pattern: ') + chalk.white.bold(pattern));
    console.log();
    
    // Create project structure
    await createProjectStructure(projectPath, type, pattern, name);
    
    // Initialize git
    initGit(projectPath, !options.git);
    
    // Install dependencies
    installDependencies(projectPath, type, !options.install);
    
    // Success message
    displaySuccess(name, type, pattern, options);
    
  } catch (error) {
    console.log(chalk.red.bold('\n❌ Error: ') + chalk.white(error.message + '\n'));
    process.exit(1);
  }
}
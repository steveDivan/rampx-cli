#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import initCommand from '../commands/init/index.js';
import listPatterns from '../commands/patterns/index.js';

const program = new Command();

// Beautiful banner
const showBanner = () => {
  console.log(
    gradient.pastel.multiline(
      figlet.textSync('RampX', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
      })
    )
  );
  console.log(
    chalk.cyan.bold('                      by ') +
    chalk.magenta.bold('Rampage') +
    chalk.cyan(' ⚡\n')
  );
  console.log(
    chalk.gray('    Ramp up your development workflow\n')
  );
};

// Custom help display
const displayHelp = () => {
  showBanner();
  console.log(chalk.yellow.bold('📦 Available Commands:\n'));
  
  console.log(chalk.green('  init') + chalk.gray(' <type> <name>'));
  console.log(chalk.gray('    Initialize a new project'));
  console.log(chalk.dim('    Types: flutter, laravel, node\n'));
  
  console.log(chalk.green('  patterns') + chalk.gray(' <framework>'));
  console.log(chalk.gray('    List available project structure patterns'));
  console.log(chalk.dim('    Frameworks: flutter, laravel, node\n'));
  
  console.log(chalk.yellow.bold('⚙️  Options:\n'));
  console.log(chalk.cyan('  --pattern <pattern>') + chalk.gray('  Choose project structure pattern'));
  console.log(chalk.cyan('  --no-git') + chalk.gray('             Skip git initialization'));
  console.log(chalk.cyan('  --no-install') + chalk.gray('         Skip dependency installation'));
  console.log(chalk.cyan('  --yes') + chalk.gray('                Skip all prompts and use defaults'));
  console.log(chalk.cyan('  -h, --help') + chalk.gray('          Display help information'));
  console.log(chalk.cyan('  -V, --version') + chalk.gray('       Output version number\n'));
  
  console.log(chalk.yellow.bold('💡 Examples:\n'));
  console.log(chalk.dim('  $ ') + chalk.white('rpx init flutter my-app'));
  console.log(chalk.dim('  $ ') + chalk.white('rpx init node api-server --pattern clean'));
  console.log(chalk.dim('  $ ') + chalk.white('rpx patterns laravel\n'));
};

// Enhanced command configuration
program
  .name(chalk.cyan.bold('rpx'))
  .description(chalk.gray('RampX – Ramp up your development workflow'))
  .version('0.1.0', '-V, --version', 'Output the current version')
  .addHelpCommand(false)
  .helpOption('-h, --help', 'Display help information')
  .configureHelp({
    helpWidth: 80,
  })
  .hook('preAction', (thisCommand) => {
    // Show banner only for actual commands, not for help
    if (!process.argv.includes('-h') && !process.argv.includes('--help')) {
      showBanner();
    }
  });

// Override help command
program.on('--help', () => {
  displayHelp();
});

// Init command with enhanced output
program
  .command('init')
  .description('Initialize a new project')
  .argument('<type>', 'project type (flutter, laravel, node)')
  .argument('<name>', 'project name')
  .option('--pattern <pattern>', 'Choose project structure pattern')
  .option('--no-git', 'Skip git initialization')
  .option('--no-install', 'Skip dependency installation')
  .option('--yes', 'Skip all prompts and use defaults')
  .action((type, name, options) => {
    console.log(chalk.blue('🚀 Initializing project...\n'));
    console.log(chalk.gray('  Type:    ') + chalk.white.bold(type));
    console.log(chalk.gray('  Name:    ') + chalk.white.bold(name));
    if (options.pattern) {
      console.log(chalk.gray('  Pattern: ') + chalk.white.bold(options.pattern));
    }
    console.log();
    
    initCommand(type, name, options);
  });

// Patterns command with enhanced output
program
  .command('patterns')
  .description('List available project structure patterns for a framework')
  .argument('<framework>', 'Framework name (flutter, laravel, node)')
  .action((framework) => {
    console.log(chalk.blue(`📋 Available patterns for ${chalk.bold(framework)}:\n`));
    listPatterns(framework);
  });

// Handle no command
if (process.argv.length === 2) {
  displayHelp();
  process.exit(0);
}

// Enhanced error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err.code === 'commander.help') {
    displayHelp();
  } else if (err.code === 'commander.version') {
    showBanner();
    console.log(chalk.cyan('Version: ') + chalk.white.bold('0.1.0\n'));
  } else if (err.code === 'commander.unknownCommand') {
    console.log(chalk.red.bold('\n❌ Error: ') + chalk.white(err.message));
    console.log(chalk.yellow('\n💡 Run ') + chalk.cyan.bold('rpx --help') + chalk.yellow(' to see available commands\n'));
  } else {
    console.log(chalk.red.bold('\n❌ Error: ') + chalk.white(err.message + '\n'));
  }
  process.exit(1);
}
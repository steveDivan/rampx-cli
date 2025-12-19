// commands/patterns/index.js
import chalk from 'chalk';
import boxen from 'boxen';
import { patterns } from '../init/patterns.js';

/**
 * List available patterns for a framework
 */
export default function listPatterns(framework) {
  const frameworkPatterns = patterns[framework];
  
  if (!frameworkPatterns) {
    console.log(chalk.red.bold('\n❌ Invalid framework!\n'));
    console.log(chalk.yellow('Available frameworks: ') + chalk.cyan(Object.keys(patterns).join(', ')));
    console.log();
    process.exit(1);
  }
  
  console.log(chalk.blue.bold(`\n📐 Available patterns for ${chalk.cyan(framework)}:\n`));
  
  // Display each pattern
  Object.entries(frameworkPatterns).forEach(([key, value]) => {
    const badge = value.recommended 
      ? chalk.yellow.bold(' ⭐ RECOMMENDED') 
      : '';
    
    const box = boxen(
      chalk.cyan.bold(value.label) + badge + '\n\n' +
      chalk.white(value.description) + '\n\n' +
      chalk.gray('Usage: ') + chalk.dim(`rpx init ${framework} my-project --pattern=${key}`),
      {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 2, right: 0 },
        borderStyle: 'round',
        borderColor: value.recommended ? 'yellow' : 'cyan',
      }
    );
    
    console.log(box);
  });
  
  // Display examples
  console.log(chalk.blue.bold('💡 Examples:\n'));
  console.log(chalk.dim('  Interactive selection:'));
  console.log(chalk.white(`  $ rpx init ${framework} my-project\n`));
  
  console.log(chalk.dim('  Direct pattern selection:'));
  const firstPattern = Object.keys(frameworkPatterns)[0];
  console.log(chalk.white(`  $ rpx init ${framework} my-project --pattern=${firstPattern}\n`));
  
  console.log(chalk.dim('  Skip all prompts:'));
  console.log(chalk.white(`  $ rpx init ${framework} my-project --yes --no-git\n`));
}
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';

/**
 * Run flutter doctor and analyze result
 */
const runFlutterDoctor = async () => {
  const spinner = ora('Running Flutter Doctor...').start();

  let output = '';
  let hasFlutter = true;

  try {
    output = execSync('flutter doctor', { encoding: 'utf-8', stdio: 'pipe' });
    spinner.succeed(chalk.green('Flutter Doctor completed'));
  } catch (err) {
    output = err.stdout?.toString() || err.stderr?.toString() || '';
    
    // Check if flutter command doesn't exist
    if (err.code === 127 || output.includes('command not found')) {
      hasFlutter = false;
    }
  }

  // Display doctor output in a nice format
  if (output) {
    console.log(
      boxen(output, {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan',
        title: 'Flutter Doctor Output',
      })
    );
  }

  // Critical issues that prevent project creation
  const criticalIssues = [
    'Flutter is not installed',
    'No Flutter SDK',
    'Unable to locate',
    'command not found',
  ];

  const hasCritical = criticalIssues.some(issue =>
    output.toLowerCase().includes(issue.toLowerCase())
  ) || !hasFlutter;

  if (hasCritical) {
    console.log(
      boxen(
        chalk.red.bold('❌ Critical Flutter Setup Issue\n\n') +
        chalk.yellow('Flutter SDK is not installed or not in PATH.\n\n') +
        chalk.white('Please install Flutter from:\n') +
        chalk.cyan('https://flutter.dev/docs/get-started/install\n\n') +
        chalk.gray('After installation, run: flutter doctor'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
        }
      )
    );
    process.exit(1);
  }

  // Check for warnings (non-critical)
  const hasWarnings = output.includes('!') || output.includes('✗');
  
  if (hasWarnings) {
    console.log(
      chalk.yellow.bold('\n⚠️  Warning: ') +
      chalk.white('Some Flutter components have issues.')
    );
    console.log(
      chalk.gray('You can continue, but some features may not work properly.\n')
    );
  } else {
    console.log(chalk.green.bold('\n✅ Flutter environment is healthy!\n'));
  }
};

/**
 * Preview project structure with beautiful tree
 */
const previewStructure = (projectName, pattern) => {
  const patternStructures = {
    layered: {
      description: 'Clean separation between Presentation, Domain, and Data layers',
      tree: [
        '├── lib/',
        '│   ├── main.dart',
        '│   ├── presentation/',
        '│   │   ├── pages/',
        '│   │   └── widgets/',
        '│   ├── domain/',
        '│   │   ├── models/',
        '│   │   └── repositories/',
        '│   └── data/',
        '│       ├── datasources/',
        '│       └── repositories/',
      ],
    },
    feature: {
      description: 'Feature-first organization with co-located code',
      tree: [
        '├── lib/',
        '│   ├── main.dart',
        '│   ├── features/',
        '│   │   ├── auth/',
        '│   │   └── home/',
        '│   └── core/',
        '│       ├── theme/',
        '│       └── utils/',
      ],
    },
    clean: {
      description: 'Clean Architecture with strict layer boundaries',
      tree: [
        '├── lib/',
        '│   ├── main.dart',
        '│   ├── core/',
        '│   │   ├── error/',
        '│   │   └── usecases/',
        '│   └── features/',
        '│       ├── domain/',
        '│       │   ├── entities/',
        '│       │   ├── repositories/',
        '│       │   └── usecases/',
        '│       ├── data/',
        '│       │   ├── models/',
        '│       │   ├── repositories/',
        '│       │   └── datasources/',
        '│       └── presentation/',
        '│           ├── pages/',
        '│           ├── widgets/',
        '│           └── bloc/',
      ],
    },
  };

  const structure = patternStructures[pattern];
  
  const baseTree = [
    `${projectName}/`,
    '├── android/',
    '├── ios/',
    '├── test/',
    '├── assets/',
    '│   ├── images/',
    '│   └── fonts/',
  ];

  console.log(
    boxen(
      chalk.cyan.bold(`Pattern: ${pattern}\n`) +
      chalk.gray(structure.description + '\n\n') +
      chalk.white(baseTree.concat(structure.tree).join('\n')),
      {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'cyan',
        title: '📂 Project Structure Preview',
        titleAlignment: 'center',
      }
    )
  );
};

/**
 * Confirm project creation
 */
const confirmCreation = async () => {
  // Add visual separator and clear prompt
  console.log('\n');
  console.log(chalk.bgYellow.black.bold('                                          '));
  console.log(chalk.bgYellow.black.bold('   ⚠️  CONFIRMATION REQUIRED - READ BELOW   '));
  console.log(chalk.bgYellow.black.bold('                                          '));
  console.log('\n');
  
  console.log(chalk.white.bold('Please review the project structure above.\n'));
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.cyan.bold('➤ Do you want to CREATE this project with the structure shown above?'),
      default: true,
    },
  ]);

  console.log('\n');

  if (!confirm) {
    console.log(
      boxen(
        chalk.yellow.bold('❌ CANCELLED\n\n') +
        chalk.white('Project creation aborted.\nNo files were created.'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'yellow',
        }
      )
    );
    process.exit(0);
  }
  
  console.log(chalk.green.bold('✅ Confirmed! Creating your Flutter project...\n'));
};

/**
 * Create Flutter base project
 */
const createFlutterBase = async (projectPath, projectName) => {
  const spinner = ora('Creating base Flutter project...').start();
  spinner.color = 'cyan';

  try {
    // Run flutter create with org and description
    execSync(
      `flutter create --org com.rampage --project-name ${projectName} "${projectPath}"`,
      { 
        stdio: 'pipe',
        encoding: 'utf-8'
      }
    );
    
    spinner.succeed(chalk.green('Base Flutter project created'));
  } catch (err) {
    spinner.fail(chalk.red('Failed to create Flutter project'));
    
    console.log(
      boxen(
        chalk.red.bold('❌ Flutter Create Failed\n\n') +
        chalk.yellow('Error: ') + chalk.white(err.message + '\n\n') +
        chalk.gray('Make sure Flutter SDK is properly installed.'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
        }
      )
    );
    throw err;
  }
};

/**
 * Create pattern-specific structure
 */
const createPatternStructure = async (projectPath, pattern) => {
  const spinner = ora(`Setting up ${pattern} architecture...`).start();

  try {
    if (flutterPatterns[pattern]) {
      await flutterPatterns[pattern](projectPath);
    }
    
    spinner.succeed(chalk.green(`${pattern} structure created`));
  } catch (err) {
    spinner.fail(chalk.red('Failed to create pattern structure'));
    throw err;
  }
};

/**
 * Create assets structure
 */
const createAssetsStructure = async (projectPath) => {
  const spinner = ora('Creating assets structure...').start();

  try {
    const assetDirs = [
      'assets/images',
      'assets/fonts',
      'assets/icons',
    ];

    for (const dir of assetDirs) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

    // Create .gitkeep files to preserve empty directories
    for (const dir of assetDirs) {
      await fs.writeFile(
        path.join(projectPath, dir, '.gitkeep'),
        '# Keep this directory in git\n'
      );
    }

    spinner.succeed(chalk.green('Assets structure created'));
  } catch (err) {
    spinner.warn(chalk.yellow('Assets structure partially created'));
  }
};

/**
 * Generate enhanced main.dart
 */
const generateMainDart = async (projectPath, projectName, pattern) => {
  const spinner = ora('Generating main.dart...').start();

  const mainContent = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${projectName}',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 0,
        ),
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${projectName}'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.flutter_dash,
              size: 100,
              color: Colors.blue,
            ),
            const SizedBox(height: 24),
            Text(
              'Welcome to Flutter!',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Text(
              'Architecture: ${pattern}',
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 32),
            FilledButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Ready to start building! 🚀'),
                  ),
                );
              },
              icon: const Icon(Icons.rocket_launch),
              label: const Text('Get Started'),
            ),
          ],
        ),
      ),
    );
  }
}
`;

  try {
    await fs.writeFile(
      path.join(projectPath, 'lib/main.dart'),
      mainContent
    );
    spinner.succeed(chalk.green('main.dart generated'));
  } catch (err) {
    spinner.fail(chalk.red('Failed to generate main.dart'));
    throw err;
  }
};

/**
 * Create README for the pattern
 */
const createPatternReadme = async (projectPath, pattern, projectName) => {
  const spinner = ora('Creating pattern documentation...').start();

  const patternDocs = {
    layered: {
      title: 'Layered Architecture',
      description: `This project follows a layered architecture pattern with clear separation of concerns:

## Layer Structure

### Presentation Layer (lib/presentation/)
- **pages/**: Screen/page widgets
- **widgets/**: Reusable UI components
- Handles UI logic and user interactions

### Domain Layer (lib/domain/)
- **models/**: Business entities and data models
- **repositories/**: Abstract repository interfaces
- Contains business logic and rules

### Data Layer (lib/data/)
- **datasources/**: API clients, local database
- **repositories/**: Concrete repository implementations
- Handles data fetching and persistence

## Benefits
- Clear separation of concerns
- Easy to test each layer independently
- Scalable for medium to large apps`,
    },
    feature: {
      title: 'Feature-First Architecture',
      description: `This project is organized by features, with related code co-located:

## Structure

### Features (lib/features/)
Each feature contains all related code:
- UI screens and widgets
- Business logic
- Models and services
- Tests

### Core (lib/core/)
Shared code across features:
- **theme/**: App theme and styling
- **utils/**: Helper functions and utilities
- **constants/**: App-wide constants
- **widgets/**: Shared widgets

## Benefits
- Easy to locate feature-specific code
- Natural code ownership by feature teams
- Simple to add/remove features
- Scales well for large teams`,
    },
    clean: {
      title: 'Clean Architecture',
      description: `This project follows Uncle Bob's Clean Architecture principles:

## Architecture Layers

### Core (lib/core/)
- **error/**: Error handling and exceptions
- **usecases/**: Base usecase interfaces
- Shared infrastructure

### Features (lib/features/)
Each feature has three layers:

#### Domain Layer
- **entities/**: Business objects
- **repositories/**: Repository contracts
- **usecases/**: Business use cases
- No dependencies on outer layers

#### Data Layer
- **models/**: Data transfer objects
- **repositories/**: Repository implementations
- **datasources/**: Remote and local data sources
- Implements domain contracts

#### Presentation Layer
- **pages/**: UI screens
- **widgets/**: UI components
- **bloc/**: State management (BLoC pattern)
- Depends only on domain layer

## Benefits
- Strict separation of concerns
- Testable architecture
- Framework-independent business logic
- Follows SOLID principles`,
    },
  };

  const doc = patternDocs[pattern];
  
  const readmeContent = `# ${projectName}

A Flutter application built with **${doc.title}** pattern.

${doc.description}

## Getting Started

### Prerequisites
- Flutter SDK (latest stable version)
- Dart SDK
- Android Studio / Xcode (for mobile development)

### Installation

1. Get dependencies:
\`\`\`bash
flutter pub get
\`\`\`

2. Run the app:
\`\`\`bash
flutter run
\`\`\`

### Development

- Run tests:
\`\`\`bash
flutter test
\`\`\`

- Build for production:
\`\`\`bash
flutter build apk    # Android
flutter build ios    # iOS
\`\`\`

## Project Structure

\`\`\`
lib/
├── main.dart
├── features/       # Feature modules
├── core/          # Shared code
└── ...
\`\`\`

## Resources

- [Flutter Documentation](https://docs.flutter.dev/)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter Samples](https://flutter.github.io/samples/)

---

Generated with ❤️ by **RampX CLI** by Rampage ⚡
`;

  try {
    await fs.writeFile(
      path.join(projectPath, 'ARCHITECTURE.md'),
      readmeContent
    );
    spinner.succeed(chalk.green('Architecture documentation created'));
  } catch (err) {
    spinner.warn(chalk.yellow('Documentation creation skipped'));
  }
};

/**
 * Main Flutter template generator
 */
export const generateFlutterTemplate = async (projectPath, pattern, projectName) => {
  console.log(chalk.blue.bold('\n🎯 Flutter Project Setup\n'));

  // Step 1: Check Flutter installation
  await runFlutterDoctor();

  // Step 2: Show structure preview
  previewStructure(projectName, pattern);

  // Step 3: Confirm with user
  await confirmCreation();

  // Step 4: Create base Flutter project
  await createFlutterBase(projectPath, projectName);

  // Step 5: Create assets structure
  await createAssetsStructure(projectPath);

  // Step 6: Create pattern-specific folders
  await createPatternStructure(projectPath, pattern);

  // Step 7: Generate enhanced main.dart
  await generateMainDart(projectPath, projectName, pattern);

  // Step 8: Create architecture documentation
  await createPatternReadme(projectPath, pattern, projectName);

  // Success summary
  console.log(
    boxen(
      chalk.green.bold('✨ Flutter Project Ready!\n\n') +
      chalk.white(`Pattern: ${chalk.cyan.bold(pattern)}\n`) +
      chalk.white(`Location: ${chalk.gray(projectPath)}\n\n`) +
      chalk.yellow.bold('📚 Next Steps:\n\n') +
      chalk.white('  1. cd ' + projectName + '\n') +
      chalk.white('  2. flutter pub get\n') +
      chalk.white('  3. flutter run\n\n') +
      chalk.gray('View ARCHITECTURE.md for pattern details'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      }
    )
  );
};

/* ---------------- Pattern Implementations ---------------- */

/**
 * Layered Architecture Pattern
 */
const createLayeredFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/presentation/pages',
    'lib/presentation/widgets',
    'lib/domain/models',
    'lib/domain/repositories',
    'lib/data/repositories',
    'lib/data/datasources/remote',
    'lib/data/datasources/local',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
    
    // Create .gitkeep for empty directories
    await fs.writeFile(
      path.join(projectPath, dir, '.gitkeep'),
      '# Keep this directory\n'
    );
  }
};

/**
 * Feature-First Pattern
 */
const createFeatureFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/features/auth',
    'lib/features/home',
    'lib/core/theme',
    'lib/core/utils',
    'lib/core/constants',
    'lib/core/widgets',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
    await fs.writeFile(
      path.join(projectPath, dir, '.gitkeep'),
      '# Keep this directory\n'
    );
  }
};

/**
 * Clean Architecture Pattern
 */
const createCleanFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/core/error',
    'lib/core/usecases',
    'lib/core/utils',
    'lib/features/domain/entities',
    'lib/features/domain/repositories',
    'lib/features/domain/usecases',
    'lib/features/data/models',
    'lib/features/data/repositories',
    'lib/features/data/datasources/remote',
    'lib/features/data/datasources/local',
    'lib/features/presentation/pages',
    'lib/features/presentation/widgets',
    'lib/features/presentation/bloc',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
    await fs.writeFile(
      path.join(projectPath, dir, '.gitkeep'),
      '# Keep this directory\n'
    );
  }
};

/**
 * Pattern implementations map
 */
export const flutterPatterns = {
  layered: createLayeredFlutterStructure,
  feature: createFeatureFlutterStructure,
  clean: createCleanFlutterStructure,
};
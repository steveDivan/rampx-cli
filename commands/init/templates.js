// commands/init/templates.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create project from template
 */
export const createTemplate = async (projectPath, type, pattern, projectName) => {
  const templatesDir = path.join(__dirname, '../../templates');
  const templatePath = path.join(templatesDir, type, pattern);
  
  // Check if template exists
  if (fs.existsSync(templatePath)) {
    // Copy template files
    await fs.copy(templatePath, projectPath);
    
    // Process template variables
    await processTemplateVariables(projectPath, projectName, type);
  } else {
    // Generate template programmatically if template files don't exist
    await generateTemplate(projectPath, type, pattern, projectName);
  }
  
  // Create common files
  await createCommonFiles(projectPath, projectName, type, pattern);
};

/**
 * Process template variables in files
 */
const processTemplateVariables = async (projectPath, projectName, type) => {
  const files = await getFilesRecursively(projectPath);
  
  for (const file of files) {
    if (file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.yaml')) {
      let content = await fs.readFile(file, 'utf-8');
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
      content = content.replace(/\{\{PROJECT_TYPE\}\}/g, type);
      await fs.writeFile(file, content);
    }
  }
};

/**
 * Get all files recursively
 */
const getFilesRecursively = async (dir) => {
  const files = [];
  const items = await fs.readdir(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...await getFilesRecursively(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
};

/**
 * Generate template programmatically
 */
const generateTemplate = async (projectPath, type, pattern, projectName) => {
  switch (type) {
    case 'node':
      await generateNodeTemplate(projectPath, pattern, projectName);
      break;
    case 'laravel':
      await generateLaravelTemplate(projectPath, pattern, projectName);
      break;
    case 'flutter':
      await generateFlutterTemplate(projectPath, pattern, projectName);
      break;
  }
};

/**
 * Generate Node.js template
 */
const generateNodeTemplate = async (projectPath, pattern, projectName) => {
  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: '',
    main: 'src/index.js',
    type: 'module',
    scripts: {
      start: 'node src/index.js',
      dev: 'nodemon src/index.js',
      test: 'jest',
    },
    keywords: [],
    author: '',
    license: 'MIT',
    dependencies: {
      express: '^4.18.2',
      dotenv: '^16.3.1',
    },
    devDependencies: {
      nodemon: '^3.0.1',
      jest: '^29.7.0',
    },
  };
  
  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
  
  // Create structure based on pattern
  switch (pattern) {
    case 'simple':
      await createSimpleNodeStructure(projectPath);
      break;
    case 'modular':
      await createModularNodeStructure(projectPath);
      break;
    case 'clean':
      await createCleanNodeStructure(projectPath);
      break;
  }
};

/**
 * Simple Node structure
 */
const createSimpleNodeStructure = async (projectPath) => {
  const dirs = ['src', 'src/routes', 'src/controllers', 'src/models', 'tests'];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
  
  // Create index.js
  const indexContent = `import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to your API!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  
  await fs.writeFile(path.join(projectPath, 'src/index.js'), indexContent);
};

/**
 * Modular Node structure
 */
const createModularNodeStructure = async (projectPath) => {
  const dirs = [
    'src',
    'src/modules/users',
    'src/modules/users/controllers',
    'src/modules/users/services',
    'src/modules/users/models',
    'src/modules/users/routes',
    'src/shared/middleware',
    'src/shared/utils',
    'src/config',
    'tests',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
  
  // Create index.js
  const indexContent = `import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import module routes here
// import userRoutes from './modules/users/routes/index.js';
// app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  
  await fs.writeFile(path.join(projectPath, 'src/index.js'), indexContent);
};

/**
 * Clean Architecture Node structure
 */
const createCleanNodeStructure = async (projectPath) => {
  const dirs = [
    'src',
    'src/domain/entities',
    'src/domain/repositories',
    'src/domain/usecases',
    'src/application/services',
    'src/application/dto',
    'src/infrastructure/database',
    'src/infrastructure/repositories',
    'src/interfaces/http/controllers',
    'src/interfaces/http/routes',
    'src/interfaces/http/middleware',
    'tests',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
  
  const indexContent = `import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    architecture: 'clean' 
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  
  await fs.writeFile(path.join(projectPath, 'src/index.js'), indexContent);
};

/**
 * Generate Laravel template
 */
const generateLaravelTemplate = async (projectPath, pattern, projectName) => {
  // Create basic Laravel-like structure
  const baseDirs = ['app', 'config', 'database', 'public', 'resources', 'routes', 'storage', 'tests'];
  
  for (const dir of baseDirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
  
  // Create pattern-specific structure
  switch (pattern) {
    case 'feature':
      await createFeatureLaravelStructure(projectPath);
      break;
    case 'ddd':
      await createDddLaravelStructure(projectPath);
      break;
    default:
      await createStandardLaravelStructure(projectPath);
  }
};

/**
 * Standard Laravel structure
 */
const createStandardLaravelStructure = async (projectPath) => {
  const dirs = [
    'app/Http/Controllers',
    'app/Models',
    'app/Services',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * Feature-based Laravel structure
 */
const createFeatureLaravelStructure = async (projectPath) => {
  const dirs = [
    'app/Features/Auth',
    'app/Features/Users',
    'app/Support',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * DDD Laravel structure
 */
const createDddLaravelStructure = async (projectPath) => {
  const dirs = [
    'src/Domain/User/Entities',
    'src/Domain/User/Repositories',
    'src/Domain/User/Services',
    'src/Application/UseCases',
    'src/Infrastructure/Persistence',
    'src/Presentation/Http/Controllers',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * Generate Flutter template
 */
const generateFlutterTemplate = async (projectPath, pattern, projectName) => {
  const baseDirs = ['lib', 'test', 'assets'];
  
  for (const dir of baseDirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
  
  // Create pattern-specific structure
  switch (pattern) {
    case 'layered':
      await createLayeredFlutterStructure(projectPath);
      break;
    case 'feature':
      await createFeatureFlutterStructure(projectPath);
      break;
    case 'clean':
      await createCleanFlutterStructure(projectPath);
      break;
  }
  
  // Create main.dart
  const mainContent = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
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
        title: const Text('Home'),
      ),
      body: const Center(
        child: Text('Welcome to Flutter!'),
      ),
    );
  }
}
`;
  
  await fs.writeFile(path.join(projectPath, 'lib/main.dart'), mainContent);
};

/**
 * Layered Flutter structure
 */
const createLayeredFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/presentation/pages',
    'lib/presentation/widgets',
    'lib/domain/models',
    'lib/domain/repositories',
    'lib/data/repositories',
    'lib/data/datasources',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * Feature-first Flutter structure
 */
const createFeatureFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/features/auth',
    'lib/features/home',
    'lib/core/theme',
    'lib/core/utils',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * Clean Architecture Flutter structure
 */
const createCleanFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/core/error',
    'lib/core/usecases',
    'lib/features/domain/entities',
    'lib/features/domain/repositories',
    'lib/features/domain/usecases',
    'lib/features/data/models',
    'lib/features/data/repositories',
    'lib/features/data/datasources',
    'lib/features/presentation/pages',
    'lib/features/presentation/widgets',
    'lib/features/presentation/bloc',
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
};

/**
 * Create common files (README, .env, etc.)
 */
const createCommonFiles = async (projectPath, projectName, type, pattern) => {
  // Create README.md
  const readmeContent = `# ${projectName}

## Project Information

- **Type:** ${type}
- **Pattern:** ${pattern}
- **Generated by:** RampX CLI

## Getting Started

${getStartupInstructions(type)}

## Project Structure

This project follows the **${pattern}** architecture pattern.

${getPatternDescription(type, pattern)}

## License

MIT
`;
  
  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
  
  // Create .env.example
  const envContent = getEnvTemplate(type);
  await fs.writeFile(path.join(projectPath, '.env.example'), envContent);
  await fs.writeFile(path.join(projectPath, '.env'), envContent);
};

/**
 * Get startup instructions based on type
 */
const getStartupInstructions = (type) => {
  switch (type) {
    case 'node':
      return `### Installation
\`\`\`bash
npm install
\`\`\`

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production
\`\`\`bash
npm start
\`\`\``;
    
    case 'laravel':
      return `### Installation
\`\`\`bash
composer install
cp .env.example .env
php artisan key:generate
\`\`\`

### Development
\`\`\`bash
php artisan serve
\`\`\``;
    
    case 'flutter':
      return `### Installation
\`\`\`bash
flutter pub get
\`\`\`

### Development
\`\`\`bash
flutter run
\`\`\``;
    
    default:
      return 'See documentation for setup instructions.';
  }
};

/**
 * Get pattern description
 */
const getPatternDescription = (type, pattern) => {
  const descriptions = {
    node: {
      simple: 'A flat, simple structure ideal for small APIs and microservices.',
      modular: 'Feature-based modules for better organization and scalability.',
      clean: 'Clean Architecture with strict separation of concerns.',
    },
    laravel: {
      standard: 'Traditional Laravel MVC structure.',
      feature: 'Feature-based organization for better maintainability.',
      ddd: 'Domain-Driven Design with rich domain models.',
    },
    flutter: {
      layered: 'Clear separation between Presentation, Domain, and Data layers.',
      feature: 'Features organized by business functionality.',
      clean: 'Uncle Bob\'s Clean Architecture principles.',
    },
  };
  
  return descriptions[type]?.[pattern] || 'Custom project structure.';
};

/**
 * Get environment template
 */
const getEnvTemplate = (type) => {
  switch (type) {
    case 'node':
      return `PORT=3000
NODE_ENV=development
`;
    
    case 'laravel':
      return `APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
`;
    
    case 'flutter':
      return `# Add your environment variables here
API_URL=https://api.example.com
`;
    
    default:
      return '';
  }
};
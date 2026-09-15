import fs from 'fs-extra';
import path from 'path';


export const generateNodeTemplate = async (projectPath, pattern, projectName) => {
  // Create package.json
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    main: 'src/index.js',
    type: 'module',
    scripts: {
      start: 'node src/index.js',
      dev: 'nodemon src/index.js',
      test: 'jest',
    },
    dependencies: { express: '^4.18.2', dotenv: '^16.3.1' },
    devDependencies: { nodemon: '^3.0.1', jest: '^29.7.0' },
  };

  await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  if (nodePatterns[pattern]) {
    await nodePatterns[pattern](projectPath);
  }
};

// Implement the structure functions
const createSimpleNodeStructure = async (projectPath) => {
  const dirs = ['src', 'src/routes', 'src/controllers', 'src/models', 'tests'];
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
  await fs.writeFile(path.join(projectPath, 'src/index.js'), getSimpleNodeIndex());
};

const createModularNodeStructure = async (projectPath) => {
  const dirs = [
    'src',
    'src/modules/users/controllers',
    'src/modules/users/services',
    'src/modules/users/models',
    'src/modules/users/routes',
    'src/shared/middleware',
    'src/shared/utils',
    'src/config',
    'tests',
  ];
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
  await fs.writeFile(path.join(projectPath, 'src/index.js'), getModularNodeIndex());
};

const createCleanNodeStructure = async (projectPath) => {
  const dirs = [
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
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
  await fs.writeFile(path.join(projectPath, 'src/index.js'), getCleanNodeIndex());
};

// Index templates
const getSimpleNodeIndex = () => `import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/', (req, res) => res.json({ message: 'Welcome!' }));
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;

const getModularNodeIndex = () => `import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Import module routes here
app.get('/api/health', (req, res) => res.json({ status: 'healthy' }));
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;

const getCleanNodeIndex = () => `import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'healthy', architecture: 'clean' }));
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`;

export const nodePatterns = {
  simple: createSimpleNodeStructure,
  modular: createModularNodeStructure,
  clean: createCleanNodeStructure,
};

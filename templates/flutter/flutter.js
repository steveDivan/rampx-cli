import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

export const generateFlutterTemplate = async (projectPath, pattern, projectName) => {
  // 1️⃣ Create base Flutter project
  try {
    console.log('Creating base Flutter project...');
    execSync(`flutter create "${projectPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Flutter CLI not found or failed to create project.');
    throw err;
  }

  // 2️⃣ Create additional pattern-specific folders
  if (flutterPatterns[pattern]) {
    await flutterPatterns[pattern](projectPath);
  }

  // 3️⃣ Overwrite main.dart with custom starter code
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
      theme: ThemeData(primarySwatch: Colors.blue),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home')),
      body: const Center(child: Text('Welcome to Flutter!')),
    );
  }
}
`;
  await fs.writeFile(path.join(projectPath, 'lib/main.dart'), mainContent);

  console.log('✅ Flutter project ready with pattern:', pattern);
};

// Pattern folder generators remain the same
const createLayeredFlutterStructure = async (projectPath) => {
  const dirs = [
    'lib/presentation/pages',
    'lib/presentation/widgets',
    'lib/domain/models',
    'lib/domain/repositories',
    'lib/data/repositories',
    'lib/data/datasources',
  ];
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
};

const createFeatureFlutterStructure = async (projectPath) => {
  const dirs = ['lib/features/auth', 'lib/features/home', 'lib/core/theme', 'lib/core/utils'];
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
};

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
  for (const dir of dirs) await fs.ensureDir(path.join(projectPath, dir));
};

export const flutterPatterns = {
  layered: createLayeredFlutterStructure,
  feature: createFeatureFlutterStructure,
  clean: createCleanFlutterStructure,
};

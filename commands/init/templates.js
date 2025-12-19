import { generateNodeTemplate } from '../../templates/node/node.js';
//import { generateLaravelTemplate } from '../../templates/laravel/laravel.js';
import { generateFlutterTemplate } from '../../templates/flutter/flutter.js';


export const createTemplate = async (projectPath, type, pattern, projectName) => {
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
    default:
      throw new Error(`Unknown project type: ${type}`);
  }
};

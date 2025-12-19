// commands/init/patterns.js
/**
 * Project structure patterns for each framework
 * Each pattern includes:
 * - label: Display name
 * - description: Brief explanation
 * - recommended: Boolean flag for recommended pattern
 */

export const patterns = {
  laravel: {
    standard: {
      label: 'Standard',
      description: 'Laravel default MVC structure (controllers, models, views)',
      recommended: false,
    },
    feature: {
      label: 'Feature-based',
      description: 'Organize by features/modules for better scalability',
      recommended: true,
    },
    ddd: {
      label: 'Domain-Driven Design',
      description: 'DDD layers (Domain, Application, Infrastructure)',
      recommended: false,
    },
  },

  flutter: {
    layered: {
      label: 'Layered Architecture',
      description: 'Presentation, Domain, Data layers separation',
      recommended: false,
    },
    feature: {
      label: 'Feature-first',
      description: 'Group by features with co-located code',
      recommended: true,
    },
    clean: {
      label: 'Clean Architecture',
      description: 'Uncle Bob\'s clean architecture with strict boundaries',
      recommended: false,
    },
  },

  node: {
    simple: {
      label: 'Simple',
      description: 'Flat structure for small projects and APIs',
      recommended: false,
    },
    modular: {
      label: 'Modular',
      description: 'Module-based organization for medium projects',
      recommended: true,
    },
    clean: {
      label: 'Clean Architecture',
      description: 'Layered architecture with dependency inversion',
      recommended: false,
    },
  },
};

/**
 * Get pattern details for a specific framework and pattern
 */
export const getPattern = (framework, patternKey) => {
  return patterns[framework]?.[patternKey] || null;
};

/**
 * Get all patterns for a framework
 */
export const getFrameworkPatterns = (framework) => {
  return patterns[framework] || null;
};

/**
 * Get recommended pattern for a framework
 */
export const getRecommendedPattern = (framework) => {
  const frameworkPatterns = patterns[framework];
  if (!frameworkPatterns) return null;
  
  const recommended = Object.entries(frameworkPatterns).find(
    ([_, value]) => value.recommended
  );
  
  return recommended ? recommended[0] : Object.keys(frameworkPatterns)[0];
};

/**
 * Validate if a pattern exists for a framework
 */
export const isValidPattern = (framework, patternKey) => {
  return patterns[framework]?.[patternKey] !== undefined;
};
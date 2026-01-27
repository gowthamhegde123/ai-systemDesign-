import { SystemDesignQuestion } from './system-design-questions';

// This file contains 100 additional Beginner-level system design questions
export const additionalQuestions5: SystemDesignQuestion[] = Array.from({ length: 100 }, (_, i) => {
    const id = 401 + i;
    const categories = ['Web Applications', 'Mobile Apps', 'Basic Services', 'CRUD Systems', 'User Management'];
    const category = categories[i % categories.length];

    return {
        id: `beginner-${id}`,
        title: `Beginner System Design Exercise ${id}`,
        category,
        difficulty: 'Beginner' as const,
        tags: ['beginner', 'fundamentals', 'web-development', 'basics'],
        description: `Design a basic system for exercise ${id}. Focus on understanding core concepts, CRUD operations, and simple architectures.`,
        coreRequirements: [
            'Implement basic CRUD operations',
            'User authentication and authorization',
            'Simple database schema design',
            'Basic API endpoints'
        ],
        highLevelRequirements: [
            'Responsive user interface',
            'Data validation',
            'Error handling'
        ],
        microRequirements: [
            'Input sanitization',
            'Basic security measures',
            'Simple caching'
        ],
        learningOutcomes: ['CRUD operations', 'Database design', 'API basics'],
        estimatedTime: '3-4 hours',
        techStack: ['Web Framework', 'SQL Database', 'Frontend Framework']
    };
});

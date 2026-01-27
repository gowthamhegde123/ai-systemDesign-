import { SystemDesignQuestion } from './system-design-questions';

// This file contains 100 additional Intermediate-level system design questions
export const additionalQuestions4: SystemDesignQuestion[] = Array.from({ length: 100 }, (_, i) => {
    const id = 301 + i;
    const categories = ['Web Services', 'API Design', 'Microservices', 'Cloud Architecture', 'Data Processing'];
    const category = categories[i % categories.length];

    return {
        id: `intermediate-${id}`,
        title: `Intermediate System Design Problem ${id}`,
        category,
        difficulty: 'Intermediate' as const,
        tags: ['intermediate', 'scalability', 'design-patterns', 'cloud'],
        description: `Design a moderately complex system for problem ${id}. Focus on proper architecture, scalability, and best practices.`,
        coreRequirements: [
            'Handle moderate traffic (thousands of requests/sec)',
            'Implement proper caching strategies',
            'Design RESTful or GraphQL APIs',
            'Ensure data integrity'
        ],
        highLevelRequirements: [
            'Cloud-native architecture',
            'Auto-scaling capabilities',
            'Monitoring and observability'
        ],
        microRequirements: [
            'API rate limiting',
            'Database indexing strategies',
            'Caching layers'
        ],
        learningOutcomes: ['API design', 'Caching strategies', 'Cloud architecture'],
        estimatedTime: '5-7 hours',
        techStack: ['REST API', 'Database', 'Cache', 'Cloud Platform']
    };
});

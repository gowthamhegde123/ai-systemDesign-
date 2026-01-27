import { SystemDesignQuestion } from './system-design-questions';

// This file contains 100 additional Advanced-level system design questions
export const additionalQuestions3: SystemDesignQuestion[] = Array.from({ length: 100 }, (_, i) => {
    const id = 201 + i;
    const categories = ['Distributed Systems', 'Scalability', 'Infrastructure', 'Data Systems', 'Real-time Systems'];
    const category = categories[i % categories.length];

    return {
        id: `advanced-${id}`,
        title: `Advanced System Design Challenge ${id}`,
        category,
        difficulty: 'Advanced' as const,
        tags: ['advanced', 'distributed', 'scalability', 'architecture'],
        description: `Design a highly scalable and distributed system for challenge ${id}. Focus on handling millions of requests, data consistency, and fault tolerance.`,
        coreRequirements: [
            'Handle high throughput (millions of requests/sec)',
            'Ensure data consistency across distributed nodes',
            'Implement fault tolerance and disaster recovery',
            'Support horizontal scaling'
        ],
        highLevelRequirements: [
            'Global distribution across multiple regions',
            'Sub-second latency for critical operations',
            ' 99.99% uptime SLA'
        ],
        microRequirements: [
            'Efficient data partitioning strategy',
            'Consensus algorithm implementation',
            'Circuit breaker patterns'
        ],
        learningOutcomes: ['Distributed systems', 'Scalability patterns', 'Fault tolerance'],
        estimatedTime: '8-12 hours',
        techStack: ['Distributed Database', 'Message Queue', 'Load Balancer', 'Cache']
    };
});

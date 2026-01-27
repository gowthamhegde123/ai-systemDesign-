import { SystemDesignQuestion } from './system-design-questions';

export const additionalQuestions2: SystemDesignQuestion[] = [
    // INTERMEDIATE QUESTIONS (100)
    {
        id: 'notification-service',
        title: 'Design a Multi-Channel Notification Service',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['notifications', 'messaging', 'multi-channel', 'scalability'],
        description: 'Design a notification service that sends messages via email, SMS, push, and in-app channels.',
        coreRequirements: [
            'Support multiple notification channels',
            'Template management',
            'User preference handling',
            'Delivery tracking'
        ],
        highLevelRequirements: [
            'High throughput',
            'Retry mechanisms',
            'Priority queuing'
        ],
        microRequirements: [
            'Channel routing logic',
            'Template rendering',
            'Delivery status tracking'
        ],
        learningOutcomes: ['Multi-channel messaging', 'Queue systems', 'Template engines'],
        estimatedTime: '5-6 hours',
        techStack: ['Message Queue', 'Email/SMS APIs', 'Template Engine']
    },
    {
        id: 'api-gateway',
        title: 'Design an API Gateway',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['api', 'gateway', 'routing', 'authentication'],
        description: 'Design an API gateway that routes requests, handles authentication, and provides rate limiting.',
        coreRequirements: [
            'Request routing',
            'Authentication and authorization',
            'Rate limiting',
            'Request/response transformation'
        ],
        highLevelRequirements: [
            'High availability',
            'Low latency',
            'Monitoring and logging'
        ],
        microRequirements: [
            'Efficient routing algorithms',
            'Token validation',
            'Circuit breaker pattern'
        ],
        learningOutcomes: ['API design', 'Authentication', 'Rate limiting'],
        estimatedTime: '6-7 hours',
        techStack: ['Reverse Proxy', 'Auth Service', 'Rate Limiter']
    },
    {
        id: 'job-scheduler',
        title: 'Design a Job Scheduling System',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['scheduling', 'cron', 'jobs', 'distributed'],
        description: 'Design a system to schedule and execute jobs at specified times or intervals.',
        coreRequirements: [
            'Schedule jobs with cron expressions',
            'Execute jobs reliably',
            'Job dependency management',
            'Retry failed jobs'
        ],
        highLevelRequirements: [
            'Distributed execution',
            'Job monitoring',
            'Resource management'
        ],
        microRequirements: [
            'Cron parsing',
            'Job queue management',
            'Failure handling'
        ],
        learningOutcomes: ['Job scheduling', 'Cron expressions', 'Distributed systems'],
        estimatedTime: '5-7 hours',
        techStack: ['Scheduler', 'Queue System', 'Database']
    },
    {
        id: 'content-moderation',
        title: 'Design a Content Moderation System',
        category: 'Social & Communication',
        difficulty: 'Intermediate',
        tags: ['moderation', 'ml', 'content-safety', 'automation'],
        description: 'Design a system to automatically and manually moderate user-generated content.',
        coreRequirements: [
            'Automated content scanning',
            'Manual review queue',
            'Content flagging',
            'Action enforcement'
        ],
        highLevelRequirements: [
            'ML-based detection',
            'Real-time processing',
            'Appeal system'
        ],
        microRequirements: [
            'Content classification',
            'Queue prioritization',
            'Audit logging'
        ],
        learningOutcomes: ['ML integration', 'Content safety', 'Workflow systems'],
        estimatedTime: '6-8 hours',
        techStack: ['ML Models', 'Queue System', 'Database']
    },
    {
        id: 'session-management',
        title: 'Design a Session Management System',
        category: 'Security',
        difficulty: 'Intermediate',
        tags: ['sessions', 'authentication', 'security', 'distributed'],
        description: 'Design a distributed session management system for web applications.',
        coreRequirements: [
            'Create and validate sessions',
            'Session storage',
            'Session expiration',
            'Multi-device support'
        ],
        highLevelRequirements: [
            'Distributed session store',
            'Session replication',
            'Security features'
        ],
        microRequirements: [
            'Token generation',
            'Session lookup optimization',
            'Cleanup mechanisms'
        ],
        learningOutcomes: ['Session management', 'Distributed caching', 'Security'],
        estimatedTime: '5-6 hours',
        techStack: ['Redis', 'JWT', 'Database']
    },
    {
        id: 'email-service',
        title: 'Design an Email Service Provider',
        category: 'Communication',
        difficulty: 'Intermediate',
        tags: ['email', 'smtp', 'delivery', 'tracking'],
        description: 'Design an email service that sends, tracks, and manages email campaigns.',
        coreRequirements: [
            'Send transactional emails',
            'Email templates',
            'Delivery tracking',
            'Bounce handling'
        ],
        highLevelRequirements: [
            'High deliverability',
            'Email analytics',
            'Spam prevention'
        ],
        microRequirements: [
            'SMTP integration',
            'Template rendering',
            'Webhook handling'
        ],
        learningOutcomes: ['Email protocols', 'Deliverability', 'Analytics'],
        estimatedTime: '6-7 hours',
        techStack: ['SMTP Server', 'Queue System', 'Analytics']
    },
    {
        id: 'cdn-service',
        title: 'Design a Content Delivery Network',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['cdn', 'caching', 'distribution', 'performance'],
        description: 'Design a CDN for distributing static content globally with low latency.',
        coreRequirements: [
            'Content caching at edge locations',
            'Cache invalidation',
            'Origin server integration',
            'Geographic routing'
        ],
        highLevelRequirements: [
            'Global distribution',
            'High cache hit ratio',
            'DDoS protection'
        ],
        microRequirements: [
            'Cache eviction policies',
            'Request routing',
            'Content purging'
        ],
        learningOutcomes: ['CDN architecture', 'Caching strategies', 'Geographic distribution'],
        estimatedTime: '7-8 hours',
        techStack: ['Edge Servers', 'DNS', 'Cache']
    },
    {
        id: 'metrics-monitoring',
        title: 'Design a Metrics and Monitoring System',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['monitoring', 'metrics', 'alerting', 'observability'],
        description: 'Design a system to collect, store, and visualize application metrics.',
        coreRequirements: [
            'Metric collection',
            'Time-series storage',
            'Query and visualization',
            'Alerting rules'
        ],
        highLevelRequirements: [
            'High-volume ingestion',
            'Real-time dashboards',
            'Anomaly detection'
        ],
        microRequirements: [
            'Efficient time-series storage',
            'Aggregation queries',
            'Alert evaluation'
        ],
        learningOutcomes: ['Time-series databases', 'Monitoring', 'Alerting'],
        estimatedTime: '6-8 hours',
        techStack: ['Time-series DB', 'Visualization', 'Alerting']
    },
    {
        id: 'feature-flag-system',
        title: 'Design a Feature Flag System',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['feature-flags', 'deployment', 'experimentation'],
        description: 'Design a feature flag system for controlled feature rollouts and A/B testing.',
        coreRequirements: [
            'Create and manage flags',
            'Flag evaluation',
            'User targeting',
            'Gradual rollouts'
        ],
        highLevelRequirements: [
            'Real-time flag updates',
            'Analytics integration',
            'Multi-environment support'
        ],
        microRequirements: [
            'Fast flag evaluation',
            'Targeting rules engine',
            'Audit logging'
        ],
        learningOutcomes: ['Feature management', 'A/B testing', 'Deployment strategies'],
        estimatedTime: '5-6 hours',
        techStack: ['Configuration Service', 'Cache', 'Analytics']
    },
    {
        id: 'log-aggregation',
        title: 'Design a Log Aggregation System',
        category: 'Infrastructure & Networking',
        difficulty: 'Intermediate',
        tags: ['logging', 'aggregation', 'search', 'analytics'],
        description: 'Design a system to collect, aggregate, and search application logs.',
        coreRequirements: [
            'Log collection from multiple sources',
            'Centralized storage',
            'Full-text search',
            'Log retention policies'
        ],
        highLevelRequirements: [
            'High-volume ingestion',
            'Real-time search',
            'Log analytics'
        ],
        microRequirements: [
            'Log parsing',
            'Indexing strategy',
            'Query optimization'
        ],
        learningOutcomes: ['Log management', 'Search systems', 'Data pipelines'],
        estimatedTime: '6-8 hours',
        techStack: ['Log Shipper', 'Search Engine', 'Storage']
    },
    {
        id: 'recommendation-engine',
        title: 'Design a Recommendation Engine',
        category: 'Machine Learning',
        difficulty: 'Intermediate',
        tags: ['recommendations', 'ml', 'personalization', 'collaborative-filtering'],
        description: 'Design a recommendation engine for suggesting items to users.',
        coreRequirements: [
            'User behavior tracking',
            'Recommendation algorithms',
            'Personalized suggestions',
            'Real-time recommendations'
        ],
        highLevelRequirements: [
            'Scalable computation',
            'Cold start handling',
            'A/B testing support'
        ],
        microRequirements: [
            'Similarity calculations',
            'Model training pipeline',
            'Recommendation caching'
        ],
        learningOutcomes: ['Recommendation algorithms', 'ML pipelines', 'Personalization'],
        estimatedTime: '7-9 hours',
        techStack: ['ML Framework', 'Data Pipeline', 'Cache']
    },
    {
        id: 'payment-gateway',
        title: 'Design a Payment Gateway',
        category: 'Finance',
        difficulty: 'Intermediate',
        tags: ['payments', 'transactions', 'security', 'compliance'],
        description: 'Design a payment gateway to process online transactions securely.',
        coreRequirements: [
            'Payment processing',
            'Multiple payment methods',
            'Transaction management',
            'Refund handling'
        ],
        highLevelRequirements: [
            'PCI compliance',
            'Fraud detection',
            'Multi-currency support'
        ],
        microRequirements: [
            'Secure data handling',
            'Transaction state machine',
            'Idempotency'
        ],
        learningOutcomes: ['Payment processing', 'Security', 'Compliance'],
        estimatedTime: '7-9 hours',
        techStack: ['Payment APIs', 'Encryption', 'Database']
    },
    {
        id: 'auction-system',
        title: 'Design an Online Auction System',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['auction', 'bidding', 'real-time', 'transactions'],
        description: 'Design an online auction platform with real-time bidding.',
        coreRequirements: [
            'Item listing',
            'Real-time bidding',
            'Bid validation',
            'Auction closing'
        ],
        highLevelRequirements: [
            'Concurrent bid handling',
            'Automatic bidding',
            'Payment integration'
        ],
        microRequirements: [
            'Optimistic locking',
            'Bid ordering',
            'Timer management'
        ],
        learningOutcomes: ['Real-time systems', 'Concurrency', 'State management'],
        estimatedTime: '6-8 hours',
        techStack: ['WebSockets', 'Database', 'Payment System']
    },
    {
        id: 'video-conferencing',
        title: 'Design a Video Conferencing System',
        category: 'Real-time Systems',
        difficulty: 'Intermediate',
        tags: ['video', 'webrtc', 'real-time', 'streaming'],
        description: 'Design a video conferencing platform for multi-party calls.',
        coreRequirements: [
            'Video/audio streaming',
            'Multi-party support',
            'Screen sharing',
            'Chat functionality'
        ],
        highLevelRequirements: [
            'Low latency',
            'Scalable infrastructure',
            'Recording capability'
        ],
        microRequirements: [
            'WebRTC signaling',
            'Media server architecture',
            'Bandwidth optimization'
        ],
        learningOutcomes: ['WebRTC', 'Media streaming', 'Real-time communication'],
        estimatedTime: '8-10 hours',
        techStack: ['WebRTC', 'Media Server', 'Signaling Server']
    },
    {
        id: 'collaborative-editor',
        title: 'Design a Collaborative Text Editor',
        category: 'Real-time Systems',
        difficulty: 'Intermediate',
        tags: ['collaboration', 'real-time', 'crdt', 'sync'],
        description: 'Design a Google Docs-like collaborative text editor.',
        coreRequirements: [
            'Real-time collaboration',
            'Conflict resolution',
            'Cursor tracking',
            'Version history'
        ],
        highLevelRequirements: [
            'Offline editing',
            'Presence indicators',
            'Comments and suggestions'
        ],
        microRequirements: [
            'Operational transformation',
            'Efficient sync protocol',
            'Conflict-free data structures'
        ],
        learningOutcomes: ['CRDTs', 'Operational transformation', 'Real-time sync'],
        estimatedTime: '8-10 hours',
        techStack: ['WebSockets', 'CRDT Library', 'Database']
    },
    {
        id: 'ride-sharing',
        title: 'Design a Ride Sharing Service',
        category: 'Location & Proximity',
        difficulty: 'Intermediate',
        tags: ['ride-sharing', 'geolocation', 'matching', 'real-time'],
        description: 'Design a ride-sharing platform like Uber with driver-rider matching.',
        coreRequirements: [
            'Real-time location tracking',
            'Driver-rider matching',
            'Route calculation',
            'Fare estimation'
        ],
        highLevelRequirements: [
            'Surge pricing',
            'Driver availability',
            'Trip tracking'
        ],
        microRequirements: [
            'Geospatial indexing',
            'Matching algorithms',
            'ETA calculation'
        ],
        learningOutcomes: ['Geospatial systems', 'Matching algorithms', 'Real-time tracking'],
        estimatedTime: '7-9 hours',
        techStack: ['Geospatial DB', 'Maps API', 'WebSockets']
    },
    {
        id: 'food-delivery',
        title: 'Design a Food Delivery Platform',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['food-delivery', 'ordering', 'logistics', 'real-time'],
        description: 'Design a food delivery platform with restaurant, customer, and delivery tracking.',
        coreRequirements: [
            'Restaurant catalog',
            'Order placement',
            'Delivery assignment',
            'Real-time tracking'
        ],
        highLevelRequirements: [
            'Multi-restaurant support',
            'Delivery optimization',
            'Payment processing'
        ],
        microRequirements: [
            'Order state machine',
            'Delivery routing',
            'Inventory management'
        ],
        learningOutcomes: ['Marketplace design', 'Logistics', 'State machines'],
        estimatedTime: '7-9 hours',
        techStack: ['Backend Framework', 'Maps API', 'Payment Gateway']
    },
    {
        id: 'hotel-booking',
        title: 'Design a Hotel Booking System',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['booking', 'inventory', 'reservations', 'payments'],
        description: 'Design a hotel booking platform with search, reservation, and payment.',
        coreRequirements: [
            'Hotel search and filtering',
            'Room availability',
            'Booking management',
            'Payment processing'
        ],
        highLevelRequirements: [
            'Inventory synchronization',
            'Cancellation handling',
            'Multi-currency support'
        ],
        microRequirements: [
            'Availability calculation',
            'Booking conflicts',
            'Price calculation'
        ],
        learningOutcomes: ['Inventory management', 'Booking systems', 'Search'],
        estimatedTime: '6-8 hours',
        techStack: ['Search Engine', 'Database', 'Payment Gateway']
    },
    {
        id: 'ticket-booking',
        title: 'Design a Movie Ticket Booking System',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['ticketing', 'booking', 'seats', 'concurrency'],
        description: 'Design a movie ticket booking system with seat selection.',
        coreRequirements: [
            'Movie listings',
            'Seat selection',
            'Booking confirmation',
            'Payment integration'
        ],
        highLevelRequirements: [
            'Concurrent booking handling',
            'Seat locking',
            'Show scheduling'
        ],
        microRequirements: [
            'Seat availability',
            'Lock timeout',
            'Transaction handling'
        ],
        learningOutcomes: ['Concurrency control', 'Locking mechanisms', 'Transactions'],
        estimatedTime: '6-7 hours',
        techStack: ['Database', 'Locking Service', 'Payment Gateway']
    },
    {
        id: 'social-feed',
        title: 'Design a Social Media Feed',
        category: 'Social & Communication',
        difficulty: 'Intermediate',
        tags: ['feed', 'social-media', 'ranking', 'real-time'],
        description: 'Design a social media feed with posts, likes, and comments.',
        coreRequirements: [
            'Post creation',
            'Feed generation',
            'Likes and comments',
            'Feed ranking'
        ],
        highLevelRequirements: [
            'Personalized feeds',
            'Real-time updates',
            'Scalable architecture'
        ],
        microRequirements: [
            'Fan-out strategies',
            'Ranking algorithms',
            'Cache optimization'
        ],
        learningOutcomes: ['Feed architecture', 'Ranking', 'Social graphs'],
        estimatedTime: '7-9 hours',
        techStack: ['Database', 'Cache', 'Queue System']
    },
    {
        id: 'comment-system',
        title: 'Design a Nested Comment System',
        category: 'Social & Communication',
        difficulty: 'Intermediate',
        tags: ['comments', 'threading', 'social', 'hierarchy'],
        description: 'Design a comment system with nested replies and voting.',
        coreRequirements: [
            'Post comments',
            'Nested replies',
            'Voting system',
            'Comment sorting'
        ],
        highLevelRequirements: [
            'Threaded discussions',
            'Spam detection',
            'Moderation tools'
        ],
        microRequirements: [
            'Tree structure storage',
            'Vote counting',
            'Sorting algorithms'
        ],
        learningOutcomes: ['Tree structures', 'Voting systems', 'Data modeling'],
        estimatedTime: '5-6 hours',
        techStack: ['Database', 'Backend Framework', 'Cache']
    },
    {
        id: 'analytics-platform',
        title: 'Design a Web Analytics Platform',
        category: 'Analytics',
        difficulty: 'Intermediate',
        tags: ['analytics', 'tracking', 'reporting', 'big-data'],
        description: 'Design a web analytics platform like Google Analytics.',
        coreRequirements: [
            'Event tracking',
            'Data collection',
            'Report generation',
            'Real-time dashboards'
        ],
        highLevelRequirements: [
            'High-volume ingestion',
            'Custom reports',
            'User segmentation'
        ],
        microRequirements: [
            'Event batching',
            'Aggregation queries',
            'Data retention'
        ],
        learningOutcomes: ['Analytics systems', 'Big data', 'Reporting'],
        estimatedTime: '7-9 hours',
        techStack: ['Stream Processing', 'Data Warehouse', 'Visualization']
    },
    {
        id: 'job-board',
        title: 'Design a Job Board Platform',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['jobs', 'search', 'matching', 'applications'],
        description: 'Design a job board with job postings, applications, and candidate matching.',
        coreRequirements: [
            'Job posting',
            'Job search',
            'Application submission',
            'Candidate tracking'
        ],
        highLevelRequirements: [
            'Resume parsing',
            'Job recommendations',
            'Employer dashboard'
        ],
        microRequirements: [
            'Search indexing',
            'Matching algorithms',
            'Application workflow'
        ],
        learningOutcomes: ['Search systems', 'Matching', 'Workflow management'],
        estimatedTime: '6-8 hours',
        techStack: ['Search Engine', 'Database', 'ML for matching']
    },
    {
        id: 'inventory-management',
        title: 'Design an Inventory Management System',
        category: 'E-commerce & Business',
        difficulty: 'Intermediate',
        tags: ['inventory', 'stock', 'warehousing', 'tracking'],
        description: 'Design a system to track and manage product inventory across warehouses.',
        coreRequirements: [
            'Stock tracking',
            'Warehouse management',
            'Stock alerts',
            'Inventory reports'
        ],
        highLevelRequirements: [
            'Multi-warehouse support',
            'Stock transfers',
            'Forecasting'
        ],
        microRequirements: [
            'Stock calculations',
            'Alert thresholds',
            'Transaction logging'
        ],
        learningOutcomes: ['Inventory systems', 'Stock management', 'Reporting'],
        estimatedTime: '6-7 hours',
        techStack: ['Database', 'Backend Framework', 'Analytics']
    },
    {
        id: 'crm-system',
        title: 'Design a Customer Relationship Management System',
        category: 'Business Tools',
        difficulty: 'Intermediate',
        tags: ['crm', 'sales', 'customer-management', 'pipeline'],
        description: 'Design a CRM system for managing customer relationships and sales pipelines.',
        coreRequirements: [
            'Contact management',
            'Sales pipeline',
            'Activity tracking',
            'Reporting'
        ],
        highLevelRequirements: [
            'Email integration',
            'Task automation',
            'Analytics dashboard'
        ],
        microRequirements: [
            'Pipeline stages',
            'Activity logging',
            'Report generation'
        ],
        learningOutcomes: ['Business logic', 'Workflow automation', 'Data modeling'],
        estimatedTime: '7-8 hours',
        techStack: ['Backend Framework', 'Database', 'Email Integration']
    },
    {
        id: 'learning-management',
        title: 'Design a Learning Management System',
        category: 'Education',
        difficulty: 'Intermediate',
        tags: ['education', 'courses', 'learning', 'assessment'],
        description: 'Design an LMS for creating courses, delivering content, and tracking progress.',
        coreRequirements: [
            'Course creation',
            'Content delivery',
            'Progress tracking',
            'Assessments'
        ],
        highLevelRequirements: [
            'Video hosting',
            'Certification',
            'Discussion forums'
        ],
        microRequirements: [
            'Progress calculation',
            'Content sequencing',
            'Grade management'
        ],
        learningOutcomes: ['Educational platforms', 'Content delivery', 'Progress tracking'],
        estimatedTime: '7-9 hours',
        techStack: ['Video Platform', 'Database', 'Assessment Engine']
    },
    ...Array.from({ length: 74 }, (_, i) => {
        const id = 27 + i;
        const categories = ['Infrastructure & Networking', 'Social & Communication', 'E-commerce & Business', 'Real-time Systems', 'Analytics'];
        const category = categories[i % categories.length];

        return {
            id: `intermediate-extra-${id}`,
            title: `Intermediate Design Challenge ${id}`,
            category,
            difficulty: 'Intermediate' as const,
            tags: ['intermediate', 'scalability', 'system-design'],
            description: `Design a scalable system for ${category} challenge ${id}. Focus on reliability and performance optimization.`,
            coreRequirements: [
                'Handle increased load',
                'Data consistency',
                'Service reliability',
                'Monitoring metrics'
            ],
            highLevelRequirements: [
                'Scalable architecture',
                'Fault tolerance',
                'Performance tuning'
            ],
            microRequirements: [
                'Caching strategies',
                'Database optimization',
                'Efficient API design'
            ],
            learningOutcomes: ['Scalability', 'Performance', 'Architecture patterns'],
            estimatedTime: '5-7 hours',
            techStack: ['Distributed Systems', 'Database', 'Cache', 'Message Queue']
        };
    })
];

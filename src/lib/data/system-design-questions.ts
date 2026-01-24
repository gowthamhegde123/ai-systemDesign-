export interface SystemDesignQuestion {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  description: string;
  coreRequirements: string[];
  highLevelRequirements: string[];
  microRequirements: string[];
  learningOutcomes: string[];
  estimatedTime: string;
  techStack: string[];
}

export const systemDesignQuestions: SystemDesignQuestion[] = [
  // STORAGE & DATABASES
  {
    id: 'distributed-cache',
    title: 'Design a Distributed Cache',
    category: 'Storage & Databases',
    difficulty: 'Intermediate',
    tags: ['cache', 'distributed-systems', 'performance', 'concurrency'],
    description: 'Design a single node cache and scale it to be distributed with GET, PUT, DEL, and TTL operations.',
    coreRequirements: [
      'Support GET, PUT, DEL, and TTL operations',
      'Optimal throughput and lock-free design',
      'Measure cache-hit and cache-miss ratios',
      'Fault tolerant components',
      'Pluggable cache eviction strategies'
    ],
    highLevelRequirements: [
      'High availability across components',
      'Durable data storage',
      'Efficient scaling up and down',
      'Cost-effective architecture'
    ],
    microRequirements: [
      'Consistent data state',
      'Deadlock-free system',
      'Minimal locking impact on throughput'
    ],
    learningOutcomes: ['In-memory cache implementation', 'Lock-free implementations', 'Consistent hashing'],
    estimatedTime: '4-6 hours',
    techStack: ['Golang', 'Java', 'C++']
  },
  {
    id: 'superfast-kv',
    title: 'Design a Superfast KV Store',
    category: 'Storage & Databases',
    difficulty: 'Advanced',
    tags: ['key-value', 'performance', 'storage', 'optimization'],
    description: 'Design an extremely fast key-value store optimized for high throughput and low latency.',
    coreRequirements: [
      'Ultra-fast read/write operations',
      'Memory-optimized data structures',
      'Minimal serialization overhead',
      'Lock-free concurrent access'
    ],
    highLevelRequirements: [
      'Horizontal scalability',
      'Data persistence options',
      'Memory management strategies'
    ],
    microRequirements: [
      'Cache-friendly data layouts',
      'Optimized memory allocation',
      'Efficient serialization protocols'
    ],
    learningOutcomes: ['Performance optimization', 'Memory management', 'Data structure design'],
    estimatedTime: '6-8 hours',
    techStack: ['C++', 'Rust', 'Golang']
  },
  {
    id: 'sql-kv',
    title: 'Design SQL backed KV Store',
    category: 'Storage & Databases',
    difficulty: 'Intermediate',
    tags: ['sql', 'key-value', 'database', 'hybrid'],
    description: 'Design a key-value store that uses SQL database as the underlying storage engine.',
    coreRequirements: [
      'KV interface over SQL storage',
      'Transaction support',
      'Query optimization',
      'Schema design for KV operations'
    ],
    highLevelRequirements: [
      'ACID compliance',
      'Backup and recovery',
      'Performance monitoring'
    ],
    microRequirements: [
      'Efficient indexing strategies',
      'Connection pooling',
      'Query plan optimization'
    ],
    learningOutcomes: ['SQL optimization', 'Database design', 'Hybrid storage systems'],
    estimatedTime: '4-5 hours',
    techStack: ['PostgreSQL', 'MySQL', 'Java', 'Python']
  },
  {
    id: 's3',
    title: 'Design S3 (Object Storage)',
    category: 'Storage & Databases',
    difficulty: 'Advanced',
    tags: ['object-storage', 'distributed-systems', 'scalability', 'durability'],
    description: 'Design a scalable object storage service like Amazon S3 with high durability and availability.',
    coreRequirements: [
      'Object CRUD operations',
      'Metadata management',
      'Versioning support',
      'Access control and permissions'
    ],
    highLevelRequirements: [
      '99.999999999% durability',
      'Global distribution',
      'Cost-effective storage tiers'
    ],
    microRequirements: [
      'Consistent metadata',
      'Efficient replication',
      'Garbage collection'
    ],
    learningOutcomes: ['Distributed storage', 'Replication strategies', 'Consistency models'],
    estimatedTime: '8-10 hours',
    techStack: ['Distributed Systems', 'NoSQL', 'CDN']
  },
  {
    id: 'realtime-db',
    title: 'Design a Realtime Database',
    category: 'Storage & Databases',
    difficulty: 'Advanced',
    tags: ['realtime', 'database', 'websockets', 'synchronization'],
    description: 'Design a database that provides real-time updates to connected clients.',
    coreRequirements: [
      'Real-time data synchronization',
      'WebSocket connections',
      'Conflict resolution',
      'Offline support'
    ],
    highLevelRequirements: [
      'Multi-device synchronization',
      'Scalable connection handling',
      'Data consistency guarantees'
    ],
    microRequirements: [
      'Efficient change detection',
      'Optimistic locking',
      'Connection state management'
    ],
    learningOutcomes: ['Real-time systems', 'WebSocket architecture', 'Conflict resolution'],
    estimatedTime: '6-8 hours',
    techStack: ['WebSockets', 'Node.js', 'Redis']
  },

  // INFRASTRUCTURE & NETWORKING
  {
    id: 'load-balancer',
    title: 'Design a Load Balancer',
    category: 'Infrastructure & Networking',
    difficulty: 'Intermediate',
    tags: ['load-balancing', 'networking', 'reverse-proxy', 'scalability'],
    description: 'Design a load balancer that acts as a reverse proxy and balances load across backend servers.',
    coreRequirements: [
      'Accept and forward TCP connections',
      'Add/remove backend servers dynamically',
      'Health monitoring of backend servers',
      'Configurable load balancing strategies',
      'Handle millions of concurrent connections'
    ],
    highLevelRequirements: [
      'High availability architecture',
      'Horizontal scaling capabilities',
      'Monitoring and metrics collection'
    ],
    microRequirements: [
      'Efficient connection handling',
      'Non-blocking I/O operations',
      'Memory-efficient design'
    ],
    learningOutcomes: ['System calls', 'Load balancer internals', 'Multi-threading'],
    estimatedTime: '5-7 hours',
    techStack: ['Golang', 'Java', 'C++']
  },
  {
    id: 'task-scheduler',
    title: 'Design a Distributed Task Scheduler',
    category: 'Infrastructure & Networking',
    difficulty: 'Advanced',
    tags: ['scheduling', 'distributed-systems', 'cron', 'task-management'],
    description: 'Design a distributed system that can schedule and execute tasks across multiple nodes.',
    coreRequirements: [
      'Schedule tasks with cron-like syntax',
      'Distributed task execution',
      'Task dependency management',
      'Failure handling and retries'
    ],
    highLevelRequirements: [
      'Fault tolerance',
      'Load distribution',
      'Task monitoring and logging'
    ],
    microRequirements: [
      'Leader election',
      'Task state consistency',
      'Efficient task queuing'
    ],
    learningOutcomes: ['Distributed scheduling', 'Consensus algorithms', 'Task orchestration'],
    estimatedTime: '6-8 hours',
    techStack: ['Distributed Systems', 'Message Queues', 'Consensus Protocols']
  },
  {
    id: 'queue-consumers',
    title: 'Design Synchronized Queue Consumers',
    category: 'Infrastructure & Networking',
    difficulty: 'Intermediate',
    tags: ['queues', 'consumers', 'synchronization', 'messaging'],
    description: 'Design a system with multiple consumers processing messages from queues in a synchronized manner.',
    coreRequirements: [
      'Multiple consumer coordination',
      'Message ordering guarantees',
      'Consumer failure handling',
      'Load balancing across consumers'
    ],
    highLevelRequirements: [
      'Scalable consumer groups',
      'Message durability',
      'Monitoring and alerting'
    ],
    microRequirements: [
      'Efficient message distribution',
      'Consumer health tracking',
      'Deadlock prevention'
    ],
    learningOutcomes: ['Message queues', 'Consumer patterns', 'Synchronization'],
    estimatedTime: '4-6 hours',
    techStack: ['Message Brokers', 'Kafka', 'RabbitMQ']
  },
  {
    id: 'sql-broker',
    title: 'Design a SQL backed Message Broker',
    category: 'Infrastructure & Networking',
    difficulty: 'Advanced',
    tags: ['message-broker', 'sql', 'messaging', 'queues'],
    description: 'Design a message broker that uses SQL database as the underlying storage for messages.',
    coreRequirements: [
      'Message publishing and consumption',
      'Topic and queue management',
      'Message persistence in SQL',
      'Consumer group coordination'
    ],
    highLevelRequirements: [
      'ACID message guarantees',
      'Scalable message throughput',
      'Message retention policies'
    ],
    microRequirements: [
      'Efficient message polling',
      'Transaction isolation',
      'Index optimization'
    ],
    learningOutcomes: ['Message broker design', 'SQL optimization', 'Messaging patterns'],
    estimatedTime: '6-8 hours',
    techStack: ['SQL Database', 'Java', 'Python']
  },

  // REAL-TIME SYSTEMS
  {
    id: 'live-commentary',
    title: 'Design Live Cricket Commentary Service',
    category: 'Real-time Systems',
    difficulty: 'Intermediate',
    tags: ['real-time', 'commentary', 'broadcasting', 'sports'],
    description: 'Design a text-based cricket commentary service that delivers real-time updates to millions of users.',
    coreRequirements: [
      'Real-time commentary delivery',
      'Multiple match support',
      'User subscription management',
      'Commentary moderation'
    ],
    highLevelRequirements: [
      'Global content delivery',
      'Millions of concurrent users',
      'Low latency updates'
    ],
    microRequirements: [
      'Efficient broadcasting',
      'Connection management',
      'Content caching strategies'
    ],
    learningOutcomes: ['Real-time broadcasting', 'WebSocket scaling', 'Content delivery'],
    estimatedTime: '5-7 hours',
    techStack: ['WebSockets', 'CDN', 'Redis']
  },
  {
    id: 'realtime-claps',
    title: 'Design Realtime Claps System',
    category: 'Real-time Systems',
    difficulty: 'Intermediate',
    tags: ['real-time', 'reactions', 'websockets', 'aggregation'],
    description: 'Design a system like Medium\'s claps that shows real-time reactions and aggregates them efficiently.',
    coreRequirements: [
      'Real-time clap updates',
      'Clap aggregation and counting',
      'User interaction tracking',
      'Spam prevention'
    ],
    highLevelRequirements: [
      'High-frequency updates',
      'Scalable aggregation',
      'Real-time analytics'
    ],
    microRequirements: [
      'Efficient counter updates',
      'Rate limiting',
      'Consistent aggregation'
    ],
    learningOutcomes: ['Real-time aggregation', 'Counter systems', 'Rate limiting'],
    estimatedTime: '4-6 hours',
    techStack: ['WebSockets', 'Redis', 'Time-series DB']
  },
  {
    id: 'online-offline-indicator',
    title: 'Design Online/Offline Indicator',
    category: 'Real-time Systems',
    difficulty: 'Beginner',
    tags: ['presence', 'real-time', 'status', 'websockets'],
    description: 'Design a system that shows whether users are online or offline in real-time.',
    coreRequirements: [
      'Track user online/offline status',
      'Real-time status updates',
      'Heartbeat mechanism',
      'Status persistence'
    ],
    highLevelRequirements: [
      'Scalable presence tracking',
      'Efficient status broadcasting',
      'Connection failure handling'
    ],
    microRequirements: [
      'Optimized heartbeat intervals',
      'Status change detection',
      'Memory-efficient tracking'
    ],
    learningOutcomes: ['Presence systems', 'Heartbeat mechanisms', 'Real-time updates'],
    estimatedTime: '3-4 hours',
    techStack: ['WebSockets', 'Redis', 'Node.js']
  },

  // CONTENT & MEDIA
  {
    id: 'image-service',
    title: 'Design an Image Service',
    category: 'Content & Media',
    difficulty: 'Intermediate',
    tags: ['images', 'cdn', 'storage', 'processing'],
    description: 'Design a service for uploading, storing, processing, and serving images at scale.',
    coreRequirements: [
      'Image upload and storage',
      'Multiple format support',
      'Image resizing and optimization',
      'CDN integration'
    ],
    highLevelRequirements: [
      'Global image delivery',
      'Cost-effective storage',
      'High availability'
    ],
    microRequirements: [
      'Efficient image processing',
      'Metadata management',
      'Cache optimization'
    ],
    learningOutcomes: ['Image processing', 'CDN architecture', 'Storage optimization'],
    estimatedTime: '5-7 hours',
    techStack: ['CDN', 'Object Storage', 'Image Processing Libraries']
  },
  {
    id: 'video-pipeline',
    title: 'Design Video Processing Pipeline',
    category: 'Content & Media',
    difficulty: 'Advanced',
    tags: ['video', 'streaming', 'processing', 'pipeline'],
    description: 'Design a video processing pipeline for a streaming service that handles encoding, storage, and delivery.',
    coreRequirements: [
      'Video upload and processing',
      'Multiple quality encoding',
      'Streaming protocol support',
      'Content delivery optimization'
    ],
    highLevelRequirements: [
      'Global video delivery',
      'Adaptive bitrate streaming',
      'Cost-effective processing'
    ],
    microRequirements: [
      'Efficient encoding pipeline',
      'Storage optimization',
      'Bandwidth management'
    ],
    learningOutcomes: ['Video processing', 'Streaming protocols', 'Pipeline architecture'],
    estimatedTime: '8-10 hours',
    techStack: ['Video Encoders', 'CDN', 'Streaming Protocols']
  },
  {
    id: 'blogging-platform',
    title: 'Design a Blogging Platform',
    category: 'Content & Media',
    difficulty: 'Beginner',
    tags: ['blogging', 'content-management', 'web-application', 'crud'],
    description: 'Design a blogging platform where users can create, edit, publish, and manage blog posts.',
    coreRequirements: [
      'User authentication and profiles',
      'Blog post CRUD operations',
      'Rich text editor',
      'Comment system'
    ],
    highLevelRequirements: [
      'SEO optimization',
      'Content moderation',
      'Analytics and insights'
    ],
    microRequirements: [
      'Efficient content storage',
      'Search functionality',
      'Spam prevention'
    ],
    learningOutcomes: ['Web application design', 'Content management', 'User systems'],
    estimatedTime: '4-6 hours',
    techStack: ['Web Framework', 'Database', 'Search Engine']
  },

  // SEARCH & DISCOVERY
  {
    id: 'text-search-engine',
    title: 'Design a Text-based Search Engine',
    category: 'Search & Discovery',
    difficulty: 'Advanced',
    tags: ['search', 'indexing', 'ranking', 'text-processing'],
    description: 'Design a search engine that can index and search through large amounts of text content.',
    coreRequirements: [
      'Text indexing and crawling',
      'Search query processing',
      'Ranking algorithm',
      'Result pagination'
    ],
    highLevelRequirements: [
      'Distributed indexing',
      'Real-time search updates',
      'Personalized results'
    ],
    microRequirements: [
      'Efficient index storage',
      'Query optimization',
      'Relevance scoring'
    ],
    learningOutcomes: ['Search algorithms', 'Text indexing', 'Ranking systems'],
    estimatedTime: '8-10 hours',
    techStack: ['Elasticsearch', 'Lucene', 'Distributed Systems']
  },
  {
    id: 'recent-searches',
    title: 'Design Recent Searches Service',
    category: 'Search & Discovery',
    difficulty: 'Beginner',
    tags: ['search-history', 'user-experience', 'caching', 'personalization'],
    description: 'Design a service that stores and serves recent searches for users to improve their experience.',
    coreRequirements: [
      'Store user search history',
      'Retrieve recent searches',
      'Search suggestion ranking',
      'Privacy controls'
    ],
    highLevelRequirements: [
      'Fast search retrieval',
      'Data retention policies',
      'Cross-device synchronization'
    ],
    microRequirements: [
      'Efficient storage format',
      'Cache optimization',
      'Duplicate handling'
    ],
    learningOutcomes: ['User data management', 'Caching strategies', 'Privacy design'],
    estimatedTime: '3-4 hours',
    techStack: ['Cache', 'Database', 'API Design']
  },
  {
    id: 'word-dictionary',
    title: 'Design a Word Dictionary',
    category: 'Search & Discovery',
    difficulty: 'Intermediate',
    tags: ['dictionary', 'search', 'text-processing', 'api'],
    description: 'Design a word dictionary service that provides definitions, synonyms, and language features.',
    coreRequirements: [
      'Word lookup and definitions',
      'Synonym and antonym support',
      'Pronunciation guides',
      'Multiple language support'
    ],
    highLevelRequirements: [
      'Fast word lookup',
      'Comprehensive word database',
      'API rate limiting'
    ],
    microRequirements: [
      'Efficient word indexing',
      'Fuzzy search support',
      'Cache optimization'
    ],
    learningOutcomes: ['Text search', 'API design', 'Data structures'],
    estimatedTime: '4-5 hours',
    techStack: ['Search Engine', 'API Framework', 'Database']
  },

  // SOCIAL & COMMUNICATION
  {
    id: 'hashtag-service',
    title: 'Design a HashTag Service',
    category: 'Social & Communication',
    difficulty: 'Intermediate',
    tags: ['hashtags', 'social-media', 'trending', 'indexing'],
    description: 'Design a hashtag service that tracks, indexes, and serves trending hashtags across social media.',
    coreRequirements: [
      'Hashtag extraction and indexing',
      'Trending hashtag calculation',
      'Hashtag search and discovery',
      'Real-time updates'
    ],
    highLevelRequirements: [
      'High-volume hashtag processing',
      'Global trending analysis',
      'Spam detection'
    ],
    microRequirements: [
      'Efficient hashtag counting',
      'Time-based trending algorithms',
      'Memory-efficient storage'
    ],
    learningOutcomes: ['Text processing', 'Trending algorithms', 'Real-time analytics'],
    estimatedTime: '5-6 hours',
    techStack: ['Stream Processing', 'Time-series DB', 'Analytics']
  },
  {
    id: 'tagging-photos-with-people',
    title: 'Design Photo Tagging with People',
    category: 'Social & Communication',
    difficulty: 'Advanced',
    tags: ['photo-tagging', 'face-recognition', 'machine-learning', 'social'],
    description: 'Design a system that automatically detects and tags people in photos using facial recognition.',
    coreRequirements: [
      'Face detection in photos',
      'Face recognition and matching',
      'User tagging suggestions',
      'Privacy controls'
    ],
    highLevelRequirements: [
      'Scalable image processing',
      'Machine learning pipeline',
      'User consent management'
    ],
    microRequirements: [
      'Efficient face encoding',
      'Similarity matching algorithms',
      'Batch processing optimization'
    ],
    learningOutcomes: ['Computer vision', 'ML pipelines', 'Privacy-aware design'],
    estimatedTime: '8-10 hours',
    techStack: ['Computer Vision', 'ML Framework', 'Image Processing']
  },
  {
    id: 'user-affinity',
    title: 'Design User Affinity System',
    category: 'Social & Communication',
    difficulty: 'Advanced',
    tags: ['recommendation', 'user-behavior', 'machine-learning', 'personalization'],
    description: 'Design a system that calculates user affinity and similarity for recommendations and social features.',
    coreRequirements: [
      'User behavior tracking',
      'Affinity score calculation',
      'Similar user discovery',
      'Recommendation generation'
    ],
    highLevelRequirements: [
      'Real-time affinity updates',
      'Scalable similarity computation',
      'Privacy-preserving analytics'
    ],
    microRequirements: [
      'Efficient similarity algorithms',
      'Incremental score updates',
      'Memory-efficient storage'
    ],
    learningOutcomes: ['Recommendation systems', 'Similarity algorithms', 'User modeling'],
    estimatedTime: '7-9 hours',
    techStack: ['ML Framework', 'Analytics', 'Graph Database']
  },
  {
    id: 'newly-unread-indicator',
    title: 'Design Newly Unread Message Indicator',
    category: 'Social & Communication',
    difficulty: 'Beginner',
    tags: ['messaging', 'notifications', 'user-experience', 'real-time'],
    description: 'Design a system that tracks and indicates newly unread messages across different conversations.',
    coreRequirements: [
      'Track message read status',
      'Unread count management',
      'Real-time status updates',
      'Cross-device synchronization'
    ],
    highLevelRequirements: [
      'Scalable status tracking',
      'Efficient status queries',
      'Consistent state management'
    ],
    microRequirements: [
      'Optimized status storage',
      'Batch status updates',
      'Memory-efficient counters'
    ],
    learningOutcomes: ['State management', 'Real-time systems', 'User experience design'],
    estimatedTime: '3-4 hours',
    techStack: ['Real-time DB', 'WebSockets', 'Cache']
  },

  // E-COMMERCE & BUSINESS
  {
    id: 'flash-sale',
    title: 'Design Flash Sale System',
    category: 'E-commerce & Business',
    difficulty: 'Advanced',
    tags: ['flash-sale', 'inventory', 'high-concurrency', 'payments'],
    description: 'Design a flash sale system that handles high concurrency for limited inventory items.',
    coreRequirements: [
      'Fixed inventory management',
      'High-concurrency handling',
      'Payment processing integration',
      'Cart timeout management'
    ],
    highLevelRequirements: [
      'Prevent overselling',
      'Handle traffic spikes',
      'Fair user experience'
    ],
    microRequirements: [
      'Atomic inventory operations',
      'Efficient queue management',
      'Database performance optimization'
    ],
    learningOutcomes: ['High-concurrency systems', 'Inventory management', 'Payment flows'],
    estimatedTime: '6-8 hours',
    techStack: ['High-performance DB', 'Queue Systems', 'Payment APIs']
  },
  {
    id: 'counting-impressions',
    title: 'Design Counting Impressions at Scale',
    category: 'E-commerce & Business',
    difficulty: 'Advanced',
    tags: ['analytics', 'counting', 'high-volume', 'real-time'],
    description: 'Design a system that counts impressions, clicks, and other events at massive scale for advertising.',
    coreRequirements: [
      'High-volume event ingestion',
      'Real-time counting',
      'Aggregation across dimensions',
      'Fraud detection'
    ],
    highLevelRequirements: [
      'Billions of events per day',
      'Real-time analytics',
      'Cost-effective storage'
    ],
    microRequirements: [
      'Efficient event batching',
      'Approximate counting algorithms',
      'Memory-optimized aggregation'
    ],
    learningOutcomes: ['Stream processing', 'Approximate algorithms', 'Analytics systems'],
    estimatedTime: '7-9 hours',
    techStack: ['Stream Processing', 'Time-series DB', 'Analytics']
  },
  {
    id: 'airline-checkin',
    title: 'Design Airline Check-in System',
    category: 'E-commerce & Business',
    difficulty: 'Intermediate',
    tags: ['booking', 'check-in', 'seat-selection', 'business-logic'],
    description: 'Design an airline check-in system that handles seat selection, boarding passes, and passenger management.',
    coreRequirements: [
      'Passenger check-in process',
      'Seat selection and assignment',
      'Boarding pass generation',
      'Flight status integration'
    ],
    highLevelRequirements: [
      'High availability during peak times',
      'Integration with airline systems',
      'Mobile and web support'
    ],
    microRequirements: [
      'Seat locking mechanisms',
      'Consistent passenger data',
      'Efficient seat algorithms'
    ],
    learningOutcomes: ['Business logic design', 'State machines', 'Integration patterns'],
    estimatedTime: '5-7 hours',
    techStack: ['Business Logic Framework', 'Database', 'API Integration']
  },

  // LOCATION & PROXIMITY
  {
    id: 'near-me',
    title: 'Design "Who\'s Near Me" Service',
    category: 'Location & Proximity',
    difficulty: 'Intermediate',
    tags: ['geolocation', 'proximity', 'real-time', 'spatial-indexing'],
    description: 'Design a service that finds and shows users who are near each other based on location.',
    coreRequirements: [
      'Location tracking and updates',
      'Proximity search algorithms',
      'Privacy controls',
      'Real-time location updates'
    ],
    highLevelRequirements: [
      'Scalable location indexing',
      'Efficient proximity queries',
      'Battery-optimized tracking'
    ],
    microRequirements: [
      'Spatial data structures',
      'Location update optimization',
      'Privacy-preserving algorithms'
    ],
    learningOutcomes: ['Geospatial systems', 'Spatial indexing', 'Location privacy'],
    estimatedTime: '5-7 hours',
    techStack: ['Geospatial DB', 'Location Services', 'Real-time Systems']
  },

  // FILE & SYNC SYSTEMS
  {
    id: 'file-sync',
    title: 'Design Remote File Sync Service',
    category: 'File & Sync Systems',
    difficulty: 'Advanced',
    tags: ['file-sync', 'distributed-systems', 'conflict-resolution', 'storage'],
    description: 'Design a file synchronization service like Dropbox that syncs files across multiple devices.',
    coreRequirements: [
      'File upload and download',
      'Multi-device synchronization',
      'Conflict resolution',
      'Version control'
    ],
    highLevelRequirements: [
      'Efficient delta sync',
      'Offline support',
      'Large file handling'
    ],
    microRequirements: [
      'Chunked file transfer',
      'Metadata consistency',
      'Efficient change detection'
    ],
    learningOutcomes: ['File systems', 'Sync algorithms', 'Conflict resolution'],
    estimatedTime: '8-10 hours',
    techStack: ['Distributed Storage', 'Sync Protocols', 'File Systems']
  },

  // SPECIALIZED APPLICATIONS
  {
    id: 'onepic',
    title: 'Design OnePic (Photo Sharing)',
    category: 'Specialized Applications',
    difficulty: 'Intermediate',
    tags: ['photo-sharing', 'social-media', 'content-delivery', 'mobile'],
    description: 'Design a photo sharing application where users can share one photo per day with friends.',
    coreRequirements: [
      'Daily photo upload limit',
      'Friend connections',
      'Photo feed generation',
      'Push notifications'
    ],
    highLevelRequirements: [
      'Global photo delivery',
      'Mobile-optimized experience',
      'Social engagement features'
    ],
    microRequirements: [
      'Efficient image storage',
      'Feed generation algorithms',
      'Notification delivery'
    ],
    learningOutcomes: ['Social media architecture', 'Content delivery', 'Mobile backend'],
    estimatedTime: '6-8 hours',
    techStack: ['Mobile Backend', 'CDN', 'Push Notifications']
  }
];

// Helper functions for filtering and searching
export const getQuestionsByCategory = (category: string) => {
  return systemDesignQuestions.filter(q => q.category === category);
};

export const getQuestionsByDifficulty = (difficulty: string) => {
  return systemDesignQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByTag = (tag: string) => {
  return systemDesignQuestions.filter(q => q.tags.includes(tag));
};

export const searchQuestions = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return systemDesignQuestions.filter(q => 
    q.title.toLowerCase().includes(lowercaseQuery) ||
    q.description.toLowerCase().includes(lowercaseQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAllCategories = () => {
  return [...new Set(systemDesignQuestions.map(q => q.category))];
};

export const getAllTags = () => {
  return [...new Set(systemDesignQuestions.flatMap(q => q.tags))];
};
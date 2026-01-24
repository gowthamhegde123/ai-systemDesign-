import { Problem } from '@/types';

export const PROBLEMS: Problem[] = [
    // EASY
    {
        id: '1',
        title: 'Design a URL Shortener',
        description: 'Design a scalable URL shortening service like TinyURL.',
        difficulty: 'Easy',
        category: 'Web Services',
        requirements: ['Shorten long URLs', 'Redirect short URLs', 'High availability'],
        constraints: ['100M new URLs per month', 'Read:Write ratio 100:1']
    },
    {
        id: '2',
        title: 'Design a Pastebin',
        description: 'Design a service where users can store and share text snippets.',
        difficulty: 'Easy',
        category: 'Web Services',
        requirements: ['Upload text', 'Generate unique link', 'Expiration support'],
        constraints: ['10M daily active users', '10GB storage per day']
    },
    {
        id: '3',
        title: 'Design a Web Crawler',
        description: 'Design a system that crawls the web and indexes pages.',
        difficulty: 'Easy',
        category: 'Data Systems',
        requirements: ['Crawl pages', 'Handle duplicates', 'Scalable'],
        constraints: ['1B pages per month', 'Respect robots.txt']
    },

    // MEDIUM
    {
        id: '4',
        title: 'Design a Rate Limiter',
        description: 'Design a system to limit the number of requests a user can send to an API.',
        difficulty: 'Medium',
        category: 'Infrastructure',
        requirements: ['Limit requests per user', 'Low latency', 'Distributed support'],
        constraints: ['1M RPS', 'Highly available']
    },
    {
        id: '5',
        title: 'Design Instagram',
        description: 'Design a photo-sharing service with feed and follow features.',
        difficulty: 'Medium',
        category: 'Social Media',
        requirements: ['Upload photos', 'Follow users', 'Generate news feed'],
        constraints: ['500M users', '1M photo uploads per day']
    },
    {
        id: '6',
        title: 'Design Dropbox',
        description: 'Design a file storage and synchronization service.',
        difficulty: 'Medium',
        category: 'Storage Systems',
        requirements: ['Upload/Download files', 'Sync across devices', 'File versioning'],
        constraints: ['50M users', '10PB total storage']
    },
    {
        id: '7',
        title: 'Design a Notification System',
        description: 'Design a system to send push notifications, emails, and SMS.',
        difficulty: 'Medium',
        category: 'Communication',
        requirements: ['Support multiple channels', 'Priority queues', 'Rate limiting'],
        constraints: ['10M notifications per day', 'Low latency']
    },

    // HARD
    {
        id: '8',
        title: 'Design WhatsApp',
        description: 'Design a real-time messaging application.',
        difficulty: 'Hard',
        category: 'Communication',
        requirements: ['1-on-1 messaging', 'Group chats', 'Sent/Delivered/Read receipts'],
        constraints: ['500M daily active users', 'Low latency']
    },
    {
        id: '9',
        title: 'Design an Ad Click Aggregator',
        description: 'Design a system to count ad clicks in real-time for billing.',
        difficulty: 'Hard',
        category: 'Data Systems',
        requirements: ['Real-time counting', 'Exactly-once processing', 'Scalable'],
        constraints: ['10B clicks per day', 'Fault tolerant']
    },
    {
        id: '10',
        title: 'Design YouTube',
        description: 'Design a video-sharing platform with streaming and search.',
        difficulty: 'Hard',
        category: 'Media',
        requirements: ['Upload videos', 'Stream videos', 'Search and recommendations'],
        constraints: ['2B users', '500 hours of video uploaded per minute']
    },
    {
        id: '11',
        title: 'Design Uber',
        description: 'Design a ride-sharing service with real-time location tracking.',
        difficulty: 'Hard',
        category: 'Real-time Systems',
        requirements: ['Match riders with drivers', 'Real-time tracking', 'Payment processing'],
        constraints: ['100M users', '1M active drivers']
    },
    {
        id: '12',
        title: 'Design a Distributed Message Queue',
        description: 'Design a system like Kafka for high-throughput messaging.',
        difficulty: 'Hard',
        category: 'Infrastructure',
        requirements: ['Persistent storage', 'Pub/Sub model', 'High throughput'],
        constraints: ['100TB data per day', 'Zero data loss']
    },
    {
        id: '13',
        title: 'Design a Search Engine',
        description: 'Design a system like Google Search with indexing and ranking.',
        difficulty: 'Hard',
        category: 'Data Systems',
        requirements: ['Index billions of pages', 'Fast search results', 'Ranking algorithm'],
        constraints: ['100k queries per second', 'Petabytes of data']
    },
    {
        id: '14',
        title: 'Design a Stock Exchange',
        description: 'Design a high-frequency trading platform.',
        difficulty: 'Hard',
        category: 'FinTech',
        requirements: ['Order matching', 'Low latency (<1ms)', 'Audit logging'],
        constraints: ['1M orders per second', 'Strict consistency']
    },
    {
        id: '15',
        title: 'Design a Proximity Service',
        description: 'Design a system like Yelp or Google Maps to find nearby places.',
        difficulty: 'Medium',
        category: 'Geo Systems',
        requirements: ['Search nearby places', 'Add/Update places', 'Scalable'],
        constraints: ['100M places', '50k RPS']
    }
];

// Helper to generate more problems if needed
export const getProblems = () => {
    // In a real app, this could fetch from an API or generate variations
    return PROBLEMS;
};

import { SystemDesignQuestion } from './system-design-questions';

export const additionalQuestions1: SystemDesignQuestion[] = [
    // BEGINNER QUESTIONS (100)
    {
        id: 'url-shortener-basic',
        title: 'Design a URL Shortener',
        category: 'Web Services',
        difficulty: 'Beginner',
        tags: ['url', 'web', 'hashing', 'redirection'],
        description: 'Design a basic URL shortening service that converts long URLs into short, shareable links.',
        coreRequirements: [
            'Generate short URLs from long URLs',
            'Redirect users from short to long URLs',
            'Track click statistics',
            'Handle URL expiration'
        ],
        highLevelRequirements: [
            'Fast redirection',
            'Unique short URL generation',
            'Basic analytics'
        ],
        microRequirements: [
            'Collision handling',
            'Database indexing',
            'Cache frequently accessed URLs'
        ],
        learningOutcomes: ['Hashing algorithms', 'URL encoding', 'Database design'],
        estimatedTime: '3-4 hours',
        techStack: ['REST API', 'Database', 'Cache']
    },
    {
        id: 'pastebin-service',
        title: 'Design a Pastebin Service',
        category: 'Web Services',
        difficulty: 'Beginner',
        tags: ['text-storage', 'sharing', 'web-service'],
        description: 'Design a service where users can paste and share text snippets with expiration times.',
        coreRequirements: [
            'Store text content',
            'Generate unique paste IDs',
            'Support expiration times',
            'Syntax highlighting'
        ],
        highLevelRequirements: [
            'Fast paste retrieval',
            'Privacy options',
            'Search functionality'
        ],
        microRequirements: [
            'Efficient text storage',
            'Automatic cleanup of expired pastes',
            'Rate limiting'
        ],
        learningOutcomes: ['Text storage', 'TTL implementation', 'Content delivery'],
        estimatedTime: '3-4 hours',
        techStack: ['Web Framework', 'Database', 'Storage']
    },
    {
        id: 'todo-app',
        title: 'Design a Todo List Application',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['crud', 'task-management', 'user-data'],
        description: 'Design a todo list application with task creation, editing, and organization features.',
        coreRequirements: [
            'Create, read, update, delete tasks',
            'Task categorization',
            'Due dates and reminders',
            'Task completion tracking'
        ],
        highLevelRequirements: [
            'Multi-device sync',
            'Offline support',
            'Collaboration features'
        ],
        microRequirements: [
            'Efficient task queries',
            'Data consistency',
            'Notification scheduling'
        ],
        learningOutcomes: ['CRUD operations', 'Data modeling', 'User authentication'],
        estimatedTime: '3-4 hours',
        techStack: ['Backend Framework', 'Database', 'Mobile/Web']
    },
    {
        id: 'bookmark-manager',
        title: 'Design a Bookmark Manager',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['bookmarks', 'organization', 'web-service'],
        description: 'Design a service to save, organize, and search bookmarks across devices.',
        coreRequirements: [
            'Save URLs with metadata',
            'Organize with tags and folders',
            'Search bookmarks',
            'Import/export functionality'
        ],
        highLevelRequirements: [
            'Cross-device synchronization',
            'Fast search',
            'Browser extension support'
        ],
        microRequirements: [
            'Metadata extraction',
            'Full-text search indexing',
            'Duplicate detection'
        ],
        learningOutcomes: ['Data organization', 'Search implementation', 'Browser APIs'],
        estimatedTime: '3-4 hours',
        techStack: ['API', 'Search Engine', 'Browser Extension']
    },
    {
        id: 'qr-code-generator',
        title: 'Design a QR Code Generator Service',
        category: 'Web Services',
        difficulty: 'Beginner',
        tags: ['qr-code', 'encoding', 'api'],
        description: 'Design a service that generates QR codes from text, URLs, and other data.',
        coreRequirements: [
            'Generate QR codes from input',
            'Support multiple data types',
            'Customizable QR code styling',
            'Download in various formats'
        ],
        highLevelRequirements: [
            'Fast generation',
            'High-quality output',
            'API rate limiting'
        ],
        microRequirements: [
            'Error correction levels',
            'Size optimization',
            'Caching generated codes'
        ],
        learningOutcomes: ['QR code algorithms', 'Image generation', 'API design'],
        estimatedTime: '2-3 hours',
        techStack: ['Image Processing', 'API', 'Cache']
    },
    {
        id: 'weather-app',
        title: 'Design a Weather Application',
        category: 'Mobile Applications',
        difficulty: 'Beginner',
        tags: ['weather', 'api-integration', 'mobile'],
        description: 'Design a weather application that shows current and forecasted weather data.',
        coreRequirements: [
            'Fetch weather data from APIs',
            'Display current conditions',
            'Show weather forecasts',
            'Location-based weather'
        ],
        highLevelRequirements: [
            'Multiple location support',
            'Weather alerts',
            'Historical data'
        ],
        microRequirements: [
            'API caching',
            'Location services integration',
            'Data refresh strategies'
        ],
        learningOutcomes: ['API integration', 'Location services', 'Data caching'],
        estimatedTime: '3-4 hours',
        techStack: ['Mobile Framework', 'Weather API', 'Location Services']
    },
    {
        id: 'poll-voting-system',
        title: 'Design a Poll and Voting System',
        category: 'Social & Communication',
        difficulty: 'Beginner',
        tags: ['polling', 'voting', 'real-time'],
        description: 'Design a system where users can create polls and vote on them in real-time.',
        coreRequirements: [
            'Create polls with multiple options',
            'Vote on polls',
            'View real-time results',
            'Prevent duplicate voting'
        ],
        highLevelRequirements: [
            'Anonymous voting option',
            'Poll expiration',
            'Result visualization'
        ],
        microRequirements: [
            'Vote counting accuracy',
            'Real-time updates',
            'User identification'
        ],
        learningOutcomes: ['Real-time updates', 'Vote integrity', 'Data visualization'],
        estimatedTime: '3-4 hours',
        techStack: ['WebSockets', 'Database', 'Charting Library']
    },
    {
        id: 'note-taking-app',
        title: 'Design a Note Taking Application',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['notes', 'text-editor', 'sync'],
        description: 'Design a note-taking app with rich text editing and organization features.',
        coreRequirements: [
            'Create and edit notes',
            'Rich text formatting',
            'Note organization',
            'Search functionality'
        ],
        highLevelRequirements: [
            'Cloud synchronization',
            'Offline editing',
            'Version history'
        ],
        microRequirements: [
            'Efficient text storage',
            'Conflict resolution',
            'Search indexing'
        ],
        learningOutcomes: ['Text editing', 'Data sync', 'Search implementation'],
        estimatedTime: '4-5 hours',
        techStack: ['Rich Text Editor', 'Sync Service', 'Database']
    },
    {
        id: 'contact-book',
        title: 'Design a Digital Contact Book',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['contacts', 'crud', 'search'],
        description: 'Design a contact management system for storing and organizing contact information.',
        coreRequirements: [
            'Add, edit, delete contacts',
            'Store multiple contact details',
            'Search and filter contacts',
            'Import/export contacts'
        ],
        highLevelRequirements: [
            'Cloud backup',
            'Duplicate detection',
            'Contact grouping'
        ],
        microRequirements: [
            'Efficient search algorithms',
            'Data validation',
            'Merge duplicate contacts'
        ],
        learningOutcomes: ['CRUD operations', 'Search algorithms', 'Data validation'],
        estimatedTime: '3-4 hours',
        techStack: ['Database', 'API', 'Import/Export Libraries']
    },
    {
        id: 'expense-tracker',
        title: 'Design an Expense Tracker',
        category: 'Finance',
        difficulty: 'Beginner',
        tags: ['finance', 'tracking', 'analytics'],
        description: 'Design an application to track personal expenses and generate spending reports.',
        coreRequirements: [
            'Record expenses and income',
            'Categorize transactions',
            'Generate spending reports',
            'Budget tracking'
        ],
        highLevelRequirements: [
            'Multi-currency support',
            'Recurring transactions',
            'Data visualization'
        ],
        microRequirements: [
            'Transaction validation',
            'Aggregation queries',
            'Report generation'
        ],
        learningOutcomes: ['Financial data modeling', 'Reporting', 'Data aggregation'],
        estimatedTime: '4-5 hours',
        techStack: ['Database', 'Charting Library', 'Backend Framework']
    },
    {
        id: 'countdown-timer',
        title: 'Design a Countdown Timer Service',
        category: 'Utilities',
        difficulty: 'Beginner',
        tags: ['timer', 'scheduling', 'notifications'],
        description: 'Design a countdown timer service with notifications and event tracking.',
        coreRequirements: [
            'Create countdown timers',
            'Send notifications on completion',
            'Multiple timer support',
            'Timer persistence'
        ],
        highLevelRequirements: [
            'Cross-device synchronization',
            'Recurring timers',
            'Custom notification sounds'
        ],
        microRequirements: [
            'Accurate time tracking',
            'Notification delivery',
            'Background processing'
        ],
        learningOutcomes: ['Time management', 'Notifications', 'Background tasks'],
        estimatedTime: '2-3 hours',
        techStack: ['Backend Service', 'Notification System', 'Scheduler']
    },
    {
        id: 'password-generator',
        title: 'Design a Password Generator and Manager',
        category: 'Security',
        difficulty: 'Beginner',
        tags: ['security', 'passwords', 'encryption'],
        description: 'Design a service to generate strong passwords and securely store them.',
        coreRequirements: [
            'Generate random passwords',
            'Customizable password rules',
            'Secure password storage',
            'Password strength checker'
        ],
        highLevelRequirements: [
            'Encryption at rest',
            'Master password protection',
            'Auto-fill integration'
        ],
        microRequirements: [
            'Cryptographic randomness',
            'Secure encryption',
            'Password retrieval'
        ],
        learningOutcomes: ['Cryptography', 'Security best practices', 'Encryption'],
        estimatedTime: '3-4 hours',
        techStack: ['Encryption Library', 'Secure Storage', 'Random Generator']
    },
    {
        id: 'markdown-editor',
        title: 'Design a Markdown Editor',
        category: 'Content & Media',
        difficulty: 'Beginner',
        tags: ['markdown', 'editor', 'preview'],
        description: 'Design a markdown editor with live preview and export functionality.',
        coreRequirements: [
            'Markdown editing interface',
            'Live preview rendering',
            'Export to HTML/PDF',
            'Syntax highlighting'
        ],
        highLevelRequirements: [
            'Auto-save functionality',
            'Template support',
            'Collaborative editing'
        ],
        microRequirements: [
            'Efficient parsing',
            'Real-time rendering',
            'Export optimization'
        ],
        learningOutcomes: ['Markdown parsing', 'Text editors', 'Document export'],
        estimatedTime: '3-4 hours',
        techStack: ['Markdown Parser', 'Text Editor', 'Export Libraries']
    },
    {
        id: 'rss-reader',
        title: 'Design an RSS Feed Reader',
        category: 'Content & Media',
        difficulty: 'Beginner',
        tags: ['rss', 'feed', 'aggregation'],
        description: 'Design an RSS feed reader that aggregates and displays content from multiple sources.',
        coreRequirements: [
            'Subscribe to RSS feeds',
            'Fetch and parse feed content',
            'Display articles',
            'Mark as read/unread'
        ],
        highLevelRequirements: [
            'Automatic feed updates',
            'Content filtering',
            'Offline reading'
        ],
        microRequirements: [
            'Efficient feed parsing',
            'Update scheduling',
            'Content caching'
        ],
        learningOutcomes: ['RSS/Atom parsing', 'Feed aggregation', 'Content management'],
        estimatedTime: '4-5 hours',
        techStack: ['Feed Parser', 'Scheduler', 'Database']
    },
    {
        id: 'file-converter',
        title: 'Design a File Format Converter',
        category: 'Utilities',
        difficulty: 'Beginner',
        tags: ['file-conversion', 'formats', 'processing'],
        description: 'Design a service that converts files between different formats (images, documents, etc.).',
        coreRequirements: [
            'Upload files for conversion',
            'Support multiple formats',
            'Queue conversion jobs',
            'Download converted files'
        ],
        highLevelRequirements: [
            'Batch conversion',
            'Quality settings',
            'Conversion history'
        ],
        microRequirements: [
            'Efficient file processing',
            'Format validation',
            'Temporary file cleanup'
        ],
        learningOutcomes: ['File processing', 'Format conversion', 'Job queues'],
        estimatedTime: '4-5 hours',
        techStack: ['Conversion Libraries', 'Queue System', 'Storage']
    },
    {
        id: 'habit-tracker',
        title: 'Design a Habit Tracking Application',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['habits', 'tracking', 'gamification'],
        description: 'Design an app to track daily habits and build streaks with reminders.',
        coreRequirements: [
            'Create and track habits',
            'Daily check-ins',
            'Streak counting',
            'Reminder notifications'
        ],
        highLevelRequirements: [
            'Progress visualization',
            'Habit statistics',
            'Social sharing'
        ],
        microRequirements: [
            'Streak calculation',
            'Notification scheduling',
            'Data aggregation'
        ],
        learningOutcomes: ['Gamification', 'Notifications', 'Data tracking'],
        estimatedTime: '3-4 hours',
        techStack: ['Mobile Framework', 'Notifications', 'Analytics']
    },
    {
        id: 'recipe-manager',
        title: 'Design a Recipe Management System',
        category: 'Lifestyle',
        difficulty: 'Beginner',
        tags: ['recipes', 'cooking', 'search'],
        description: 'Design a system to store, organize, and search cooking recipes.',
        coreRequirements: [
            'Add and edit recipes',
            'Ingredient lists',
            'Cooking instructions',
            'Search recipes'
        ],
        highLevelRequirements: [
            'Recipe categorization',
            'Nutritional information',
            'Shopping list generation'
        ],
        microRequirements: [
            'Ingredient parsing',
            'Search indexing',
            'Image storage'
        ],
        learningOutcomes: ['Content management', 'Search', 'Data modeling'],
        estimatedTime: '3-4 hours',
        techStack: ['Database', 'Search Engine', 'Image Storage']
    },
    {
        id: 'flashcard-app',
        title: 'Design a Flashcard Learning App',
        category: 'Education',
        difficulty: 'Beginner',
        tags: ['education', 'learning', 'spaced-repetition'],
        description: 'Design a flashcard application with spaced repetition for effective learning.',
        coreRequirements: [
            'Create flashcard decks',
            'Study mode with card flipping',
            'Progress tracking',
            'Spaced repetition algorithm'
        ],
        highLevelRequirements: [
            'Multi-deck support',
            'Import/export decks',
            'Performance analytics'
        ],
        microRequirements: [
            'Algorithm implementation',
            'Study session management',
            'Progress calculation'
        ],
        learningOutcomes: ['Spaced repetition', 'Learning algorithms', 'Progress tracking'],
        estimatedTime: '4-5 hours',
        techStack: ['Mobile/Web Framework', 'Database', 'Algorithm']
    },
    {
        id: 'link-preview',
        title: 'Design a Link Preview Generator',
        category: 'Web Services',
        difficulty: 'Beginner',
        tags: ['web-scraping', 'metadata', 'preview'],
        description: 'Design a service that generates rich previews for URLs with images and metadata.',
        coreRequirements: [
            'Fetch URL metadata',
            'Extract Open Graph tags',
            'Generate preview cards',
            'Cache previews'
        ],
        highLevelRequirements: [
            'Fast preview generation',
            'Fallback handling',
            'Image optimization'
        ],
        microRequirements: [
            'HTML parsing',
            'Metadata extraction',
            'Cache management'
        ],
        learningOutcomes: ['Web scraping', 'Metadata extraction', 'Caching'],
        estimatedTime: '3-4 hours',
        techStack: ['Web Scraper', 'Parser', 'Cache']
    },
    {
        id: 'currency-converter',
        title: 'Design a Currency Converter',
        category: 'Finance',
        difficulty: 'Beginner',
        tags: ['currency', 'conversion', 'api'],
        description: 'Design a currency converter with real-time exchange rates.',
        coreRequirements: [
            'Fetch exchange rates',
            'Convert between currencies',
            'Historical rate data',
            'Multiple currency support'
        ],
        highLevelRequirements: [
            'Real-time rate updates',
            'Offline mode',
            'Rate alerts'
        ],
        microRequirements: [
            'API integration',
            'Rate caching',
            'Calculation accuracy'
        ],
        learningOutcomes: ['API integration', 'Financial calculations', 'Data caching'],
        estimatedTime: '2-3 hours',
        techStack: ['Exchange Rate API', 'Cache', 'Backend']
    },
    {
        id: 'event-calendar',
        title: 'Design an Event Calendar System',
        category: 'Productivity',
        difficulty: 'Beginner',
        tags: ['calendar', 'events', 'scheduling'],
        description: 'Design a calendar system for creating and managing events.',
        coreRequirements: [
            'Create and edit events',
            'Calendar views (day/week/month)',
            'Event reminders',
            'Recurring events'
        ],
        highLevelRequirements: [
            'Multi-calendar support',
            'Event sharing',
            'Calendar sync'
        ],
        microRequirements: [
            'Date calculations',
            'Reminder scheduling',
            'Conflict detection'
        ],
        learningOutcomes: ['Calendar algorithms', 'Date handling', 'Scheduling'],
        estimatedTime: '4-5 hours',
        techStack: ['Calendar Library', 'Database', 'Notifications']
    },
    {
        id: 'quiz-platform',
        title: 'Design a Quiz Platform',
        category: 'Education',
        difficulty: 'Beginner',
        tags: ['quiz', 'education', 'assessment'],
        description: 'Design a platform for creating and taking quizzes with scoring.',
        coreRequirements: [
            'Create quizzes with questions',
            'Multiple question types',
            'Take quizzes and submit answers',
            'Automatic scoring'
        ],
        highLevelRequirements: [
            'Timed quizzes',
            'Result analytics',
            'Quiz sharing'
        ],
        microRequirements: [
            'Answer validation',
            'Score calculation',
            'Time tracking'
        ],
        learningOutcomes: ['Assessment systems', 'Scoring algorithms', 'Data validation'],
        estimatedTime: '4-5 hours',
        techStack: ['Web Framework', 'Database', 'Timer']
    },
    {
        id: 'image-gallery',
        title: 'Design an Image Gallery',
        category: 'Content & Media',
        difficulty: 'Beginner',
        tags: ['images', 'gallery', 'albums'],
        description: 'Design an image gallery with albums, tags, and search functionality.',
        coreRequirements: [
            'Upload and store images',
            'Create albums',
            'Tag images',
            'Search by tags'
        ],
        highLevelRequirements: [
            'Thumbnail generation',
            'Lazy loading',
            'Sharing functionality'
        ],
        microRequirements: [
            'Image optimization',
            'Metadata storage',
            'Efficient queries'
        ],
        learningOutcomes: ['Image handling', 'Storage optimization', 'Search'],
        estimatedTime: '4-5 hours',
        techStack: ['Image Processing', 'Storage', 'Database']
    },
    {
        id: 'fitness-tracker',
        title: 'Design a Fitness Tracking App',
        category: 'Health & Fitness',
        difficulty: 'Beginner',
        tags: ['fitness', 'health', 'tracking'],
        description: 'Design an app to track workouts, exercises, and fitness goals.',
        coreRequirements: [
            'Log workouts and exercises',
            'Track fitness metrics',
            'Set and monitor goals',
            'Progress visualization'
        ],
        highLevelRequirements: [
            'Workout templates',
            'Social features',
            'Wearable integration'
        ],
        microRequirements: [
            'Data aggregation',
            'Goal tracking algorithms',
            'Chart generation'
        ],
        learningOutcomes: ['Health data modeling', 'Progress tracking', 'Visualization'],
        estimatedTime: '4-5 hours',
        techStack: ['Mobile Framework', 'Database', 'Charting']
    },
    {
        id: 'music-playlist',
        title: 'Design a Music Playlist Manager',
        category: 'Entertainment',
        difficulty: 'Beginner',
        tags: ['music', 'playlist', 'media'],
        description: 'Design a system to create and manage music playlists.',
        coreRequirements: [
            'Create playlists',
            'Add/remove songs',
            'Playlist ordering',
            'Search songs'
        ],
        highLevelRequirements: [
            'Playlist sharing',
            'Collaborative playlists',
            'Playlist recommendations'
        ],
        microRequirements: [
            'Efficient song lookup',
            'Playlist storage',
            'Ordering algorithms'
        ],
        learningOutcomes: ['Data structures', 'Search', 'Recommendations'],
        estimatedTime: '3-4 hours',
        techStack: ['Database', 'API', 'Search Engine']
    },
    {
        id: 'invoice-generator',
        title: 'Design an Invoice Generator',
        category: 'Business Tools',
        difficulty: 'Beginner',
        tags: ['invoicing', 'billing', 'pdf'],
        description: 'Design a system to create, manage, and send invoices.',
        coreRequirements: [
            'Create invoices',
            'Add line items and taxes',
            'Generate PDF invoices',
            'Track payment status'
        ],
        highLevelRequirements: [
            'Invoice templates',
            'Recurring invoices',
            'Payment reminders'
        ],
        microRequirements: [
            'Tax calculations',
            'PDF generation',
            'Email delivery'
        ],
        learningOutcomes: ['Document generation', 'Business logic', 'PDF creation'],
        estimatedTime: '4-5 hours',
        techStack: ['PDF Library', 'Email Service', 'Database']
    },
    ...Array.from({ length: 74 }, (_, i) => {
        const id = 27 + i;
        const categories = ['Web Services', 'Productivity', 'Finance', 'Education', 'Content & Media'];
        const category = categories[i % categories.length];

        return {
            id: `beginner-extra-${id}`,
            title: `Beginner Design Problem ${id}`,
            category,
            difficulty: 'Beginner' as const,
            tags: ['beginner', 'practice', 'simple-system'],
            description: `Design a simple system for problem ${id}. Focus on basic CRUD operations and data modeling.`,
            coreRequirements: [
                'Basic data storage',
                'User interface constraints',
                'Simple API endpoints',
                'Data validation'
            ],
            highLevelRequirements: [
                'User experience',
                'Mobile responsiveness',
                'Basic security'
            ],
            microRequirements: [
                'Input validation',
                'Error handling',
                'Simple caching'
            ],
            learningOutcomes: ['CRUD', 'Basic API', 'Data Modeling'],
            estimatedTime: '2-3 hours',
            techStack: ['Web Framework', 'Database', 'Frontend']
        };
    })
];

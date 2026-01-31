export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  requirements: string[];
  constraints: string[];
  estimatedTime: string;
  points: number;
}

export const PROBLEMS: Problem[] = [
  {
    id: 'url-shortener',
    title: 'Design a URL Shortener',
    description: 'Design a URL shortening service like bit.ly or tinyurl.com that can handle millions of URLs and redirects.',
    difficulty: 'Medium',
    category: 'System Design',
    requirements: [
      'Shorten long URLs to 6-8 character codes',
      'Redirect users to original URL when accessing short URL',
      'Handle 100M URLs shortened per day',
      'Support custom aliases for premium users',
      'Provide analytics on click counts and geographic data'
    ],
    constraints: [
      '100:1 read to write ratio',
      '500M new URLs per month',
      'URL shortening should be fast (<100ms)',
      'Redirects should be fast (<100ms)',
      '99.9% availability required'
    ],
    estimatedTime: '45-60 minutes',
    points: 150
  },
  {
    id: 'chat-system',
    title: 'Design WhatsApp',
    description: 'Design a real-time messaging system that can handle billions of users and messages with high availability.',
    difficulty: 'Hard',
    category: 'Distributed Systems',
    requirements: [
      'Send and receive messages in real-time',
      'Support group chats with up to 256 members',
      'Message delivery confirmation (sent, delivered, read)',
      'Support multimedia messages (images, videos, files)',
      'User presence indicators (online, last seen)',
      'Message history and search functionality'
    ],
    constraints: [
      '2 billion active users',
      '100 billion messages per day',
      'Messages should be delivered within 100ms',
      'Support for offline message delivery',
      '99.99% availability required',
      'End-to-end encryption for privacy'
    ],
    estimatedTime: '60-90 minutes',
    points: 200
  },
  {
    id: 'social-media-feed',
    title: 'Design Twitter Feed',
    description: 'Design a social media feed system that can generate personalized timelines for millions of users.',
    difficulty: 'Hard',
    category: 'Social Media',
    requirements: [
      'Users can post tweets (280 characters)',
      'Users can follow other users',
      'Generate personalized timeline for each user',
      'Support likes, retweets, and replies',
      'Real-time feed updates',
      'Trending topics and hashtags'
    ],
    constraints: [
      '500M active users',
      '400M tweets per day',
      'Timeline generation should be fast (<200ms)',
      'Handle celebrity users with millions of followers',
      '99.9% availability required'
    ],
    estimatedTime: '60-75 minutes',
    points: 180
  },
  {
    id: 'video-streaming',
    title: 'Design YouTube',
    description: 'Design a video streaming platform that can handle millions of video uploads and billions of views.',
    difficulty: 'Hard',
    category: 'Media & Content',
    requirements: [
      'Upload videos in various formats',
      'Stream videos with different quality options',
      'Search videos by title, description, tags',
      'User subscriptions and notifications',
      'Video recommendations',
      'Comments and likes system'
    ],
    constraints: [
      '2 billion logged-in users per month',
      '500 hours of video uploaded every minute',
      '1 billion hours watched daily',
      'Support 4K video streaming',
      'Global content delivery required'
    ],
    estimatedTime: '75-90 minutes',
    points: 220
  },
  {
    id: 'ride-sharing',
    title: 'Design Uber',
    description: 'Design a ride-sharing service that can match drivers with passengers in real-time.',
    difficulty: 'Hard',
    category: 'Location-Based Services',
    requirements: [
      'Match drivers with nearby passengers',
      'Real-time location tracking',
      'Fare calculation and payment processing',
      'Trip history and ratings',
      'Driver and passenger profiles',
      'Surge pricing during high demand'
    ],
    constraints: [
      '100M active users',
      '15M trips per day',
      'Location updates every 3 seconds',
      'Matching should happen within 30 seconds',
      '99.9% availability in major cities'
    ],
    estimatedTime: '60-75 minutes',
    points: 190
  },
  {
    id: 'search-engine',
    title: 'Design Google Search',
    description: 'Design a web search engine that can index billions of web pages and return relevant results quickly.',
    difficulty: 'Hard',
    category: 'Search & Discovery',
    requirements: [
      'Crawl and index billions of web pages',
      'Return relevant search results in milliseconds',
      'Handle billions of search queries per day',
      'Support different types of content (text, images, videos)',
      'Personalized search results',
      'Auto-complete and spell correction'
    ],
    constraints: [
      '60+ billion web pages to index',
      '8.5 billion searches per day',
      'Search results should load within 200ms',
      'Handle 40,000 searches per second on average',
      '99.99% availability required'
    ],
    estimatedTime: '90+ minutes',
    points: 250
  }
];
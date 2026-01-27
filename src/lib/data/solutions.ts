import { systemDesignQuestions } from './system-design-questions';

export interface SolutionStep {
  title: string;
  description: string;
  reasoning: string;
}

export interface ProblemSolution {
  problemId: string;
  steps: SolutionStep[];
}

export const SOLUTIONS: ProblemSolution[] = [
  {
    problemId: 'distributed-cache',
    steps: [
      {
        title: 'Step 1: Client & Load Balancing',
        description: 'Set up a Load Balancer to act as the single entry point for all client requests.',
        reasoning: 'A Load Balancer is crucial for distributing the incoming GET/PUT/DEL requests across multiple routing nodes or cache clusters, ensuring no single point of failure at the entry level and handling high traffic.'
      },
      {
        title: 'Step 2: Routing with Consistent Hashing',
        description: 'Implement a Consistent Hashing layer between the Load Balancer and Cache Nodes.',
        reasoning: 'Consistent hashing determines which cache node should store a particular key. It minimizes data relocation when nodes are added or removed, which is essential for scaling a distributed cache without triggering a massive "cache miss" storm.'
      },
      {
        title: 'Step 3: Distributed Cache Clusters',
        description: 'Deploy multiple Cache Nodes (e.g., memory-optimized instances) to store the data.',
        reasoning: 'By distributing data across multiple nodes, we can scale the total memory capacity and throughput horizontally. This allows the system to handle millions of operations per second.'
      },
      {
        title: 'Step 4: Eviction Policy Engine',
        description: 'Configure an eviction strategy like LRU (Least Recently Used) or LFU (Least Frequently Used) on each node.',
        reasoning: 'Since cache memory is finite, an eviction policy is needed to automatically remove less valuable data to make room for new entries, ensuring the cache stays performant and doesn\'t crash due to OOM (Out of Memory) errors.'
      },
      {
        title: 'Step 5: Data Persistence (WAL/Snapshots)',
        description: 'Add a persistence layer (SSD/Disk) for Write-Ahead Logs or periodic snapshots.',
        reasoning: 'While caches are primarily in-memory, persistence provides fault tolerance. If a node restarts, it can quickly reload its state from disk rather than starting empty (cold cache), which would otherwise put immense pressure on the backend database.'
      },
      {
        title: 'Step 6: Replication for High Availability',
        description: 'Set up Primary-Replica pairs for each cache shard.',
        reasoning: 'Replication ensures that even if a primary cache node fails, a replica is available to take over immediately. This satisfies the "High Availability" requirement by preventing data loss and downtime.'
      },
      {
        title: 'Step 7: Monitoring & Observability',
        description: 'Integrate a monitoring service to track cache-hit/miss ratios and node health.',
        reasoning: 'Observability is key to maintaining a distributed system. Tracking hit/miss ratios helps in tuning the cache size and eviction policies, while health metrics alert engineers to failing nodes before they impact users.'
      }
    ]
  },
  {
    problemId: 'load-balancer',
    steps: [
      {
        title: 'Step 1: Client Request Entry',
        description: 'Client sends a request (TCP/HTTP) to a Virtual IP (VIP).',
        reasoning: 'A VIP allows multiple physical load balancer instances to appear as a single entry point to the client.'
      },
      {
        title: 'Step 2: Health Checks',
        description: 'Implement active health checks for all backend servers in the pool.',
        reasoning: 'Routing traffic to a dead server is a major failure. Health checks ensure only healthy servers receive traffic.'
      },
      {
        title: 'Step 3: Algorithm Selection',
        description: 'Implement a balancing algorithm like Round Robin, Least Connections, or Weighted Round Robin.',
        reasoning: 'The choice of algorithm depends on server capacity and traffic patterns. Least Connections is often best for servers with varying processing power.'
      },
      {
        title: 'Step 4: Request Forwarding',
        description: 'Forward the request to the selected backend server (Pass-through or Proxy mode).',
        reasoning: 'Layer 4 (Transport) forwarding is faster, while Layer 7 (Application) allows for specialized routing based on URLs or headers.'
      }
    ]
  },
  {
    problemId: 'url-shortener',
    steps: [
      {
        title: 'Step 1: REST API Layer',
        description: 'Create endpoints for URL shortening (POST) and redirection (GET).',
        reasoning: 'A clean API layer is necessary for clients (web/mobile) to interact with the service.'
      },
      {
        title: 'Step 2: ID Generation (Hashing/KGS)',
        description: 'Implement a Key Generation Service or use base62 encoding on an auto-incrementing ID.',
        reasoning: 'To ensure uniqueness and avoid collisions at scale, a dedicated ID generator is often better than simple hashing.'
      },
      {
        title: 'Step 3: Database Selection (NoSQL)',
        description: 'Use a NoSQL database like MongoDB or DynamoDB to store mapping (ID -> Long URL).',
        reasoning: 'NoSQL databases are highly scalable for read-heavy workloads and don\'t require complex joins.'
      },
      {
        title: 'Step 4: Caching Layer',
        description: 'Cache frequently accessed "hot" URLs using Redis.',
        reasoning: 'Redirection is a very high-read operation. Caching significantly reduces database load and latency.'
      }
    ]
  },
  {
    problemId: 'image-service',
    steps: [
      {
        title: 'Step 1: Upload API & Metadata Storage',
        description: 'Create an upload endpoint and store image metadata (size, format, user) in a SQL DB.',
        reasoning: 'Separating metadata from the actual file allows for fast searching and management.'
      },
      {
        title: 'Step 2: Global Storage (S3/Object Storage)',
        description: 'Store actual image files in an Object Storage service like S3.',
        reasoning: 'Files are large and unstructured; Object storage is designed to handle petabytes of such data cost-effectively.'
      },
      {
        title: 'Step 3: Image Processing Workers',
        description: 'Implement background workers to generate thumbnails and different resolutions.',
        reasoning: 'Processing images is CPU-intensive. Doing it asynchronously prevents blocking the user while generating variants.'
      },
      {
        title: 'Step 4: Content Delivery Network (CDN)',
        description: 'Use a CDN to serve images from edge locations near the user.',
        reasoning: 'Serving images from a central server is slow for global users. CDNs reduce latency by caching content at the edge.'
      }
    ]
  },
  {
    problemId: 's3',
    steps: [
      {
        title: 'Step 1: Load Balancer & API Gateways',
        description: 'Handle millions of requests through a layer of API Gateways.',
        reasoning: 'API gateways handle authentication, rate limiting, and request routing to internal services.'
      },
      {
        title: 'Step 2: Metadata Service',
        description: 'Manage object metadata (bucket names, keys, permissions) in a distributed Key-Value store.',
        reasoning: 'Fast metadata lookup is critical for file retrieval performance.'
      },
      {
        title: 'Step 3: Data Storage (Blocks/Chunks)',
        description: 'Split large files into smaller chunks and store them across multiple disks.',
        reasoning: 'Chunking improves upload/download speeds through parallelism and makes storage more efficient.'
      },
      {
        title: 'Step 4: Replication & Erasure Coding',
        description: 'Implement replication across Availability Zones and use Erasure Coding for durability.',
        reasoning: 'Erasure coding provides high durability (99.999999999%) with less storage overhead than simple replication.'
      }
    ]
  },
  {
    problemId: 'superfast-kv',
    steps: [
      {
        title: 'Step 1: In-Memory Storage',
        description: 'Store all data in RAM using optimized data structures like Skip Lists or Hash Maps.',
        reasoning: 'RAM access is significantly faster than disk, which is essential for "superfast" performance.'
      },
      {
        title: 'Step 2: Lock-Free Concurrency',
        description: 'Use atomic operations and optimistic locking to handle concurrent access.',
        reasoning: 'Traditional locks create bottlenecks under high contention. Lock-free designs scale better with more CPU cores.'
      },
      {
        title: 'Step 3: Persistence with Append-Only Log',
        description: 'Write every update to an Append-Only File (AOF) on disk for durability.',
        reasoning: 'Sequential writes to disk are much faster than random writes, providing durability without sacrificing too much speed.'
      }
    ]
  },
  {
    problemId: 'realtime-db',
    steps: [
      {
        title: 'Step 1: WebSocket Gateway',
        description: 'Establish bi-directional communication channels with clients using WebSockets.',
        reasoning: 'Traditional HTTP is request-response. WebSockets allow the server to push updates to clients instantly as they happen.'
      },
      {
        title: 'Step 2: Pub/Sub Logic (Redis)',
        description: 'Use a Pub/Sub system to broadcast data changes to relevant client groups.',
        reasoning: 'Scaling real-time updates requires an efficient way to distribute messages across multiple server nodes.'
      },
      {
        title: 'Step 3: Conflict Resolution (OT/CRDT)',
        description: 'Implement Operational Transformation or CRDTs for concurrent edits.',
        reasoning: 'When multiple users edit the same data simultaneously, the system must resolve conflicts in a way that is consistent across all clients.'
      }
    ]
  },
  {
    problemId: 'task-scheduler',
    steps: [
      {
        title: 'Step 1: Task Submission API',
        description: 'Accept task definitions (code/script) and timing (cron) via a REST API.',
        reasoning: 'Provides a standard way for users to define and manage their scheduled tasks.'
      },
      {
        title: 'Step 2: Highly Available Task Store',
        description: 'Store task metadata and status in a durable, distributed database.',
        reasoning: 'Task information must survive node failures to ensure no tasks are missed or double-executed.'
      },
      {
        title: 'Step 3: Scheduler (Leader Election)',
        description: 'Implement a leader/follower model for the scheduling logic.',
        reasoning: 'Only one node should "decide" which task runs next to prevent duplicate executions in a distributed environment.'
      },
      {
        title: 'Step 4: Task Execution Workers',
        description: 'Queue tasks for execution by a pool of worker nodes.',
        reasoning: 'Separating scheduling from execution allows the system to scale task throughput independently.'
      }
    ]
  },
  {
    problemId: 'flash-sale',
    steps: [
      {
        title: 'Step 1: Pre-warm & Static Content',
        description: 'Use a CDN to serve the sale landing page and pre-warm the cache nodes.',
        reasoning: 'Handling massive spike traffic requires serving as much as possible from the edge and cache.'
      },
      {
        title: 'Step 2: Distributed Locking (Redis)',
        description: 'Use Lua scripts in Redis to handle atomic inventory decrement.',
        reasoning: 'Inventory must be accurate. Atomic operations in Redis prevent over-selling while maintaining high performance.'
      },
      {
        title: 'Step 3: Request Queuing',
        description: 'Implement a virtual waiting room or message queue to buffer excessive requests.',
        reasoning: 'Queuing prevents the backend database and payment systems from being overwhelmed by a sudden traffic surge.'
      },
      {
        title: 'Step 4: Payment Processing Integration',
        description: 'Handle payments asynchronously and release reserved stock if payment fails.',
        reasoning: 'Decoupling payment from inventory reservation improves user experience and system reliability.'
      }
    ]
  },
  {
    problemId: 'near-me',
    steps: [
      {
        title: 'Step 1: Geohashing / Quadtrees',
        description: 'Index the world map using Geohashing or a Quadtree structure.',
        reasoning: 'Traditional database indexes are not efficient for 2D proximity queries. Geohashing converts coordinates into a searchable string.'
      },
      {
        title: 'Step 2: Efficient Spatial Database',
        description: 'Use a database with native geospatial support (e.g., PostGIS or Redis Geo).',
        reasoning: 'Spatial databases provide optimized functions for calculating distances and finding points within a radius.'
      },
      {
        title: 'Step 3: Cache Nearby Results',
        description: 'Cache search results for popular areas to reduce database load.',
        reasoning: 'Many users in the same city will query for similar nearby places. Caching improves latency significantly.'
      }
    ]
  },
  {
    problemId: 'file-sync',
    steps: [
      {
        title: 'Step 1: Chunking & Hashing',
        description: 'Break files into chunks and generate hashes for each chunk.',
        reasoning: 'Chunking allows the system to upload only changed parts of a file (Delta sync), saving bandwidth.'
      },
      {
        title: 'Step 2: Metadata Synchronization',
        description: 'Keep a central metadata store to track file versions, owners, and chunk locations.',
        reasoning: 'Metadata is small and highly structured, allowing for fast queries across all user devices.'
      },
      {
        title: 'Step 3: Cloud Storage Integration',
        description: 'Store actual chunks in an object storage service like S3.',
        reasoning: 'Provides limitless scalability and high durability for billions of file chunks.'
      },
      {
        title: 'Step 4: Conflict Resolution',
        description: 'Implement a strategy to handle simultaneous edits (e.g., "Keep both files").',
        reasoning: 'In a distributed sync system, conflicting edits are inevitable. A clear policy ensures no data loss.'
      }
    ]
  },
  {
    problemId: 'video-pipeline',
    steps: [
      {
        title: 'Step 1: Upload & Initial Storage',
        description: 'Store raw video files in a temporary storage bucket.',
        reasoning: 'Raw videos are huge. Temporary storage allows the system to acknowledge the upload before processing begins.'
      },
      {
        title: 'Step 2: Transcoding Workers',
        description: 'Use specialized workers to encode video into multiple formats (1080p, 720p, 480p) and codecs.',
        reasoning: 'Transcoding is resource-intensive. Distributing it across many workers ensures fast processing for all users.'
      },
      {
        title: 'Step 3: Chunking for Adaptive Streaming',
        description: 'Split videos into short segments (e.g., 5 seconds) and create a manifest file.',
        reasoning: 'Adaptive bitrate streaming (like HLS or DASH) requires small segments so the player can switch quality based on network speed.'
      }
    ]
  },
  {
    problemId: 'text-search-engine',
    steps: [
      {
        title: 'Step 1: Web Crawler',
        description: 'Discover and download web pages to build a corpus.',
        reasoning: 'A search engine is only as good as its data. Efficient crawling is the foundation.'
      },
      {
        title: 'Step 2: Inverted Index',
        description: 'Map every unique word to a list of documents it appears in.',
        reasoning: 'An inverted index allows for near-instant retrieval of "all documents containing word X" without scanning every file.'
      },
      {
        title: 'Step 3: Ranking Algorithm (PageRank/BM25)',
        description: 'Assign relevance scores to documents based on keywords and authority.',
        reasoning: 'Ranking ensures the most useful results appear at the top, which is what users care about most.'
      }
    ]
  },
  {
    problemId: 'hashtag-service',
    steps: [
      {
        title: 'Step 1: Post Processing Engine',
        description: 'Extract hashtags from new posts in real-time.',
        reasoning: 'Automated extraction is necessary for social media scale, allowing the system to categorize content instantly.'
      },
      {
        title: 'Step 2: Frequency Aggregator',
        description: 'Count hashtag occurrences over time windows (e.g., last 5 minutes, 1 hour).',
        reasoning: 'Trending topics are time-sensitive. Sliding window aggregation highlights what is popular "right now".'
      },
      {
        title: 'Step 3: Trending Cache',
        description: 'Maintain a sorted list of the top hashtags in a fast-access cache like Redis.',
        reasoning: 'Trending lists are highly requested. Serving them from cache ensures the homepage loads fast.'
      }
    ]
  },
  {
    problemId: 'counting-impressions',
    steps: [
      {
        title: 'Step 1: High-Throughput Ingestion',
        description: 'Use a system like Kafka to buffer billions of daily event logs.',
        reasoning: 'The system must handle massive spikes without losing data or crashing. Queuing is essential.'
      },
      {
        title: 'Step 2: Stream Processing (Flink/Spark)',
        description: 'Aggregate counts in real-time across different dimensions (AdID, Platform, Region).',
        reasoning: 'Real-time billing requires real-time data processing. Stream processing allows for low-latency aggregation.'
      },
      {
        title: 'Step 3: Fault-Tolerant State Store',
        description: 'Keep the running totals in a highly available, distributed state store.',
        reasoning: 'Exactly-once processing requires that if a worker fails, its state (the counts so far) can be recovered perfectly.'
      }
    ]
  },
  {
    problemId: 'airline-checkin',
    steps: [
      {
        title: 'Step 1: Passenger Verification API',
        description: 'Verify booking references and passenger identity.',
        reasoning: 'Security and accuracy are the first priorities in any flight-related system.'
      },
      {
        title: 'Step 2: Interactive Seat Map',
        description: 'Display an up-to-date seat map and handle seat locking during selection.',
        reasoning: 'Seat selection is a highly concurrent operation. Locking prevents two passengers from choosing the same seat simultaneously.'
      },
      {
        title: 'Step 3: Boarding Pass Generator',
        description: 'Generate secure digital boarding passes with unique QR codes.',
        reasoning: 'Provides the final artifact the user needs for travel, which must be tamper-proof and easy to scan.'
      }
    ]
  },
  {
    problemId: 'queue-consumers',
    steps: [
      {
        title: 'Step 1: Message Broker Config',
        description: 'Organize messages into topics or shards.',
        reasoning: 'Sharding messages allows multiple consumers to work in parallel without tripping over each other.'
      },
      {
        title: 'Step 2: Consumer Group Logic',
        description: 'Implement consumer groups to coordinate message processing.',
        reasoning: 'Ensures that each message is processed exactly once by a single member of the group, even as the group scales.'
      },
      {
        title: 'Step 3: Dead Letter Queues (DLQ)',
        description: 'Route messages that fail repeatedly to a specialized queue for analysis.',
        reasoning: 'Prevents "poison pill" messages from blocking the entire pipeline forever.'
      }
    ]
  },
  {
    problemId: 'sql-kv',
    steps: [
      {
        title: 'Step 1: Schema Design',
        description: 'Create a simple table with primary key "key" and a blob/text "value" column.',
        reasoning: 'SQL databases are reliable and ACID compliant. A simple Key-Value schema leverages these properties without complexity.'
      },
      {
        title: 'Step 2: Connection Pooling',
        description: 'Use a connection pool to manage the database connections efficiently.',
        reasoning: 'Opening new connections is expensive. Pooling reuses existing connections, greatly improving request speed.'
      },
      {
        title: 'Step 3: Indexing & Sharding',
        description: 'Ensure the key column is indexed and shard the database if data exceeds a single server.',
        reasoning: 'Indexing provides O(1) or O(log N) lookup speeds, and sharding allows the SQL engine to scale beyond a single machine.'
      }
    ]
  },
  // Solutions for numeric problem IDs (matching PROBLEMS data)
  {
    problemId: '1', // URL Shortener
    steps: [
      {
        title: 'Step 1: REST API Layer',
        description: 'Create endpoints for URL shortening (POST) and redirection (GET).',
        reasoning: 'A clean API layer is necessary for clients (web/mobile) to interact with the service.'
      },
      {
        title: 'Step 2: ID Generation (Hashing/KGS)',
        description: 'Implement a Key Generation Service or use base62 encoding on an auto-incrementing ID.',
        reasoning: 'To ensure uniqueness and avoid collisions at scale, a dedicated ID generator is often better than simple hashing.'
      },
      {
        title: 'Step 3: Database Selection (NoSQL)',
        description: 'Use a NoSQL database like MongoDB or DynamoDB to store mapping (ID -> Long URL).',
        reasoning: 'NoSQL databases are highly scalable for read-heavy workloads and don\'t require complex joins.'
      },
      {
        title: 'Step 4: Caching Layer',
        description: 'Cache frequently accessed "hot" URLs using Redis.',
        reasoning: 'Redirection is a very high-read operation. Caching significantly reduces database load and latency.'
      }
    ]
  },
  {
    problemId: '2', // Pastebin
    steps: [
      {
        title: 'Step 1: Upload API',
        description: 'Create an endpoint to accept text content and generate a unique ID.',
        reasoning: 'Simple API design makes it easy for users to paste and share content quickly.'
      },
      {
        title: 'Step 2: Storage with TTL',
        description: 'Store paste content in a database with Time-To-Live (TTL) support.',
        reasoning: 'TTL automatically removes expired pastes, saving storage costs and maintaining system performance.'
      },
      {
        title: 'Step 3: CDN for Popular Pastes',
        description: 'Cache frequently accessed pastes at edge locations.',
        reasoning: 'Popular code snippets are accessed globally. CDN reduces latency for users worldwide.'
      }
    ]
  },
  {
    problemId: '3', // Web Crawler
    steps: [
      {
        title: 'Step 1: URL Frontier Queue',
        description: 'Maintain a priority queue of URLs to crawl.',
        reasoning: 'A frontier ensures systematic crawling and prevents revisiting the same pages unnecessarily.'
      },
      {
        title: 'Step 2: Duplicate Detection',
        description: 'Use a Bloom filter or hash set to track visited URLs.',
        reasoning: 'Avoiding duplicates saves bandwidth and processing time, critical when crawling billions of pages.'
      },
      {
        title: 'Step 3: Distributed Workers',
        description: 'Deploy multiple crawler workers to fetch pages in parallel.',
        reasoning: 'Parallelization dramatically increases crawl speed and allows the system to scale horizontally.'
      },
      {
        title: 'Step 4: Content Storage',
        description: 'Store crawled content in a distributed file system or object storage.',
        reasoning: 'Web pages are unstructured and large. Object storage provides cost-effective, scalable storage.'
      }
    ]
  },
  {
    problemId: '4', // Rate Limiter
    steps: [
      {
        title: 'Step 1: Token Bucket Algorithm',
        description: 'Implement a token bucket for each user/API key.',
        reasoning: 'Token bucket allows burst traffic while maintaining an average rate limit over time.'
      },
      {
        title: 'Step 2: Distributed Counter (Redis)',
        description: 'Use Redis with atomic operations to track request counts.',
        reasoning: 'Redis provides fast, atomic increments essential for accurate rate limiting in distributed systems.'
      },
      {
        title: 'Step 3: Response Headers',
        description: 'Return rate limit status in HTTP headers (X-RateLimit-Remaining, X-RateLimit-Reset).',
        reasoning: 'Transparency helps API consumers manage their usage and avoid hitting limits unexpectedly.'
      }
    ]
  },
  {
    problemId: '5', // Instagram
    steps: [
      {
        title: 'Step 1: Photo Upload Service',
        description: 'Handle photo uploads and store in object storage (S3).',
        reasoning: 'Object storage is designed for large binary files and provides high durability.'
      },
      {
        title: 'Step 2: Image Processing Pipeline',
        description: 'Generate thumbnails and multiple resolutions asynchronously.',
        reasoning: 'Processing images in the background prevents blocking the user and enables responsive UI.'
      },
      {
        title: 'Step 3: Feed Generation',
        description: 'Build a news feed using a fan-out approach (push or pull).',
        reasoning: 'Pre-computing feeds (fan-out on write) provides fast load times but requires more storage. Pull-based is more efficient for celebrities with millions of followers.'
      },
      {
        title: 'Step 4: CDN for Media',
        description: 'Serve images through a global CDN.',
        reasoning: 'CDN reduces latency for users worldwide and offloads traffic from origin servers.'
      }
    ]
  },
  {
    problemId: '6', // Dropbox
    steps: [
      {
        title: 'Step 1: Chunking & Hashing',
        description: 'Break files into chunks and generate hashes for each chunk.',
        reasoning: 'Chunking allows the system to upload only changed parts of a file (Delta sync), saving bandwidth.'
      },
      {
        title: 'Step 2: Metadata Synchronization',
        description: 'Keep a central metadata store to track file versions, owners, and chunk locations.',
        reasoning: 'Metadata is small and highly structured, allowing for fast queries across all user devices.'
      },
      {
        title: 'Step 3: Cloud Storage Integration',
        description: 'Store actual chunks in an object storage service like S3.',
        reasoning: 'Provides limitless scalability and high durability for billions of file chunks.'
      },
      {
        title: 'Step 4: Conflict Resolution',
        description: 'Implement a strategy to handle simultaneous edits (e.g., "Keep both files").',
        reasoning: 'In a distributed sync system, conflicting edits are inevitable. A clear policy ensures no data loss.'
      }
    ]
  },
  {
    problemId: '7', // Notification System
    steps: [
      {
        title: 'Step 1: Multi-Channel Gateway',
        description: 'Create adapters for different notification channels (Push, Email, SMS).',
        reasoning: 'Abstraction allows the system to add new channels without changing core logic.'
      },
      {
        title: 'Step 2: Priority Queue',
        description: 'Implement priority queues to handle urgent notifications first.',
        reasoning: 'Critical alerts (security, payments) must be delivered faster than promotional content.'
      },
      {
        title: 'Step 3: Rate Limiting per Channel',
        description: 'Apply rate limits to prevent overwhelming users or hitting provider limits.',
        reasoning: 'Too many notifications annoy users and can trigger spam filters or provider throttling.'
      },
      {
        title: 'Step 4: Retry Logic with Backoff',
        description: 'Implement exponential backoff for failed deliveries.',
        reasoning: 'Temporary failures (network issues) should be retried, but not so aggressively that they cause cascading failures.'
      }
    ]
  },
  {
    problemId: '8', // WhatsApp
    steps: [
      {
        title: 'Step 1: WebSocket Gateway',
        description: 'Establish persistent connections with clients using WebSockets.',
        reasoning: 'Real-time messaging requires bi-directional communication. WebSockets are ideal for this.'
      },
      {
        title: 'Step 2: Message Queue (Kafka)',
        description: 'Buffer messages in a distributed queue for reliability.',
        reasoning: 'Queuing ensures messages aren\'t lost if a server crashes and enables asynchronous processing.'
      },
      {
        title: 'Step 3: Message Storage',
        description: 'Store messages in a distributed database with replication.',
        reasoning: 'Users expect message history to be available across devices and after app reinstalls.'
      },
      {
        title: 'Step 4: Delivery Receipts',
        description: 'Track message states (sent, delivered, read) using acknowledgments.',
        reasoning: 'Receipts provide transparency and improve user experience by confirming message delivery.'
      }
    ]
  },
  {
    problemId: '9', // Ad Click Aggregator
    steps: [
      {
        title: 'Step 1: High-Throughput Ingestion',
        description: 'Use a system like Kafka to buffer billions of daily event logs.',
        reasoning: 'The system must handle massive spikes without losing data or crashing. Queuing is essential.'
      },
      {
        title: 'Step 2: Stream Processing (Flink/Spark)',
        description: 'Aggregate counts in real-time across different dimensions (AdID, Platform, Region).',
        reasoning: 'Real-time billing requires real-time data processing. Stream processing allows for low-latency aggregation.'
      },
      {
        title: 'Step 3: Fault-Tolerant State Store',
        description: 'Keep the running totals in a highly available, distributed state store.',
        reasoning: 'Exactly-once processing requires that if a worker fails, its state (the counts so far) can be recovered perfectly.'
      }
    ]
  },
  {
    problemId: '10', // YouTube
    steps: [
      {
        title: 'Step 1: Upload & Initial Storage',
        description: 'Store raw video files in a temporary storage bucket.',
        reasoning: 'Raw videos are huge. Temporary storage allows the system to acknowledge the upload before processing begins.'
      },
      {
        title: 'Step 2: Transcoding Workers',
        description: 'Use specialized workers to encode video into multiple formats (1080p, 720p, 480p) and codecs.',
        reasoning: 'Transcoding is resource-intensive. Distributing it across many workers ensures fast processing for all users.'
      },
      {
        title: 'Step 3: Chunking for Adaptive Streaming',
        description: 'Split videos into short segments (e.g., 5 seconds) and create a manifest file.',
        reasoning: 'Adaptive bitrate streaming (like HLS or DASH) requires small segments so the player can switch quality based on network speed.'
      },
      {
        title: 'Step 4: CDN Distribution',
        description: 'Distribute video chunks globally via CDN.',
        reasoning: 'Serving video from edge locations reduces buffering and improves user experience worldwide.'
      }
    ]
  },
  {
    problemId: '11', // Uber
    steps: [
      {
        title: 'Step 1: Real-Time Location Tracking',
        description: 'Use WebSockets or Server-Sent Events to stream driver locations.',
        reasoning: 'Real-time updates are essential for matching riders with nearby drivers and showing accurate ETAs.'
      },
      {
        title: 'Step 2: Geospatial Indexing',
        description: 'Index driver locations using Geohashing or QuadTrees.',
        reasoning: 'Efficiently finding nearby drivers requires specialized spatial data structures.'
      },
      {
        title: 'Step 3: Matching Algorithm',
        description: 'Implement a matching service that pairs riders with optimal drivers.',
        reasoning: 'The algorithm must consider distance, driver rating, and surge pricing to optimize both user experience and business metrics.'
      },
      {
        title: 'Step 4: Payment Integration',
        description: 'Integrate with payment gateways for secure transactions.',
        reasoning: 'Reliable payment processing is critical for trust and revenue. Must handle failures gracefully.'
      }
    ]
  },
  {
    problemId: '12', // Distributed Message Queue
    steps: [
      {
        title: 'Step 1: Partition Strategy',
        description: 'Divide topics into partitions for parallel processing.',
        reasoning: 'Partitioning allows multiple consumers to process messages concurrently, increasing throughput.'
      },
      {
        title: 'Step 2: Replication for Durability',
        description: 'Replicate each partition across multiple brokers.',
        reasoning: 'Replication ensures zero data loss even if a broker fails.'
      },
      {
        title: 'Step 3: Consumer Groups',
        description: 'Implement consumer group coordination for load balancing.',
        reasoning: 'Consumer groups allow scaling consumption by adding more workers without duplicate processing.'
      },
      {
        title: 'Step 4: Offset Management',
        description: 'Track consumer offsets to enable replay and exactly-once semantics.',
        reasoning: 'Offset tracking allows consumers to resume from where they left off after failures.'
      }
    ]
  },
  {
    problemId: '13', // Search Engine
    steps: [
      {
        title: 'Step 1: Web Crawler',
        description: 'Discover and download web pages to build a corpus.',
        reasoning: 'A search engine is only as good as its data. Efficient crawling is the foundation.'
      },
      {
        title: 'Step 2: Inverted Index',
        description: 'Map every unique word to a list of documents it appears in.',
        reasoning: 'An inverted index allows for near-instant retrieval of "all documents containing word X" without scanning every file.'
      },
      {
        title: 'Step 3: Ranking Algorithm (PageRank/BM25)',
        description: 'Assign relevance scores to documents based on keywords and authority.',
        reasoning: 'Ranking ensures the most useful results appear at the top, which is what users care about most.'
      },
      {
        title: 'Step 4: Distributed Query Processing',
        description: 'Shard the index across multiple servers for parallel search.',
        reasoning: 'Distributing the index allows the system to handle billions of documents and thousands of queries per second.'
      }
    ]
  },
  {
    problemId: '14', // Stock Exchange
    steps: [
      {
        title: 'Step 1: Order Book Data Structure',
        description: 'Implement a high-performance order book using sorted data structures.',
        reasoning: 'The order book must support ultra-fast insertions, deletions, and matching operations.'
      },
      {
        title: 'Step 2: Matching Engine',
        description: 'Build a matching engine that pairs buy and sell orders based on price-time priority.',
        reasoning: 'Fair and deterministic matching is essential for market integrity and regulatory compliance.'
      },
      {
        title: 'Step 3: Low-Latency Infrastructure',
        description: 'Use in-memory processing and co-location to minimize latency.',
        reasoning: 'In high-frequency trading, microseconds matter. Every optimization counts.'
      },
      {
        title: 'Step 4: Audit Trail',
        description: 'Log every order and trade to an append-only ledger.',
        reasoning: 'Regulatory requirements demand complete, tamper-proof records of all trading activity.'
      }
    ]
  },
  {
    problemId: '15', // Proximity Service (Yelp)
    steps: [
      {
        title: 'Step 1: Geohashing / Quadtrees',
        description: 'Index the world map using Geohashing or a Quadtree structure.',
        reasoning: 'Traditional database indexes are not efficient for 2D proximity queries. Geohashing converts coordinates into a searchable string.'
      },
      {
        title: 'Step 2: Efficient Spatial Database',
        description: 'Use a database with native geospatial support (e.g., PostGIS or Redis Geo).',
        reasoning: 'Spatial databases provide optimized functions for calculating distances and finding points within a radius.'
      },
      {
        title: 'Step 3: Cache Nearby Results',
        description: 'Cache search results for popular areas to reduce database load.',
        reasoning: 'Many users in the same city will query for similar nearby places. Caching improves latency significantly.'
      },
      {
        title: 'Step 4: Business Data Updates',
        description: 'Implement a pipeline to handle business information updates (hours, reviews, photos).',
        reasoning: 'Keeping data fresh is critical for user trust. Stale information leads to poor user experience.'
      }
    ]
  }
];

export const getSolution = (problemId: string): ProblemSolution | null => {
  const specificSolution = SOLUTIONS.find(s => s.problemId === problemId);
  if (specificSolution) return specificSolution;

  const question = systemDesignQuestions.find(q => q.id === problemId);
  if (question) {
    return {
      problemId: question.id,
      steps: [
        {
          title: 'Step 1: Requirement Analysis',
          description: `Focus on the core requirements: ${question.coreRequirements.slice(0, 3).join(', ')}.`,
          reasoning: 'Understanding the primary goals is essential before designing any components.'
        },
        {
          title: 'Step 2: High-Level Architecture',
          description: `Design a system that supports: ${question.highLevelRequirements.slice(0, 3).join(', ')}.`,
          reasoning: 'Defining the high-level architecture helps in identifying the necessary components and their interactions.'
        },
        {
          title: 'Step 3: Data & Storage',
          description: 'Select appropriate databases and caching mechanisms based on the data access patterns.',
          reasoning: `For a ${question.category} system, data consistency and availability trade-offs must be made carefully.`
        },
        {
          title: 'Step 4: Detailed Design',
          description: `Address specific challenges such as: ${question.microRequirements.slice(0, 3).join(', ')}.`,
          reasoning: 'Handling edge cases and technical constraints is key to a robust production system.'
        }
      ]
    };
  }

  return null;
};

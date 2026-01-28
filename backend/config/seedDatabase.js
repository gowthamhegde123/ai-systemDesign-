const { pool } = require('./database');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await pool.query('TRUNCATE TABLE system_design_diagrams, submissions, problems, users RESTART IDENTITY CASCADE');
    console.log('✓ Existing data cleared\n');

    // Seed Users
    console.log('Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      ['john_doe', 'john@example.com', hashedPassword],
      ['jane_smith', 'jane@example.com', hashedPassword],
      ['alice_dev', 'alice@example.com', hashedPassword],
      ['bob_engineer', 'bob@example.com', hashedPassword],
      ['charlie_sys', 'charlie@example.com', hashedPassword]
    ];

    for (const [username, email, password] of users) {
      await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
        [username, email, password]
      );
    }
    console.log(`✓ Created ${users.length} users\n`);

    // Seed Problems
    console.log('Seeding problems...');
    const problems = [
      [
        'Design URL Shortener',
        'Design a URL shortening service like bit.ly or TinyURL that can create short aliases for long URLs.',
        'Medium',
        ['system-design', 'databases', 'distributed-systems']
      ],
      [
        'Design Instagram',
        'Design a photo-sharing social media platform like Instagram with features for uploading, viewing, and sharing photos.',
        'Hard',
        ['system-design', 'social-media', 'storage', 'cdn']
      ],
      [
        'Design Rate Limiter',
        'Design a rate limiting system that restricts the number of requests a user can make in a given time window.',
        'Medium',
        ['system-design', 'distributed-systems', 'algorithms']
      ],
      [
        'Design Parking Lot System',
        'Design a parking lot system that can track available spots, vehicle entry/exit, and calculate parking fees.',
        'Easy',
        ['system-design', 'object-oriented-design']
      ],
      [
        'Design Twitter',
        'Design a microblogging platform like Twitter with features for posting tweets, following users, and viewing timelines.',
        'Hard',
        ['system-design', 'social-media', 'distributed-systems', 'caching']
      ],
      [
        'Design Chat Application',
        'Design a real-time chat application like WhatsApp or Slack with support for one-on-one and group messaging.',
        'Hard',
        ['system-design', 'real-time', 'websockets', 'distributed-systems']
      ],
      [
        'Design Notification System',
        'Design a notification system that can send notifications via email, SMS, and push notifications.',
        'Medium',
        ['system-design', 'messaging', 'distributed-systems']
      ],
      [
        'Design Search Autocomplete',
        'Design a search autocomplete system that suggests queries as users type.',
        'Easy',
        ['system-design', 'algorithms', 'caching']
      ]
    ];

    for (const [title, description, difficulty, tags] of problems) {
      await pool.query(
        'INSERT INTO problems (title, description, difficulty, tags) VALUES ($1, $2, $3, $4)',
        [title, description, difficulty, tags]
      );
    }
    console.log(`✓ Created ${problems.length} problems\n`);

    // Seed Submissions
    console.log('Seeding submissions...');
    const submissions = [
      [1, 1, 'Used consistent hashing for load balancing and distributed caching for scalability...', 85],
      [1, 2, 'Implemented a microservices architecture with separate services for image upload, processing, and storage...', 90],
      [2, 1, 'Designed a token bucket algorithm for rate limiting with Redis for distributed state...', 88],
      [2, 3, 'Used sliding window log algorithm with time-series database...', 82],
      [3, 4, 'Created a simple class hierarchy with ParkingLot, ParkingSpot, and Vehicle classes...', 95],
      [3, 5, 'Implemented observer pattern for real-time notifications and message queuing...', 87],
      [4, 2, 'Used CDN for image delivery and object storage for scalability...', 92],
      [4, 3, 'Designed a feed generation system with fanout on write approach...', 86],
      [5, 1, 'Implemented base62 encoding for short URLs and used consistent hashing...', 89],
      [5, 6, 'Designed WebSocket-based real-time messaging with message persistence...', 91]
    ];

    for (const [userId, problemId, solution, score] of submissions) {
      await pool.query(
        'INSERT INTO submissions (user_id, problem_id, solution, score) VALUES ($1, $2, $3, $4)',
        [userId, problemId, solution, score]
      );
    }
    console.log(`✓ Created ${submissions.length} submissions\n`);

    // Seed Diagrams
    console.log('Seeding diagrams...');
    const diagrams = [
      [
        1,
        1,
        {
          nodes: [
            { id: '1', type: 'client', position: { x: 100, y: 100 }, label: 'User' },
            { id: '2', type: 'loadBalancer', position: { x: 300, y: 100 }, label: 'Load Balancer' },
            { id: '3', type: 'server', position: { x: 500, y: 50 }, label: 'App Server 1' },
            { id: '4', type: 'server', position: { x: 500, y: 150 }, label: 'App Server 2' },
            { id: '5', type: 'database', position: { x: 700, y: 100 }, label: 'PostgreSQL' }
          ],
          edges: [
            { source: '1', target: '2' },
            { source: '2', target: '3' },
            { source: '2', target: '4' },
            { source: '3', target: '5' },
            { source: '4', target: '5' }
          ]
        },
        'URL Shortener Architecture'
      ],
      [
        2,
        2,
        {
          nodes: [
            { id: '1', type: 'client', position: { x: 100, y: 100 }, label: 'Mobile App' },
            { id: '2', type: 'cdn', position: { x: 300, y: 100 }, label: 'CDN' },
            { id: '3', type: 'loadBalancer', position: { x: 500, y: 100 }, label: 'Load Balancer' },
            { id: '4', type: 'server', position: { x: 700, y: 100 }, label: 'API Server' },
            { id: '5', type: 'storage', position: { x: 900, y: 50 }, label: 'S3' },
            { id: '6', type: 'database', position: { x: 900, y: 150 }, label: 'Database' }
          ],
          edges: [
            { source: '1', target: '2' },
            { source: '1', target: '3' },
            { source: '3', target: '4' },
            { source: '4', target: '5' },
            { source: '4', target: '6' }
          ]
        },
        'Instagram Photo Upload Flow'
      ]
    ];

    for (const [userId, problemId, diagramData, name] of diagrams) {
      await pool.query(
        'INSERT INTO system_design_diagrams (user_id, problem_id, diagram_data, name) VALUES ($1, $2, $3, $4)',
        [userId, problemId, JSON.stringify(diagramData), name]
      );
    }
    console.log(`✓ Created ${diagrams.length} diagrams\n`);

    // Display summary
    console.log('✅ Database seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`  - ${users.length} users created (password: password123)`);
    console.log(`  - ${problems.length} problems created`);
    console.log(`  - ${submissions.length} submissions created`);
    console.log(`  - ${diagrams.length} diagrams created\n`);

    console.log('Test credentials:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

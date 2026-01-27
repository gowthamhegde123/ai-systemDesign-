# AI System Design Platform

A comprehensive Next.js application for learning system design with interactive canvas, AI-powered feedback, and user authentication.

## Features

- **Interactive Canvas**: Drag and drop system components (Load Balancers, Databases, Caches, etc.) using React Flow
- **AI Evaluator**: Real-time analysis of your design against specific problem constraints using Google Gemini API
- **Dynamic Problems**: Practice with different scenarios like "Design a URL Shortener" or "Design WhatsApp"
- **User Authentication**: Secure login and user management with NextAuth
- **Email Integration**: Contact forms and notifications via SendGrid, Resend, and Nodemailer
- **Database Integration**: Data persistence with Supabase
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Smooth Animations**: Enhanced UX with Framer Motion

## Tech Stack

- **Frontend**: Next.js 16.1.4 (App Router), React 19, Tailwind CSS 4, Lucide React
- **State Management**: Zustand
- **Canvas**: React Flow
- **AI**: Google Generative AI (Gemini)
- **Authentication**: NextAuth.js
- **Database**: Supabase
- **Email Services**: SendGrid, Resend, Nodemailer, EmailJS
- **Animations**: Framer Motion
- **Backend**: Next.js API Routes (Serverless)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-sysdes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key
   
   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Database
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Email Services (choose one or more)
   SENDGRID_API_KEY=your_sendgrid_api_key
   RESEND_API_KEY=your_resend_api_key
   
   # SMTP Configuration (for Nodemailer)
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── ai-evaluator/  # AI evaluation endpoint
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── canvas/           # Design canvas components
│   ├── ui/               # Reusable UI components
│   └── auth/             # Authentication components
├── lib/                  # Utilities and configurations
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── ai-prompt.ts      # AI prompt engineering
└── types/                # TypeScript type definitions
```

## Key Features Explained

### Interactive Design Canvas
- Drag and drop system components
- Real-time connection drawing
- Component configuration panels
- Export/import design functionality

### AI-Powered Evaluation
- Context-aware design analysis
- Best practices recommendations
- Scalability assessments
- Performance optimization suggestions

### User Management
- Secure authentication with NextAuth
- User profiles and preferences
- Design history and favorites
- Progress tracking

### Communication Features
- Contact forms with multiple email providers
- Automated notifications
- User feedback collection
- Support ticket system

## Deployment

### AWS Deployment
This application is optimized for AWS deployment using:
- **AWS Amplify** or **Vercel** for hosting
- **AWS Lambda** for serverless functions
- **Amazon RDS** or **DynamoDB** for database
- **AWS S3** for static assets
- **CloudFront** for CDN

### Environment Configuration
Ensure all environment variables are properly configured in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

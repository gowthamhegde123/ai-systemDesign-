# AI System Design Learning Platform

An interactive platform for learning AI system design through drag-and-drop interfaces, ML-powered validation, and gamification.

## 🎯 Features

### Core Functionality
- **Drag & Drop Design Canvas**: Build system architectures by dragging components
- **ML-Powered Validation**: AI evaluates your designs against best practices
- **Real-time Feedback**: Get instant feedback on your design decisions
- **Gamification**: Achievements, streaks, and progress tracking
- **User Profiles**: Track your learning journey with GitHub-style activity graphs

### User Profile Features
- Profile picture, name, and description
- Activity tracker (contribution-style heatmap)
- Progress overview by category
- Recent activity feed
- Achievements system with unlockable badges
- Edit profile functionality

### Design Validation
- ML model evaluates architectural correctness
- Test cases for each problem
- Fun/motivational feedback based on performance
- Solution marking and progress tracking

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **React DnD** for drag and drop
- **Recharts** for visualizations
- **Framer Motion** for animations

### Backend
- **Node.js + Express**
- **TypeScript**
- **PostgreSQL** with Prisma ORM
- **Redis** for caching
- **JWT** authentication
- **AWS S3** for image uploads

### ML Validator
- **Python FastAPI**
- **TensorFlow/PyTorch**
- **Graph Neural Networks** for architecture validation
- **Rule-based validation engine**

## 📁 Project Structure

```
ai-design-platform/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and hooks
│   └── public/              # Static assets
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   └── services/        # Business logic
│   └── prisma/              # Database schema
└── ml-validator/            # Python ML service
    ├── models/              # Trained models
    ├── validators/          # Validation logic
    └── api/                 # FastAPI endpoints
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis

### Installation

1. **Clone and setup**
```bash
git clone <repo-url>
cd ai-design-platform
```

2. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

3. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

4. **ML Validator Setup**
```bash
cd ml-validator
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000
```

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/aidesign
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
```

## 📱 Screenshots

[Screenshots will be added here]

## 🎮 How to Use

1. **Sign up/Login** to create your profile
2. **Choose a problem** from the problem library
3. **Drag components** from the sidebar onto the canvas
4. **Connect components** to build your architecture
5. **Submit for validation** - ML model will evaluate your design
6. **Get feedback** - Learn from mistakes or celebrate success
7. **Track progress** on your profile page

## 🏆 Achievement System

- **First Design**: Complete your first system design
- **Perfectionist**: Get 100% on 5 problems
- **Speed Demon**: Complete a design in under 5 minutes
- **Streak Master**: Maintain a 7-day streak
- **Category Expert**: Complete all problems in a category
- And many more!

## 📊 Database Schema

See `backend/prisma/schema.prisma` for detailed schema.

Key models:
- User
- Problem
- Solution
- Achievement
- Activity
- Progress

## 🤖 ML Validation

The ML validator uses:
- Graph Neural Networks to analyze architecture topology
- Rule-based validators for best practices
- Similarity matching with reference solutions
- Component compatibility checking

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection prevention with Prisma

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway/Render)
- Set environment variables
- Connect to GitHub
- Auto-deploy on push

### ML Validator (AWS/GCP)
- Dockerize the application
- Deploy to container service
- Set up load balancing

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Contact

For questions or feedback, open an issue on GitHub.

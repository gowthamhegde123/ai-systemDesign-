# System Design Learning Platform

A Next.js application for learning system design with an interactive canvas and AI-powered feedback.

## Features

- **Interactive Canvas**: Drag and drop system components (Load Balancers, Databases, Caches, etc.) using React Flow.
- **AI Evaluator**: Real-time analysis of your design against specific problem constraints using Google Gemini API.
- **Dynamic Problems**: Practice with different scenarios like "Design a URL Shortener" or "Design WhatsApp".

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React
- **State Management**: Zustand
- **Canvas**: React Flow
- **AI**: Google Generative AI (Gemini)
- **Backend**: Next.js API Routes (Serverless)

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up Environment Variables:
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   GEMINI_API_KEY=your_gemini_api_key
   \`\`\`
   (If no key is provided, the app will use a mock evaluator for demonstration).

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Architecture

- **`src/components/canvas`**: Contains the `DesignCanvas` and `CustomNodes` logic.
- **`src/lib/hooks/useStore.ts`**: Global state management for the canvas and current problem.
- **`src/app/api/ai-evaluator`**: Server-side route that interfaces with the LLM to validate designs.
- **`src/lib/utils/ai-prompt.ts`**: prompt engineering for the System Design "Interviewer" persona.

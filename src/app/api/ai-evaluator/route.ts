import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateUserPrompt, generateSystemPrompt } from '@/lib/utils/ai-prompt';
import { DesignState, Problem } from '@/types';

export async function POST(req: NextRequest) {
    try {
        const { design, problem }: { design: DesignState; problem: Problem } = await req.json();

        if (!design || !problem) {
            return NextResponse.json({ error: 'Missing design or problem data' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Mock response if no API key is provided (for demo/boilerplate purposes)
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not found, returning mock response');
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            const isPass = design.nodes.length > 3 && design.edges.length > 2; // Simple heuristic

            return NextResponse.json({
                status: isPass ? 'Pass' : 'Fail',
                feedback: isPass
                    ? 'Good start! You have the basic components.'
                    : 'Your design seems incomplete. Consider adding a Load Balancer and Database.',
                score: isPass ? 80 : 40,
                suggestions: ['Consider adding a cache layer', 'Ensure DB is scalable']
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = generateSystemPrompt();
        const userPrompt = generateUserPrompt(problem, design);

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure it's valid JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(jsonStr);

        return NextResponse.json(analysis);

    } catch (error) {
        console.error('AI Evaluation Error:', error);
        return NextResponse.json({ error: 'Failed to evaluate design' }, { status: 500 });
    }
}

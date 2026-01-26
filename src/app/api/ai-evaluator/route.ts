import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateUserPrompt, generateSystemPrompt } from '@/lib/utils/ai-prompt';
import { DesignState, Problem } from '@/types';

export async function POST(req: NextRequest) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
        }

        const { design, problem, type }: { design: DesignState; problem: Problem; type?: 'hint' | 'evaluate' } = body;

        if (!design || !problem) {
            return NextResponse.json({ error: 'Missing design or problem data' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // RESTORED: Use simple heuristic for "Run AI Analysis" as it was before
        if (!type || type === 'evaluate') {
            const nodeCount = design.nodes.length;
            const edgeCount = design.edges.length;

            let rating: 'Excellent' | 'Improving' | 'Incomplete' = 'Incomplete';
            let feedback = '';
            let suggestions: string[] = [];
            let score = 0;

            if (nodeCount >= 7 && edgeCount >= 6) {
                rating = 'Excellent';
                feedback = `Great work! This design for ${problem.title} is robust and covers multiple architectural layers.`;
                suggestions = [
                    'Consider fine-tuning your cache eviction policies (LRU/LFU)',
                    'Think about database sharding strategies for even higher scale',
                    'Implement deep monitoring and alerting for all microservices'
                ];
                score = 90;
            } else if (nodeCount >= 4) {
                rating = 'Improving';
                feedback = `You're on the right track with ${problem.title}. You have the core components, but it needs more optimization for high availability.`;
                suggestions = [
                    'Add a CDN to reduce latency for global users',
                    'Implement a Message Queue to handle write spikes asynchronously',
                    'Add a Load Balancer to remove single points of failure'
                ];
                score = 65;
            } else {
                rating = 'Incomplete';
                feedback = `Your design for ${problem.title} is still in the early stages. It lacks the critical infrastructure needed for a scalable system.`;
                suggestions = [
                    'Start by adding a Load Balancer to distribute incoming traffic',
                    'Add a Database layer to persist your system state',
                    'Consider adding an API Gateway for request routing and auth'
                ];
                score = 30;
            }

            return NextResponse.json({
                status: rating === 'Excellent' ? 'Pass' : 'Fail',
                rating,
                feedback,
                score,
                suggestions
            });
        }

        // Keep Gemini API for Pointwise Hints
        if (!apiKey) {
            return NextResponse.json({
                error: 'AI Error',
                message: 'API Key missing for hints. Please add GEMINI_API_KEY to your .env.local'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = generateSystemPrompt(problem.title, 'hint');
        const userPrompt = generateUserPrompt(problem, design);

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const analysis = JSON.parse(jsonStr);
            if (!analysis.feedback && analysis.feedback_text) analysis.feedback = analysis.feedback_text;
            if (!analysis.feedback) analysis.feedback = text;
            return NextResponse.json(analysis);
        } catch {
            return NextResponse.json({
                status: 'Hint',
                feedback: text
            });
        }
    } catch (error: unknown) {
        console.error('CRITICAL AI ERROR:', error);
        return NextResponse.json({
            error: 'AI Error',
            message: error instanceof Error ? error.message : 'Unknown server error'
        }, { status: 500 });
    }
}

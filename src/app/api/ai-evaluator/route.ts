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

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;

        // "Run AI Analysis" -> Call Python ML Service
        if (!type || type === 'evaluate') {
            try {
                // Map Frontend Types to Backend Types
                const typeMapping: Record<string, string> = {
                    'API_GATEWAY': 'api-gateway',
                    'LB': 'load-balancer',
                    'WEB_SERVER': 'web-server',
                    'MICROSERVICE': 'web-server', // Treat microservices as web servers for validation
                    'SQL_DB': 'database',
                    'NOSQL_DB': 'database',
                    'REDIS': 'cache',
                    'CDN': 'cdn',
                    'KAFKA': 'message-queue',
                    'PUB_SUB': 'message-queue',
                    'FIREWALL': 'security',
                    'WAF': 'security'
                };

                const components = design.nodes.map(node => ({
                    id: node.id,
                    type: typeMapping[node.data.type] || 'unknown',
                    position: node.position
                }));

                const connections = design.edges.map(edge => ({
                    from_component: edge.source,
                    to_component: edge.target
                }));

                // Call Python Service
                const mlServiceUrl = process.env.NEXT_PUBLIC_ML_API_URL || 'http://127.0.0.1:8000';

                const response = await fetch(`${mlServiceUrl}/validate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        components,
                        connections,
                        problem_id: problem.id
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('ML Validator Error:', errorText);
                    throw new Error(`ML Validator failed: ${response.statusText}`);
                }

                const result = await response.json();

                return NextResponse.json({
                    status: result.passed ? 'Pass' : 'Fail',
                    score: result.score,
                    feedback: result.feedback,
                    test_results: result.test_results,
                    detailed_results: result.detailed_results,
                    suggestions: [] // Backend can provide these if needed in future
                });

            } catch (error) {
                console.error('Validation Gateway Error:', error);

                // Fallback if Python service is down
                console.warn('Falling back to basic validation...');
                return NextResponse.json({
                    status: 'Fail',
                    score: 0,
                    feedback: "Unable to connect to AI Validator Service. Please ensure the backend (port 8000) is running.",
                    test_results: [],
                    detailed_results: {}
                });
            }
        }

        // Keep Gemini API for Pointwise Hints (Direct Call)
        if (!apiKey) {
            return NextResponse.json({
                error: 'AI Error',
                message: 'API Key missing for hints. Please add GEMINI_API_KEY to your .env.local'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = generateSystemPrompt(problem.title, 'hint');
        const userPrompt = generateUserPrompt(problem, design);

        const result = await model.generateContent([systemPrompt, userPrompt]);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            status: 'Hint',
            feedback: text
        });

    } catch (error: unknown) {
        console.error('CRITICAL AI ERROR:', error);
        return NextResponse.json({
            error: 'AI Error',
            message: error instanceof Error ? error.message : 'Unknown server error'
        }, { status: 500 });
    }
}

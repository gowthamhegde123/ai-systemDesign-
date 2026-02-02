import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        console.log('Roast API: Request received');
        const body = await req.json();
        const { image } = body;

        console.log('Roast API: Image received length:', image?.length || 0);

        if (!image) {
            console.error('Roast API: No image provided');
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
        console.log('Roast API: API Key present:', !!apiKey);

        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error: Missing AI API Key (checked GEMINI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, GOOGLE_API_KEY)' }, { status: 500 });
        }

        if (apiKey === 'AIzaSyBez-ZpjdFfvwcMIM5qIQN16bJZDVl2b-8') {
            return NextResponse.json({ error: 'Invalid API Key', details: 'You are using the placeholder API Key. Please replace it with your real Google Gemini API Key in .env.local' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // List of models to try in order
        const modelsToTry = [
            'gemini-2.0-flash',
            'gemini-2.0-flash-lite',
            'gemini-1.5-flash',
            'gemini-1.5-pro'
        ];

        // Remove the data:image/png;base64, prefix
        const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        const prompt = `
        Act as a brutally honest but witty UI/UX design critic. Analyze the attached screenshot of a user's system design diagram.
        
        CRITERIA:
        > Check for alignment, whitespace usage, color coding consistency, and overall layout 'vibes'.
        > Note: This is a technical system design diagram (boxes and arrows), so critique the clarity and organization.
        
        OUTPUT FORMAT (JSON):
        {
            "rating": "A number from 1-10",
            "verdict": "Either 'ROAST' (if rating < 7) or 'BOAST' (if rating >= 7)",
            "commentary": "A short, punchy 2-sentence critique. If ROAST, be sarcastic and funny. If BOAST, be genuinely impressed but still witty.",
            "meme_keyword": "A specific keyword to search for a GIF (e.g., 'facepalm', 'chef kiss', 'dumpster fire', 'mind blown')"
        }
        
        Return ONLY valid JSON.
        `;

        let result;
        let activeModelName = '';
        const errors: string[] = [];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Roast API: Attempting generation with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: 'image/png',
                        },
                    },
                ]);

                activeModelName = modelName;
                console.log(`Roast API: Success with model: ${modelName}`);
                break; // Exit loop on success
            } catch (e: any) {
                const msg = e.message || String(e);
                console.warn(`Roast API: Failed with model ${modelName}:`, msg);
                errors.push(`${modelName}: ${msg.includes('404') ? 'Model Not Found' : msg.includes('403') ? 'Permission Denied' : 'Error'}`);
            }
        }

        if (!result) {
            // DIAGNOSTIC STEP: Check available models directly via REST API
            let diagnosticMsg = '';
            try {
                const listModelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                const listModelsData = await listModelsRes.json();

                if (!listModelsRes.ok) {
                    diagnosticMsg = `API Key Check Failed: ${listModelsData.error?.message || listModelsRes.statusText}`;
                } else {
                    const availableModels = listModelsData.models?.map((m: any) => m.name) || [];
                    diagnosticMsg = `Your API Key is valid but has access to different models: ${availableModels.join(', ')}. Please update 'route.ts' with one of these.`;
                }
            } catch (diagError) {
                diagnosticMsg = 'Could not verify API Key connectivity.';
            }

            throw new Error(`All models failed. details: ${errors.join(' | ')}. DIAGNOSIS: ${diagnosticMsg}`);
        }

        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let analysis;
        try {
            analysis = JSON.parse(cleanJson);
        } catch (e) {
            console.error('Failed to parse AI response:', text);
            return NextResponse.json({ error: 'AI Brain Freeze' }, { status: 500 });
        }

        // Fetch GIF from Giphy
        let memeUrl = null;
        console.log('Roast API: Analyzing meme keyword:', analysis.meme_keyword);

        if (process.env.GIPHY_API_KEY && analysis.meme_keyword) {
            try {
                // Fetch more results to pick a different one each time
                const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(analysis.meme_keyword)}&limit=20&rating=pg`;
                const giphyRes = await fetch(giphyUrl);
                const giphyData = await giphyRes.json();

                if (giphyData.data && giphyData.data.length > 0) {
                    // Randomly select one GIF from the results
                    const randomIndex = Math.floor(Math.random() * giphyData.data.length);
                    memeUrl = giphyData.data[randomIndex].images.downsized_medium.url;
                    console.log(`Roast API: Found meme (Index ${randomIndex}):`, memeUrl);
                } else {
                    console.log('Roast API: No memes found for keyword');
                    if (giphyData.meta && giphyData.meta.status !== 200) {
                        console.error('Roast API: Giphy API Error:', giphyData.meta);
                    }
                }
            } catch (err) {
                console.error('Roast API: Giphy Fetch Error:', err);
            }
        } else {
            console.log('Roast API: Skipping Giphy (Missing Key or Keyword). Key Present:', !!process.env.GIPHY_API_KEY);
        }

        return NextResponse.json({
            ...analysis,
            meme_url: memeUrl
        });

    } catch (error: unknown) {
        console.error('Roast API Error:', error);
        return NextResponse.json({
            error: 'Roast Machine Broken',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

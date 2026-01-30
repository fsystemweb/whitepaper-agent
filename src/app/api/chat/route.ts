/**
 * Chat API Route - Streaming endpoint
 * 
 * POST /api/chat
 * 
 * Streams AI responses using Server-Sent Events.
 * Follows async-defer-await and validation patterns.
 */

import { NextRequest } from 'next/server';
import { z } from 'zod';
import { streamChatResponse, type ChatMessage } from '@/lib/langchain';
import { type SystemPromptKey, SYSTEM_PROMPTS } from '@/lib/prompts';

// Input validation schema
const chatRequestSchema = z.object({
    messages: z.array(
        z.object({
            id: z.string(),
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string(),
            createdAt: z.string().or(z.date()).transform((val) => new Date(val)),
        })
    ),
    userMessage: z.string().min(1, 'Message cannot be empty'),
    systemPromptKey: z
        .enum(Object.keys(SYSTEM_PROMPTS) as [SystemPromptKey, ...SystemPromptKey[]])
        .optional()
        .default('default'),
});

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validationResult = chatRequestSchema.safeParse(body);

        if (!validationResult.success) {
            return new Response(
                JSON.stringify({
                    error: 'Invalid request',
                    details: validationResult.error.flatten(),
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        const { messages, userMessage, systemPromptKey } = validationResult.data;

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Get the stream generator
                    const streamGen = streamChatResponse(
                        messages as ChatMessage[],
                        userMessage,
                        systemPromptKey
                    );

                    // Iterate over the generator and stream chunks
                    for await (const chunk of streamGen) {
                        const data = JSON.stringify({ content: chunk });
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    }

                    // Send completion event
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

// Handle unsupported methods
export async function GET() {
    return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

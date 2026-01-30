/**
 * Application configuration
 * Centralized configuration management with environment variable validation
 */

export const config = {
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.2'),
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2048', 10),
    },
    features: {
        enableRelevanceCheck: process.env.ENABLE_RELEVANCE_CHECK === 'true',
    },
} as const;

/**
 * Validate that required environment variables are set
 * @throws Error if required variables are missing
 */
export function validateConfig(): void {
    if (!config.openai.apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required');
    }
}

import { z } from "zod";
import { ArxivRetriever } from "@langchain/community/retrievers/arxiv";
import { tool } from "@langchain/core/tools";
import { getChatModel } from "./client";
import { SystemMessage } from "@langchain/core/messages";
import { config } from "@/lib/config";
import { Document } from "@langchain/core/documents";

const formatDocsToString = (docs: Document[]) => {
    return docs.map((doc, i) => [
        `**${i + 1}. Title:** ${doc.metadata.title}`,
        `**Authors:** ${doc.metadata.authors}`,
        `**Published:** ${doc.metadata.published}`,
        `**Summary:** ${doc.pageContent}`,
        `**Link:** [${doc.metadata.id}](${doc.metadata.id})`
    ].join("  \n")).join("\n\n");
};
export const arxivTool = tool(
    async ({ query }: { query: string }) => {
        const retriever = new ArxivRetriever({
            maxSearchResults: 5,
            getFullDocuments: false,
        });

        const docs = await retriever.invoke(query);

        if (config.features.enableRelevanceCheck) {
            const chatModel = getChatModel();
            const summaries = docs.map((d, i) => `[${i}] Title: ${d.metadata.title}\nSummary: ${d.pageContent}`).join("\n\n");

            const relevancePrompt = `You are a helpful assistant acting as a filter for a search tool.
The user searched for: "${query}".
Here are the search results from arXiv:

${summaries}

Which of these papers are actually relevant to the user's technical query?
Return a JSON object with a single key "relevant_indices" containing a list of the integers (indices) of the relevant papers.
If NONE are relevant, return an empty list.
Example: { "relevant_indices": [0, 2] }
ONLY return the JSON.`;

            const response = await chatModel.invoke([new SystemMessage(relevancePrompt)]);
            let relevantIndices: number[] = [];

            try {
                const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
                // Simple cleanup to handle potential markdown code blocks
                const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
                const result = JSON.parse(jsonStr);
                if (result && Array.isArray(result.relevant_indices)) {
                    relevantIndices = result.relevant_indices;
                }
            } catch (e) {
                console.error("Failed to parse relevance check response", e);
                // Fallback: If parsing fails, assuming all are relevant or none? 
                // Let's assume none to be safe, or maybe all to be permissive. 
                // Given the requirement is strict ("couldn't find..."), let's match exact indices.
                // If we can't parse, we probably shouldn't return garbage.
            }

            if (relevantIndices.length === 0) {
                return "couldn't find white paper available on that topic";
            }

            const filteredDocs = docs.filter((_, i) => relevantIndices.includes(i));

            return formatDocsToString(filteredDocs);
        }

        console.log("arvix", docs);
        return formatDocsToString(docs);
    },
    {
        name: "search_arxiv",
        description:
            "Searches arXiv.org for scientific papers. Useful for finding technical whitepapers, authors, and summaries.",
        schema: z.object({
            query: z.string().describe(
                "The search query, e.g., 'Large Language Models' or 'Quantum Computing'"
            ),
        }),
    }
);

export const appTools = [arxivTool];

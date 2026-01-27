import { z } from "zod";
import { ArxivRetriever } from "@langchain/community/retrievers/arxiv";
import { tool } from "@langchain/core/tools";

export const arxivTool = tool(
    async ({ query }: { query: string }) => {
        const retriever = new ArxivRetriever({
            maxSearchResults: 5,
            getFullDocuments: false,
        });

        const docs = await retriever.invoke(query);

        console.log("arvix", docs);
        return JSON.stringify(
            docs.map((doc) => ({
                title: doc.metadata.title,
                summary: doc.pageContent,
            })),
            null,
            2
        );
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

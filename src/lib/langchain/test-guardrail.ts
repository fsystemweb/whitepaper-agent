import { arxivTool } from "./tools";

async function main() {
    const query = process.argv[2];
    if (!query) {
        console.error("Please provide a query argument");
        process.exit(1);
    }

    console.log(`Testing with query: "${query}"`);
    // Note: We can't easily see the internal config value here if it was already loaded, 
    // but running this script with 'npx tsx' in a fresh process will pick up the ENV.

    try {
        const result = await arxivTool.invoke({ query });
        console.log("\n--- RESULT START ---");
        console.log(result);
        console.log("--- RESULT END ---\n");
    } catch (error) {
        console.error("Error:", error);
    }
}

main();

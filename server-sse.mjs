import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const JOKES_FILE = join(__dirname, "jokes.txt");

function loadJokes() {
  const raw = readFileSync(JOKES_FILE, "utf-8");
  return raw.split("---").map((j) => j.trim()).filter(Boolean);
}

function createServer() {
  const server = new McpServer({ name: "jokes", version: "1.0.0" });

  server.tool("get_random_joke", "Get a random joke", {}, async () => {
    const jokes = loadJokes();
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return { content: [{ type: "text", text: joke }] };
  });

  server.tool(
    "search_jokes",
    "Search jokes by keyword",
    { keyword: { type: "string", description: "Keyword to search for" } },
    async ({ keyword }) => {
      const jokes = loadJokes();
      const matches = jokes.filter((j) =>
        j.toLowerCase().includes(keyword.toLowerCase())
      );
      const text = matches.length
        ? matches.join("\n\n")
        : `No jokes found for "${keyword}"`;
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool("list_jokes", "List all available jokes", {}, async () => {
    const jokes = loadJokes();
    const numbered = jokes.map((j, i) => `${i + 1}. ${j}`).join("\n\n");
    return { content: [{ type: "text", text: numbered }] };
  });

  return server;
}

const PORT = process.env.PORT || 3000;
const app = express();
const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => delete transports[transport.sessionId]);
  const server = createServer();
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (!transport) return res.status(400).send("Unknown session");
  await transport.handlePostMessage(req, res);
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MCP Jokes SSE server on http://0.0.0.0:${PORT}`);
});

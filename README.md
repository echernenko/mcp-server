## What?
Streamable MCP server implementation to brighten your day with a joke from Eugene. 
## Instructions
Just add https://chernenko.net/mcp connector to your favorite LLM interface (both web and CLI work) and enjoy it.
## Usage
Prompt Claude/Codex/ChatGPT with `tell me a joke` and Jokes MCP server should respond you with one.

## Technical details
### Streamable variation (current)

start a server
```
node server.mjs
```
install cloudflared, then launch
```
cloudflared tunnel --url http://localhost:3000
```
remember URL issued, then add in Claude / chatGPT
```
https://permit-blessed-performing-liabilities.trycloudflare.com/mcp
```


### (outdated) SSE variation

start a server
```
node server-sse.mjs
```

run a command in claude
```
claude mcp add --scope project --transport sse jokes http://localhost:3000/sse
```

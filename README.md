# How to add to Claude?

## Streamable variation (current)

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


## SSE variation (outdated)

start a server
```
node server-sse.mjs
```

run a command in claude
```
claude mcp add --scope project --transport sse jokes http://localhost:3000/sse
```

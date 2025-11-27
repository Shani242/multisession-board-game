// test-server.js
const http = require("http");

const server = http.createServer((req, res) => {
    res.end("OK");
});

server.listen(4000, () => {
    console.log("✅ basic HTTP server listening on http://localhost:4000");
});

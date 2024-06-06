const express = require('express')
const app = express()
const fs = require('fs')

app.get('/', (request ,response) => {
    response.sendFile(__dirname + '/index.html');
})

app.get('/video', (request ,response) => {
    const range = request.headers.range;
    if (!range) {
        response.status(400).send("Requires Range headers")
    }

    const videoPath = "video.mp4"
    const videoSize = fs.statSync("video.mp4").size
    
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g,""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)

    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    response.writeHead(206 ,headers);
    
    const videoStream = fs.createReadStream(videoPath, {start ,end});
    videoStream.pipe(response)
})

app.listen(9000 ,() => {
    console.log("[Server] Running on http://localhost:9000");
})
const http = require('http')

const server = http.createServer((req, res) => {
    res.end("Generic Response Please Ignore!")
})

server.listen(process.env.PORT || 3000);
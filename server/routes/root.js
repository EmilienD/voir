const fs = require('fs')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

module.exports = async function (fastify, opts) {
  fastify.get('/stream', { websocket: true }, (connection) => {
    let hasContent = false
    const filePath = path.resolve(__dirname, `../../uploads/${uuidV4()}.webm`)
    const fileStream = fs.createWriteStream(filePath, { encoding: 'binary' })
    fileStream.on('error', (err) => {
      //todo: handle errors
    })
    fileStream.on('close', (ev) => {
      if (!hasContent) {
        fs.rm(filePath, () => {})
      }
    })
    connection.socket.on('message', (message, isBinary) => {
      hasContent = true
      fileStream.write(message)
    })
    connection.socket.on('close', (ev) => {
      fileStream.close()
    })
    connection.socket.on('error', (err) => {
      //todo: handle errors
    })
  })
}

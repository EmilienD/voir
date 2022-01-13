const fs = require('fs')
const promisesFs = require('fs/promises')
const path = require('path')
const { v4: uuidV4 } = require('uuid')

module.exports = async function (fastify) {
  fastify.get('/upload-stream', { websocket: true }, (connection) => {
    let hasContent = false
    const filePath = getFilePath(uuidV4())
    const writeStream = fs.createWriteStream(filePath, { encoding: 'binary' })
    writeStream.on('error', () => {
      //todo: handle errors
    })
    writeStream.on('close', () => {
      if (!hasContent) {
        fs.rm(filePath, () => {})
      }
    })
    connection.socket.on('message', (message) => {
      hasContent = true
      writeStream.write(message)
    })
    connection.socket.on('close', () => {
      writeStream.close()
    })
    connection.socket.on('error', () => {
      //todo: handle errors
    })
  })
  fastify.get('/download-stream/:id', async (req, rep) => {
    const filePath = getFilePath(req.params.id)
    const fileStats = await promisesFs.stat(filePath)
    const [queryStart, queryEnd] = (req.query.bytes || '')
      .split('-')
      .map((val) => Number.parseInt(val))
    const start = queryStart || 0
    const end =
      queryEnd && queryEnd > 0 && queryEnd < fileStats.size
        ? queryEnd
        : fileStats.size - 1
    const readStream = fs.createReadStream(filePath, {
      start,
      end,
      autoClose: true,
    })
    rep
      .code(206)
      .headers({
        'content-range': `bytes ${start}-${end}/`,
        'accept-ranges': 'bytes',
        'content-length': end - start + 1,
        'content-type': 'video/webm',
      })
      .send(readStream)
  })
}

const getFilePath = (id) => path.resolve(__dirname, `../../uploads/${id}.webm`)

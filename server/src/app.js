'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  const config = {
    dbPath: process.env.DB_PATH,
    webClientFolder: process.env.WEB_CLIENT_FOLDER,
    uploadFolder: process.env.UPLOAD_FOLDER,
  }
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, { ...opts, ...config }),
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({ prefix: '/api/v1' }, { ...opts, ...config }),
  })
}

const initUser = require('./user')

module.exports = (repositories) => ({
  user: initUser({ repositories, services: {} }),
})

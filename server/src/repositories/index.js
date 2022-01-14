const user = require('./user')

module.exports = (db) => ({
  user: user(db),
})

const installation = require('./installation')
const user = require('./user')

module.exports = (db) => ({
  user: user(db),
  installation: installation(db),
})

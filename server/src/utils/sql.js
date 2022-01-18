const camelize = require('camelize')

const sql = (string, ...args) => {
  const query = string.join('?')
  return [query, args]
}

const select = (db) => (query) => (params) =>
  camelize(db.prepare(query).get(params))
const selectAll = (db) => (query) => (params) =>
  camelize(db.prepare(query).all(params))

module.exports = { sql, select, selectAll }

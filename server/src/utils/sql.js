const sql = (string, ...args) => {
  const query = string.join('?')
  return [query, args]
}

module.exports = { sql }

const { sql, select: hoSelect } = require('../utils/sql')

module.exports = (db) => {
  const select = hoSelect(db)
  return {
    createUser: async ({ id, email, passwordHash, createdAt }) => {
      const [query, params] = sql`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (${id}, ${email}, ${passwordHash}, ${createdAt});
    `
      await db.prepare(query).run(params)
      return { id, email, createdAt }
    },
    getUserByEmail: async (email) => {
      const [query, params] = sql`
    SELECT * FROM users where email = ${email}
    `
      return select(query)(params)
    },
    getUserByToken: async (token) => {
      const [query, params] = sql`
      SELECT u.id, u.email, u.created_at, u.updated_at
      FROM installations i
      LEFT OUTER JOIN users u ON u.id = i.user_id
      WHERE i.token = ${token}
      `
      return select(query)(params)
    },
  }
}

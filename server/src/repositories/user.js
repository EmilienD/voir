const { sql } = require('../utils/sql')

module.exports = (db) => ({
  createUser: async ({ id, email, hashedPassword, createdAt }) => {
    const [query, params] = sql`
    INSERT INTO users (id, email, password_hash, created_at)
    VALUES (${id}, ${email}, ${hashedPassword}, ${createdAt});
    `
    await db.prepare(query).run(params)
    return { id, email, createdAt }
  },
  getUserByEmail: async (email) => {
    const [query, params] = sql`
    SELECT * FROM users where email = ${email}
    `
    return db.prepare(query).get(params)
  },
  getAllUsers: async () => {
    const [query, params] = sql`
    SELECT id, email, created_at, updated_at FROM users;
    `
    return db.prepare(query).all(params)
  },
})

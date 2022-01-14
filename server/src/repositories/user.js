const { sql } = require('../utils/sql')

module.exports = (db) => ({
  createUser: async ({ id, email, hashedPassword, createdAt }) => {
    await db.runAsync(
      ...sql`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (${id}, ${email}, ${hashedPassword}, ${createdAt});
      `
    )
    return { id, email, createdAt }
  },
  getAllUsers: () =>
    db.allAsync(
      ...sql`
    SELECT id, email, created_at, updated_at FROM users;
    `
    ),
})

const { sql } = require('../utils/sql')

module.exports = (db) => {
  return {
    update: async (installation) => {
      const [query, params] = sql`
    UPDATE installations
    SET token = ${installation.token}, updated_at = ${new Date().toJSON()}
    WHERE id = ${installation.id}
    `
      await db.prepare(query).run(params)
      return installation
    },
    create: async (installation) => {
      const createdAt = new Date().toJSON()

      const [query, params] = sql`
    INSERT INTO installations (id, token, user_id, created_at)
    VALUES (${installation.id}, ${installation.token}, ${installation.userId},${createdAt})
    `
      await db.prepare(query).run(params)
      return installation
    },
  }
}

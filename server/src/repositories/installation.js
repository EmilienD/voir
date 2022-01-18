const { sql, select: hofSelect } = require('../utils/sql')

module.exports = (db) => {
  const select = hofSelect(db)
  return {
    update: async (installation) => {
      const [query, params] = sql`
    UPDATE installations
    SET token = ${installation.token}, updated_at = ${new Date().toJSON()}
    WHERE id = ${installation.id} AND user_id = ${installation.userId}
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
    get: async (installation) => {
      const [query, params] = sql`
    SELECT * FROM installations
    WHERE user_id = ${installation.userId} AND id = ${installation.id}
    `
      return select(query)(params)
    },
  }
}

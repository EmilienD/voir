const argon2 = require('argon2')
const { v4: uuidV4 } = require('uuid')

// promisified sqlite3 db
module.exports = ({ repositories }) => ({
  createUser: async (user) => {
    const { password, id, email } = user
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 1024, // TODO: use env var, should be at least 15mb for prod
      timeCost: 2,
    })

    const savedUser = await repositories.user.createUser({
      id: id || uuidV4(),
      email,
      password,
      createdAt: new Date().toJSON(),
      passwordHash,
    })
    return savedUser
  },
  getAllUsers: () => repositories.user.getAllUsers(),
})

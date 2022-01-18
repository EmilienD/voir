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

    const newUser = {
      id: id || uuidV4(),
      email,
      password,
      createdAt: new Date().toJSON(),
      passwordHash,
    }
    await repositories.user.createUser(newUser)
    const installation = { id: uuidV4(), token: uuidV4(), userId: newUser.id }
    await repositories.installation.create(installation)

    return { user: newUser, installation }
  },
  getAuthenticationToken: async ({ email, password, installationId }) => {
    const maybeUser = await repositories.user.getUserByEmail(email)
    if (!maybeUser) {
      return null
    }
    const { passwordHash, ...user } = maybeUser
    const isValid = await argon2.verify(passwordHash, password)
    if (isValid) {
      let installation
      if (installationId) {
        const updatedInstallation = {
          id: installationId,
          token: uuidV4(),
        }
        installation = await repositories.installation.update(
          updatedInstallation
        )
      } else {
        installation = { id: uuidV4(), token: uuidV4(), userId: user.id }
        await repositories.installation.create(installation)
      }
      return { user, installation }
    } else {
      return null
    }
  },
  deleteAuthenticationToken: async (installation) => {
    return repositories.installation.update({ id: installation.id })
  },
  getUserByToken: async (token) => {
    return repositories.user.getUserByToken(token)
  },
})

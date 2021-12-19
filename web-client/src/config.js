const env = (process && process.env) || {}

const config = {
  webSocketUrlBase: env.REACT_APP_WEB_SOCKET_URL_BASE,
}

export default config

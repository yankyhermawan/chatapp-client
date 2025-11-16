const isDev = import.meta.env.DEV

const endpoint = isDev
  ? `http://${window.location.hostname}:8080`
  : import.meta.env.VITE_SERVER_URL

export { endpoint }

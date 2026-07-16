const configuredDatabaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/+$/, '')

export const databaseUrl = configuredDatabaseUrl?.includes('YOUR_PROJECT_ID')
  ? ''
  : configuredDatabaseUrl

export const firebaseConfigurationError =
  'Add your Firebase Realtime Database URL to VITE_FIREBASE_DATABASE_URL in .env.'

export function getFirebaseUrl(path) {
  if (!databaseUrl) {
    throw new Error(firebaseConfigurationError)
  }

  return `${databaseUrl}/${path.replace(/^\/+|\/+$/g, '')}.json`
}

export function getFirebaseRequestError(action, response) {
  return response.statusText
    ? `Could not ${action}: ${response.statusText}`
    : `Could not ${action}.`
}

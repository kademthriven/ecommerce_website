const configuredApiKey = import.meta.env.VITE_FIREBASE_WEB_API_KEY

const firebaseApiKey = configuredApiKey?.includes('YOUR_FIREBASE') ? '' : configuredApiKey

export const authConfigurationError =
  'Add your Firebase Web API key to VITE_FIREBASE_WEB_API_KEY in .env.'

export class FirebaseAuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FirebaseAuthError'
  }
}

async function readAuthResponse(response) {
  let responseData

  try {
    responseData = await response.json()
  } catch {
    throw new Error('The authentication server returned an invalid response.')
  }

  if (!response.ok) {
    throw new FirebaseAuthError(responseData?.error?.message || 'Authentication failed.')
  }

  return responseData
}

async function sendPasswordAuthRequest(action, email, password, signal) {
  if (!firebaseApiKey) {
    throw new Error(authConfigurationError)
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      signal,
    },
  )

  return readAuthResponse(response)
}

export function createFirebaseAccount(email, password, signal) {
  return sendPasswordAuthRequest('signUp', email, password, signal)
}

export function signInFirebaseAccount(email, password, signal) {
  return sendPasswordAuthRequest('signInWithPassword', email, password, signal)
}

export async function validateFirebaseToken(idToken, signal) {
  if (!firebaseApiKey) {
    throw new Error(authConfigurationError)
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      signal,
    },
  )

  return readAuthResponse(response)
}

export async function changeFirebasePassword(idToken, newPassword, signal) {
  if (!firebaseApiKey) {
    throw new Error(authConfigurationError)
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idToken,
        password: newPassword,
        returnSecureToken: true,
      }),
      signal,
    },
  )

  return readAuthResponse(response)
}

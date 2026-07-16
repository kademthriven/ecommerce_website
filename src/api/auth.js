const configuredApiKey = import.meta.env.VITE_FIREBASE_WEB_API_KEY

const firebaseApiKey = configuredApiKey?.includes('YOUR_FIREBASE') ? '' : configuredApiKey

export const authConfigurationError =
  'Add your Firebase Web API key to VITE_FIREBASE_WEB_API_KEY in .env.'

export async function createFirebaseAccount(email, password, signal) {
  if (!firebaseApiKey) {
    throw new Error(authConfigurationError)
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${encodeURIComponent(firebaseApiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      signal,
    },
  )

  let responseData

  try {
    responseData = await response.json()
  } catch {
    throw new Error('The authentication server returned an invalid response.')
  }

  if (!response.ok) {
    throw new Error(responseData?.error?.message || 'Authentication failed.')
  }

  return responseData
}

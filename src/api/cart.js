const configuredCrudCrudApiUrl = import.meta.env.VITE_CRUDCRUD_API_URL?.replace(/\/+$/, '')

const crudCrudApiUrl = configuredCrudCrudApiUrl?.includes('YOUR_CRUDCRUD')
  ? ''
  : configuredCrudCrudApiUrl

export const cartConfigurationError =
  'Add your CrudCrud API URL to VITE_CRUDCRUD_API_URL in .env.'

function getCartUrl(userEmail) {
  if (!crudCrudApiUrl) {
    throw new Error(cartConfigurationError)
  }

  const cartOwnerId = userEmail?.replace(/[@.]/g, '')

  if (!cartOwnerId) {
    throw new Error('A valid email address is required to load a cart.')
  }

  return `${crudCrudApiUrl}/cart${cartOwnerId}`
}

async function readCartResponse(response, action) {
  if (!response.ok) {
    throw new Error(`Could not ${action} the cart: ${response.statusText || 'request failed'}.`)
  }

  try {
    return await response.json()
  } catch {
    throw new Error(`Could not ${action} the cart: invalid server response.`)
  }
}

export async function createCartItem(userEmail, product, signal) {
  const productId = product.id || product.productId
  const response = await fetch(getCartUrl(userEmail), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    }),
    signal,
  })

  return readCartResponse(response, 'save')
}

export async function getCartItems(userEmail, signal) {
  const response = await fetch(getCartUrl(userEmail), { signal })
  const cartItems = await readCartResponse(response, 'load')

  if (!Array.isArray(cartItems)) {
    throw new Error('Could not load the cart: invalid server response.')
  }

  return cartItems
}

export async function deleteCartItem(userEmail, recordId, signal) {
  const response = await fetch(`${getCartUrl(userEmail)}/${recordId}`, {
    method: 'DELETE',
    signal,
  })

  if (!response.ok) {
    throw new Error(`Could not remove the cart item: ${response.statusText || 'request failed'}.`)
  }
}

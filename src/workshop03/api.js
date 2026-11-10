export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/v1'
const AUTH_TOKEN_KEY = 'workshop03.token'
const AUTH_STORE_KEY = 'workshop03.store'
const AUTH_CHANGE_EVENT = 'workshop03-auth-changed'

export const apiEndpoints = {
  login: { method: 'POST', path: '/login' },
  stores: { method: 'GET', path: '/' },
  register: { method: 'POST', path: '/register' },
  updateStore: id => ({ method: 'PUT', path: `/${id}` }),
  approveStore: id => ({ method: 'PUT', path: `/user/${id}/approve` }),
  products: { method: 'GET', path: '/product' },
  product: id => ({ method: 'GET', path: `/product/${id}` }),
  createProduct: { method: 'POST', path: '/product' },
  updateProduct: id => ({ method: 'PUT', path: `/product/${id}` }),
  deleteProduct: id => ({ method: 'DELETE', path: `/product/${id}` }),
  orders: { method: 'GET', path: '/orders' },
  adminOrders: { method: 'GET', path: '/admin/orders' },
  productOrders: id => ({ method: 'GET', path: `/products/${id}/orders` }),
  createOrders: { method: 'POST', path: '/orders' },
  createOrder: id => ({ method: 'POST', path: `/products/${id}/orders` }),
}

export function getAuthSession() {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  const storeData = sessionStorage.getItem(AUTH_STORE_KEY)
  let store = null

  if (storeData) {
    try {
      store = JSON.parse(storeData)
    } catch (error) {
      sessionStorage.removeItem(AUTH_STORE_KEY)
    }
  }

  return token ? { token, store: store || {} } : null
}

export function saveAuthSession({ token, store }) {
  if (typeof token !== 'string' || !token) {
    throw new Error('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
  }

  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  sessionStorage.setItem(AUTH_STORE_KEY, JSON.stringify({
    id: store?.id || '',
    storename: store?.storename || '',
    username: store?.username || '',
    status: store?.status || '',
  }))
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_STORE_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export function updateAuthStore(store) {
  const session = getAuthSession()
  if (!session || session.store.id !== String(store.id)) return

  saveAuthSession({ token: session.token, store: { ...session.store, ...store } })
}

export const createLoginPayload = ({ username, password }) => ({
  username: username.trim(),
  password,
})

export const createRegistrationPayload = ({ storename, username, password, image }) => {
  if (!image) {
    return {
      storename: storename.trim(),
      username: username.trim(),
      password,
    }
  }

  const payload = new FormData()
  payload.append('storename', storename.trim())
  payload.append('username', username.trim())
  payload.append('password', password)
  payload.append('image', image)
  return payload
}

async function request(endpoint, payload, authenticated = false) {
  const isFormData = payload instanceof FormData
  const headers = {}
  const session = authenticated ? getAuthSession() : null
  if (payload && !isFormData) headers['Content-Type'] = 'application/json'
  if (session?.token) headers.Authorization = `Bearer ${session.token}`

  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers,
      body: payload ? (isFormData ? payload : JSON.stringify(payload)) : undefined,
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง')
    }
    throw error
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = typeof data?.message === 'string'
      ? data.message
      : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
    throw new Error(message)
  }

  return data
}

export const loginStore = credentials => request(
  apiEndpoints.login,
  createLoginPayload(credentials),
)

export const registerStore = registration => request(
  apiEndpoints.register,
  createRegistrationPayload(registration),
)

function unwrapApiData(response) {
  if (!response || !Object.prototype.hasOwnProperty.call(response, 'data')) {
    throw new Error('ระบบส่งข้อมูลกลับมาไม่ถูกต้อง')
  }
  return response.data
}

export async function fetchProducts() {
  const products = unwrapApiData(await request(apiEndpoints.products, null, true))
  if (!Array.isArray(products)) throw new Error('ไม่สามารถโหลดรายการสินค้าได้')
  return products.map(product => {
    const id = product?._id || product?.id
    const qty = Number(product?.qty)
    if (!id || typeof product.name !== 'string' || !Number.isInteger(qty) || qty < 0) {
      throw new Error('พบข้อมูลสินค้าในรูปแบบที่ไม่ถูกต้อง')
    }

    return {
      ...product,
      id: String(id),
      qty,
      price: Number(product.price) || 0,
      imageurl: product.imageurl || '',
      icon: 'mdi-shoe-sneaker',
    }
  })
}

export async function fetchProduct(id) {
  return unwrapApiData(await request(apiEndpoints.product(id), null, true))
}

export async function createProduct(product) {
  const data = unwrapApiData(await request(
    apiEndpoints.createProduct,
    createProductPayload(product),
    true,
  ))
  return { ...data, id: String(data._id || data.id), icon: 'mdi-shoe-sneaker' }
}

export async function updateProduct(id, product) {
  const data = unwrapApiData(await request(
    apiEndpoints.updateProduct(id),
    createProductPayload(product),
    true,
  ))
  return { ...data, id: String(data._id || data.id), icon: 'mdi-shoe-sneaker' }
}

export async function deleteProduct(id) {
  return unwrapApiData(await request(apiEndpoints.deleteProduct(id), null, true))
}

function sanitizeStore(store) {
  return {
    id: String(store?._id || store?.id || ''),
    storename: store?.storename || '',
    username: store?.username || '',
    status: store?.status || '',
  }
}

export async function fetchStores() {
  const stores = await request(apiEndpoints.stores, null, true)
  if (!Array.isArray(stores)) throw new Error('ไม่สามารถโหลดรายการร้านค้าได้')
  return stores.map(sanitizeStore)
}

export async function approveStore(id) {
  const response = await request(apiEndpoints.approveStore(id), null, true)
  if (!response?.store) throw new Error('ไม่สามารถยืนยันข้อมูลร้านค้าที่อนุมัติได้')
  return sanitizeStore(response.store)
}

export async function updateStore(id, updates) {
  const payload = {
    storename: updates.storename.trim(),
    username: updates.username.trim(),
  }
  if (updates.password) payload.password = updates.password

  const response = await request(apiEndpoints.updateStore(id), payload, true)
  return sanitizeStore(response?.data || response)
}

function normalizeOrders(orders) {
  if (!Array.isArray(orders)) throw new Error('ไม่สามารถโหลดรายการคำสั่งซื้อได้')
  return orders.map(order => {
    const id = order?._id || order?.id
    let rawItems = Array.isArray(order?.items) ? order.items : []
    if (!rawItems.length && typeof order?.product === 'string' &&
        Number.isSafeInteger(Number(order.qty)) && Number(order.qty) > 0) {
      rawItems = [{ product: '', name: order.product, qty: Number(order.qty), price: null }]
    }
    if (!id || rawItems.length === 0) {
      throw new Error('พบข้อมูลคำสั่งซื้อในรูปแบบที่ไม่ถูกต้อง')
    }

    const items = rawItems.map(item => {
      const qty = Number(item?.qty)
      const price = item?.price == null ? null : Number(item.price)
      if (typeof item?.name !== 'string' || !Number.isSafeInteger(qty) || qty < 1 ||
          (price !== null && (!Number.isFinite(price) || price < 0))) {
        throw new Error('พบรายการสินค้าในคำสั่งซื้อที่มีรูปแบบไม่ถูกต้อง')
      }

      return {
        productId: String(item.product || ''),
        name: item.name,
        qty,
        price,
        imageurl: item.imageurl || '',
      }
    })
    const createdAt = new Date(order.createdAt)
    return {
      id: String(id),
      items,
      itemCount: items.length,
      totalQty: items.reduce((total, item) => total + item.qty, 0),
      hasTotal: items.every(item => item.price !== null),
      total: items.reduce((total, item) => total + (item.price || 0) * item.qty, 0),
      summary: items.length > 2
        ? `${items.slice(0, 2).map(item => item.name).join(', ')} +${items.length - 2}`
        : items.map(item => item.name).join(', '),
      store: order.store && typeof order.store === 'object'
        ? {
          storename: order.store.storename || '',
          username: order.store.username || '',
        }
        : null,
      createdAt: Number.isNaN(createdAt.getTime()) ? '-' : createdAt.toLocaleString('th-TH'),
    }
  })
}

export async function fetchOrders() {
  return normalizeOrders(unwrapApiData(await request(apiEndpoints.orders, null, true)))
}

export async function fetchAdminOrders() {
  return normalizeOrders(unwrapApiData(await request(apiEndpoints.adminOrders, null, true)))
}

export const fetchProductOrders = id => request(apiEndpoints.productOrders(id), null, true)

export const createProductOrder = (id, qty) => request(
  apiEndpoints.createOrder(id),
  createOrderPayload(qty),
  true,
)

export async function createMultiItemOrder(items) {
  if (!Array.isArray(items) || items.length === 0 ||
      items.some(item => !item?.productId || !Number.isSafeInteger(item.qty) || item.qty < 1)) {
    throw new Error('กรุณาตรวจสอบสินค้าและจำนวนในตะกร้าก่อนสั่งซื้อ')
  }

  return unwrapApiData(await request(
    apiEndpoints.createOrders,
    { items: items.map(({ productId, qty }) => ({ productId, qty })) },
    true,
  ))
}

export const createProductPayload = ({ name, qty, price, imageurl }) => ({
  name: name.trim(),
  qty: Number(qty),
  price: Number(price),
  imageurl: imageurl.trim(),
})

export const createOrderPayload = qty => ({ qty: Number(qty) })

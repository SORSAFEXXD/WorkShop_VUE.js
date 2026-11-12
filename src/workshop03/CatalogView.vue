<template>
  <main class="shop-content">
    <section class="shop-hero">
      <div class="hero-copy">
        <span class="shop-kicker"><i></i> FIND YOUR NEXT PAIR</span>
        <h1>ก้าวให้สุด<br><em>ในสไตล์ของคุณ</em></h1>
        <p>สนีกเกอร์คู่โปรด พร้อมพาคุณไปได้ไกลกว่าเดิม</p>
        <a class="hero-cta" href="#products">เลือกคู่ที่ใช่ <v-icon small>mdi-arrow-down</v-icon></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <span class="hero-art-label">MOVE<br>YOUR<br>WAY</span>
        <v-icon class="hero-shoe">mdi-shoe-sneaker</v-icon>
        <span class="hero-art-number">SOLE<br>01</span>
      </div>
    </section>

    <section id="products" class="catalog-section">
      <div class="catalog-heading">
        <div>
          <span class="shop-kicker">THE SNEAKER EDIT</span>
          <h2>รองเท้าคู่โปรดของคุณ</h2>
        </div>
        <span class="product-count">{{ products.length }} รายการ</span>
      </div>
      <v-alert v-if="productsError" type="error" outlined dense>
        {{ productsError }}
      </v-alert>
      <v-progress-linear v-if="productsLoading" indeterminate color="success" class="mb-4"></v-progress-linear>

      <div class="catalog-layout">
        <div class="product-grid">
          <article v-for="(product, index) in products" :key="product.id" class="product-card">
            <button
              class="product-visual"
              :class="`product-visual-${index + 1}`"
              type="button"
              :aria-label="`ดูรายละเอียด ${product.name}`"
              @click="openProductDetails(product)"
            >
              <img v-if="product.imageurl" class="product-image" :src="product.imageurl" :alt="product.name">
              <span v-else class="product-art-circle"><v-icon>{{ product.icon }}</v-icon></span>
              <span class="product-tag">SOLE PICK</span>
              <span class="product-quick-view">ดูรายละเอียด <v-icon x-small>mdi-arrow-up-right</v-icon></span>
            </button>
            <div class="product-info">
              <button class="product-name" type="button" @click="openProductDetails(product)">
                {{ product.name }}
              </button>
              <span class="product-subtitle">พร้อมส่ง · {{ product.qty }} คู่</span>
              <div class="product-bottom">
                <strong>฿{{ formatPrice(product.price) }}</strong>
                <button
                  class="add-product"
                  type="button"
                  :aria-label="`เพิ่ม ${product.name} ลงตะกร้า`"
                  :disabled="product.qty < 1 || orderBusy"
                  @click="addToCart(product)"
                >
                  <v-icon small>mdi-plus</v-icon>
                </button>
              </div>
              <span class="stock-note">{{ product.qty > 0 ? `เหลือ ${product.qty} คู่` : 'สินค้าหมด' }}</span>
            </div>
          </article>
          <div v-if="!productsLoading && !productsError && !products.length" class="empty-row">
            ยังไม่มีสินค้าในร้าน
          </div>
        </div>

        <aside class="cart-panel">
          <div class="cart-heading">
            <span class="cart-icon"><v-icon>mdi-shopping-outline</v-icon></span>
            <div><span class="shop-kicker">YOUR SNEAKER BAG</span><h2>ถุงช้อปปิ้ง</h2></div>
            <span class="cart-count">{{ cartCount }}</span>
          </div>

          <div v-if="cart.length" class="cart-items">
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <span class="cart-item-icon"><v-icon small>{{ item.icon }}</v-icon></span>
              <div class="cart-item-copy">
                <strong>{{ item.name }}</strong>
                <span>฿{{ formatPrice(item.price) }}</span>
              </div>
              <div class="quantity-control">
                <button
                  type="button"
                  :aria-label="`ลดจำนวน ${item.name}`"
                  :disabled="orderBusy"
                  @click="changeQuantity(item, -1)"
                >−</button>
                <span>{{ item.cartQty }}</span>
                <button
                  type="button"
                  :aria-label="`เพิ่มจำนวน ${item.name}`"
                  :disabled="item.cartQty >= item.qty || orderBusy"
                  @click="changeQuantity(item, 1)"
                >+</button>
              </div>
            </div>
          </div>
          <div v-else class="cart-empty">
            <v-icon>mdi-shopping-outline</v-icon>
            <span>ยังไม่มีรองเท้าในถุงช้อปปิ้ง</span>
            <small>เลือกสนีกเกอร์ที่ชอบแล้วกดปุ่ม +</small>
          </div>

          <div class="cart-total">
            <span>ยอดรวม</span>
            <strong>฿{{ formatPrice(cartTotal) }}</strong>
          </div>
          <v-btn
            class="checkout-button"
            block
            large
            :loading="orderBusy"
            :disabled="!cart.length || orderBusy"
            @click="placeOrder"
          >
            {{ authSession ? 'ยืนยันคำสั่งซื้อ' : 'เข้าสู่ระบบเพื่อสั่งซื้อ' }}
            <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <p v-if="orderMessage" class="cart-message" :class="{ 'is-error': orderError }" role="status">
            {{ orderMessage }}
          </p>
        </aside>
      </div>
    </section>

    <v-dialog v-model="productDialog" max-width="460">
      <v-card v-if="selectedProduct" class="product-dialog">
        <button class="dialog-close" type="button" aria-label="ปิด" @click="productDialog = false">
          <v-icon>mdi-close</v-icon>
        </button>
        <div class="dialog-product-art">
          <img
            v-if="selectedProduct.imageurl"
            class="dialog-product-image"
            :src="selectedProduct.imageurl"
            :alt="selectedProduct.name"
          >
          <span v-else class="product-art-circle"><v-icon>{{ selectedProduct.icon }}</v-icon></span>
        </div>
        <v-card-text class="dialog-product-content">
          <span class="shop-kicker">PRODUCT DETAILS</span>
          <h2>{{ selectedProduct.name }}</h2>
          <p>{{ selectedProduct.description || selectedProduct.name }}</p>
          <div class="dialog-stock">
            <span>พร้อมส่ง</span><strong>{{ selectedProduct.qty }} คู่</strong>
          </div>
          <div class="dialog-price-row">
            <strong>฿{{ formatPrice(selectedProduct.price) }}</strong>
            <v-btn
              class="dialog-add"
              :disabled="selectedProduct.qty < 1 || orderBusy"
              @click="addToCart(selectedProduct)"
            >
              เพิ่มลงตะกร้า <v-icon right small>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import { createMultiItemOrder, fetchProducts, getAuthSession } from './api'

const CART_STORAGE_KEY = 'workshop03.cart'

export default {
  name: 'Workshop03CatalogView',
  data: () => ({
    products: [],
    productsLoading: false,
    productsError: '',
    cart: [],
    savedCart: [],
    selectedProduct: null,
    productDialog: false,
    orderMessage: '',
    orderError: false,
    orderBusy: false,
    authSession: getAuthSession(),
  }),
  created() {
    this.restoreCart()
    this.loadProducts()
  },
  computed: {
    cartCount() {
      return this.cart.reduce((total, item) => total + item.cartQty, 0)
    },
    cartTotal() {
      return this.cart.reduce((total, item) => total + item.price * item.cartQty, 0)
    },
  },
  methods: {
    openProductDetails(product) {
      this.selectedProduct = product
      this.productDialog = true
    },
    async loadProducts() {
      this.productsLoading = true
      this.productsError = ''
      try {
        this.products = await fetchProducts()
        this.restoreCartProducts()
      } catch (error) {
        this.productsError = error.message || 'โหลดสินค้าไม่สำเร็จ'
      } finally {
        this.productsLoading = false
      }
    },
    formatPrice(value) {
      return new Intl.NumberFormat('th-TH').format(value)
    },
    addToCart(product) {
      if (this.orderBusy) return
      const item = this.cart.find(entry => entry.id === product.id)
      if (item) {
        if (item.cartQty < product.qty) item.cartQty += 1
      } else if (product.qty > 0) {
        this.cart.push({ ...product, cartQty: 1 })
      }
      this.orderMessage = ''
      this.orderError = false
      this.persistCart()
    },
    changeQuantity(item, amount) {
      if (this.orderBusy) return
      const nextQuantity = item.cartQty + amount
      if (nextQuantity <= 0) {
        this.cart = this.cart.filter(entry => entry.id !== item.id)
      } else if (nextQuantity <= item.qty) {
        item.cartQty = nextQuantity
      }
      this.persistCart()
    },
    restoreCart() {
      const saved = sessionStorage.getItem(CART_STORAGE_KEY)
      if (!saved) return

      try {
        const items = JSON.parse(saved)
        if (!Array.isArray(items) || items.some(item =>
          typeof item?.productId !== 'string' || !item.productId ||
          !Number.isSafeInteger(item.qty) || item.qty < 1)) {
          throw new Error('ข้อมูลตะกร้าสินค้าไม่ถูกต้อง')
        }
        this.savedCart = items
      } catch (error) {
        sessionStorage.removeItem(CART_STORAGE_KEY)
        this.orderError = true
        this.orderMessage = 'ข้อมูลตะกร้าเสียหาย ระบบล้างข้อมูลตะกร้าแล้ว กรุณาเลือกสินค้าใหม่'
      }
    },
    restoreCartProducts() {
      let removedCount = 0
      let adjustedCount = 0
      const savedItems = this.savedCart.length
        ? this.savedCart
        : this.cart.map(item => ({ productId: item.id, qty: item.cartQty }))
      const productsById = new Map(this.products.map(product => [product.id, product]))
      this.cart = savedItems.reduce((items, savedItem) => {
        const product = productsById.get(savedItem.productId)
        if (!product || product.qty < 1) {
          removedCount += 1
          return items
        }

        const cartQty = Math.min(savedItem.qty, product.qty)
        if (cartQty !== savedItem.qty) adjustedCount += 1
        items.push({ ...product, cartQty })
        return items
      }, [])
      this.savedCart = []
      this.persistCart()

      if ((removedCount || adjustedCount) && !this.orderError) {
        this.orderError = false
        this.orderMessage = removedCount
          ? `นำสินค้า ${removedCount} รายการที่หมดสต็อกหรือถูกลบออกจากตะกร้าแล้ว`
          : 'ปรับจำนวนในตะกร้าตามสต็อกล่าสุดแล้ว'
      }
    },
    persistCart() {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(
        this.cart.map(item => ({ productId: item.id, qty: item.cartQty })),
      ))
    },
    async placeOrder() {
      if (!this.cart.length || this.orderBusy) return
      if (!getAuthSession()) {
        this.authSession = null
        this.orderError = false
        this.orderMessage = 'เข้าสู่ระบบก่อน แล้วกลับมายืนยันคำสั่งซื้อได้เลย'
        await this.$router.push('/workshop3/login')
        return
      }

      this.orderBusy = true
      this.orderError = false
      this.orderMessage = ''
      try {
        const order = await createMultiItemOrder(this.cart.map(item => ({
          productId: item.id,
          qty: item.cartQty,
        })))
        const orderId = order?._id || order?.id
        if (!orderId) throw new Error('สร้างคำสั่งซื้อแล้ว แต่ไม่พบเลขที่คำสั่งซื้อ')

        const itemCount = this.cart.length
        this.cart = []
        this.persistCart()
        this.orderMessage = `สั่งซื้อสำเร็จ เลขที่ #${orderId} (${itemCount} รายการ)`
        await this.loadProducts()
        await this.$router.push({
          path: '/workshop3/orders',
          query: { created: String(orderId) },
        })
      } catch (error) {
        this.orderError = true
        this.orderMessage = error.message || 'สร้างคำสั่งซื้อไม่สำเร็จ กรุณาลองอีกครั้ง'
        await this.loadProducts()
      } finally {
        this.orderBusy = false
      }
    },
  },
}
</script>

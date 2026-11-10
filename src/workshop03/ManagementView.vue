<template>
  <main class="shop-content management-page">
    <header class="management-heading">
      <div>
        <span class="shop-kicker">SOLE STUDIO CONTROL CENTER</span>
        <h1>จัดการร้าน<span>รองเท้า</span></h1>
        <p>จัดการรุ่นรองเท้า สต็อก และคำสั่งซื้อในหน้าเดียว</p>
      </div>
      <span class="demo-badge"><i></i> จัดการร้านค้า</span>
    </header>

    <div class="management-tabs" role="tablist" aria-label="จัดการร้าน">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="{ 'is-active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <v-icon small>{{ tab.icon }}</v-icon>
        {{ tab.label }}
        <span>{{ counts[tab.id] }}</span>
      </button>
    </div>

    <section v-if="activeTab === 'products'" class="management-panel">
      <v-alert v-if="productError" type="error" outlined dense>
        {{ productError }}
      </v-alert>
      <div class="panel-heading">
        <div><span class="shop-kicker">SNEAKER INVENTORY</span><h2>รุ่นรองเท้า</h2></div>
        <v-btn class="primary-action" :disabled="productsLoading" @click="openProductForm()">
          <v-icon left small>mdi-plus</v-icon> เพิ่มสินค้า
        </v-btn>
      </div>
      <v-progress-linear v-if="productsLoading" indeterminate color="success" class="mb-4"></v-progress-linear>
      <div class="table-wrap">
        <table class="management-table">
          <thead><tr><th>รุ่นรองเท้า</th><th>รหัสรุ่น</th><th>คงเหลือ</th><th>ราคา</th><th>จัดการ</th></tr></thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td><span class="table-product-icon"><v-icon small>{{ product.icon }}</v-icon></span><strong>{{ product.name }}</strong></td>
              <td class="table-muted">{{ product.id }}</td>
              <td><span class="stock-pill" :class="{ 'is-low': product.qty < 6 }">{{ product.qty }} คู่</span></td>
              <td class="table-muted">฿{{ formatPrice(product.price) }}</td>
              <td class="table-actions">
                <button type="button" aria-label="แก้ไขสินค้า" :disabled="productBusy" @click="openProductForm(product)"><v-icon small>mdi-pencil-outline</v-icon></button>
                <button type="button" aria-label="ลบสินค้า" :disabled="productBusy" @click="deleteProduct(product)"><v-icon small>mdi-trash-can-outline</v-icon></button>
              </td>
            </tr>
            <tr v-if="!productsLoading && !products.length"><td colspan="5" class="empty-row">ยังไม่มีรุ่นรองเท้า เพิ่มสินค้าเพื่อเริ่มต้น</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="activeTab === 'stores'" class="management-panel">
      <v-alert v-if="storeError" type="error" outlined dense>
        {{ storeError }}
      </v-alert>
      <div class="panel-heading">
        <div><span class="shop-kicker">STORE ACCOUNTS</span><h2>บัญชีร้านรองเท้า</h2></div>
        <span class="pending-summary"><v-icon small>mdi-clock-outline</v-icon> รออนุมัติ {{ pendingStores }}</span>
      </div>
      <v-progress-linear v-if="storesLoading" indeterminate color="success" class="mb-4"></v-progress-linear>
      <div class="store-list">
        <article v-for="store in stores" :key="store.id" class="store-row">
          <span class="store-avatar"><v-icon>mdi-storefront-outline</v-icon></span>
          <div class="store-details"><strong>{{ store.storename }}</strong><span>@{{ store.username }}</span></div>
          <span
            class="store-status"
            :class="{ 'is-approved': store.status === 'approve', 'is-admin': store.status === 'admin' }"
          >
            <i></i>{{ store.status === 'admin' ? 'ผู้ดูแลระบบ' : (store.status === 'approve' ? 'อนุมัติแล้ว' : 'รอตรวจสอบ') }}
          </span>
          <div class="store-actions">
            <button type="button" aria-label="แก้ไขร้านค้า" :disabled="storeBusy" @click="openStoreForm(store)"><v-icon small>mdi-pencil-outline</v-icon></button>
            <v-btn
              v-if="store.status !== 'approve' && store.status !== 'admin'"
              small
              outlined
              color="success"
              :loading="storeBusyId === store.id"
              :disabled="storeBusy"
              @click="approveStoreAccount(store)"
            >
              อนุมัติร้าน
            </v-btn>
          </div>
        </article>
        <div v-if="!storesLoading && !stores.length" class="empty-row">ไม่พบข้อมูลร้านค้า</div>
      </div>
      <v-alert class="security-note" type="info" outlined dense>
        ข้อมูลรหัสผ่านถูกซ่อนเพื่อความปลอดภัย
      </v-alert>
    </section>

    <section v-else class="management-panel">
      <v-alert v-if="orderError" type="error" outlined dense>
        {{ orderError }}
      </v-alert>
      <div class="panel-heading">
        <div><span class="shop-kicker">ORDERS</span><h2>คำสั่งซื้อ</h2></div>
        <div class="store-actions">
          <span class="orders-total"><v-icon small>mdi-receipt-text-outline</v-icon> {{ orders.length }} รายการ</span>
          <button type="button" aria-label="โหลดคำสั่งซื้อใหม่" :disabled="ordersLoading" @click="loadOrders">
            <v-icon small>mdi-refresh</v-icon>
          </button>
        </div>
      </div>
      <v-progress-linear v-if="ordersLoading" indeterminate color="success" class="mb-4"></v-progress-linear>
      <div class="order-list">
        <article v-for="order in orders" :key="order.id" class="order-row">
          <span class="order-icon"><v-icon>mdi-package-variant-closed</v-icon></span>
          <div class="order-details">
            <strong>{{ order.summary }}</strong>
            <span>คำสั่งซื้อ #{{ order.id }} · {{ order.itemCount }} รายการ · {{ order.createdAt }}</span>
            <span v-if="order.store">
              ร้าน {{ order.store.storename || order.store.username }}
              <template v-if="order.store.storename && order.store.username"> · @{{ order.store.username }}</template>
            </span>
            <span v-else>คำสั่งซื้อเก่า · ไม่มีข้อมูลร้านเจ้าของ</span>
          </div>
          <span class="order-qty">รวม <strong>{{ order.totalQty }} คู่</strong></span>
          <button
            type="button"
            class="order-detail-button"
            @click="openOrderDetails(order)"
          >
            ดูคำสั่งซื้อ <v-icon small>mdi-arrow-up-right</v-icon>
          </button>
        </article>
        <div v-if="!ordersLoading && !orders.length" class="empty-row">
          ยังไม่พบคำสั่งซื้อในระบบ
        </div>
      </div>
    </section>

    <v-dialog v-model="productDialog" max-width="460">
      <v-card class="management-dialog">
        <v-card-title>{{ editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="productForm.name" label="ชื่อสินค้า" outlined autofocus></v-text-field>
          <v-text-field v-model="productForm.qty" label="จำนวนรองเท้าคงเหลือ (คู่)" type="number" min="0" outlined></v-text-field>
          <v-text-field v-model="productForm.price" label="ราคา" type="number" min="0" step="0.01" outlined></v-text-field>
          <v-text-field v-model="productForm.imageurl" label="URL รูปรองเท้า (ไม่บังคับ)" outlined></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :disabled="productBusy" @click="productDialog = false">ยกเลิก</v-btn>
          <v-btn class="primary-action" :loading="productBusy" :disabled="productBusy" @click="saveProduct">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="storeDialog" max-width="460">
      <v-card class="management-dialog">
        <v-card-title>แก้ไขข้อมูลร้านค้า</v-card-title>
        <v-card-text>
          <v-text-field v-model="storeForm.storename" label="ชื่อร้านค้า" outlined></v-text-field>
          <v-text-field v-model="storeForm.username" label="ชื่อผู้ใช้" outlined></v-text-field>
          <v-text-field
            v-model="storeForm.password"
            label="รหัสผ่านใหม่ (ไม่บังคับ)"
            type="password"
            autocomplete="new-password"
            outlined
          ></v-text-field>
          <small class="helper-caption">เว้นรหัสผ่านว่างไว้หากไม่ต้องการเปลี่ยน</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text :disabled="storeBusy" @click="storeDialog = false">ยกเลิก</v-btn>
          <v-btn class="primary-action" :loading="storeBusy" :disabled="storeBusy" @click="saveStore">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="orderDialog" max-width="420">
      <v-card class="management-dialog">
        <v-card-title>รายละเอียดคำสั่งซื้อ</v-card-title>
        <v-card-text v-if="selectedOrder">
          <div class="order-dialog-items">
            <div v-for="item in selectedOrder.items" :key="`${selectedOrder.id}-${item.productId}-${item.name}`" class="order-dialog-item">
              <span>
                <strong>{{ item.name }}</strong>
                <small>{{ item.price === null ? 'ไม่มีข้อมูลราคาเดิม' : `฿${formatPrice(item.price)} / คู่` }}</small>
              </span>
              <strong>{{ item.qty }} คู่</strong>
            </div>
          </div>
          <p v-if="selectedOrder.hasTotal" class="order-dialog-total">
            รวม {{ selectedOrder.totalQty }} คู่
            <strong>฿{{ formatPrice(selectedOrder.total) }}</strong>
          </p>
          <p v-else class="order-dialog-total">
            รวม {{ selectedOrder.totalQty }} คู่
            <strong>ไม่มีข้อมูลราคาใน order เดิม</strong>
          </p>
          <p class="helper-caption">รหัสคำสั่งซื้อ #{{ selectedOrder.id }} · {{ selectedOrder.createdAt }}</p>
        </v-card-text>
        <v-card-actions><v-spacer></v-spacer><v-btn text @click="orderDialog = false">ปิด</v-btn></v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="2600" color="success">
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }"><v-btn text v-bind="attrs" @click="snackbar = false">ปิด</v-btn></template>
    </v-snackbar>
  </main>
</template>

<script>
import {
  approveStore as approveStoreRequest,
  createProduct,
  deleteProduct as deleteProductRequest,
  fetchStores,
  fetchProducts,
  fetchAdminOrders,
  updateAuthStore,
  updateStore as updateStoreRequest,
  updateProduct,
} from './api'

export default {
  name: 'Workshop03ManagementView',
  data: () => ({
    activeTab: 'products',
    tabs: [
      { id: 'products', label: 'สินค้า', icon: 'mdi-package-variant-closed' },
      { id: 'stores', label: 'ร้านค้า', icon: 'mdi-store-outline' },
      { id: 'orders', label: 'คำสั่งซื้อ', icon: 'mdi-receipt-text-outline' },
    ],
    products: [],
    productsLoading: false,
    productBusy: false,
    productError: '',
    stores: [],
    storesLoading: false,
    storeBusy: false,
    storeBusyId: '',
    storeError: '',
    orders: [],
    ordersLoading: false,
    orderError: '',
    productDialog: false,
    storeDialog: false,
    orderDialog: false,
    editingProduct: null,
    editingStore: null,
    productForm: { name: '', qty: 0, price: 0, imageurl: '' },
    storeForm: { storename: '', username: '', password: '' },
    selectedOrder: null,
    snackbar: false,
    snackbarMessage: '',
  }),
  computed: {
    pendingStores() {
      return this.stores.filter(store => !['approve', 'admin'].includes(store.status)).length
    },
    counts() {
      return {
        products: this.products.length,
        stores: this.stores.length,
        orders: this.orders.length,
      }
    },
  },
  created() {
    this.loadProducts()
    this.loadStores()
    this.loadOrders()
  },
  methods: {
    formatPrice(value) {
      return new Intl.NumberFormat('th-TH').format(value)
    },
    openProductForm(product) {
      this.productError = ''
      this.editingProduct = product || null
      this.productForm = product
        ? {
          name: product.name,
          qty: product.qty,
          price: product.price,
          imageurl: product.imageurl || '',
        }
        : { name: '', qty: 0, price: 0, imageurl: '' }
      this.productDialog = true
    },
    async loadProducts() {
      this.productsLoading = true
      this.productError = ''
      try {
        this.products = await fetchProducts()
      } catch (error) {
        this.productError = error.message || 'โหลดสินค้าไม่สำเร็จ'
      } finally {
        this.productsLoading = false
      }
    },
    async loadStores() {
      this.storesLoading = true
      this.storeError = ''
      try {
        this.stores = await fetchStores()
      } catch (error) {
        this.storeError = error.message || 'โหลดบัญชีร้านค้าไม่สำเร็จ'
      } finally {
        this.storesLoading = false
      }
    },
    async loadOrders() {
      this.ordersLoading = true
      this.orderError = ''
      try {
        this.orders = await fetchAdminOrders()
      } catch (error) {
        this.orderError = error.message || 'โหลดคำสั่งซื้อไม่สำเร็จ'
      } finally {
        this.ordersLoading = false
      }
    },
    async saveProduct() {
      const payload = {
        ...this.productForm,
        name: this.productForm.name.trim(),
        qty: Number(this.productForm.qty),
        price: Number(this.productForm.price),
        imageurl: this.productForm.imageurl.trim(),
      }
      if (!payload.name || !Number.isInteger(payload.qty) || payload.qty < 0 ||
          !Number.isFinite(payload.price) || payload.price < 0) {
        this.productError = 'กรุณากรอกชื่อสินค้า จำนวนเต็มตั้งแต่ 0 และราคาที่ไม่ติดลบ'
        return
      }

      this.productBusy = true
      this.productError = ''
      try {
        if (this.editingProduct) {
          const updated = await updateProduct(this.editingProduct.id, payload)
          const index = this.products.findIndex(product => product.id === this.editingProduct.id)
          if (index !== -1) this.$set(this.products, index, updated)
          this.notify('อัปเดตสินค้าแล้ว')
        } else {
          const created = await createProduct(payload)
          this.products.push(created)
          this.notify('เพิ่มสินค้าแล้ว')
        }
        this.productDialog = false
      } catch (error) {
        this.productError = error.message || 'บันทึกสินค้าไม่สำเร็จ'
      } finally {
        this.productBusy = false
      }
    },
    async deleteProduct(product) {
      this.productBusy = true
      this.productError = ''
      try {
        await deleteProductRequest(product.id)
        this.products = this.products.filter(item => item.id !== product.id)
        this.notify('ลบสินค้าแล้ว')
      } catch (error) {
        this.productError = error.message || 'ลบสินค้าไม่สำเร็จ'
      } finally {
        this.productBusy = false
      }
    },
    openStoreForm(store) {
      this.editingStore = store
      this.storeForm = { storename: store.storename, username: store.username, password: '' }
      this.storeDialog = true
    },
    async saveStore() {
      if (!this.storeForm.storename.trim() || !this.storeForm.username.trim()) {
        this.storeError = 'กรุณากรอกชื่อร้านและชื่อผู้ใช้'
        return
      }

      this.storeBusy = true
      this.storeError = ''
      try {
        const updatedStore = await updateStoreRequest(this.editingStore.id, this.storeForm)
        const index = this.stores.findIndex(store => store.id === updatedStore.id)
        if (index !== -1) this.$set(this.stores, index, updatedStore)
        updateAuthStore(updatedStore)
        this.storeDialog = false
        this.notify('อัปเดตข้อมูลร้านค้าแล้ว')
      } catch (error) {
        this.storeError = error.message || 'อัปเดตร้านค้าไม่สำเร็จ'
      } finally {
        this.storeBusy = false
      }
    },
    async approveStoreAccount(store) {
      this.storeBusy = true
      this.storeBusyId = store.id
      this.storeError = ''
      try {
        const approvedStore = await approveStoreRequest(store.id)
        const index = this.stores.findIndex(item => item.id === approvedStore.id)
        if (index !== -1) this.$set(this.stores, index, approvedStore)
        this.notify('อนุมัติร้านค้าแล้ว')
      } catch (error) {
        this.storeError = error.message || 'อนุมัติร้านค้าไม่สำเร็จ'
      } finally {
        this.storeBusy = false
        this.storeBusyId = ''
      }
    },
    openOrderDetails(order) {
      this.selectedOrder = order
      this.orderDialog = true
    },
    notify(message) {
      this.snackbarMessage = message
      this.snackbar = true
    },
  },
}
</script>

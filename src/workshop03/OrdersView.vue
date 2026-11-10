<template>
  <main class="shop-content management-page">
    <header class="management-heading">
      <div>
        <span class="shop-kicker">YOUR ORDER HISTORY</span>
        <h1>คำสั่งซื้อ<span>ของฉัน</span></h1>
        <p>ตรวจสอบรายการและยอดรวมของคำสั่งซื้อที่ทำจากบัญชีนี้</p>
      </div>
      <router-link to="/workshop3" class="order-detail-button">
        <v-icon small>mdi-arrow-left</v-icon> กลับไปเลือกสินค้า
      </router-link>
    </header>

    <v-alert v-if="$route.query.created" type="success" outlined dense>
      สั่งซื้อสำเร็จแล้ว · เลขที่คำสั่งซื้อ #{{ $route.query.created }}
    </v-alert>
    <v-alert v-if="orderError" type="error" outlined dense>{{ orderError }}</v-alert>

    <section class="management-panel">
      <div class="panel-heading">
        <div><span class="shop-kicker">ORDER HISTORY</span><h2>รายการคำสั่งซื้อ</h2></div>
        <span class="orders-total"><v-icon small>mdi-receipt-text-outline</v-icon> {{ orders.length }} รายการ</span>
      </div>
      <v-progress-linear v-if="ordersLoading" indeterminate color="success" class="mb-4"></v-progress-linear>
      <div class="order-list">
        <article v-for="order in orders" :key="order.id" class="order-row">
          <span class="order-icon"><v-icon>mdi-package-variant-closed</v-icon></span>
          <div class="order-details">
            <strong>{{ order.summary }}</strong>
            <span>คำสั่งซื้อ #{{ order.id }} · {{ order.itemCount }} รายการ · {{ order.createdAt }}</span>
          </div>
          <span class="order-qty">รวม <strong>{{ order.totalQty }} คู่</strong></span>
          <button type="button" class="order-detail-button" @click="selectedOrder = order">
            ดูรายละเอียด <v-icon small>mdi-arrow-up-right</v-icon>
          </button>
        </article>
        <div v-if="!ordersLoading && !orderError && !orders.length" class="empty-row">
          ยังไม่มีคำสั่งซื้อจากบัญชีนี้
        </div>
      </div>
    </section>

    <v-dialog :value="Boolean(selectedOrder)" max-width="460" @input="closeDetails">
      <v-card v-if="selectedOrder" class="management-dialog">
        <v-card-title>รายละเอียดคำสั่งซื้อ</v-card-title>
        <v-card-text>
          <div class="order-dialog-items">
            <div
              v-for="(item, index) in selectedOrder.items"
              :key="`${selectedOrder.id}-${item.productId}-${index}`"
              class="order-dialog-item"
            >
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
        <v-card-actions><v-spacer></v-spacer><v-btn text @click="selectedOrder = null">ปิด</v-btn></v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import { fetchOrders } from './api'

export default {
  name: 'Workshop03OrdersView',
  data: () => ({
    orders: [],
    ordersLoading: false,
    orderError: '',
    selectedOrder: null,
  }),
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.ordersLoading = true
      this.orderError = ''
      try {
        this.orders = await fetchOrders()
      } catch (error) {
        this.orderError = error.message || 'โหลดคำสั่งซื้อไม่สำเร็จ'
      } finally {
        this.ordersLoading = false
      }
    },
    closeDetails(open) {
      if (!open) this.selectedOrder = null
    },
    formatPrice(value) {
      return new Intl.NumberFormat('th-TH').format(value)
    },
  },
}
</script>

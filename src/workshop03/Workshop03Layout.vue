<template>
  <div class="workshop3">
    <header class="shop-header">
      <router-link to="/workshop3" class="shop-brand" aria-label="Workshop Shop home">
        <span class="shop-brand-mark"><v-icon>mdi-shoe-sneaker</v-icon></span>
        <span><strong>SOLE</strong>STUDIO<small>WORKSHOP 03 · SNEAKER SHOP</small></span>
      </router-link>

      <nav class="shop-nav" aria-label="Shop navigation">
        <router-link to="/workshop3" exact>หน้าร้าน</router-link>
        <router-link v-if="authSession" to="/workshop3/orders">คำสั่งซื้อ</router-link>
        <router-link v-if="isAdmin" to="/workshop3/manage">จัดการระบบ</router-link>
      </nav>

      <div class="shop-account">
        <template v-if="authSession">
          <span class="shop-user">
            <v-icon small>{{ isAdmin ? 'mdi-shield-account-outline' : 'mdi-account-circle-outline' }}</v-icon>
            {{ authSession.store.storename || authSession.store.username || 'บัญชีร้านค้า' }}
            <small v-if="isAdmin" class="admin-label">ADMIN</small>
          </span>
          <button type="button" class="shop-logout" @click="logout">ออกจากระบบ</button>
        </template>
        <template v-else>
          <router-link to="/workshop3/login" class="shop-login">เข้าสู่ระบบ</router-link>
          <router-link to="/workshop3/register" class="shop-register">สมัครสมาชิก</router-link>
          <router-link
            v-if="$route.path !== '/workshop3/admin/login'"
            to="/workshop3/admin/login"
            class="admin-login-link"
          >
            <v-icon x-small>mdi-shield-lock-outline</v-icon> Admin
          </router-link>
        </template>
      </div>
    </header>

    <router-view />

    <footer class="shop-footer">
      <span>SOLE STUDIO <i>·</i> WORKSHOP 03</span>
      <span>รองเท้าคู่ที่ใช่ สำหรับทุกวันของคุณ</span>
    </footer>
  </div>
</template>

<script>
import { clearAuthSession, getAuthSession } from './api'

export default {
  name: 'Workshop03Layout',
  data: () => ({
    authSession: getAuthSession(),
  }),
  computed: {
    isAdmin() {
      return this.authSession?.store.status === 'admin'
    },
  },
  mounted() {
    window.addEventListener('workshop03-auth-changed', this.refreshAuthSession)
  },
  beforeDestroy() {
    window.removeEventListener('workshop03-auth-changed', this.refreshAuthSession)
  },
  methods: {
    refreshAuthSession() {
      this.authSession = getAuthSession()
    },
    logout() {
      clearAuthSession()
      if (this.$route.path !== '/workshop3') this.$router.push('/workshop3')
    },
  },
}
</script>

<style src="./workshop03.css"></style>

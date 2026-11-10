<template>
  <main class="shop-auth-page">
    <section class="auth-card">
      <div class="auth-intro">
        <span class="auth-icon">
          <v-icon>{{ isAdminLogin ? 'mdi-shield-lock-outline' : (isRegister ? 'mdi-shoe-sneaker' : 'mdi-lock-outline') }}</v-icon>
        </span>
        <span class="shop-kicker">{{ isAdminLogin ? 'ADMINISTRATOR ACCESS' : (isRegister ? 'OPEN YOUR SNEAKER SHOP' : 'WELCOME BACK') }}</span>
        <h1>{{ isAdminLogin ? 'เข้าสู่ระบบผู้ดูแล' : (isRegister ? 'เปิดร้านรองเท้าของคุณ' : 'ยินดีต้อนรับกลับมา') }}</h1>
        <p>{{ isAdminLogin ? 'เข้าสู่ระบบด้วยบัญชีที่กำหนดสิทธิ์ Admin ในระบบแล้ว' : (isRegister ? 'สร้างบัญชีร้านค้า แล้วเริ่มจัดการรองเท้าและสต็อกได้ในที่เดียว' : 'เข้าสู่ระบบเพื่อจัดการร้านรองเท้าและคำสั่งซื้อ') }}</p>
      </div>
      <v-alert v-if="isAdminLogin" type="info" outlined dense class="auth-alert">
        ต้องใช้บัญชีที่ได้รับสิทธิ์ผู้ดูแลระบบแล้ว หน้านี้ไม่สามารถเปลี่ยนสิทธิ์บัญชีได้
      </v-alert>

      <v-alert v-if="successMessage" type="success" outlined dense class="auth-alert">
        {{ successMessage }}
      </v-alert>
      <v-alert v-if="errorMessage" type="error" outlined dense class="auth-alert">
        {{ errorMessage }}
      </v-alert>

      <form class="auth-form" @submit.prevent="submitForm">
        <v-text-field
          v-if="isRegister"
          v-model="form.storename"
          label="ชื่อร้านค้า"
          placeholder="เช่น Sole Studio"
          prepend-inner-icon="mdi-shoe-sneaker"
          outlined
          required
          autocomplete="organization"
          :disabled="loading"
        ></v-text-field>
        <v-text-field
          v-model="form.username"
          label="ชื่อผู้ใช้"
          placeholder="กรอกชื่อผู้ใช้"
          prepend-inner-icon="mdi-account-outline"
          outlined
          required
          autocomplete="username"
          :disabled="loading"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          label="รหัสผ่าน"
          placeholder="กรอกรหัสผ่าน"
          prepend-inner-icon="mdi-key-outline"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          outlined
          required
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          :disabled="loading"
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <label v-if="isRegister" class="upload-field" :class="{ 'is-disabled': loading }">
          <span class="upload-icon"><v-icon>mdi-image-plus-outline</v-icon></span>
          <span>
            <strong>{{ form.image ? form.image.name : 'รูปหน้าร้าน (ไม่บังคับ)' }}</strong>
            <small>เลือกรูปหน้าร้านรองเท้าของคุณ</small>
          </span>
          <input type="file" accept="image/*" :disabled="loading" @change="selectImage">
        </label>

        <v-btn class="auth-submit" type="submit" large block :loading="loading" :disabled="loading">
          {{ loading ? 'กำลังเชื่อมต่อ...' : (isRegister ? 'เปิดร้านรองเท้า' : 'เข้าสู่ระบบ') }}
          <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
      </form>

      <div class="auth-switch">
        <span>{{ isAdminLogin ? 'เข้าสู่ระบบร้านค้าทั่วไป?' : (isRegister ? 'มีบัญชีร้านค้าแล้ว?' : 'ยังไม่มีบัญชีร้านรองเท้า?') }}</span>
        <router-link :to="isAdminLogin ? '/workshop3/login' : (isRegister ? '/workshop3/login' : '/workshop3/register')">
          {{ isAdminLogin ? 'เข้าสู่ระบบร้านค้า' : (isRegister ? 'เข้าสู่ระบบ' : 'สมัครร้านค้า') }}
        </router-link>
      </div>
      <div v-if="!isAdminLogin && !isRegister" class="auth-admin-switch">
        <router-link to="/workshop3/admin/login">เข้าสู่ระบบผู้ดูแลระบบ</router-link>
      </div>

    </section>
  </main>
</template>

<script>
import { loginStore, registerStore, saveAuthSession } from './api'

export default {
  name: 'Workshop03AuthView',
  data: () => ({
    form: { storename: '', username: '', password: '', image: null },
    showPassword: false,
    loading: false,
    successMessage: '',
    errorMessage: '',
  }),
  computed: {
    isRegister() {
      return this.$route.meta.authMode === 'register'
    },
    isAdminLogin() {
      return this.$route.meta.authMode === 'admin-login'
    },
  },
  watch: {
    '$route.meta.authMode'() {
      this.resetForm()
      this.successMessage = ''
      this.errorMessage = ''
    },
  },
  methods: {
    selectImage(event) {
      this.form.image = event.target.files[0] || null
      this.successMessage = ''
      this.errorMessage = ''
    },
    resetForm() {
      this.form = { storename: '', username: '', password: '', image: null }
      this.showPassword = false
    },
    async submitForm() {
      if (this.loading) return

      this.loading = true
      this.successMessage = ''
      this.errorMessage = ''

      try {
        if (this.isRegister) {
          await registerStore(this.form)
          this.resetForm()
          await this.$router.push('/workshop3/login')
        } else {
          const response = await loginStore(this.form)
          if (this.isAdminLogin && response.store?.status !== 'admin') {
            throw new Error('บัญชีนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ กรุณาใช้บัญชี Admin')
          }
          saveAuthSession(response)
          this.resetForm()
          const requestedPath = this.$route.query.redirect
          let destination = response.store?.status === 'admin' ? '/workshop3/manage' : '/workshop3'
          if (this.isAdminLogin) destination = '/workshop3/manage'
          else if (typeof requestedPath === 'string' && requestedPath.startsWith('/workshop3/')) {
            destination = requestedPath
          }
          await this.$router.push(destination)
        }
      } catch (error) {
        this.errorMessage = error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

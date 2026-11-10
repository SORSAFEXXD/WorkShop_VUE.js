<template>
  <main class="profile-page" :class="{ 'is-ready': ready }">
    <!-- scroll progress -->
    <div class="scroll-progress" aria-hidden="true">
      <span class="sp-bar" :style="{ transform: `scaleX(${progress})` }"></span>
    </div>

    <!-- custom cursor -->
    <div
      v-if="!touch"
      class="cursor-dot"
      :class="{ 'is-active': cursorActive }"
      :style="{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }"
      aria-hidden="true"
    ></div>
    <div
      v-if="!touch"
      class="cursor-ring"
      :class="{ 'is-active': cursorActive, 'is-hover': cursorHover }"
      :style="{ transform: `translate3d(${ring.x}px, ${ring.y}px, 0)` }"
      aria-hidden="true"
    ></div>

    <!-- moving background -->
    <div class="bg-aurora" aria-hidden="true"></div>
    <div class="bg-orb orb-1" aria-hidden="true"></div>
    <div class="bg-orb orb-2" aria-hidden="true"></div>
    <div class="bg-orb orb-3" aria-hidden="true"></div>

    <v-container class="profile-container">
      <div class="page-kicker reveal" data-tilt>
        <span class="kicker-line"></span>
        <span class="kicker-text split">
          <span v-for="(ch, i) in 'PERSONAL PROFILE'" :key="i" :style="{ '--i': i }">{{ ch }}</span>
        </span>
        <span class="kicker-index">NO. 01 / 2026</span>
      </div>

      <div
        class="profile-marquee reveal"
        role="img"
        aria-label="แนะนำตัว เซฟ จบจากมหาวิทยาลัยแม่โจ้ ชอบฟุตบอล ออกกำลังกาย เล่นเกม ฟังเพลง ดูหนัง และอ่านการ์ตูน"
      >
        <div class="marquee-track" aria-hidden="true">
          <div v-for="copy in 2" :key="copy" class="marquee-group">
            <span class="mk" data-hover>สวัสดีครับ ผมชื่อเซฟ</span><b>✳</b>
            <span class="mk is-outline" data-hover>MAEJO UNIVERSITY</span><b>✳</b>
            <span class="mk" data-hover>ชอบฟุตบอล</span><b>✳</b>
            <span class="mk is-outline" data-hover>ออกกำลังกาย · เล่นเกม · ฟังเพลง · ดูหนัง · อ่านการ์ตูน</span><b>✳</b>
          </div>
        </div>
      </div>

      <section class="hero-layout">
        <div class="hero-copy" :style="parallax.copy">
          <div class="hero-intro reveal" style="--d: 80ms">
            <span class="hello-chip" data-magnetic><span></span> สวัสดีครับ ผมชื่อ</span>
            <span class="hero-caption">NICE TO MEET YOU</span>
          </div>

          <h1 class="hero-nickname reveal" style="--d: 160ms" data-tilt>
            <span class="nick-fill">SAFE</span>
            <span class="hero-period">.</span>
            <span class="nick-ghost" aria-hidden="true">SAFE</span>
          </h1>

          <div class="hero-name reveal" style="--d: 240ms">
            <span class="split">
              <span v-for="(ch, i) in 'THANAPAT'" :key="`a${i}`" :style="{ '--i': i }">{{ ch }}</span>
            </span>
            <span class="split is-soft">
              <span v-for="(ch, i) in 'SIRIPRAPASUK'" :key="`b${i}`" :style="{ '--i': i + 4 }">{{ ch }}</span>
            </span>
          </div>

          <h1 class="hero-description reveal" style="--d: 300ms">
            Frontend devloper 
          </h1>

          <div class="hero-facts reveal" style="--d: 360ms">
            <button class="hero-fact" type="button" data-magnetic @click="openDialog('education')">
              <v-icon small>mdi-school-outline</v-icon>
              <span>มหาวิทยาลัยแม่โจ้</span>
            </button>
            <div class="hero-fact" data-magnetic>
              <v-icon small>mdi-soccer</v-icon>
              <span>ฟุตบอล</span>
            </div>
          </div>
        </div>

        <div
          class="hero-art tilt-3d reveal"
          :style="{ '--d': '120ms', ...parallax.art }"
          data-tilt
          aria-label="ภาพของเซฟ"
        >
          <div class="art-grid"></div>
          <div class="art-rings" aria-hidden="true">
            <span class="art-orbit orbit-outer"></span>
            <span class="art-orbit orbit-mid"></span>
            <span class="art-orbit orbit-inner"></span>
            <span class="orbit-dash dash-a"></span>
            <span class="orbit-dash dash-b"></span>
            <span class="orbit-dot dot-a"></span>
            <span class="orbit-dot dot-b"></span>
            <span class="orbit-dot dot-c"></span>
          </div>
          <div class="art-spotlight" aria-hidden="true"></div>

          <div class="art-photo" data-tilt>
            <img :src="profileImage" alt="เซฟนั่งพักผ่อนริมทาง" />
            <span class="photo-shine" aria-hidden="true"></span>
            <span class="photo-frame" aria-hidden="true"></span>
          </div>

          <div class="art-side-label">S A F E</div>

          <div class="art-sticker" data-magnetic>
            <span class="sticker-star">✳</span>
            <span>GOOD<br />VIBES<br />ONLY</span>
          </div>

          <div class="art-number">01</div>
          <div class="art-caption">THE STORY OF SAFE</div>
          <span class="art-glint" aria-hidden="true"></span>
        </div>
      </section>

      <section class="hobby-section">
        <div class="section-topline reveal">
          <div>
            <span class="section-overline">OFF THE CLOCK</span>
            <h2 class="split-line">
              <span class="split"><span v-for="(ch, i) in 'เวลาว่างของผม'" :key="`c${i}`" :style="{ '--i': i }">{{ ch }}</span></span>
              <span class="split is-soft"><span v-for="(ch, i) in 'มีไว้ทำอะไร?'" :key="`d${i}`" :style="{ '--i': i + 8 }">{{ ch }}</span></span>
            </h2>
          </div>
          <span class="section-count">05 THINGS I ENJOY</span>
        </div>

        <div class="hobby-grid">
          <v-card
            v-for="(hobby, index) in hobbies"
            :key="hobby.label"
            class="hobby-tile tilt-3d reveal"
            :class="`hobby-tone-${index + 1}`"
            :style="{ '--d': `${index * 70}ms` }"
            data-tilt
            flat
          >
            <span class="tile-sheen" aria-hidden="true"></span>
            <span class="tile-corner" aria-hidden="true"></span>
            <span class="hobby-index">0{{ index + 1 }}</span>
            <div class="hobby-icon">
              <span class="icon-ring" aria-hidden="true"></span>
              <v-icon>{{ hobby.icon }}</v-icon>
            </div>
            <h3>{{ hobby.label }}</h3>
            <span class="hobby-arrow" data-hover>
              <v-icon small>mdi-arrow-up-right</v-icon>
            </span>
          </v-card>
        </div>
      </section>

      <section class="bottom-grid">
        <ProfileDetailCard
          class="education-panel tilt-3d reveal"
          style="--d: 60ms"
          data-tilt
          @activate="openDialog('education')"
        >
          <div class="bottom-card-label">
            <span class="bottom-card-icon"><v-icon small>mdi-school-outline</v-icon></span>
            MY EDUCATION
          </div>
          <div class="education-copy">
            <span class="education-pretitle">จบการศึกษาจาก</span>
            <h2>มหาวิทยาลัย<br />แม่โจ้</h2>
          </div>
          <img
            class="education-seal"
            :src="universityLogo"
            alt="ตราสัญลักษณ์มหาวิทยาลัยแม่โจ้"
          />
          <div class="education-footer">
            <span>คลิกเพื่อดูรายละเอียด</span>
            <v-icon small>mdi-arrow-up-right</v-icon>
          </div>
        </ProfileDetailCard>

        <ProfileDetailCard
          class="football-panel tilt-3d reveal"
          style="--d: 140ms"
          data-tilt
          @activate="openDialog('sport')"
        >
          <div class="bottom-card-label">
            <span class="bottom-card-icon"><v-icon small>mdi-trophy-outline</v-icon></span>
            MY FAVORITE SPORT
          </div>
          <div class="football-copy">
            <span>กีฬาที่ชอบ</span>
            <h2>ฟุตบอล</h2>
          </div>
          <v-icon class="football-art">mdi-soccer</v-icon>
          <div class="football-footer">
            เล่นให้สุด แล้วหยุดที่เสียงนกหวีด
            <span class="bottom-card-action">คลิกดู <v-icon x-small>mdi-arrow-up-right</v-icon></span>
          </div>
        </ProfileDetailCard>

        <ProfileDetailCard
          class="likes-panel tilt-3d reveal"
          style="--d: 220ms"
          data-tilt
          @activate="openDialog('likes')"
        >
          <div class="bottom-card-label">
            <span class="bottom-card-icon"><v-icon small>mdi-heart-outline</v-icon></span>
            THE LITTLE THINGS
          </div>
          <div class="like-row" data-hover>
            <span>สิ่งที่ชอบ</span>
            <strong>รอมาเล่าให้ฟัง <v-icon small>mdi-arrow-right</v-icon></strong>
          </div>
          <div class="like-row" data-hover>
            <span>สิ่งที่ไม่ชอบ</span>
            <strong>ยังไม่ได้ระบุ <v-icon small>mdi-minus</v-icon></strong>
          </div>
          <div class="likes-note">มีเรื่องไหนอยากรู้จักเพิ่มอีกไหมครับ?</div>
          <span class="bottom-card-action">คลิกดู <v-icon x-small>mdi-arrow-up-right</v-icon></span>
        </ProfileDetailCard>
      </section>

      <footer class="profile-footer reveal">
        <span>ธนภัทร สิริประภาสุข <i>·</i> เซฟ</span>
        <span>ขอบคุณที่แวะมาทำความรู้จักกันครับ <b>✳</b></span>
      </footer>
    </v-container>

    <ProfileDetailDialog
      :value="Boolean(activeDialog)"
      :detail="activeDialog"
      @input="closeDialog"
    />
  </main>
</template>

<script>
import ProfileDetailCard from './ProfileDetailCard.vue'
import ProfileDetailDialog from './ProfileDetailDialog.vue'
import profileImage from './assets/safe-profile.png'
import universityLogo from './assets/maejo-university.png'

const dialogDetails = {
  education: {
    label: 'MY EDUCATION',
    title: 'ประวัติการศึกษา',
    icon: 'mdi-school-outline',
    details: [
      { label: 'มหาวิทยาลัย', value: 'มหาวิทยาลัยแม่โจ้' },
      { label: 'คณะ', value: 'คณะวิทยาศาสตร์' },
      { label: 'สาขาวิชา', value: 'เทคโนโลยีสารสนเทศ' },
    ],
  },
  sport: {
    label: 'MY FAVORITE SPORT',
    title: 'กีฬาที่ชอบ',
    icon: 'mdi-soccer',
    details: [
      { label: 'กีฬา', value: 'ฟุตบอล' },
      { label: 'คติประจำใจ', value: 'เล่นให้สุด แล้วหยุดที่เสียงนกหวีด' },
    ],
  },
  likes: {
    label: 'THE LITTLE THINGS',
    title: 'สิ่งที่ชอบและไม่ชอบ',
    icon: 'mdi-heart-outline',
    details: [
      { label: 'สิ่งที่ชอบ', value: 'รอมาเล่าให้ฟัง' },
      { label: 'สิ่งที่ไม่ชอบ', value: 'ยังไม่ได้ระบุ' },
    ],
  },
}

export default {
  name: 'ProfileView',
  components: {
    ProfileDetailCard,
    ProfileDetailDialog,
  },
  data: () => ({
    activeDialog: null,
    universityLogo,
    profileImage,
    hobbies: [
      { label: 'ออกกำลังกาย', icon: 'mdi-dumbbell' },
      { label: 'เล่นเกม', icon: 'mdi-controller' },
      { label: 'ฟังเพลง', icon: 'mdi-music-note' },
      { label: 'ดูหนัง', icon: 'mdi-movie-open-outline' },
      { label: 'อ่านการ์ตูน', icon: 'mdi-book-open-page-variant-outline' },
    ],
    pointer: { x: 0, y: 0 },
    progress: 0,
    ready: false,
    touch: false,
    ticking: false,
    cursor: { x: -100, y: -100 },
    ring: { x: -100, y: -100 },
    cursorActive: false,
    cursorHover: false,
    observer: null,
    cleanups: [],
  }),
  computed: {
    parallax() {
      const x = this.pointer.x
      const y = this.pointer.y
      return {
        copy: { transform: `translate3d(${x * -4}px, ${y * -3}px, 0)` },
        art: { transform: `translate3d(${x * 9}px, ${y * 8}px, 0)` },
      }
    },
  },
  mounted() {
    this.touch = window.matchMedia('(hover: none)').matches

    window.addEventListener('pointermove', this.onPointer, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onScroll, { passive: true })
    window.addEventListener('pointerdown', this.onDown)
    window.addEventListener('pointerup', this.onUp)

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            this.observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    this.$nextTick(() => {
      this.observeReveals()
      this.setupInteractions()
      this.onScroll()
      requestAnimationFrame(() => {
        this.ready = true
      })
    })
  },

  beforeDestroy() {
    window.removeEventListener('pointermove', this.onPointer)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onScroll)
    window.removeEventListener('pointerdown', this.onDown)
    window.removeEventListener('pointerup', this.onUp)
    if (this.observer) this.observer.disconnect()
    this.cleanups.forEach((fn) => fn())
    this.cleanups = []
  },

  methods: {
    observeReveals() {
      this.$el.querySelectorAll('.reveal').forEach((node) => this.observer.observe(node))
    },

    onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      this.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    },

    onPointer(event) {
      if (event.pointerType === 'touch') return

      const rect = this.$el.getBoundingClientRect()
      const nx = (event.clientX - rect.left) / rect.width - 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5

      // cursor layers react immediately, parallax is throttled to one rAF
      this.cursor = { x: event.clientX, y: event.clientY }
      this.cursorActive = true
      this.ring = { x: event.clientX, y: event.clientY }

      const target = event.target.closest
        ? event.target.closest('[data-hover], [data-magnetic], .tilt-3d')
        : null
      this.cursorHover = Boolean(target)

      if (this.ticking) return
      this.ticking = true
      requestAnimationFrame(() => {
        this.pointer = {
          x: Math.max(-0.5, Math.min(0.5, nx)),
          y: Math.max(-0.5, Math.min(0.5, ny)),
        }
        this.ticking = false
      })
    },

    onDown() {
      this.cursorActive = true
      this.$el.classList.add('is-press')
    },

    onUp() {
      this.$el.classList.remove('is-press')
    },

    setupInteractions() {
      // 3D tilt + spotlight tracking
      this.$el.querySelectorAll('.tilt-3d').forEach((el) => {
        const move = (event) => {
          const r = el.getBoundingClientRect()
          const px = (event.clientX - r.left) / r.width
          const py = (event.clientY - r.top) / r.height
          el.style.setProperty('--rx', `${(0.5 - py) * 13}deg`)
          el.style.setProperty('--ry', `${(px - 0.5) * 15}deg`)
          el.style.setProperty('--sx', `${px * 100}%`)
          el.style.setProperty('--sy', `${py * 100}%`)
        }
        const leave = () => {
          el.style.setProperty('--rx', '0deg')
          el.style.setProperty('--ry', '0deg')
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        this.cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })

      // magnetic pull
      this.$el.querySelectorAll('[data-magnetic]').forEach((el) => {
        const move = (event) => {
          const r = el.getBoundingClientRect()
          const mx = (event.clientX - (r.left + r.width / 2)) / r.width
          const my = (event.clientY - (r.top + r.height / 2)) / r.height
          el.style.transform = `translate3d(${mx * 14}px, ${my * 12}px, 0)`
        }
        const leave = () => {
          el.style.transform = 'translate3d(0, 0, 0)'
        }
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        this.cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      })
    },

    openDialog(name) {
      this.activeDialog = dialogDetails[name]
    },

    closeDialog() {
      this.activeDialog = null
    },
  },
}
</script>

<style src="./profile.css"></style>

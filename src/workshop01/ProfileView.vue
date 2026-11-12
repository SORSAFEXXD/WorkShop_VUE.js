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
            <img :src="profileImage" alt="pic" />
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

      <ProfileHobbySection :hobbies="hobbies" @open-hobby="openHobbyDialog" />

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
            alt="mjulogo"
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
            <strong> <v-icon small>mdi-arrow-right</v-icon></strong>
          </div>
          <div class="like-row" data-hover>
            <span>สิ่งที่ไม่ชอบ</span>
            <strong> <v-icon small>mdi-minus</v-icon></strong>
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
import ProfileHobbySection from './ProfileHobbySection.vue'
import profileInteractions from './profileInteractions'
import { dialogDetails, hobbies } from './profileData'
import profileImage from './assets/safe-profile.png'
import universityLogo from './assets/maejo-university.png'

export default {
  name: 'ProfileView',
  mixins: [profileInteractions],
  components: {
    ProfileDetailCard,
    ProfileDetailDialog,
    ProfileHobbySection,
  },
  data: () => ({
    activeDialog: null,
    universityLogo,
    profileImage,
    hobbies,
  }),
  methods: {
    openDialog(name) {
      this.activeDialog = dialogDetails[name]
    },

    openHobbyDialog(hobby) {
      this.activeDialog = {
        label: `MY ${hobby.label.toUpperCase()}`,
        title: hobby.label,
        icon: hobby.icon,
        items: hobby.items,
      }
    },

    closeDialog() {
      this.activeDialog = null
    },
  },
}
</script>

<style src="./profile.css"></style>

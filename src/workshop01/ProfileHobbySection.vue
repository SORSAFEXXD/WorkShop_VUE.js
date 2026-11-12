<template>
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
        role="button"
        tabindex="0"
        :aria-label="`ดูรายการ${hobby.label}`"
        flat
        @click="$emit('open-hobby', hobby)"
        @keydown.enter.prevent="$emit('open-hobby', hobby)"
        @keydown.space.prevent="$emit('open-hobby', hobby)"
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
</template>

<script>
export default {
  name: 'ProfileHobbySection',
  props: {
    hobbies: {
      type: Array,
      required: true,
    },
  },
}
</script>

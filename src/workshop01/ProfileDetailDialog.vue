<template>
  <v-dialog :value="value" max-width="440" @input="$emit('input', $event)">
    <v-card v-if="detail" class="education-dialog">
      <v-card-title class="education-dialog-title">
        <span>
          <span class="education-dialog-label">{{ detail.label }}</span>
          <span class="education-dialog-heading">{{ detail.title }}</span>
        </span>
        <v-btn icon aria-label="ปิดหน้าต่าง" @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="education-dialog-content">
        <div class="education-dialog-icon">
          <v-icon>{{ detail.icon }}</v-icon>
        </div>
        <div v-for="item in detail.details" :key="item.label">
          <span class="education-dialog-caption">{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ProfileDetailDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Object,
      default: null,
    },
  },
}
</script>

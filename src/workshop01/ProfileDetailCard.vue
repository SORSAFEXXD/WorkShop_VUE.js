<template>
  <v-card
    v-bind="$attrs"
    role="button"
    tabindex="0"
    flat
    @click="$emit('activate')"
    @keydown.enter.prevent="$emit('activate')"
    @keydown.space.prevent="$emit('activate')"
  >
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  name: 'ProfileDetailCard',
  inheritAttrs: false,
}
</script>

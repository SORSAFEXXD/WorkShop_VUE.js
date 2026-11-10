<template>
  <div>
    <v-app-bar
      app
      color="#e5eadc"
      height="64"
      elevation="0"
    >
      <div class="brand-mark">
        <span class="brand-name">INET</span>
        <span class="brand-divider"></span>
        <span class="brand-caption">{{ workshopLabel }}</span>
      </div>

      <v-spacer></v-spacer>

      <nav class="workshop-nav" aria-label="Workshop navigation">
        <router-link to="/" class="workshop-link" :class="{ 'is-current': $route.name === 'home' }">
          01
        </router-link>
        <router-link
          to="/workshop2"
          class="workshop-link"
          :class="{ 'is-current': $route.name === 'workshop2' }"
        >
          02
        </router-link>
        <router-link
          to="/workshop3"
          class="workshop-link"
          :class="{ 'is-current': $route.path.startsWith('/workshop3') }"
        >
          03
        </router-link>
      </nav>

      <div class="toolbar-greeting">
        <v-icon small>mdi-view-dashboard-outline</v-icon>
        <span>โปรไฟล์และเกรด</span>
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    </div>
</template>
<script>
export default {
  computed: {
    workshopLabel() {
      const workshop = this.$route.matched
        .map(route => route.meta.workshop)
        .find(Boolean)

      return workshop || 'WORKSHOP'
    },
  },
}
</script>

<style scoped>
.brand-mark {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-name {
  color: #334936;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: 1px;
}

.brand-divider {
  width: 1px;
  height: 23px;
  background: rgba(51, 73, 54, 0.25);
}

.brand-caption {
  color: #5b705c;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.toolbar-greeting {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #405642;
  font-size: 13px;
}

.workshop-nav {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px;
}

.workshop-link {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid rgba(51, 73, 54, 0.18);
  border-radius: 50%;
  color: #5b705c;
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: background 180ms ease, color 180ms ease, border-color 180ms ease;
}

.workshop-link:hover,
.workshop-link.is-current {
  border-color: #527c43;
  background: #527c43;
  color: #fff;
}

@media (max-width: 420px) {
  .brand-caption {
    font-size: 9px;
    letter-spacing: 1px;
  }

  .workshop-nav {
    gap: 3px;
    margin-right: 10px;
  }

  .workshop-link {
    width: 26px;
    height: 26px;
  }
}
</style>
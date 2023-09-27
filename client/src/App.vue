<script lang="ts">
import { RouterView } from "vue-router";
import HeaderNav from "@/components/HeaderNav.vue";
import { defineComponent } from "vue";
import { useFilmsStore } from "@/stores/filmsStore";
import { mapActions } from "pinia";

export default defineComponent({
  name: "App",
  components: {
    HeaderNav,
    RouterView
  },
  async created() {
    await this.fetchFilms();
  },
  methods: {
    ...mapActions(useFilmsStore, {
      fetchFilms: "fetchFilms"
    })
  }
});
</script>

<template>
  <div class="bg-dark min-vh-100 d-flex flex-column">
    <HeaderNav />
    <RouterView />
    <footer class="container-fluid mt-auto" />
  </div>
</template>

<style lang="scss" scoped>
.container-fluid {
  height: 10vh;
  background: linear-gradient(0deg, $primary 0%, transparent 100%);
}
</style>

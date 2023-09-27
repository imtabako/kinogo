<script lang="ts">
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "HeaderNav",
  components: { RouterLink }
});
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark px-5">
      <div class="container-fluid">
        <RouterLink
          class="navbar-brand fs-2"
          to="/"
        >
          <i class="bi bi-film" />
          KinoGo
        </RouterLink>
        <div class="nav-item dropdown">
          <i
            id="navbarDropdown"
            class="nav-link bi bi-person-circle text-white fs-2"
            data-bs-toggle="dropdown"
          />
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark bg-primary p-0">
            <li>
              <RouterLink
                to="/favorites"
                class="dropdown-item text-white px-3 py-2"
              >
                Избранные
              </RouterLink>
            </li>
            <li>
              <RouterLink
                to="/marks"
                class="dropdown-item text-white px-3 py-2"
              >
                Оценки
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Candal&display=swap');

.container-fluid {
  height: 10vh;
}

.navbar-brand {
  font-family: 'Candal', sans-serif;
}

.navbar {
  background: linear-gradient(0deg, transparent 0%, $primary 100%);
}

.nav-link:hover {
  opacity: 0.9;
}

.dropdown-menu {
  min-width: inherit;
}
</style>
<script setup lang="ts">
import MainPage from "@/components/Films.vue";
import { useFilmsStore } from "@/stores/filmsStore";

defineProps<{
  page?: string,
  sort?: string,
  search?: string,
}>();
</script>

<template>
  <main>
    <MainPage
      :films="useFilmsStore().films"
      :page-num="page"
      :sort-option="sort"
      :search-string="search"
    />
  </main>
</template>

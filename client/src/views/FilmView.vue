<script setup lang="ts">
import FilmPage from "@/components/FilmPage.vue";

defineProps<{
  id: string
}>();
</script>

<template>
  <main>
    <FilmPage :film-id="id" />
  </main>
</template>
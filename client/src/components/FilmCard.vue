<script lang="ts">
import { defineComponent, PropType } from "vue";
import type { Film } from "@/types/main";
import { RouterLink } from "vue-router";
import { useFilmsStore } from "@/stores/filmsStore";
import { mapActions } from "pinia";

export default defineComponent({
  name: "FilmCard",
  components: { RouterLink },
  props: {
    film: {
      type: Object as PropType<Film>,
      required: true
    }
  },
  methods: {
    getRatingColor(rating) {
      if (rating > 7) return "bg-success";
      else if (rating > 4) return "bg-warning";
      else return "bg-danger";
    },
    ...mapActions(useFilmsStore, {
      isFilmFavorite: "isFilmFavorite"
    })
  }
});
</script>

<template>
  <RouterLink
    class="card text-white m-3 bg-dark"
    :to="'/film/' + film._id"
  >
    <img
      class="card-img-top rounded h-100 object-fit-cover"
      :src="film.poster"
      alt="Failed to load"
    >
    <div class="card-img-overlay d-flex flex-column justify-content-end">
      <div class="d-flex align-items-start flex-wrap">
        <h4 class="card-title me-2 text-break">
          {{ film.name }}
        </h4>
        <i
          v-if="isFilmFavorite(film._id)"
          class="bi bi-star-fill text-secondary me-2"
        />
        <h5
          class="rating rounded p-1"
          :class="getRatingColor(film.rating.kp)"
        >
          {{ film.rating.kp.toFixed(1) }}
        </h5>
      </div>
      <div class="card-text text-break">
        {{ film.shortDescription }}
      </div>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.card-img-overlay {
  z-index: 1;
  background: linear-gradient(0deg, $primary 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 2.2vmin;

  &:hover {
    opacity: 1;
  }
}

.bi-star-fill {
  font-size: 2.6vmin;
}

.card-title {
  font-size: 3vmin;
}

.rating {
  font-size: 2.6vmin;
}
</style>
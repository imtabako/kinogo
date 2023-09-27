<script lang="ts">
import { defineComponent } from "vue";
import { useFilmsStore } from "@/stores/filmsStore";
import FilmCard from "@/components/FilmCard.vue";
import { mapActions } from "pinia";
import VueHorizontal from "vue-horizontal";

export default defineComponent({
  name: "FilmPage",
  components: { FilmCard, VueHorizontal },
  props: {
    filmId: {
      type: String,
      required: true
    }
  },
  computed: {
    film() {
      return useFilmsStore().getFilmById(this.filmId);
    },
    recommendedFilms() {
      return useFilmsStore().recs;
    }
  },
  async beforeCreate() {
    await useFilmsStore().fetchRecs(this.filmId);
  },
  created() {
    this.$watch(
      () => this.$route.params,
      async (toParams) => {
        await useFilmsStore().fetchRecs(toParams.id);
        this.$refs.horizontal.scrollToIndex(0);
      }
    );
  },
  methods: {
    getRatingColor(rating) {
      if (rating > 7) return "text-success";
      else if (rating > 4) return "text-warning";
      else return "text-danger";
    },
    ...mapActions(useFilmsStore, {
      isFilmFavorite: "isFilmFavorite",
      addToFavorites: "addToFavorites",
      deleteFromFavorites: "delFromFavorites",
      addToLikes: "addToLikes",
      deleteFromLikes: "delFromLikes",
      isFilmLiked: "isFilmLiked",
      addToDislikes: "addToDislikes",
      deleteFromDislikes: "delFromDislikes",
      isFilmDisliked: "isFilmDisliked"
    })
  }
});
</script>

<template>
  <div class="container mt-5 text-white">
    <div
      v-if="!film"
      class="d-flex justify-content-center"
    >
      <div
        class="spinner-border m-5"
        role="status"
      >
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div v-else>
      <div class="row fs-5">
        <div class="col-sm-12 col-md-4">
          <img
            :src="film.poster"
            class="img-fluid mb-3"
            alt="Failed to load"
          >
        </div>
        <div class="col-sm-12 col-md-8 ps-4">
          <div class="d-flex justify-content-between mb-3">
            <h2>{{ film.name }}</h2>
            <div class="d-flex">
              <i
                v-if="isFilmLiked(filmId)"
                class="bi bi-hand-thumbs-up-fill fs-2 text-success check"
                @click="deleteFromLikes(filmId)"
              />
              <i
                v-else
                class="bi bi-hand-thumbs-up fs-2 text-success check"
                @click="addToLikes(filmId)"
              />
              <div class="vr mx-2" />
              <i
                v-if="isFilmDisliked(filmId)"
                class="bi bi-hand-thumbs-down-fill fs-2 text-danger check me-5"
                @click="deleteFromDislikes(filmId)"
              />
              <i
                v-else
                class="bi bi-hand-thumbs-down fs-2 text-danger check me-5"
                @click="addToDislikes(filmId)"
              />
              <i
                v-if="isFilmFavorite(filmId)"
                class="bi bi-star-fill fs-2 text-secondary check"
                @click="deleteFromFavorites(filmId)"
              />
              <i
                v-else
                class="bi bi-star fs-2 text-secondary check"
                @click="addToFavorites(filmId)"
              />
            </div>
          </div>
          <div class="d-flex">
            <p class="me-4">
              {{ film.alternativeName }}
            </p>
            <p class="me-4">
              <i class="bi bi-calendar me-1" />
              {{ film.year }} г.
            </p>
            <p>
              <i class="bi bi-clock me-1" />
              {{ film.movieLength }} мин.
            </p>
          </div>
          <p>{{ film.description }}</p>
          <h5>Рейтинг</h5>
          <div class="d-flex mt-3">
            <div class="d-flex flex-column">
              <div
                class="rating bg-primary rounded p-1 me-5"
                :class="getRatingColor(film.rating.kp)"
              >
                <img
                  src="../assets/pics/kinopoisk-icon.svg"
                  class="rating-img me-1"
                  alt="Failed to load"
                >
                <b>{{ film.rating.kp.toFixed(2) }}</b>
              </div>
              <p class="fs-6">
                {{ film.votes.kp }} оценок
              </p>
            </div>
            <div class="d-flex flex-column">
              <div
                class="rating bg-primary rounded p-1 me-5"
                :class="getRatingColor(film.rating.kp)"
              >
                <img
                  src="../assets/pics/imdb-logo.svg"
                  class="rating-img me-1"
                  alt="Failed to load"
                >
                <b>{{ film.rating.imdb.toFixed(2) }}</b>
              </div>
              <p class="fs-6">
                {{ film.votes.imdb }} оценок
              </p>
            </div>
          </div>
          <div v-if="film.watchability">
            <h5>Где смотреть</h5>
            <div class="d-flex flex-wrap">
              <a
                v-for="watch in film.watchability"
                :key="watch.name"
                :href="watch.url"
                target="_blank"
                class="link text-decoration-none text-white mt-3 me-5"
              >
                <img
                  :src="watch.logo"
                  class="rating-img"
                  alt="Failed to load"
                >
                {{ watch.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="recommendedFilms.length!=0"
        class="row mt-5"
      >
        <h3 class="mb-0">
          Похожие фильмы
        </h3>
        <vue-horizontal ref="horizontal">
          <div v-for="item in recommendedFilms" :key="item._id" class="d-flex align-items-stretch horizontal-item">
            <FilmCard :film="item" />
          </div>

          <template v-slot:btn-prev>
            <i class="bi bi-chevron-left text-white fs-2 bg-primary rounded px-1 chevron" />
          </template>

          <template v-slot:btn-next>
            <i class="bi bi-chevron-right text-white fs-2 bg-primary rounded px-1 chevron" />
          </template>
        </vue-horizontal>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.check {
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}

.rating-img {
  width: 3rem;
  height: 3rem;
}

.link:hover {
  opacity: 0.9;
}

.chevron:hover {
  opacity: 0.9;
}

@media (min-width: 0px) {
  .horizontal-item {
    width: calc(100% / 2);
  }
}

@media (min-width: 768px) {
  .horizontal-item {
    width: calc(100% / 3);
  }
}

@media (min-width: 1280px) {
  .horizontal-item {
    width: calc(100% / 4);
  }
}
</style>
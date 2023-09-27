<script lang="ts">
import { defineComponent } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import FilmCard from "@/components/FilmCard.vue";
import { useFilmsStore } from "@/stores/filmsStore";
import Paginate from "vuejs-paginate-next";
import { mapState } from "pinia";

export default defineComponent({
  name: "MainPage",
  components: {
    SearchBar,
    SortDropdown,
    FilmCard,
    Paginate
  },
  props: {
    films: {
      type: Array,
      required: true
    },
    pageNum: {
      type: String,
      default: "1"
    },
    sortOption: {
      type: String,
      default: "По названию"
    },
    searchString: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      sortValue: "По названию",
      searchInput: "",
      page: 1,
      filmsPerPage: 20,
      filmsOnPage: []
    };
  },
  computed: {
    ...mapState(useFilmsStore, {
      storeFilms: "films"
    }),
    sortedFilms() {
      const val = this.sortValue;
      const films = [...this.films];
      switch (val) {
        case "По рейтингу":
          return films.sort((a, b) => b.rating.kp - a.rating.kp);
        case "По году":
          return films.sort((a, b) => b.year - a.year);
        case "По хронометражу":
          return films.sort((a, b) => a.movieLength - b.movieLength);
        default:
          return films.sort((a, b) => a.name.localeCompare(b.name));
      }
    },
    filteredFilms() {
      return this.sortedFilms.filter((film) => film.name.toLowerCase().includes(this.searchInput.toString().toLowerCase()));
    },
    pageCount() {
      return Math.ceil(this.filteredFilms.length / this.filmsPerPage);
    }
  },
  watch: {
    filteredFilms() {
      this.changePage(this.page);
    },
    pageNum(value) {
      this.changePage(parseInt(value));
    },
    sortOption(value) {
      this.setSort(value);
    },
    searchString(value) {
      this.setSearch(value);
    }
  },
  mounted() {
    this.setSort(this.sortOption);
    this.setSearch(this.searchString);
    this.changePage(parseInt(this.pageNum));
  },
  methods: {
    setSearch(input) {
      this.searchInput = input;
      this.changePage(1);
    },
    setSort(value) {
      this.sortValue = value;
      this.changePage(1);
    },
    changePage(pageNum) {
      this.page = pageNum;
      const offset = (this.filmsPerPage * pageNum) - this.filmsPerPage;
      this.filmsOnPage = [...this.filteredFilms].splice(offset, this.filmsPerPage);
      this.updateQueryParams();
    },
    onPaginateClick(p) {
      this.changePage(p);
      window.scrollTo(0, 0);
    },
    updateQueryParams() {
      let query = "";
      if (this.sortValue != "По названию") {
        query += `sort=${this.sortValue}&`;
      }
      if (this.searchInput != "") {
        query += `search=${this.searchInput}&`;
      }
      if (this.page != 1) {
        query += `page=${this.page}`;
      }
      this.$router.push(`${this.$route.path}?${query}`);
    }
  }
});
</script>

<template>
  <div class="container">
    <SearchBar
      v-model="searchInput"
    />
    <SortDropdown
      v-model="sortValue"
    />
    <div
      v-if="storeFilms.length === 0"
      class="d-flex justify-content-center"
    >
      <div
        class="spinner-border text-white m-5"
        role="status"
      >
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <h4
      v-else-if="films.length == 0"
      class="text-white text-center"
    >
      Фильмы не найдены
    </h4>
    <h4
      v-else-if="filteredFilms.length === 0"
      class="text-white text-center"
    >
      По вашему запросу ничего не найдено
    </h4>
    <div
      v-else
      class="row row-cols-2 row-cols-lg-3 row-cols-xl-4"
    >
      <div
        v-for="film in filmsOnPage"
        :key="film._id"
        class="col p-0 d-flex align-items-stretch"
      >
        <FilmCard :film="film" />
      </div>
    </div>
    <Paginate
      v-if="pageCount > 1"
      v-model="page"
      :page-count="pageCount"
      :page-range="3"
      :margin-pages="2"
      :click-handler="onPaginateClick"
      :prev-text="''"
      :next-text="''"
      :prev-link-class="'page-link rounded text-white me-2 bi bi-chevron-left'"
      :next-link-class="'page-link rounded text-white bi bi-chevron-right'"
      :container-class="'pagination d-flex justify-content-center my-3'"
      :page-class="'page-item'"
      :page-link-class="'page-link me-2 rounded text-white'"
    />
  </div>
</template>

<style lang="scss" scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>

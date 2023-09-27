import type { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import FilmView from "@/views/FilmView.vue";
import FavoritesView from "@/views/FavoritesView.vue";
import MarksView from "@/views/MarksView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    props: (route) => ({
      page: route.query.page,
      search: route.query.search,
      sort: route.query.sort
    })
  },
  {
    path: "/film/:id",
    name: "film",
    component: FilmView,
    props: true
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesView,
    props: (route) => ({
      page: route.query.page,
      search: route.query.search,
      sort: route.query.sort
    })
  },
  {
    path: "/marks",
    name: "marks",
    component: MarksView,
    props: (route) => ({
      page: route.query.page,
      search: route.query.search,
      sort: route.query.sort
    })
  }
];
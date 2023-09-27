import { defineStore } from "pinia";
import type { Film } from "@/types/main";
import axios from "axios";

axios.interceptors.request.use(function(config) {
  return config;
}, function(error) {
  console.error(error);
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
  return response;
}, function(error) {
  console.error(error);
  return Promise.reject(error);
});

export const useFilmsStore = defineStore("films", {
  state: () => ({
    films: [] as Film[],
    recs: [] as Film[],
    favorites: [] as string[],
    likes: [] as string[],
    dislikes: [] as string[]
  }),
  getters: {
    getFilmById: (state) => (filmId: string) => {
      return state.films.find((film) => film._id === filmId);
    },
    getFavorites: state => {
      return state.films.filter(film => state.favorites.indexOf(film._id) != -1);
    },
    getMarks: state => {
      return state.films.filter(film => state.likes.includes(film._id) || state.dislikes.includes(film._id));
    }
  },
  actions: {
    async fetchFilms() {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/list`);
      this.films = response.data;
      this.loadFavorites();
      this.loadDislikes();
      this.loadLikes();
    },
    async fetchRecs(id: string) {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/recs/${id}`);
      this.recs = response.data;
    },
    loadFavorites() {
      const favs = localStorage.getItem("favorites");
      if (favs != null) {
        this.favorites = JSON.parse(favs);
      }
    },
    addToFavorites(id: string) {
      this.favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    delFromFavorites(id: string) {
      const index = this.favorites.indexOf(id);
      if (index > -1) {
        this.favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(this.favorites));
      }
    },
    isFilmFavorite(id: string): boolean {
      return this.favorites.indexOf(id) > -1;
    },
    loadLikes() {
      const likes = localStorage.getItem("likes");
      if (likes != null) {
        this.likes = JSON.parse(likes);
      }
    },
    addToLikes(id: string) {
      this.likes.push(id);
      localStorage.setItem("likes", JSON.stringify(this.likes));
      if (this.isFilmDisliked(id)) {
        this.delFromDislikes(id);
      }
    },
    delFromLikes(id: string) {
      const index = this.likes.indexOf(id);
      if (index > -1) {
        this.likes.splice(index, 1);
        localStorage.setItem("likes", JSON.stringify(this.likes));
      }
    },
    isFilmLiked(id: string): boolean {
      return this.likes.indexOf(id) > -1;
    },
    loadDislikes() {
      const dislikes = localStorage.getItem("dislikes");
      if (dislikes != null) {
        this.dislikes = JSON.parse(dislikes);
      }
    },
    addToDislikes(id: string) {
      this.dislikes.push(id);
      localStorage.setItem("dislikes", JSON.stringify(this.dislikes));
      if (this.isFilmLiked(id)) {
        this.delFromLikes(id);
      }
    },
    delFromDislikes(id: string) {
      const index = this.dislikes.indexOf(id);
      if (index > -1) {
        this.dislikes.splice(index, 1);
        localStorage.setItem("dislikes", JSON.stringify(this.dislikes));
      }
    },
    isFilmDisliked(id: string): boolean {
      return this.dislikes.indexOf(id) > -1;
    }
  }
});
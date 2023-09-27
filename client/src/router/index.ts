import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path.includes('/film/') || !savedPosition) {
      return { top: 0 };
    }
    else return savedPosition;
  }
})

export default router

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/essentials",
      name: "essentials",
      component: () => import("../views/EssentialsView.vue"),
    },
    {
      path: "/comInDepth",
      name: "comInDepth",
      component: () => import("../views/ComponentInDepth.vue"),
    },
    {
      path: "/reusable",
      name: "reusable",
      component: () => import("../views/ReusableView.vue"),
    },
    {
      path: "/sandbox",
      name: "sandbox",
      component: () => import("../views/SandboxView.vue"),
    },
  ],
});

export default router;

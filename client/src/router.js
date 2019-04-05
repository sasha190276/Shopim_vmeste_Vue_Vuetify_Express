import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Ad from "./views/Ads/Ad.vue";
import AdList from "./views/Ads/AdList.vue";
import NewAd from "./views/Ads/NewAd.vue";
import Login from "./views/Auth/Login.vue";
import Registration from "./views/Auth/Registration.vue";
import Orders from "./views/User/Orders.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/ad/:id",
      name: "ad",
      component: Ad
    },
    {
      path: "/list",
      name: "list",
      component: AdList
    },
    {
      path: "/new",
      name: "new",
      component: NewAd
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/registration",
      name: "reg",
      component: Registration
    },
    {
      path: "/orders",
      name: "orders",
      component: Orders
    }
  ]
});

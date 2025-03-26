import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ManageView from '@/views/ManageView.vue'
import SongView from '@/views/SongView.vue'
import { useUserStore } from '@/stores/user.js'

const routes = [
  {
    name: 'home',
    path: '/',
    component: HomeView,
    meta: { requiresAuth: false },
  },
  {
    name: 'about',
    path: '/about',
    component: AboutView,
    meta: { requiresAuth: false },
  },
  {
    name: 'manage',
    path: '/manage-music',
    //alias: '/manage', //i.e. an old path to this page, it will still function
    component: ManageView,
    //this Guard will only run before routing to Manage page, we can also call it from the ManageView
    //this Guard will run after the Global Guard
    // beforeEnter: (to, from, next) => {
    //   next();
    // }
    meta: { requiresAuth: true },
  },
  //if we wanted to redirect from an old path then this is the way
  {
    path: '/manage',
    redirect: { name: 'manage' },
    meta: { requiresAuth: true },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: SongView,
    meta: { requiresAuth: false },
  },
  {
    path: '/:catchAll(.*)*', //gottacatchemall
    redirect: { name: 'home' },
    meta: { requiresAuth: false },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500 font-bold', //this one will help us highlight the link that exactly matches the page we're on
  //if our page has sub-menus and the link doesn't exactly match our page, but we still want to highlight it, then we use linkActiveClass
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  },
})

//this Guard runs on each rout, so we could run some code or check sth before user can get access to each and every page we have defined in the routes
//this Guard always runs first, unless there is a beforeRouteLeave, then it will run after it
//full order of Guards: https://router.vuejs.org/guide/advanced/navigation-guards.html#The-Full-Navigation-Resolution-Flow
router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const store = useUserStore()
  if (store.userLoggedIn) {
    next()
  } else {
    next({ name: 'home' })
  }
})

export default router

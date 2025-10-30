import { createRouter, createWebHistory } from 'vue-router'
import Catalog from '../pages/Catalog.vue'
import Cart from '../pages/Cart.vue'

const routes = [
  { path: '/', component: Catalog },
  { path: '/cart', component: Cart }
]

const router = createRouter({
  history: createWebHistory('/shop/'),
  routes
})

export default router

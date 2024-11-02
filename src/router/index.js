import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MenuView from '../views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/menu',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/alistamiento',
      name: 'alistamiento',
      component: () => import('../views/PickingView.vue')
    },
    {
      path: '/cargue',
      name: 'cargue',
      component: () => import('../views/CargueView.vue')
    },
    {
        path: '/entrega/:id',
        name: 'entrega',
        component: () => import('../views/picking/MaterialListaPickingView.vue')
      },
      {
        path: '/picking/scan/:materialId',
        name: 'scan',
        component: () => import('../views/picking/ScanView.vue')
      }
    // Aquí agregaremos las demás rutas según se necesiten
  ]
})

export default router
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
        name: 'Lista-entrega',
        component: () => import('../views/picking/MaterialListaPickingView.vue')
      },
      {
        path: '/picking/scan/:materialId',
        name: 'scan',
        component: () => import('../views/picking/ScanView.vue')
      },
      {
        path: '/traslado',
        name: 'traslado',
        component: () => import('../views/TrasladosView.vue')
      },
      {
        path: '/consultar-ubicacion',
        name: 'consultar-ubicacion',
        component: () => import('../views/ConsultaUbicacionView.vue')
      },
      {
        path: '/consultar-material',
        name: 'consultar-material',
        component: () => import('../views/ConsultaMaterialView.vue')
      },
      {
        path: '/ot-pendiente',
        name: 'ot-pendiente',
        component: () => import('../views/OTPendienteView.vue')
      },
      {
        path: '/legalizacion',
        name: 'legalizacion',
        component: () => import('../views/LegalizacionView.vue')
      }
    // Aquí agregaremos las demás rutas según se necesiten
  ]
})

export default router
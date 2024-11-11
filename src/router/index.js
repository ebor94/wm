import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MenuView from '../views/MenuView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useAuthStore } from '../store/auth'

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
      component: () => import('../views/ListaDespachos.vue')
    },
    {
      path: '/cargue',
      name: 'cargue',
      component: () => import('../views/CargueView.vue')
    },
    {
        path: '/entrega/:entrega',
        name: 'Lista-entrega',
        component: () => import('../views/picking/MaterialListaPickingView.vue')
      },
      {
        path: '/picking/scan/:entrega/:pos',
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
      },
      {
        path: '/orden-transporte/:id',
        name: 'orden-transporte',
        component: () => import('../views/OrdenTransporteView.vue')
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView
      }
    // Aquí agregaremos las demás rutas según se necesiten
  ]
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authStore.isAuthenticated ) {
    return next('/')
  }

  next()
})
router.onError((error) => {
    console.error('Error de navegación:', error)
    router.push({ name: 'not-found' })
  })

export default router
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FaskesPage.vue') },
    ]
  },
  {
    path: '/daftar',
    component:() => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PendaftaranPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

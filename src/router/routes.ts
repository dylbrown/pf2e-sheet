import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  /*{
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CharacterSheet.vue') },
    ],
  },*/

  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;

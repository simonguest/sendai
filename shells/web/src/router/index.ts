import { createRouter, createWebHashHistory } from 'vue-router'
import NotebooksView from '../views/Notebooks.vue'
import CurriculumView from '../views/Curriculum.vue'
import SettingsView from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: 'notebooks'
  },
  {
    path: '/notebooks',
    name: 'notebooks',
    component: NotebooksView
  },
  {
    path: '/curriculum',
    name: 'curriculum',
    component: CurriculumView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  }
]

const router = createRouter({
  // @ts-ignore
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router

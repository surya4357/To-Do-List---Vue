import Vue from 'vue'
import Router from 'vue-router'
import ToDoList from '@/components/ToDoList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'ToDoList',
      component: ToDoList
    }
  ]
})

import Vue from 'vue'
import Error from '@/view/error/index'
import Login from '@/view/login/index'
import VerbalManage from '@/view/verbalManage/index'
import TemplateManage from '@/view/templateManage/index'
import MyTemplate from '@/view/myTemplate/index'
import UserManage from '@/view/userManage/index'
import AuthorityManage from '@/view/authorityManage/index'
import RoleManage from '@/view/roleManage/index'
import RetrieveView from '@/view/retrieve/index'
import MyWorkSpace from '../view/myWorkSpace/index'
import Index from '@/view/guide/index'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  mode: 'history',
  hashbang: false,
  history: true,
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {path: '/error', component: Error},
    {path: '/login', component: Login},
    {path: '/retrieve', component: RetrieveView},
    {
      path: '/workspace',
      name: 'Workspace',
      component: MyWorkSpace,
      children: [
        {path: '/workspace', redirect: '/index'},
        {path: '/index', component: Index},
        {path: '/templateManage', component: TemplateManage},

        {path: '/templateManage/user/:id/:name',
          name: 'userTemplate',
          component: MyTemplate
        }, //  用户的模版
        {path: '/templateManage/global/:id/:name',
          name: 'globalTemplate',
          component: MyTemplate
        }, // 全局的模版
        {path: '/verbalManage', component: VerbalManage},
        {path: '/userManage', component: UserManage},
        {path: '/authorityManage', component: AuthorityManage},
        {path: '/roleManage', component: RoleManage}
      ]
    },
    {path: '*', component: Error}
  ]
})

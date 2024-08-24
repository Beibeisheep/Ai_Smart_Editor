import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/user/account/LoginView.vue'
import RegisterView from '../views/user/account/RegisterView.vue'
import HomeView from '../views/home/HomeView.vue'
import EditView from '../views/home/edit/EditView.vue'
import RecentFiles from '../views/menu/RecentFiles.vue'
import RecycleBin from '../views/menu/RecycleBin.vue'
import ContactView from '../views/home/ContactView.vue'
import PreviewVditor from '@/views/home/PreviewVditor.vue'
import ChangePasswordView from '@/views/user/account/ChangePasswordView.vue'
import store from '@/stores'
// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue')
//     }
//   ]
// })
const routes = [
	{
		path: '/recent-files',
		name: 'RecentFiles',
		component: RecentFiles
	},
	{
		path: '/recycle-bin',
		name: 'RecycleBin',
		component: RecycleBin
	},
	{
		path: '/contact-us',
		name: 'ContactView',
		component: ContactView // 对应的组件
	},
	{
		path: '/change-password',
		name: 'ChangePasswordView',
		component: ChangePasswordView
	},
	{
		path: '/preview',
		name: 'PreviewVditor',
		component: PreviewVditor
	},
	{
		path: '/user/account/login/',
		component: LoginView,
		name: 'LoginView'
	},
	{
		path: '/user/account/register/',
		component: RegisterView,
		name: 'RegisterView'
	},
	{
		path: '/home/Home',
		component: HomeView,
		name: 'HomeView',
		meta: {
			Auth: true // 需要授权才能登录
		}
	},
	{
		path: '/home/edit',
		component: EditView,
		name: 'EditView',
		meta: {
			Auth: true //我不知道需不需要必须登陆后才能访问
		}
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	if (to.meta.Auth == true && store.state.user.is_login == false) {
		//如果要去的界面需要授权并且user的is_login属性显示未登录，重定向到登录界面
		next({ name: 'LoginView' })
	} else {
		next()
	}
})

export default router

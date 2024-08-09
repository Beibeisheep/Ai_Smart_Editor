<template>
	<nav class="navbar navbar-expand-lg bg-light">
		<div class="container-fluid">
			<router-link class="navbar-brand" :to="{ name: 'LoginView' }">Gobang</router-link>
			<!--使用a标签href跳转点完后会刷新，使用router-link就不会刷新-->

			<div class="collapse navbar-collapse" id="navbarText">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
				<ul class="navbar-nav" v-if="$store.state.user.is_login">
					<!--如果查询store里面的全局变量发现is_login是true-->
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle"
							href="#"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							{{ $store.state.user.email }}
						</a>
						<ul class="dropdown-menu">
							<router-link class="dropdown-item" :to="{ name: 'LoginView' }" @click="logout"
								>退出登录</router-link
							>
						</ul>
					</li>
				</ul>

				<ul class="navbar-nav" v-else>
					<!--如果发现没有登录-->
					<li class="nav-item">
						<router-link class="nav-link" :to="{ name: 'HomeView' }" role="button">
							登录
						</router-link>
					</li>
					<li class="nav-item">
						<router-link class="nav-link" :to="{ name: 'RegisterView' }" role="button">
							注册
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
export default {
	//导出模块
	setup() {
		//setup是入口函数
		const route = useRoute() //useRoute()必须在setup中使用，useRoute函数返回当前路由地址
		let route_name = computed(() => route.name) //computed实时计算路由的名字
		const store = useStore() //获取store,用来更新store里面属性的值
		const logout = () => {
			store.dispatch('logout')
		}

		return {
			logout,
			route_name
		}
	},
	mounted() {
		// 组件挂载后检查用户登录状态
		if (!this.$store.state.user.is_login) {
			// 如果未登录，则重定向到登录页面
			this.$router.push({ name: 'LoginView' })
		}
	}
}
</script>

<style scoped>
.navbar {
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}

.container-fluid {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.navbar-nav {
	display: flex;
	align-items: center;
	list-style: none; /* Remove list item markers */
	padding-left: 0; /* Remove default padding */
	margin-bottom: 0; /* Remove default margin */
}

.nav-item {
	margin-left: 1rem;
}

.nav-link {
	font-size: 1rem;
	color: #000000ad;
	transition: color 0.3s ease;
	text-decoration: none;
}

.nav-link:hover {
	color: #13151a;
}

.navbar-brand {
	font-size: 1.5rem;
	font-weight: bold;
	color: #000;
	text-decoration: none; /* Remove underline from the brand link */
}
</style>

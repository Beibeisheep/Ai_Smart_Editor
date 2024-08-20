<template>
	<n-layout>
		<n-layout-header class="navbar">
			<div class="container-fluid">
				<router-link class="navbar-brand" :to="{ name: 'LoginView' }"> Editor </router-link>

				<div class="navbar-content">
					<template v-if="$store.state.user.is_login">
						<n-dropdown trigger="click">
							<template #trigger>
								<n-button text class="nav-link">
									{{ $store.state.user.email }}
								</n-button>
							</template>
							<n-dropdown-item @click="logout" :style="{ cursor: 'pointer' }"
								>退出登录</n-dropdown-item
							>
						</n-dropdown>
					</template>

					<template v-else>
						<router-link class="nav-link" :to="{ name: 'HomeView' }">
							<n-button text>登录</n-button>
						</router-link>
						<router-link class="nav-link" :to="{ name: 'RegisterView' }">
							<n-button text>注册</n-button>
						</router-link>
					</template>
				</div>
			</div>
		</n-layout-header>
	</n-layout>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { NLayout, NLayoutHeader, NButton, NDropdown } from 'naive-ui'
import router from '../router/index'
export default {
	components: {
		NLayout,
		NLayoutHeader,
		NButton,
		NDropdown
	},
	setup() {
		const route = useRoute()
		const route_name = computed(() => route.name)
		const store = useStore()

		const logout = () => {
			store.dispatch('logout')
			router.push({ name: 'LoginView' })
		}

		return {
			logout,
			route_name
		}
	},
	mounted() {
		if (!this.$store.state.user.is_login) {
			this.$router.push({ name: 'LoginView' })
		}
	}
}
</script>

<style scoped>
.navbar {
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
	background-color: #f8f9fa;
	padding: 0 1rem;
	position: fixed; /* Make the navbar fixed to the top */
	top: 0; /* Align it to the top */
	width: 100%; /* Full width */
	height: 10%;
	z-index: 1000; /* Ensure it stays on top of other content */
}

.container-fluid {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100%;
}

.navbar-brand {
	font-size: 1.8rem; /* Increase font size */
	font-weight: bold;
	color: #000;
	text-decoration: none;
	margin-top: 10px; /* Move down slightly */
}

.navbar-content {
	display: flex;
	align-items: center;
}

.nav-link {
	font-size: 1rem;
	color: #000000ad;
	margin-left: 1rem;
	transition: color 0.3s ease;
	text-decoration: none;
}

.nav-link:hover {
	color: #13151a;
}
</style>

<template>
	<n-layout-header
		style="
			background: #339;
			color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60px;
			padding: 0 20px;
		"
	>
		<n-space>
			<n-button
				@click="goHome"
				size="large"
				style="
					padding: 8px 20px;
					background-color: #ffcc00;
					color: #333;
					border: none;
					box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
					cursor: pointer;
				"
			>
				返回
			</n-button>
		</n-space>
		<n-space style="margin-left: auto">
			<n-button text style="color: white; padding-right: 20px">
				用户名: {{ $store.state.user.email }}
			</n-button>
		</n-space>
	</n-layout-header>

	<n-layout has-sider style="height: calc(100vh - 60px)">
		<div class="box">
			<div class="row">
				<div class="col-4">
					<form @submit.prevent="changePassword">
						<h1 class="text-center">修改密码</h1>
						<div class="mb-3">
							<input
								v-model="oldPassword"
								type="password"
								class="form-control"
								id="oldPassword"
								placeholder="请输入旧密码"
							/>
						</div>
						<div class="mb-3">
							<input
								v-model="newPassword"
								type="password"
								class="form-control"
								id="newPassword"
								placeholder="请输入新密码"
							/>
						</div>
						<div class="mb-3">
							<input
								v-model="confirmPassword"
								type="password"
								class="form-control"
								id="confirmPassword"
								placeholder="请确认新密码"
							/>
						</div>
						<div class="mb-3">
							<div class="error_message">{{ errorMessage }}</div>
						</div>
						<div class="form-buttons">
							<button type="submit" class="btn btn-primary">修改密码</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</n-layout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { NButton, NLayout, NLayoutContent, NSpace, NLayoutHeader } from 'naive-ui'
import $ from 'jquery'

export default {
	setup() {
		const store = useStore()
		const router = useRouter()
		const oldPassword = ref('')
		const newPassword = ref('')
		const confirmPassword = ref('')
		const errorMessage = ref('')

		const goHome = () => {
			store.commit('setSelectedMenuKey', '/recycle-bin')
			router.push('/recycle-bin')
		}

		const changePassword = () => {
			if (newPassword.value !== confirmPassword.value) {
				window.$message.error('新密码和确认密码不一致')
				return
			}

			$.ajax({
				url: 'http://localhost:8083/TextEditor/user/changePassword',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					oldPassword: oldPassword.value,
					newPassword: newPassword.value
				}),
				success(response) {
					if (response.code === 200) {
						// Update the stored password in Vuex state
						store.commit('updateState', {
							email: store.state.email, // Keep the existing email
							password: newPassword.value, // Update with the new password
							is_login: store.state.is_login // Keep the existing login status
						})
						window.$message.success('密码修改成功')
					} else if (response.code === 400) {
						window.$message.error('旧密码错误')
					} else {
						window.$message.error('密码修改失败')
					}
				},
				error() {
					window.$message.error('修改密码请求失败')
				}
			})
		}

		return {
			oldPassword,
			newPassword,
			confirmPassword,
			errorMessage,
			goHome,
			changePassword
		}
	}
}
</script>

<style scoped>
html,
body {
	height: 100%;
	margin: 0;
	background-color: #f8f8f8;
	font-family: Arial, sans-serif; /* Default font */
}

.box {
	width: 60vw; /* Adjusted width */
	margin: 5vh auto; /* Center horizontally and position vertically */
	border-radius: 5%;
}

.row {
	height: 100vh; /* Full viewport height */
	display: flex;
	align-items: center;
	justify-content: center;
}

.col-4 {
	background-color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

div.mb-3 {
	margin-top: 3vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

h1 {
	color: #2e466a;
	font-size: 28px;
	font-family: 'Dancing Script', cursive;
	margin-bottom: 20px;
	text-align: center;
}

input.form-control {
	width: 100%;
	padding: 10px;
	font-size: 16px;
	border: 1px solid #ccc;
	border-radius: 5px;
	transition:
		border-color 0.15s ease-in-out,
		box-shadow 0.15s ease-in-out;
}

input.form-control:focus {
	outline: none;
	border-color: #80bdff;
	box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.error_message {
	color: red;
	text-align: center;
}

.form-buttons {
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-top: 20px;
	width: 300px;
	height: 100px;
}

button {
	width: 100%;
	padding: 10px;
	font-size: 18px;
	background-color: #354c6e;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

button:hover {
	background-color: #1e314d;
}
</style>

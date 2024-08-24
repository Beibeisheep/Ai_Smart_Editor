<template>
	<div class="box">
		<div class="row">
			<div class="col-8"></div>
			<div class="col-4">
				<form @submit.prevent="change">
					<h1 class="text-center">修改密码</h1>
					<div class="mb-3">
						<input
							v-model="password"
							type="text"
							class="form-control"
							id="username"
							placeholder="请输入当前密码"
						/>
					</div>
					<div class="mb-3">
						<input
							v-model="password"
							type="password"
							class="form-control"
							id="password"
							placeholder="请输入新密码"
						/>
					</div>
					<div class="mb-3">
						<input
							v-model="password"
							type="password"
							class="form-control"
							id="password"
							placeholder="请确认新密码"
						/>
					</div>
					<div class="mb-3">
						<div class="error_message">{{ error_message }}</div>
					</div>
					<div class="form-buttons">
						<button type="submit" class="btn btn-primary">登录</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from 'vuex'
import { ref } from 'vue'
import router from '../../../router/index'

export default {
	setup() {
		const store = useStore()
		const email = ref('')
		const password = ref('')
		const error_message = ref('')

		return {
			login,
			email,
			password,
			error_message,
			register
		}
	}
}
</script>

<style scoped>
body {
	background-color: #f8f9fa; /* Light gray background */
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

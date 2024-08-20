<template>
	<div class="box">
		<div class="row">
			<div class="col-8"></div>
			<div class="col-4">
				<form @submit.prevent="register">
					<!--.prevent是防止默认行为-->
					<div class="mb-3">
						<img id="photo" src="https://himg.bdimg.com/sys/portrait/hotitem/wildkid/48" />
					</div>
					<div class="mb-3">
						<!--v-model绑定export出来的变量-->
						<input
							v-model="email"
							type="text"
							class="form-control"
							id="username"
							placeholder="请输入用户名"
						/>
					</div>
					<div class="mb-3">
						<input
							v-model="password"
							type="password"
							class="form-control"
							id="password"
							placeholder="请输入密码"
						/>
					</div>
					<div class="mb-3">
						<input
							v-model="confirmPassword"
							type="password"
							class="form-control"
							id="confirmPassword"
							placeholder="再次输入密码"
						/>
					</div>
					<div class="mb-3">
						<div class="error_message">{{ error_message }}</div>
					</div>
					<div class="register_btn">
						<button type="primary" class="btn btn-success">注册</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue'
import $ from 'jquery'
import router from '../../../router/index'

export default {
	setup() {
		let email = ref('')
		let password = ref('')
		let confirmPassword = ref('')
		let error_message = ref('')

		const register = () => {
			error_message.value = ''
			$.ajax({
				// url: 'http://192.168.1.5:8083/TextEditor/user/register',
				// url: 'http://10.6.3.167:8083/TextEditor/user/register',
				url: 'http://192.168.0.129:8083/TextEditor/user/register',
				type: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify({
					email: email.value,
					password: password.value,
					confirmPassword: confirmPassword.value
				}),
				dataType: 'json',
				success(resp) {
					if (resp.message == '注册成功') {
						window.$message.success('注册成功')
						router.push({ name: 'LoginView' }) //使用router跳转界面
					} else {
						error_message.value = resp.message
						window.$message.error('注册失败')
					}
				}
			})
		}

		return {
			register,
			email,
			password,
			error_message,
			confirmPassword
		}
	}
}
</script>

<style scoped>
.box img {
	width: 30%;
	border-radius: 50%;
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

div.error_message {
	color: red;
}

div.mb-3 {
	margin-top: 3vh;
	display: flex;
	justify-content: center;
	align-items: center;
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

div.register_btn {
	display: flex;
	justify-content: center;
	align-items: center;
}

.box button {
	width: 100%;
	padding: 10px;
	font-size: 18px;
	background-color: #354c6e; /* Blue button background color */
	color: white; /* Button text color */
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}
button:hover {
	background-color: #1e314d; /* Darker shade of blue on hover */
}
</style>

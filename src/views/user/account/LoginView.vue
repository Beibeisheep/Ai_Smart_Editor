<template>
	<div class="box">
		<div class="row justify-content-center">
			<div class="col-8 d-none d-md-block"></div>
			<div class="col-4 col-md-4">
				<h1>Editor</h1>
				<form @submit.prevent="login">
					<!--.prevent是防止默认行为-->
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
						<div class="error_message">{{ error_message }}</div>
					</div>
					<div class="login_btn">
						<button type="submit" class="btn btn-primary">登录</button>
					</div>
					<div class="register_btn" @click="register">
						<button type="submit" class="btn btn-success">注册</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import { useStore } from 'vuex'
import { ref } from 'vue'
// import $ from "jquery";
import router from '../../../router/index'

export default {
	setup() {
		const store = useStore() //使用这个去调用store里面的方法，并且将值传入store中当做全局变量使用
		let email = ref('')
		let password = ref('')
		let error_message = ref('')

		// let token = localStorage.getItem("token");
		// if (token != null) {
		//   store.commit("updateToken", token);
		//   store.dispatch("getinfo", {
		//     success() {
		//       router.push({ name: "home" });
		//     },
		//   });
		// }

		// const login = () => {
		//   error_message.value = "";
		//   store.dispatch("login", {
		//     email: email.value,
		//     password: password.value, //用ref取值时要用.value
		//     success() {
		//       store.dispatch("getinfo", {
		//         success() {
		//           router.push({ name: "home" });
		//         },
		//       });
		//     },
		//     error() {
		//       error_message.value = "用户名或密码错误";
		//     },
		//   });
		// };
		// const login = () => {
		//   error_message.value = "";
		//   $.ajax({
		//     url: "http://10.6.3.167:8083/TextEditor/user/login",
		//     type: "post",
		//     headers: {
		//       "Content-Type": "application/json",
		//     },
		//     data: JSON.stringify({
		//       email: email.value,
		//       password: password.value,
		//     }),
		//     dataType: "json",
		//     success(resp) {
		//       if (resp.message == "success") {
		//         router.push({ name: "HomeView" });
		//         store.dispatch("getinfo", {
		//           success() {
		//             router.push({ name: "HomeView" });
		//           },
		//         });
		//       } else {
		//         error_message.value = "用户名或密码错误";
		//       }
		//     },
		//   });
		// };

		const login = () => {
			error_message.value = ''
			store.dispatch('login', {
				email: email.value,
				password: password.value,
				success() {
					store.commit('setSelectedMenuKey', '/recent-files')
					router.push('/recent-files')
				},
				error(msg) {
					error_message.value = msg
				}
			})
		}

		const register = () => {
			router.push({ name: 'RegisterView' })
		}

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

div.box {
	width: 80vw;
	margin-left: 10vw;
	margin-top: 10vh;
	border-radius: 5%;
}
div.col-4 {
	background-color: white;
	/* 新增样式 */
	display: flex;
	flex-direction: row;
}

div.error_message {
	color: red;
}

h1 {
	padding-top: 5px;
	color: #2e466a; /* Blue header color */
	font-size: 28px; /* Larger font size */
	font-family: 'Dancing Script', cursive;
	margin-bottom: 20px; /* Space below the heading */
	text-align: center;
}

div.mb-3 {
	margin-top: 3vh;
	display: flex;
	justify-content: center;
	align-items: center;
}

div.mb-3:first-child {
	margin-top: 7vh;
}

div.mb-3:nth-of-type(3) {
	margin-top: 2vh;
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
	margin-top: 30px; /* Adjust this value to increase the distance */
}

div.login_btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30px; /* Added margin top for spacing */
}

button {
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

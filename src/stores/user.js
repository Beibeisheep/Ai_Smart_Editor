import $ from 'jquery'
export default {
	state: {
		email: '',
		password: '',
		is_login: false
	},
	getters: {},
	mutations: {
		updateState(state, user) {
			state.email = user.email
			state.password = user.password
			state.is_login = user.is_login
		},
		// updateToken(state, token) {
		//   state.token = token;
		// },
		logout(state) {
			state.email = ''
			state.password = ''
			state.is_login = false
		}
	},
	actions: {
		login(context, data) {
			// 通过账号密码登录
			$.ajax({
				// url: 'http://10.6.3.167:8083/TextEditor/user/login',
				// url: 'http://192.168.1.5:8083/TextEditor/user/login',
				url: 'http://192.168.1.5:8083/TextEditor/user/login',
				type: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify({
					email: data.email,
					password: data.password
				}),
				success(resp) {
					console.log('服务器响应:', resp) // 打印服务器响应
					console.log('resp.message', resp.message)
					if (resp.message == '执行成功') {
						context.commit('updateState', {
							email: resp.data.email,
							password: resp.data.password,
							is_login: true
						})
						data.success() // 调用传入的成功回调
					} else {
						console.log('登录失败信息:', resp)
						data.error('用户名或密码错误')
					}
				},
				error(resp) {
					data.error(resp)
				}
			})
		},
		logout(context) {
			// 退出登录
			context.commit('logout')
			window.$message.success('退出登录')
		}
	},
	modules: {}
}

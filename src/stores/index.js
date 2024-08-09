import { createStore } from 'vuex'
import User from '../stores/user'

export default createStore({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
	modules: {
		user: User //防止store变得臃肿，其实就相当于一个名为user子模块,
	}
})


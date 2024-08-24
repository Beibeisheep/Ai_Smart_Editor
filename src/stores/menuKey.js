import { createStore } from 'vuex'

const menuKey = {
	state: () => ({
		selectedMenuKey: '最近文档' // 默认值
	}),
	mutations: {
		setSelectedMenuKey(state, key) {
			state.selectedMenuKey = key
		}
	},
	getters: {
		getSelectedMenuKey: (state) => {
			return state.selectedMenuKey
		}
	}
}

export default menuKey

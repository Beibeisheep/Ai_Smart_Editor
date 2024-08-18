import { createStore } from 'vuex'
const itemKey = {
	state: () => ({
		selectedItemKey: null // 默认值，开始为 null
	}),
	mutations: {
		setSelectedItemKey(state, key) {
			state.selectedItemKey = key
		}
	},
	getters: {
		getSelectedItemKey: (state) => {
			return state.selectedItemKey
		}
	}
}

export default itemKey

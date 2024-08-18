// text.js
const text = {
	state: () => ({
		aiText: '', // 存储 AI 修改过的文本
		userText: '' // 存储用户输入的文本，供 AI 处理
	}),
	mutations: {
		setAiText(state, text) {
			state.aiText = text
		},
		setUserText(state, text) {
			state.userText = text
		}
	},
	getters: {
		getAiText(state) {
			return state.aiText
		},
		getUserText(state) {
			return state.userText
		}
	}
}

export default text

const text = {
	state: () => ({
		// 使用对象存储每个文档的文本
		files: {},
		shouldUpdateUserText: false, // 默认值为 false
		ShouldconfirmDialogVisible: false,
		ShouldUpdateAIContinuation: false //更新Ai
	}),
	mutations: {
		setAiText(state, { fileId, text }) {
			// 设置指定 fileId 的 AI 文本
			if (!state.files[fileId]) {
				state.files[fileId] = {}
			}
			state.files[fileId].aiText = text
		},
		setUserText(state, { fileId, text }) {
			// 设置指定 fileId 的用户文本
			if (!state.files[fileId]) {
				state.files[fileId] = {}
			}
			state.files[fileId].userText = text
		},
		setShouldUpdateUserText(state, value) {
			state.shouldUpdateUserText = value
		},
		setShouldconfirmDialogVisible(state, value) {
			state.ShouldconfirmDialogVisible = value
		},
		setShouldUpdateAIContinuation(state, value) {
			state.ShouldUpdateAIContinuation = value
		}
	},
	getters: {
		getAiText: (state) => (fileId) => {
			// 获取指定 fileId 的 AI 文本
			return state.files[fileId]?.aiText || ''
		},
		getUserText: (state) => (fileId) => {
			// 获取指定 fileId 的用户文本
			return state.files[fileId]?.userText || ''
		},
		getShouldUpdateUserText: (state) => {
			return state.shouldUpdateUserText
		},
		getShouldconfirmDialogVisible: (state) => {
			return state.ShouldconfirmDialogVisible
		},
		getShouldUpdateAIContinuation: (state) => {
			return state.ShouldUpdateAIContinuation
		}
	}
}

export default text

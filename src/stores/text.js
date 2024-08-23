const text = {
	state: () => ({
		// 使用对象存储每个文件的文本
		files: {},
		shouldUpdateUserText: false, // 默认值为 false
		ShouldconfirmDialogVisible: false
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
		}
	}
}

export default text

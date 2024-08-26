<template>
	<n-layout style="height: 100vh">
		<n-layout-header
			style="
				background: #339;
				color: white;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 60px;
				padding: 0 20px;
			"
		>
			<n-space>
				<n-button
					@click="goHome"
					size="large"
					style="
						margin-left: 10px;
						background-color: #ffcc00;
						color: #333;
						border: none;
						box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
					"
				>
					返回主页面
				</n-button>
				<n-button text @click="toggleDropdown" style="color: #339">
					{{ dropdownOpen ? '-' : '+' }}
				</n-button>
			</n-space>
			<n-space style="margin-left: auto">
				<router-link to="/contact-us">
					<n-button text style="color: white; margin-right: 30px"> 联系我们 </n-button>
				</router-link>
				<n-button text style="color: white; padding-right: 20px"
					>用户名: {{ $store.state.user.email }}</n-button
				>
			</n-space>
		</n-layout-header>

		<n-layout has-sider style="height: calc(100vh - 60px)">
			<n-layout-sider width="250" style="background-color: #f0f0f0">
				<div class="sidebar">
					<div style="display: flex; align-items: center; margin-bottom: 20px">
						<input
							placeholder="搜索文档"
							style="
								opacity: 0.7;
								flex: 1;
								margin-right: 10px;
								height: 36px;
								border: 1px solid black;
								border-radius: 3px;
							"
							clearable
							v-model="searchQuery"
							@input="searchFiles"
						/>
						<n-button @click="addNewItem" type="primary">
							<Icon icon="teenyicons:add-solid" />
						</n-button>
					</div>
					<n-collapse v-model:value="dropdownOpen">
						<n-collapse-item name="files" :title="collapseTitle">
							<n-menu
								:options="menuOptions"
								:default-value="currentFileId"
								@update:value="handleMenuSelect"
								style="width: 100%; height: calc(100% - 40px); overflow-y: auto"
							/>
						</n-collapse-item>
					</n-collapse>

					<!-- <AiText :userText="vditor.value.getValue()" @update-son-thing="handleSonThingUpdate" />    获取不到文本编辑器内的实时数据-->
					<!-- <AiText :userText="currentFileContent" @update-son-thing="handleSonThingUpdate" /> -->
					<AiText />
				</div>
			</n-layout-sider>

			<n-layout-content style="padding: 0; overflow: auto">
				<div style="display: flex; height: 100%">
					<div id="vditor-container" style="flex: 1; height: 100%; width: 100%">
						<div id="vditor"></div>
					</div>
				</div>
			</n-layout-content>
		</n-layout>
	</n-layout>
	<!-- 重命名对话框 -->
	<n-dialog v-show="renameDialogVisible" title="重命名" :style="dialogStyle">
		<div class="dialog-content">
			<input type="text" v-model="newFileName" placeholder="输入新的文档名" :style="inputStyle" />
		</div>
		<div class="dialog-footer">
			<n-space size="large">
				<n-button @click="handleRenameConfirm" type="primary">确定</n-button>
				<n-button @click="handleRenameCancel">取消</n-button>
			</n-space>
		</div>
	</n-dialog>
	<n-dialog v-show="confirmDialogVisible" title="查错纠错" :style="dialogStyle">
		<div class="dialog-content">
			红色标注内容表示为表示原始文本中的不正确或需要纠正的部分，黄色标注内容为对错误内容的修正建议，请问进行内容更改吗
		</div>
		<div class="dialog-footer">
			<n-space size="large">
				<n-button @click="acceptChanges" type="primary">接受更改</n-button>
				<n-button @click="rejectChanges">拒绝更改</n-button>
			</n-space>
		</div>
	</n-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import AiText from '@/components/AiText.vue'
import { Icon } from '@iconify/vue'
import {
	NCollapse,
	NCollapseItem,
	NButton,
	NSpace,
	NLayout,
	NLayoutHeader,
	NLayoutSider,
	NLayoutContent,
	NMenu,
	NDialog
} from 'naive-ui'
import $ from 'jquery'
import { diffWordsWithSpace } from 'diff'
const router = useRouter()
const store = useStore()
const fileItems = ref([])
const dropdownOpen = ref(false)
const vditor = ref(null)
const currentFileId = computed(() => store.getters['getSelectedItemKey'])
const renameDialogVisible = ref(false)
const newFileName = ref('')
const currentFileContent = ref('') // Reference for current file content
const searchQuery = ref('') // 用于存储搜索框的值
const confirmDialogVisible = ref(false)
const ShouldconfirmDialogVisible = computed(() => store.getters['getShouldconfirmDialogVisible'])
const ShouldUpdateAIContinuation = computed(() => store.getters['getShouldUpdateAIContinuation'])
const fileContent = computed(() => store.getters['getUserText'](currentFileId.value))
const shouldUpdateUserText = computed(() => store.getters['getShouldUpdateUserText'])
const editText = ref('') // 文本编辑器内的实时数据
const newFileContent = computed(() => store.getters['getAiText'](currentFileId.value)) //Ai改过格式的数据
console.log('newFileContent)))AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII', newFileContent.value)
const dialogStyle = {
	width: '300px', // 对话框宽度
	top: '50%', // 垂直居中
	left: '50%', // 水平居中
	transform: 'translate(-50%, -50%)', // 用于居中对话框
	position: 'fixed', // 保证对话框始终相对于页面定位
	backgroundColor: 'white',
	zIndex: 1000 // 保证对话框在所有内容之上
}
const inputStyle = {
	border: '1px solid #dcdcdc',
	borderRadius: '4px',
	padding: '8px',
	fontSize: '14px',
	width: '100%',
	height: '36px',
	boxSizing: 'border-box'
}
const collapseTitle = computed(() => {
	return dropdownOpen.value ? '所有文档 - ' : '所有文档'
})
const menuOptions = computed(() => {
	return fileItems.value.map((file) => ({
		label: file.fileName,
		key: file.fileId,
		icon: () => h(Icon, { icon: 'ph:files-light' }),
		// 添加重命名按钮
		extra: () =>
			h(
				NButton,
				{
					size: 'medium',
					text: true,
					onClick: () => handleRename(file),
					style: { marginLeft: '4px' }
				},
				() => h(Icon, { icon: 'ic:outline-drive-file-rename-outline' })
			)
	}))
})
const diffHtml = ref('')

const compareTexts = () => {
	const oldText = fileContent.value
	const newText = newFileContent.value
	const diff = diffWordsWithSpace(oldText, newText)
	diffHtml.value = diff
		.map((part) => {
			const color = part.added ? 'background-color: yellow;' : part.removed ? 'color: red;' : ''
			return `<span style="${color}">${part.value}</span>`
		})
		.join('')

	// Set the diffHtml content directly to the editor
	vditor.value.setValue(diffHtml.value, false)
}

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value
}

const goHome = () => {
	store.commit('setSelectedMenuKey', '/recent-files')
	router.push('/recent-files')
}

const addNewItem = () => {
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/createFile',
		// url: 'http://10.6.3.167:8083/TextEditor/user/createFile',
		type: 'POST',
		success: function (response) {
			console.log('文档创建成功:', response)
			window.$message.success('创建成功')
			store.commit('setSelectedItemKey', response.data.fileId)
			fetchFileList() // 重新获取文档列表
		},
		error: function (error) {
			console.error('文档创建失败:', error)
		}
	})
}

const fetchFileList = () => {
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/listFiles',
		type: 'POST',
		dataType: 'json',
		success: (response) => {
			if (response.code === 200) {
				fileItems.value = response.data.map((file) => ({
					fileId: file.fileId,
					fileName: file.fileName
				}))
			} else {
				console.error('获取数据时出错:', response.message)
			}
		},
		error: (xhr, status, error) => {
			console.error('获取数据时出错:', {
				xhr,
				status,
				error
			})
		}
	})
}
const handleMenuSelect = (fileId) => {
	selectFile(fileId)
}

const selectFile = (fileId) => {
	store.commit('setSelectedItemKey', fileId) // 更新 Vuex 中的
	console.log('fileIdddddddddddddddddddddddddd', currentFileId.value)
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/getFileInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(currentFileId.value),
		success: function (response) {
			if (response.code === 200) {
				currentFileContent.value = response.data
				store.commit('setUserText', { fileId: currentFileId.value, text: currentFileContent.value })
				console.log('currentFileContent.value', currentFileContent.value)
				console.log('fileContenttttttttttttttt', fileContent.value)
			} else {
				console.error('获取文档内容时出错:', response.message)
			}
		},
		error: function (error) {
			console.error('获取文档内容失败:', error)
		}
	})
}
//搜索文档
const searchFiles = () => {
	if (searchQuery.value.trim() === '') {
		fetchFileList() // 如果搜索框为空，则重新获取所有文档
		return
	}
	console.log('FIleName', searchQuery.value)
	console.log('searchQuery.value.trim()', searchQuery.value.trim())
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/listFileByName',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchQuery.value.trim()), // 传递搜索参数
		success: function (response) {
			if (response.code === 200) {
				// 更新文档列表
				fileItems.value = response.data.map((file) => ({
					fileId: file.fileId,
					fileName: file.fileName
				}))
			} else {
				console.error('搜索文档时出错:', response.message)
			}
		},
		error: function (error) {
			console.error('搜索文档失败:', error)
		}
	})
}
// 显示重命名对话框
const handleRename = (file) => {
	renameDialogVisible.value = true
	newFileName.value = file.fileName
	console.log('renameDialogVisible.valuuuuuuuuuuuuuuuuuuuuuuue', renameDialogVisible.value)
}

// 确认重命名操作
const handleRenameConfirm = () => {
	if (!newFileName.value.trim()) {
		alert('文档名不能为空')
		return
	}
	console.log('renameDialogVisible.valuuuuuuuuuuuuuuuuuuuuuuue', renameDialogVisible.value)
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/updateFileName',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			fileId: currentFileId.value,
			fileName: newFileName.value
		}),
		dataType: 'json',
		success: (response) => {
			if (response.code === 200) {
				fetchFileList() // 更新文档列表
				renameDialogVisible.value = false
				newFileName.value = ''
			} else {
				console.error('重命名失败:', response.message)
			}
		},
		error: (xhr, status, error) => {
			console.error('重命名时出错:', { xhr, status, error })
		}
	})
}

// 取消重命名操作
const handleRenameCancel = () => {
	renameDialogVisible.value = false
	newFileName.value = ''
}

onMounted(() => {
	fetchFileList() // 获取文档列表
	if (currentFileId.value) {
		selectFile(currentFileId.value) // Load the selected file content
	}
	vditor.value = new Vditor('vditor', {
		height: document.getElementById('vditor-container').offsetHeight,
		width: document.getElementById('vditor-container').offsetWidth,
		cache: { enable: false },
		mode: 'sv',
		input: (value) => {
			// 使用 `input` 回调函数监听内容变化
			if (currentFileId.value) {
				$.ajax({
					url: 'http://localhost:8083/TextEditor/file/saveFile',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						fileId: currentFileId.value,
						fileContent: value
					}),
					success: function (response) {
						console.log('文档保存成功:', response)
						store.commit('setUserText', {
							fileId: currentFileId.value,
							text: value
						})
						currentFileContent.value = value
					},
					error: function (error) {
						console.error('文档保存失败:', error)
					}
				})
			}
		},
		after() {
			vditor.value.setValue(fileContent.value) // 使用 ref 包装的 vditor 实例
		}
	})
})

const acceptChanges = () => {
	//接受纠错改变
	currentFileContent.value = newFileContent.value // 将 newFileContent(Ai改过的) 的值赋值给 currentFileContent（展示的？）
	vditor.value.setValue(currentFileContent.value, false) // 更新 Vditor 中的内容
	$.ajax({
		url: 'http://localhost:8083/TextEditor/file/saveFile',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			fileId: currentFileId.value,
			fileContent: currentFileContent.value
		}),
		success: function (response) {
			console.log('文档保存成功:', response)
			store.commit('setUserText', { fileId: currentFileId.value, text: currentFileContent.value })
			confirmDialogVisible.value = false
		},
		error: function (error) {
			console.error('文档保存失败:', error)
		}
	})
	store.commit('setShouldUpdateUserText', false)
	store.commit('setShouldconfirmDialogVisible', false)
	store.commit('setAiText', {
		//确保每次AiText都有改变
		fileId: currentFileId.value,
		text: ''
	})
}

const rejectChanges = () => {
	vditor.value.setValue(fileContent.value, false)
	confirmDialogVisible.value = false
	store.commit('setShouldUpdateUserText', false)
	store.commit('setShouldconfirmDialogVisible', false)
	store.commit('setAiText', {
		//确保每次AiText都有改变
		fileId: currentFileId.value,
		text: ''
	})
}
const handleSonThingUpdate = () => {
	if (shouldUpdateUserText.value) {
		if (ShouldconfirmDialogVisible.value) {
			//实现文本纠错
			compareTexts()
			if (diffHtml.value) {
				confirmDialogVisible.value = true
			} else {
				window.$message.success('没有发现错误')
			}
		} else if (ShouldUpdateAIContinuation.value) {
			//实现Ai续写

			// 去除重复的部分
			if (currentFileContent.value.includes(newFileContent.value)) {
				const startIndex = currentFileContent.value.indexOf(newFileContent.value)
				currentFileContent.value = currentFileContent.value.slice(0, startIndex)
			}
			console.log('currentFileContent.valueeeeeeeeeee', currentFileContent.value)
			console.log('newFileContent.valueeeeeeeeeeeeeee', newFileContent.value)
			currentFileContent.value += newFileContent.value // 将 newFileContent(AI改过的) 的内容追加到 currentFileContent（展示的）

			vditor.value.setValue(currentFileContent.value, false) // 更新 Vditor 中的内容
			$.ajax({
				url: 'http://localhost:8083/TextEditor/file/saveFile',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					fileId: currentFileId.value,
					fileContent: currentFileContent.value
				}),
				success: function (response) {
					console.log('文档保存成功:', response)
					store.commit('setUserText', {
						fileId: currentFileId.value,
						text: currentFileContent.value
					})
				},
				error: function (error) {
					console.error('文档保存失败:', error)
				}
			})
			store.commit('setShouldUpdateUserText', false)
			store.commit('setShouldUpdateAIContinuation', false)
			store.commit('setAiText', {
				//确保每次AiText都有改变
				fileId: currentFileId.value,
				text: ''
			})
		} else {
			//实现一键排版
			currentFileContent.value = newFileContent.value // 将 newFileContent(Ai改过的) 的值赋值给 currentFileContent（展示的？）
			vditor.value.setValue(currentFileContent.value, false) // 更新 Vditor 中的内容
			$.ajax({
				url: 'http://localhost:8083/TextEditor/file/saveFile',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					fileId: currentFileId.value,
					fileContent: currentFileContent.value
				}),
				success: function (response) {
					console.log('文档保存成功:', response)
					store.commit('setUserText', {
						fileId: currentFileId.value,
						text: currentFileContent.value
					})
					confirmDialogVisible.value = false
				},
				error: function (error) {
					console.error('文档保存失败:', error)
				}
			})
			store.commit('setShouldUpdateUserText', false)
			store.commit('setAiText', {
				//确保每次AiText都有改变
				fileId: currentFileId.value,
				text: ''
			})
		}
	}
}

// 监控 currentFileId 的变化
watch(currentFileId, (newFileId, oldFileId) => {
	if (newFileId !== oldFileId) {
		selectFile(newFileId) // 当 currentFileId 变化时，自动加载新文档
	}
})

// 监听 newFileContent 的变化
// watch(newFileContent, (newValue) => {
// 	if (newValue) {
// 		handleSonThingUpdate()
// 	}
// })
watch(newFileContent, () => handleSonThingUpdate())

watch(fileContent, (newCotent) => {
	const saveFileContent = fileContent.value
	if (saveFileContent !== vditor.value.getValue()) {
		console.log('vditor.value.getValue()', vditor.value.getValue())
		console.log('fileContenttttttttttttttt', saveFileContent)
		vditor.value.setValue(saveFileContent)
	}
})
</script>

<style scoped>
body {
	background-color: #f8f8f8;
	margin: 0;
}
input:focus {
	outline: none;
	box-shadow: none;
}

.sidebar {
	padding: 20px;
	height: 100%;
}
</style>

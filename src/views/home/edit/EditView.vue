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
				<n-button text style="color: white; margin-right: 30px">联系我们</n-button>
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
							placeholder="搜索文件"
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
			<input type="text" v-model="newFileName" placeholder="输入新的文件名" :style="inputStyle" />
		</div>
		<div class="dialog-footer">
			<n-space size="large">
				<n-button @click="handleRenameConfirm" type="primary">确定</n-button>
				<n-button @click="handleRenameCancel">取消</n-button>
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
const editText = ref('') // 文本编辑器内的实时数据
const newFileContent = computed(() => store.getters['getAiText']) //Ai改过格式的数据
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
	return dropdownOpen.value ? '所有文件 - ' : '所有文件'
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

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value
}

const goHome = () => {
	store.commit('setSelectedMenuKey', '/recent-files')
	router.push('/recent-files')
}

const addNewItem = () => {
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/createFile',
		// url: 'http://10.6.3.167:8083/TextEditor/user/createFile',
		type: 'POST',
		success: function (response) {
			console.log('文件创建成功:', response)
			fetchFileList() // 重新获取文件列表
		},
		error: function (error) {
			console.error('文件创建失败:', error)
		}
	})
}

const fetchFileList = () => {
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/listFiles',
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
		url: 'http://192.168.0.129:8083/TextEditor/user/getFileInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(currentFileId.value),
		success: function (response) {
			if (response.code === 200) {
				currentFileContent.value = response.data
				console.log('currentFileContent.value', currentFileContent.value)
				vditor.value.setValue(currentFileContent.value) // Update Vditor with the file content
				store.commit('setSelectedMenuKey', fileId)
				store.commit('setUserText', currentFileContent.value)
			} else {
				console.error('获取文件内容时出错:', response.message)
			}
		},
		error: function (error) {
			console.error('获取文件内容失败:', error)
		}
	})
}
//搜索文件
const searchFiles = () => {
	if (searchQuery.value.trim() === '') {
		fetchFileList() // 如果搜索框为空，则重新获取所有文件
		return
	}
	console.log('FIleName', searchQuery.value)
	console.log('searchQuery.value.trim()', searchQuery.value.trim())
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/listFileByName',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(searchQuery.value.trim()), // 传递搜索参数
		success: function (response) {
			if (response.code === 200) {
				// 更新文件列表
				fileItems.value = response.data.map((file) => ({
					fileId: file.fileId,
					fileName: file.fileName
				}))
			} else {
				console.error('搜索文件时出错:', response.message)
			}
		},
		error: function (error) {
			console.error('搜索文件失败:', error)
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
		alert('文件名不能为空')
		return
	}
	console.log('renameDialogVisible.valuuuuuuuuuuuuuuuuuuuuuuue', renameDialogVisible.value)
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/updateFileName',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			fileId: currentFileId.value,
			fileName: newFileName.value
		}),
		dataType: 'json',
		success: (response) => {
			if (response.code === 200) {
				fetchFileList() // 更新文件列表
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
	fetchFileList() // 获取文件列表
	if (currentFileId.value) {
		selectFile(currentFileId.value) // Load the selected file content
	}
	vditor.value = new Vditor('vditor', {
		height: document.getElementById('vditor-container').offsetHeight,
		width: document.getElementById('vditor-container').offsetWidth,
		cache: { enable: false },
		input: (value) => {
			// 使用 `input` 回调函数监听内容变化
			if (currentFileId.value) {
				$.ajax({
					url: 'http://192.168.0.129:8083/TextEditor/user/saveFile',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						fileId: currentFileId.value,
						fileContent: value
					}),
					success: function (response) {
						console.log('文件保存成功:', response)
					},
					error: function (error) {
						console.error('文件保存失败:', error)
					}
				})
			}
		}
	})
})
// const handleSonThingUpdate = (aiText) => {
//   newFileContent.value = aiText;
// };
const handleSonThingUpdate = () => {
	currentFileContent.value = newFileContent.value // 将 newFileContent(Ai改过的) 的值赋值给 currentFileContent（展示的？）
	vditor.value.setValue(currentFileContent.value) // 更新 Vditor 中的内容
}

// setInterval(() => {
//   const content = vditor.value
//   if (content !== '' && content !== null && content !== undefined && content !== null) {
//     console.log('vditor content:', content);
//   }
// }, 1000)
// 监控 currentFileId 的变化
watch(currentFileId, (newFileId, oldFileId) => {
	if (newFileId !== oldFileId) {
		selectFile(newFileId) // 当 currentFileId 变化时，自动加载新文件
	}
})

watch(newFileContent, (newValue) => {
	if (newValue) {
		handleSonThingUpdate() // 当 newFileContent 改变时，自动更新 Vditor 内容
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

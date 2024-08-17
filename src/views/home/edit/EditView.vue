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
				<n-button text style="color: white; padding-right: 20px">这里是用户名</n-button>
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
							<div style="display: flex; flex-direction: column">
								<template v-for="(subItem, subIndex) in fileItems" :key="subIndex">
									<n-button block text @click="selectFile(subItem.fileId)" class="file-button"
										><Icon icon="ph:files-light" />
										{{ subItem.fileName }}
									</n-button>
								</template>
							</div>
						</n-collapse-item>
					</n-collapse>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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
	NLayoutContent
} from 'naive-ui'
import $ from 'jquery'

const router = useRouter()
const fileItems = ref([])
const dropdownOpen = ref(false)
const vditor = ref(null)
const currentFileId = ref(null) // Reference for current file ID
const currentFileContent = ref('') // Reference for current file content
const searchQuery = ref('') // 用于存储搜索框的值

const collapseTitle = computed(() => {
	return dropdownOpen.value ? '所有文件 - ' : '所有文件'
})

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value
}

const goHome = () => {
	router.push('/recent-files')
}

const addNewItem = () => {
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/createFile',
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

const selectFile = (fileId) => {
	currentFileId.value = fileId
	console.log('fileIdddddddddddddddddddddddddd', fileId)
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/getFileInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(fileId),
		success: function (response) {
			if (response.code === 200) {
				currentFileContent.value = response.data
				console.log('currentFileContent.value', currentFileContent.value)
				vditor.value.setValue(currentFileContent.value) // Update Vditor with the file content
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

onMounted(() => {
	fetchFileList() // 获取文件列表

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
.file-button {
	text-align: left !important;
	display: flex;
	margin-left: 0 !important;
	justify-content: space-between;
	margin-bottom: 10px; /* 每个选项之间的间距 */
	font-size: 18px; /* 增加文件名的字体大小 */
	text-overflow: ellipsis; /* 超出显示省略号 */
	overflow: hidden;
	white-space: nowrap;
	color: #333; /* 按钮文本颜色 */
}
.sidebar {
	padding: 20px;
	height: 100%;
}
</style>

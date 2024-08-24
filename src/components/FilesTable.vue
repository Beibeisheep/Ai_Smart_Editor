<template>
	<div class="container">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<n-space align="center" justify="space-between" style="width: 100%">
				<n-space align="center"
					><h2 class="recent-files-title">最近文档</h2>
					<input
						placeholder="搜索文档"
						class="search-input"
						v-model="searchQuery"
						@input="searchFiles"
						style="
							margin-left: 10px;
							opacity: 0.7;
							width: 200px;
							height: 36px;
							border: 1px solid black;
							border-radius: 3px;
						" />
					<n-button @click="addNewItem" type="primary" class="add-button">
						<Icon icon="teenyicons:add-solid" /> </n-button
				></n-space>
				<n-space
					><n-button type="error" text @click="handleDelete">
						<Icon icon="material-symbols:delete-sharp" /> 移动进回收站
					</n-button>
				</n-space>
			</n-space>
		</div>
		<n-space vertical class="table-container">
			<n-data-table
				:columns="columns"
				:data="tableData"
				:loading="loading"
				:checked-row-keys="selectedKeys"
				@update:checked-row-keys="handleSelectedKeysUpdate"
				:rowKey="(row) => row.fileId"
			/>

			<!-- 重命名对话框 -->
			<n-dialog class="rename" v-show="renameDialogVisible" title="重命名" :style="dialogStyle">
				<div class="dialog-content">
					<input
						type="text"
						v-model="newFileName"
						placeholder="输入新的文档名"
						:style="inputStyle"
					/>
				</div>
				<div class="dialog-footer">
					<n-space size="large">
						<n-button @click="handleRenameConfirm" type="primary">确定</n-button>
						<n-button @click="handleRenameCancel">取消</n-button>
					</n-space>
				</div>
			</n-dialog>
		</n-space>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted, h } from 'vue'
import { NDataTable, NSpace, NPopover, NButton, NDialog, NInput } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import $ from 'jquery'

export default defineComponent({
	components: {
		NDataTable,
		NSpace,
		NPopover,
		NButton,
		NDialog,
		NInput,
		Icon
	},
	setup() {
		const router = useRouter()
		const store = useStore()
		const tableData = ref([])
		const loading = ref(true)
		const renameDialogVisible = ref(false)
		const selectedFile = ref(null)
		const newFileName = ref('')
		const searchQuery = ref('') // 用于存储搜索框的值
		const selectedKeys = ref([])
		const handleSelectedKeysUpdate = (keys) => {
			selectedKeys.value = keys
		}
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
		const columns = [
			{
				type: 'selection',
				key: 'selection',
				size: 'medium',
				fixed: 'left'
			},
			{
				title: '文档名',
				key: 'fileName',
				ellipsis: {
					tooltip: true
				},
				align: 'center',
				render: (row) =>
					h('div', { style: 'display: flex; align-items: center; justify-content: center;' }, [
						h(
							'span',
							{
								class: 'file-name',
								style:
									'margin-right: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: pointer;',
								onClick: () => handlePreview(row)
							},
							row.fileName
						),
						h(
							NButton,
							{
								size: 'small',
								type: 'primary',
								style: 'margin-right: 8px;',
								text: true,
								onClick: () => handleRename(row)
							},
							() => h(Icon, { icon: 'ic:outline-drive-file-rename-outline' })
						)
					])
			},
			{
				title: '创建时间',
				key: 'fileCreateTime',
				align: 'center',
				render: (row) => formatDate(row.fileCreateTime)
			},
			{
				title: '最近更新时间',
				key: 'fileUpdateTime',
				align: 'center',
				render: (row) => formatDate(row.fileUpdateTime)
			}
		]

		//搜索文档
		const searchFiles = () => {
			if (searchQuery.value.trim() === '') {
				fetchData() // 如果搜索框为空，则重新获取所有文档
				return
			}
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/file/listFileByName',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(searchQuery.value.trim()), // 传递搜索参数
				success: function (response) {
					if (response.code === 200) {
						tableData.value = response.data.map((file) => ({
							fileId: file.fileId,
							fileName: file.fileName,
							fileCreateTime: file.fileCreateTime,
							fileUpdateTime: file.fileUpdateTime
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

		const addNewItem = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/file/createFile',
				type: 'POST',
				success: function (response) {
					console.log('文档创建成功:', response)
					window.$message.success('创建成功')
					fetchData() // 重新获取文档列表
				},
				error: function (error) {
					console.error('文档创建失败:', error)
					window.$message.error('创建失败')
				}
			})
		}

		// 获取数据
		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/file/listFiles',
				type: 'POST',
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						tableData.value = response.data
					} else {
						console.error('获取数据时出错:', response.message)
					}
					loading.value = false
				},
				error: (xhr, status, error) => {
					console.error('获取数据时出错:', {
						xhr,
						status,
						error
					})
					loading.value = false
				}
			})
		}

		// 时间格式化函数
		const formatDate = (dateString) => {
			const options = {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				timeZone: 'UTC',
				timeZoneName: 'short'
			}
			const date = new Date(dateString)
			return date.toLocaleString('zh-CN', options)
		}

		// 显示重命名对话框
		const handleRename = (row) => {
			selectedFile.value = row // 将当前行的数据存储到 selectedFile
			renameDialogVisible.value = true
			newFileName.value = row.fileName // 设置新文档名为当前文档名
			// newFileName.value = row.value ? row.value.fileName : ''
		}

		// 确认重命名操作
		const handleRenameConfirm = () => {
			console.log('FIleName', newFileName.value)
			console.log('searchQuery.value.trim()', newFileName.value.trim())
			if (!newFileName.value.trim()) {
				window.$message.error('文档名不能为空')
				return
			}

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/file/updateFileName',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					fileId: selectedFile.value.fileId,
					fileName: newFileName.value
				}),
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						fetchData()
						renameDialogVisible.value = false
						newFileName.value = ''
					} else {
						window.$message.error('重命名失败')
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

		// 移动进回收站操作
		const handleDelete = () => {
			if (selectedKeys.value.length === 0) {
				window.$message.warning('未选择文档')
				return
			}

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/file/removeFile',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(selectedKeys.value),
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						fetchData()
						selectedKeys.value = [] // 清空选中项
						window.$message.success('移动成功')
					} else {
						window.$message.error('移动失败')
					}
				},
				error: (xhr, status, error) => {
					console.error('删除时出错:', {
						xhr,
						status,
						error
					})
					window.$message.error('移动时出错')
				}
			})
		}

		// 文档预览
		const handlePreview = (row) => {
			console.log('selectedFile.value.fileId', row.fileId)
			store.commit('setSelectedItemKey', row.fileId)
			router.push('/home/edit')
			// $.ajax({
			// 	url: 'http://192.168.0.129:8083/TextEditor/file/getFileInfo',
			// 	type: 'POST',
			// 	contentType: 'application/json',
			// 	data: JSON.stringify(row.fileId),
			// 	success: function (response) {
			// 		if (response.code === 200) {
			// 			currentFileContent.value = response.data
			// 			store.commit('setUserText', {
			// 				fileId: row.fileId,
			// 				text: currentFileContent.value
			// 			})
			// 			console.log('currentFileContent.value', currentFileContent.value)
			// 		} else {
			// 			console.error('获取文档内容时出错:', response.message)
			// 		}
			// 	},
			// 	error: function (error) {
			// 		console.error('获取文档内容失败:', error)
			// 	}
			// })
		}

		// Mounted
		onMounted(() => {
			fetchData()
		})

		return {
			tableData,
			loading,
			columns,
			renameDialogVisible,
			dialogStyle,
			inputStyle,
			handleRenameConfirm,
			handleRenameCancel,
			handleSelectedKeysUpdate,
			handleDelete,
			addNewItem,
			searchQuery,
			newFileName,
			searchFiles,
			selectedKeys
		}
	}
})
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	background-color: #f5f5f5;
	height: 100%;
	box-sizing: border-box;
}
.navbar {
	margin-top: 34px;
	background-color: #f8f9fa;
	padding: 16px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	border-bottom: 1px solid #e9ecef;
	display: flex;
	align-items: center;
}
.add-button {
	margin-left: -10px; /* Reduced margin to close gap */
	height: 36px;
	line-height: 36px; /* Ensure text alignment inside the button */
}

.table-container {
	flex: 1;
	overflow: auto;
}

.recent-files-title {
	padding: 0;
	font-size: 24px;
	color: #333;
	font-weight: normal;
}

.search-bar {
	display: flex;
	align-items: center;
}

/* 确保移除输入框在聚焦时的黑色边框和阴影效果 */
input:focus {
	outline: none !important;
	box-shadow: none !important;
}

.rename,
.delete {
	width: 300px;
}

.dialog-content {
	margin-bottom: 20px;
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
}
</style>

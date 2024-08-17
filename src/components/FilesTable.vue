<template>
	<div class="container">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<h2 class="recent-files-title">最近文件</h2>
			<input
				placeholder="搜索文件"
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
					margin-right: 3px;
				"
			/>
			<n-button @click="addNewItem" type="primary">
				<Icon icon="teenyicons:add-solid" />
			</n-button>
		</div>
		<n-space vertical class="table-container">
			<n-data-table :columns="columns" :data="tableData" :loading="loading" />

			<!-- 重命名对话框 -->
			<n-dialog class="rename" v-show="renameDialogVisible" title="重命名" :style="dialogStyle">
				<div class="dialog-content">
					<input
						type="text"
						v-model="newFileName"
						placeholder="输入新的文件名"
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

			<!-- 删除确认对话框 -->
			<n-dialog
				class="delete"
				v-show="deleteDialogVisible"
				title="确认删除"
				:style="dialogStyle"
				type="warning"
			>
				<div class="dialog-content">
					<p>确认删除吗？</p>
				</div>
				<div class="dialog-footer">
					<n-space size="large">
						<n-button @click="handleDeleteConfirm" type="warning">删除</n-button>
						<n-button @click="handleDeleteCancel">取消</n-button>
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
		const tableData = ref([])
		const loading = ref(true)
		const renameDialogVisible = ref(false)
		const deleteDialogVisible = ref(false)
		const selectedFile = ref(null)
		const newFileName = ref('')
		const searchQuery = ref('') // 用于存储搜索框的值

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
				title: '文件名',
				key: 'fileName',
				align: 'center',
				render: (row) =>
					h(
						NPopover,
						{
							trigger: 'click',
							placement: 'bottom',
							showArrow: true,
							vModel: (val) => {
								row.popoverVisible = val
							}
						},
						{
							trigger: () =>
								h(
									'span',
									{
										class: 'file-name',
										style:
											'margin-right: 8px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor: pointer;',
										onClick: () => handleFileClick(row)
									},
									row.fileName
								),
							default: () =>
								h(NSpace, { vertical: true }, [
									h(NButton, { size: 'small', text: 'true', onClick: handleRename }, () => [
										h(Icon, { icon: 'ic:outline-drive-file-rename-outline' }),
										'重命名'
									]),
									h(NButton, { size: 'small', text: 'true', onClick: handleDelete }, () => [
										h(Icon, { icon: 'material-symbols:delete-sharp' }),
										'删除文件'
									]),
									h(NButton, { size: 'small', text: 'true', onClick: handlePreview }, () => [
										h(Icon, { icon: 'ph:eye-duotone' }),
										'预览文件'
									])
								])
						}
					)
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

		const handleFileClick = (file) => {
			selectedFile.value = file
		}

		//搜索文件
		const searchFiles = () => {
			if (searchQuery.value.trim() === '') {
				fetchData() // 如果搜索框为空，则重新获取所有文件
				return
			}
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/listFileByName',
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
						console.error('搜索文件时出错:', response.message)
					}
				},
				error: function (error) {
					console.error('搜索文件失败:', error)
				}
			})
		}

		const addNewItem = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/createFile',
				type: 'POST',
				success: function (response) {
					console.log('文件创建成功:', response)
					fetchData() // 重新获取文件列表
				},
				error: function (error) {
					console.error('文件创建失败:', error)
				}
			})
		}

		// 获取数据
		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/listFiles',
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
		const handleRename = () => {
			renameDialogVisible.value = true
			newFileName.value = selectedFile.value ? selectedFile.value.fileName : ''
		}

		// 确认重命名操作
		const handleRenameConfirm = () => {
			console.log('FIleName', newFileName.value)
			console.log('searchQuery.value.trim()', newFileName.value.trim())
			if (!newFileName.value.trim()) {
				alert('文件名不能为空')
				return
			}

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/updateFileName',
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

		// 显示删除确认对话框
		const handleDelete = () => {
			deleteDialogVisible.value = true
		}

		// 确认删除操作
		const handleDeleteConfirm = () => {
			if (!selectedFile.value) return

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/removeFile',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(selectedFile.value.fileId),
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						fetchData()
						deleteDialogVisible.value = false
						selectedFile.value = null
					} else {
						console.error('删除失败:', response.message)
					}
				},
				error: (xhr, status, error) => {
					console.error('删除时出错:', {
						xhr,
						status,
						error
					})
				}
			})
		}

		// 取消删除操作
		const handleDeleteCancel = () => {
			deleteDialogVisible.value = false
			selectedFile.value = null
		}

		// 文件预览
		const handlePreview = () => {
			router.push('/home/edit')
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
			deleteDialogVisible,
			dialogStyle,
			inputStyle,
			handleRenameConfirm,
			handleRenameCancel,
			handleDeleteConfirm,
			handleDeleteCancel,
			addNewItem,
			searchQuery,
			newFileName,
			searchFiles
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

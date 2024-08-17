<template>
	<div class="container">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<n-space align="center" justify="space-between" style="width: 100%">
				<h2 class="recycle-bin-title">回收站</h2>
				<n-button type="error" text @click="showClearConfirm">
					<Icon icon="ic:outline-delete" /> 清空回收站
				</n-button>
			</n-space>
		</div>
		<!-- 数据表格 -->
		<n-space vertical class="table-container">
			<n-data-table :columns="columns" :data="tableData" :loading="loading" />
		</n-space>

		<!-- 清空回收站确认对话框 -->
		<n-dialog
			class="clear"
			v-show="clearDialogVisible"
			title="确认清空回收站"
			:style="dialogStyle"
			type="warning"
		>
			<div class="dialog-content">
				<p>所有文件将彻底删除，无法恢复，是否继续？</p>
			</div>
			<div class="dialog-footer">
				<n-space size="large">
					<n-button @click="handleClearConfirm" type="warning">确认</n-button>
					<n-button @click="handleClearCancel">取消</n-button>
				</n-space>
			</div>
		</n-dialog>

		<!-- 恢复确认对话框 -->
		<n-dialog
			class="restore"
			v-show="restoreDialogVisible"
			title="确认恢复文件"
			:style="dialogStyle"
		>
			<div class="dialog-content">
				<p>确认恢复此文件吗？</p>
			</div>
			<div class="dialog-footer">
				<n-space size="large">
					<n-button @click="handleRestoreConfirm" type="primary">确认</n-button>
					<n-button @click="handleRestoreCancel">取消</n-button>
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
				<p>确认彻底删除此文件吗？</p>
			</div>
			<div class="dialog-footer">
				<n-space size="large">
					<n-button @click="handleDeleteConfirm" type="warning">删除</n-button>
					<n-button @click="handleDeleteCancel">取消</n-button>
				</n-space>
			</div>
		</n-dialog>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted, h } from 'vue'
import { NDataTable, NSpace, NButton, NDialog, NPopover } from 'naive-ui'
import { Icon } from '@iconify/vue'
import $ from 'jquery'

export default defineComponent({
	components: {
		NDataTable,
		NSpace,
		NButton,
		NDialog,
		NPopover,
		Icon
	},
	setup() {
		const tableData = ref([])
		const loading = ref(true)
		const clearDialogVisible = ref(false)
		const restoreDialogVisible = ref(false)
		const deleteDialogVisible = ref(false)
		const selectedFile = ref(null)

		const dialogStyle = {
			width: '300px',
			height: 'auto',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between'
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
									h(
										NButton,
										{ size: 'small', text: 'true', onClick: () => handleRestore(row) },
										() => [h(Icon, { icon: 'ic:outline-restore-from-trash' }), '恢复文件']
									),
									h(
										NButton,
										{ size: 'small', text: 'true', onClick: () => handleDelete(row) },
										() => [h(Icon, { icon: 'material-symbols:delete-sharp' }), '彻底删除']
									)
								])
						}
					)
			},
			{
				title: '删除时间',
				key: 'fileDeleteTime',
				align: 'center',
				render: (row) => formatDate(row.fileDeleteTime)
			}
		]
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
			return date.toLocaleString(undefined, options).replace(',', '')
		}
		const handleFileClick = (file) => {
			selectedFile.value = file
		}

		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/getRecycleBinFileInfo',
				type: 'POST',
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						tableData.value = response.data
					} else {
						console.error('Error fetching data:', response.message)
					}
					loading.value = false
				},
				error: (xhr, status, error) => {
					console.error('Error fetching data:', { xhr, status, error })
					loading.value = false
				}
			})
		}

		const deleteAllFiles = () => {
			const fileIds = tableData.value.map((file) => file.fileId) // 假设文件 ID 存储在 `id` 字段中

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/deleteFiles',
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(fileIds),
				success: (response) => {
					if (response.code === 200) {
						fetchData()
						clearDialogVisible.value = false
					} else {
						console.error('Error deleting files:', response.message)
					}
				},
				error: (xhr, status, error) => {
					console.error('Error deleting files:', { xhr, status, error })
				}
			})
		}

		const showClearConfirm = () => {
			clearDialogVisible.value = true
		}

		const handleClearConfirm = () => {
			deleteAllFiles()
		}

		const handleClearCancel = () => {
			clearDialogVisible.value = false
		}

		const handleRestore = (file) => {
			selectedFile.value = file
			restoreDialogVisible.value = true
		}

		const handleRestoreConfirm = () => {
			if (!selectedFile.value) {
				console.error('No file selected for restoration.')
				return
			}

			// Prepare the data as an array containing the file ID(s)
			const fileIdsToRestore = [selectedFile.value.fileId]

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/recoverFile',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(fileIdsToRestore),
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						fetchData()
						restoreDialogVisible.value = false
						selectedFile.value = null
					} else {
						console.error('恢复失败:', response.message)
					}
				},
				error: (xhr, status, error) => {
					console.error('恢复时出错:', { xhr, status, error })
				}
			})
		}

		const handleRestoreCancel = () => {
			restoreDialogVisible.value = false
			selectedFile.value = null
		}

		const handleDelete = (file) => {
			selectedFile.value = file
			deleteDialogVisible.value = true
		}

		const handleDeleteConfirm = () => {
			if (!selectedFile.value) {
				console.error('No file selected for deletion.')
				return
			}

			// Prepare the data as an array containing the file ID(s)
			const fileIdsToDelete = [selectedFile.value.fileId]

			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/deleteFiles',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(fileIdsToDelete),
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
					console.error('删除时出错:', { xhr, status, error })
				}
			})
		}

		const handleDeleteCancel = () => {
			deleteDialogVisible.value = false
			selectedFile.value = null
		}

		onMounted(() => {
			fetchData()
		})

		return {
			tableData,
			loading,
			columns,
			clearDialogVisible,
			restoreDialogVisible,
			deleteDialogVisible,
			selectedFile,
			showClearConfirm,
			handleClearConfirm,
			handleClearCancel,
			handleRestore,
			handleRestoreConfirm,
			handleRestoreCancel,
			handleDelete,
			handleDeleteConfirm,
			handleDeleteCancel,
			dialogStyle
		}
	}
})
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
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

.file-name {
	cursor: default;
}

.file-name:hover {
	cursor: pointer;
	text-decoration: underline;
	color: #007bff;
}

.clear .dialog-content,
.restore .dialog-content,
.delete .dialog-content {
	margin-bottom: 16px;
}

.clear .dialog-footer,
.restore .dialog-footer,
.delete .dialog-footer {
	display: flex;
	justify-content: flex-end;
}
.recycle-bin-title {
	color: rgba(0, 0, 0, 0.721);
}
.n-dialog {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>

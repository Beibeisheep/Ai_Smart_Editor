<template>
	<div class="container">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<div><h2>最近文件</h2></div>
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
		NInput
	},
	setup() {
		const router = useRouter()
		const tableData = ref([])
		const loading = ref(true)
		const renameDialogVisible = ref(false)
		const deleteDialogVisible = ref(false)
		const selectedFile = ref(null)
		const newFileName = ref('')

		// 对话框样式
		const dialogStyle = {
			width: '300px',
			height: 'auto',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between'
		}
		const inputStyle = {
			border: '1px solid #dcdcdc',
			borderRadius: '4px',
			padding: '8px',
			fontSize: '14px',
			width: '100%',
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

		// 获取数据
		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.1.5:8083/TextEditor/user/listFiles',
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
			return date.toLocaleString(undefined, options).replace(',', '')
		}

		// 显示重命名对话框
		const handleRename = () => {
			renameDialogVisible.value = true
			newFileName.value = selectedFile.value ? selectedFile.value.fileName : ''
		}

		// 确认重命名操作
		const handleRenameConfirm = () => {
			if (!newFileName.value.trim()) {
				alert('文件名不能为空')
				return
			}

			$.ajax({
				url: 'http://192.168.1.5:8083/TextEditor/user/updateFileName',
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
					console.error('重命名时出错:', {
						xhr,
						status,
						error
					})
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
				url: 'http://192.168.1.5:8083/TextEditor/user/removeFile',
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

		const handlePreview = () => {
			router.push('/home/edit')
		}

		onMounted(() => {
			fetchData()
		})

		return {
			tableData,
			loading,
			columns,
			renameDialogVisible,
			deleteDialogVisible,
			selectedFile,
			newFileName,
			handleFileClick,
			handleRename,
			handleRenameConfirm,
			handleRenameCancel,
			handleDelete,
			handleDeleteConfirm,
			handleDeleteCancel,
			dialogStyle,
			inputStyle
		}
	}
})
</script>

<style scoped>
.navbar {
	margin-top: 34px;
	background-color: #f8f9fa; /* 背景色 */
	padding: 16px; /* 内边距 */
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
	display: flex;
	align-items: center;
	border-bottom: 1px solid #e9ecef; /* 底部边框 */
}
.container {
	display: flex;
	flex-direction: column;
	height: 100%;
}
.table-container {
	flex: 1; /* 使数据表格容器占据剩余空间 */
	overflow: auto; /* 确保数据表格内容能滚动查看 */
}
.file-name {
	cursor: default;
}

.file-name:hover {
	cursor: pointer;
	text-decoration: underline;
	color: #007bff;
}

.rename.dialog-button {
	margin-left: 5px;
}

.rename.dialog-content {
	margin-bottom: 16px;
}

.rename.dialog-footer {
	display: flex;
	justify-content: flex-end;
}

.delete.dialog-button {
	margin-left: 5px;
}

.delete.dialog-content {
	margin-bottom: 16px;
}

.delete.dialog-footer {
	display: flex;
	justify-content: flex-end;
}

.dialog-button:last-child {
	margin-right: 0;
}
</style>

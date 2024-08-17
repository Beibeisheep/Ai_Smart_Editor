<template>
	<div class="container">
		<!-- 顶部导航栏 -->
		<div class="navbar">
			<h2>回收站</h2>
		</div>
		<!-- 数据表格 -->
		<n-space vertical class="table-container">
			<n-data-table :columns="columns" :data="tableData" :loading="loading" />
		</n-space>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { NDataTable, NSpace } from 'naive-ui'
import $ from 'jquery'

export default defineComponent({
	components: {
		NDataTable,
		NSpace
	},
	setup() {
		const tableData = ref([])
		const loading = ref(true)
		const columns = [
			{
				title: '文件名',
				key: 'fileName',
				align: 'center'
			},
			{
				title: '删除时间',
				key: 'fileDeleteTime',
				align: 'center'
			}
		]

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

		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/getRecycleBinFileInfo',
				type: 'POST',
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						// 格式化时间
						const formattedData = response.data.map((item) => ({
							...item,
							fileDeleteTime: formatDate(item.fileDeleteTime)
						}))
						tableData.value = formattedData
					} else {
						console.error('Error fetching data:', response.message)
					}
					loading.value = false
				},
				error: (xhr, status, error) => {
					console.error('Error fetching data:', {
						xhr,
						status,
						error
					})
					loading.value = false
				}
			})
		}

		onMounted(() => {
			fetchData()
		})

		return {
			tableData,
			loading,
			columns
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
}

.table-container {
	flex: 1; /* 使数据表格容器占据剩余空间 */
	overflow: auto; /* 确保数据表格内容能滚动查看 */
}
</style>

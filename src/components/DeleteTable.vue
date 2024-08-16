<template>
	<n-space vertical>
		<n-data-table :columns="columns" :data="tableData" :loading="loading" />
	</n-space>
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
		const userId = ref(null)
		// 定义表格的列
		const columns = [
			{
				title: '文件名',
				key: 'filename',
				align: 'center'
			},
			{
				title: '删除时间',
				key: 'deleteTime',
				align: 'center'
			}
		]

		// 获取数据
		const fetchData = () => {
			$.ajax({
				url: 'http://192.168.0.129:8083/TextEditor/user/getRecycleBinFileInfo',
				type: 'POST',
				dataType: 'json',
				success: (response) => {
					if (response.code === 200) {
						tableData.value = response.data // 从data字段提取数据
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
/* 可在此处添加自定义样式 */
</style>

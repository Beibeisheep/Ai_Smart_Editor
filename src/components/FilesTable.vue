<template>
	<div>
		<table class="files-table">
			<thead>
				<tr>
					<th>文件名</th>
					<th>创建者</th>
					<th>打开时间</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item, index) in tableData" :key="index">
					<td>{{ item.filename }}</td>
					<td>{{ item.creator }}</td>
					<td>{{ item.openTime }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import $ from 'jquery'

export default defineComponent({
	setup() {
		const tableData = ref([])
		const loading = ref(true)

		const fetchData = () => {
			$.ajax({
				url: 'http://10.6.3.167:8083/api/files',
				type: 'GET',
				success: (data) => {
					tableData.value = data
					loading.value = false
				},
				error: (xhr, status, error) => {
					console.error('Error fetching data:', error)
					loading.value = false
				}
			})
		}

		onMounted(() => {
			fetchData()
		})

		return {
			tableData,
			loading
		}
	}
})
</script>

<style scoped>
.files-table {
	width: 100%;
	border-collapse: collapse;
}

.files-table th,
.files-table td {
	border: 1px solid #f4f4f4;
	padding: 8px;
	color: #000; /* 设置表头和单元格的文字颜色为黑色 */
}

.files-table th {
	background-color: #f4f4f4;
}
</style>

<template>
	<div>
		<table v-if="!loading" class="data-table">
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
		<div v-else>加载中...</div>
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
			// $.ajax({
			// 	url: 'http://10.6.3.167:8083/api/files',
			// 	type: 'GET',
			// 	success: (data) => {
			// 		tableData.value = data
			// 		loading.value = false
			// 	},
			// 	error: (xhr, status, error) => {
			// 		console.error('Error fetching data:', error)
			// 		loading.value = false
			// 	}
			// })
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
.data-table {
	width: 100%;
	border-collapse: collapse;
}

.data-table th,
.data-table td {
	border: 1px solid #ddd;
	padding: 8px;
}

.data-table th {
	background-color: #f4f4f4;
}
</style>

<template>
	<div class="sidebar">
		<div class="btn">
			<n-button @click="createFile" type="submit" class="btn btn-primary">创建</n-button>
		</div>
		<n-menu :options="menuOptions" :value="selectedKey" @update:value="handleMenuClick" />
	</div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { NButton, NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'

export default defineComponent({
	components: {
		NMenu,
		NButton
	},
	setup() {
		const router = useRouter()
		const selectedKey = ref('')

		const menuItems = ref([
			{ label: '最近文件', path: '/recent-files' },
			{ label: '回收站', path: '/recycle-bin' }
		])

		const menuOptions = computed(() =>
			menuItems.value.map((item) => ({
				label: item.label,
				key: item.path,
				path: item.path
			}))
		)

		const createFile = () => {
			console.log('创建了一个文件')
			$.ajax({
				url: 'http://192.168.1.5:8083/TextEditor/user/createFile',
				// url: 'http://10.6.3.167:8083/TextEditor/user/createFile',
				type: 'POST',
				success: function (response) {
					console.log('文件创建成功:', response)
					// 处理成功后的逻辑，例如更新文件列表
				},
				error: function (error) {
					console.error('文件创建失败:', error)
				}
			})
			router.push('/home/edit')
		}
		// const createFile = () => {
		// 	console.log('创建了一个文件')
		// 	$.ajax({
		// 		url: 'http://192.168.1.5:8083/TextEditor/user/createFile',
		// 		// url: 'http://10.6.3.167:8083/TextEditor/user/createFile',
		// 		type: 'POST',
		// 		success: function (response) {
		// 			if (response.fileId) {
		// 				// 假设response中返回了fileId
		// 				currentFileId.value = response.fileId
		// 				console.log('获取到的文件ID:', currentFileId.value)
		// 				// 在文件创建成功后，可以将用户重定向到编辑页面，并传递fileId
		// 				router.push({ path: `/home/edit`, query: { fileId: currentFileId.value } })
		// 			} else {
		// 				console.error('文件ID未返回')
		// 			}
		// 		},
		// 		error: function (error) {
		// 			console.error('文件创建失败:', error)
		// 		}
		// 	})
		// }
		const handleMenuClick = (key) => {
			const item = menuItems.value.find((menuItem) => menuItem.path === key)
			if (item) {
				console.log('点击了菜单项：', item.label)
				router.push(item.path)
				selectedKey.value = key // 更新选中的菜单项
			}
		}

		return {
			menuOptions,
			handleMenuClick,
			createFile,
			selectedKey
		}
	}
})
</script>

<style scoped>
.sidebar {
	width: 200px;
	height: calc(100vh - 10vh);
	background-color: #f5f5f5;
	padding: 1rem;
	position: fixed;
	top: 10vh;
	left: 0;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

div.btn {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
}

.btn-primary {
	width: 100%;
	padding: 10px;
	font-size: 18px;
	background-color: #354c6e !important;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.btn-primary:hover {
	background-color: #1e314d !important;
}
</style>

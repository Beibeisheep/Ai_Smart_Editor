<template>
	<div class="sidebar">
		<div class="btn">
			<n-button @click="createFile" type="submit" class="btn btn-primary">创建</n-button>
		</div>
		<n-menu :options="menuOptions" :value="selectedKey" @update:value="handleMenuClick" />
	</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { NButton, NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'

export default defineComponent({
	components: {
		NMenu,
		NButton
	},
	setup() {
		const store = useStore()
		const router = useRouter()

		// 从 Vuex 中获取 selectedMenuKey
		const selectedKey = computed(() => store.getters['getSelectedMenuKey'])
		console.log('selectedKeyyyyyyyyyyyyyyyy', selectedKey)
		const menuItems = [
			{ label: '最近文档', path: '/recent-files' },
			{ label: '回收站', path: '/recycle-bin' }
		]

		const menuOptions = computed(() =>
			menuItems.map((item) => ({
				label: item.label,
				key: item.path,
				path: item.path
			}))
		)

		const createFile = () => {
			console.log('创建了一个文档')
			$.ajax({
				url: 'http://192.168.1.5:8083/TextEditor/file/createFile',
				type: 'POST',
				success: function (response) {
					console.log('文档创建成功:', response)
					store.commit('setSelectedItemKey', response.data.fileId)
					router.push('/home/edit')
				},
				error: function (error) {
					console.error('文档创建失败:', error)
					window.$message.error('创建失败')
				}
			})
		}

		const handleMenuClick = (key) => {
			const item = menuItems.find((menuItem) => menuItem.path === key)
			if (item) {
				console.log('点击了菜单项：', item.label)
				router.push(item.path)
				// 使用 Vuex mutation 更新 selectedKey
				store.commit('setSelectedMenuKey', key)
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

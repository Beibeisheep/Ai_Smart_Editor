<!-- <template>
	<div class="layout">
		<div class="sidebar">
			<div class="btn">
				<n-button @click="createFile" type="submit" class="btn btn-primary">创建</n-button>
			</div>
			<n-menu :options="menuOptions" @update:value="handleMenuClick" />
		</div>
		<div class="box">
			<router-view />
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { NButton, NMenu } from 'naive-ui'
import EditView from './edit/EditView.vue';
import { useRouter } from 'vue-router'

export default defineComponent({
	components: {
		NMenu,
		NButton
	},
	setup() {
		const router = useRouter()

		const menuItems = ref([
			{ label: '最近文件', path: '/recent-files' },
			{ label: '回收站', path: '/recycle-bin' }
		])

		const menuOptions = computed(() =>
			menuItems.value.map((item, index) => ({
				label: item.label,
				key: index.toString(),
				path: item.path
			}))
		)

		const createFile = () => {
			console.log('创建了一个文件')

			const router = useRouter() // 需要使用 router
			router.push('/home/edit') // 导航到编辑页面
			// 这里可以添加展示通知的逻辑
			// nNotification.info({
			// 	title: '通知',
			// 	description: '文件已创建！'
			// })

			// 或者路由导航到新的页面
			// this.$router.push('/new-file')
		}

		const handleMenuClick = (key) => {
			const index = parseInt(key)
			const item = menuItems.value[index]
			if (item && item.path) {
				console.log('点击了菜单项：', item.label)
				router.push(item.path)
			}
		}

		return {
			menuOptions,
			handleMenuClick,
			createFile
		}
	}
})
</script>

<style scoped>
.layout {
	display: flex;
	height: 100vh;
}

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

.box {
	margin-left: 200px;
	margin-top: 60px;
	padding: 2rem;
	background-color: #fff;
	border-radius: 5%;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	overflow: auto;
	flex: 1;
}
</style> -->
<template>
	<div class="layout">
		<SideBar></SideBar>
		<div class="box">
			<router-view />
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { NButton, NMenu } from 'naive-ui'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
export default defineComponent({
	components: {
		SideBar
	},
	setup() {
		const router = useRouter()
	}
})
</script>

<style scoped>
.layout {
	display: flex;
	height: 100vh;
}

.box {
	margin-left: 200px;
	margin-top: 60px;
	padding: 2rem;
	background-color: #fff;
	border-radius: 5%;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	overflow: auto;
	flex: 1;
}
</style>

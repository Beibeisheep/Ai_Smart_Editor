<template>
	<div class="layout">
		<div class="sidebar">
			<div class="btn">
				<n-button @click="createFile" type="submit" class="btn btn-primary">创建</n-button>
			</div>
			<n-menu :options="menuOptions" @update:value="handleMenuClick" />
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
		const menuItems = ref([
			{ label: '最近文件', path: '/settings' },
			{ label: '回收站', path: '/help' }
		])

		const menuOptions = computed(() =>
			menuItems.value.map((item, index) => {
				if (item.type === 'group') {
					return {
						type: 'group',
						title: item.label,
						key: `group-${index}`
					}
				}
				return {
					label: item.label,
					key: index,
					path: item.path
				}
			})
		)

		// 创建文件的点击事件处理
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
			const item = menuItems.value[key]
			if (item && item.path) {
				console.log('点击了菜单项：', item.label)
				// 这里可以使用路由导航到对应路径
				// this.$router.push(item.path)
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
	margin-top: 30px; /* Added margin top for spacing */
}

.btn-primary {
	width: 100%;
	padding: 10px;
	font-size: 18px;
	background-color: #354c6e !important; /* Blue button background color */
	color: white; /* Button text color */
	border: none;
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease; /* Smooth transition for hover effect */
}

.btn-primary:hover {
	background-color: #1e314d !important; /* Darker shade of blue on hover */
}

.box {
	margin-left: 200px;
	padding: 2rem;
	background-color: #fff;
	border-radius: 5%;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>

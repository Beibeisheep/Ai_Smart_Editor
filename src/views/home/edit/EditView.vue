<!--
 * @Author: Beibeisheep 3248679944@qq.com
 * @Date: 2024-08-13 00:49:52
 * @LastEditors: Beibeisheep 3248679944@qq.com
 * @LastEditTime: 2024-08-14 12:13:59
 * @FilePath: \vue3-template\src\views\Demo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<n-layout style="height: 100vh">
		<n-layout-header
			style="
				background: #339;
				color: white;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 60px;
				padding: 0 20px;
			"
		>
			<n-space>
				<n-button
					@click="goHome"
					size="large"
					style="
						margin-left: 10px;
						background-color: #ffcc00;
						color: #333;
						border: none;
						box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
					"
				>
					返回主页面
				</n-button>
				<n-button text @click="toggleDropdown" style="color: #339">
					{{ dropdownOpen ? '-' : '+' }}
				</n-button>
			</n-space>
			<n-space style="margin-left: auto">
				<n-button text style="color: white; margin-right: 30px">联系我们</n-button>
				<n-button text style="color: white; padding-right: 20px">这里是用户名</n-button>
			</n-space>
		</n-layout-header>

		<n-layout has-sider style="height: calc(100vh - 60px)">
			<n-layout-sider width="250" style="background-color: #f0f0f0">
				<div class="sidebar">
					<div style="display: flex; align-items: center; margin-bottom: 20px">
						<n-input
							placeholder="搜索文件"
							style="opacity: 0.7; flex: 1; margin-right: 10px"
							clearable
						/>
						<n-button @click="addNewItem" type="primary">+</n-button>
					</div>
					<n-collapse v-model:value="dropdownOpen">
						<n-collapse-item name="files" :title="collapseTitle">
							<div style="display: flex; flex-direction: column">
								<template v-for="(subItem, subIndex) in fileItems" :key="subIndex">
									<router-link :to="subItem.path" style="margin-bottom: 5px">
										{{ subItem.label }}
									</router-link>
								</template>
							</div>
						</n-collapse-item>
					</n-collapse>
					<AiText />
				</div>
			</n-layout-sider>

			<n-layout-content style="padding: 0; overflow: auto">
				<div style="display: flex; height: 100%">
					<div id="vditor-container" style="flex: 1; height: 100%; width: 100%">
						<div id="vditor"></div>
					</div>
				</div>
			</n-layout-content>
		</n-layout>
	</n-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
	NInput,
	NCollapse,
	NCollapseItem,
	NButton,
	NSpace,
	NLayout,
	NLayoutHeader,
	NLayoutSider,
	NLayoutContent
} from 'naive-ui'
import { useRouter } from 'vue-router'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import AiText from '@/components/AiText.vue'
const router = useRouter()
const fileItems = ref([
	{ label: '文件1', path: '/file1' },
	{ label: '文件2', path: '/file2' }
])
const dropdownOpen = ref(false)

const collapseTitle = computed(() => {
	return dropdownOpen.value ? '折叠面板标题 - ' : '折叠面板标题'
})

const toggleDropdown = () => {
	dropdownOpen.value = !dropdownOpen.value
}

const goHome = () => {
	router.push('/home/Home')
}

const addNewItem = () => {
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/user/createFile',
		type: 'POST',
		success: function (response) {
			console.log('文件创建成功:', response)
			// 处理成功后的逻辑，例如更新文件列表
		},
		error: function (error) {
			console.error('文件创建失败:', error)
		}
	})
}

onMounted(() => {
	new Vditor('vditor', {
		height: document.getElementById('vditor-container').offsetHeight,
		width: document.getElementById('vditor-container').offsetWidth,
		cache: { enable: false }
	})
})
</script>

<style scoped>
body {
	background-color: #f8f8f8;
	margin: 0;
}

.sidebar {
	padding: 20px;
	height: 100%;
}
</style>

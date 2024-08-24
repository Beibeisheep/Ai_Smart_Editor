<!--
 * @Author: Beibeisheep 3248679944@qq.com
 * @Date: 2024-08-07 23:09:33
 * @LastEditors: Beibeisheep 3248679944@qq.com
 * @LastEditTime: 2024-08-07 23:20:44
 * @FilePath: \AI_Smart_Editor\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AiText from './components/AiText.vue'
import NavBar from './components/NavBar.vue'

// 获取当前路由信息
const route = useRoute()

// 定义需要隐藏 NavBar 的路径
const hideNavBarPaths = ['/home/edit', '/contact-us', '/preview', '/change-password']

// 判断当前路径是否应该隐藏 NavBar
const ShowNavBar = computed(() => {
	return !hideNavBarPaths.includes(route.path)
})
</script>

<template>
	<div>
		<n-message-provider>
			<MessageApi />
		</n-message-provider>

		<!-- 仅在 ShowNavBar 为 true 时渲染 NavBar -->
		<NavBar v-if="ShowNavBar" />
		<router-view></router-view>
		<!-- 测试的ai窗口 -->
		<AiText />
	</div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import MessageApi from './components/MessageApi.vue'
import { NMessageProvider } from 'naive-ui'

export default {
	components: {
		NavBar,
		MessageApi
	}
}
</script>

<style scoped>
header {
	background-color: #f8f9fa;
	padding: 20px 0;
	border-bottom: 1px solid #e9ecef;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	text-align: center;
}

nav {
	display: flex;
	justify-content: center;
	margin-top: 10px;
}

nav a {
	font-weight: bold;
	color: #6c757d;
	text-decoration: none;
	padding: 10px 15px;
	margin: 0 5px;
	border-radius: 5px;
	transition:
		background-color 0.3s ease,
		color 0.3s ease;
}

nav a.router-link-exact-active {
	color: #007bff;
	background-color: #e9ecef;
}

nav a:hover {
	color: #0056b3;
	background-color: #f1f3f5;
}
</style>

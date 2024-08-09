<!--
 * @Author: Beibeisheep 3248679944@qq.com
 * @Date: 2024-08-07 23:09:33
 * @LastEditors: Beibeisheep 3248679944@qq.com
 * @LastEditTime: 2024-08-07 23:20:44
 * @FilePath: \AI_Smart_Editor\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AiText from './components/AiText.vue'
</script>

<template>
	<!-- <header>
		<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

		<div class="wrapper">
			<HelloWorld msg="You did it!" />
			<NavBar />
			<router-view></router-view>
		</div>
	</header> -->
	<div>
		<NavBar />
		<router-view></router-view>
		<!-- 测试的ai窗口 -->
		<AiText />
	</div>
	<!-- <RouterView /> -->
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
	components: {
		NavBar
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

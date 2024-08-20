<template>
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
				返回
			</n-button>
		</n-space>
		<n-space style="margin-left: auto">
			<router-link to="/contact-us">
				<n-button text style="color: white; margin-right: 30px"> 联系我们 </n-button>
			</router-link>
			<n-button text style="color: white; padding-right: 20px"
				>用户名: {{ $store.state.user.email }}</n-button
			>
		</n-space>
	</n-layout-header>
	<div class="center-container">
		<n-card class="contact-us">
			<div class="content">
				<h1 class="large">{{ title }}</h1>
				<p>{{ description }}</p>
			</div>
			<n-form @submit.prevent="handleSubmit">
				<n-form-item path="name" label="姓名" required>
					<n-input type="text" placeholder="请输入您的姓名"></n-input>
				</n-form-item>
				<n-form-item path="email" label="邮箱" required>
					<n-input type="text" placeholder="请输入您的邮箱"></n-input>
				</n-form-item>
				<n-form-item path="message" label="留言" required>
					<n-input
						type="textarea"
						placeholder="请输入您的内容"
						:autosize="{
							minRows: 3,
							maxRows: 4
						}"
						show-count
					></n-input>
				</n-form-item>
				<n-button type="primary" class="submit-btn">提交</n-button>
			</n-form>
		</n-card>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import 'vditor/dist/index.css'
import { NButton, NForm, NFormItem, NCard, NInput, NSpace, NLayoutHeader } from 'naive-ui'
const router = useRouter()
const store = useStore()
console.log('store.state.user.email', store.state.user.email)
// 响应式数据
const title = ref('联系我们')
const description = ref('请填写以下表单，我们会尽快回复您。')
const name = ref('')
const email = ref('')
const message = ref('')

// 处理表单提交的方法
const handleSubmit = () => {
	// 这里可以添加发送邮件或调用API的逻辑
	alert(`姓名: ${name.value}\n邮箱: ${email.value}\n留言: ${message.value}`)

	// 清空表单字段
	name.value = ''
	email.value = ''
	message.value = ''
}
const goHome = () => {
	router.push('/home/edit')
}
</script>

<style scoped>
html,
body {
	height: 100%;
	margin: 0;
	background-color: #f8f8f8;
}

.center-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}

.contact-us {
	padding: 20px;
	width: 600px;
	border-radius: 15px;
	background: white;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.content {
	padding-bottom: 20px;
}

.contact-us label {
	display: block;
	margin-bottom: 5px;
}

.submit-btn {
	font-size: 18px;
	display: block;
	margin: 2px auto 0;
	width: 100px;
	height: 45px;
	padding: 10px 32px;
}

.large {
	font-size: 30px;
}

input:focus {
	outline: none;
	box-shadow: none;
}
</style>

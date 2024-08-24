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
					cursor: pointer;
					height: 30px;
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
	<n-layout has-sider style="height: calc(100vh - 60px)">
		<n-layout-content style="padding: 0; overflow: auto">
			<div style="display: flex; height: 100%">
				<div id="vditor-container" style="flex: 1; height: 100%; width: 100%">
					<div id="vditor"></div>
				</div>
			</div>
		</n-layout-content>
	</n-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { NButton, NLayout, NLayoutContent, NSpace, NLayoutHeader } from 'naive-ui'
import $ from 'jquery'

const router = useRouter()
const store = useStore()
const vditor = ref(null)
const currentFileId = computed(() => store.getters['getSelectedItemKey'])
const currentFileContent = ref('')
console.log('store.state.user.email', store.state.user.email)
// 响应式数据

const goHome = () => {
	store.commit('setSelectedMenuKey', '/recycle-bin')
	router.push('/recycle-bin')
}
const fetchFileContent = () => {
	$.ajax({
		url: 'http://192.168.0.129:8083/TextEditor/file/getFileInfo',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(currentFileId.value),
		success: function (response) {
			if (response.code === 200) {
				currentFileContent.value = response.data
				if (vditor.value) {
					vditor.value.setValue(currentFileContent.value)
				}
			} else {
				console.error('获取文档内容时出错:', response.message)
			}
		},
		error: function (error) {
			console.error('获取文档内容失败:', error)
		}
	})
}

onMounted(() => {
	vditor.value = new Vditor('vditor', {
		height: document.getElementById('vditor-container').offsetHeight,
		width: document.getElementById('vditor-container').offsetWidth,
		cache: { enable: false },
		mode: 'wysiwyg', // 设置为纯展示模式，不可编辑
		toolbarConfig: {
			hide: false // 隐藏工具栏
		},
		after: () => {
			vditor.value.disabled(true)
		}
	})

	fetchFileContent()
})

watch(currentFileId, () => {
	fetchFileContent()
})
</script>

<style scoped>
html,
body {
	height: 100%;
	margin: 0;
	background-color: #f8f8f8;
}
</style>

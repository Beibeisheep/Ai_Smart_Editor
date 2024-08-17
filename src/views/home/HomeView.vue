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

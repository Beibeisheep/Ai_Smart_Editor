<template>
	<div class="layout">
		<SideBar></SideBar>
		<div class="box">
			<files-table></files-table>
		</div>
	</div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import FilesTable from '@/components/FilesTable.vue'
export default defineComponent({
	components: {
		SideBar,
		FilesTable
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
	padding: 0; /* 移除 padding 以填满整个可用空间 */
	background-color: #fff;
	border-radius: 5%;
	box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	flex: 1;
	display: flex;
	flex-direction: column;
}
</style>

<template>
  <n-layout style="height: 100vh;">
    <n-layout-header style="background: #339; color: white; display: flex; justify-content: space-between; align-items: center; height: 60px;">
      <n-space>
        <n-button @click="goHome" size="large" style="margin-right: 10px; background-color: #ffcc00; color: #333; border: none; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);">
        返回主页面
        </n-button>
        <n-button text @click="toggleDropdown" style="color: #339;">{{ dropdownOpen ? '-' : '+' }}</n-button>
      </n-space>
      <n-space style="margin-left: auto;">
        <n-button text style="color: white; margin-right: 30px;">联系我们</n-button>
        <n-button text style="color: white;">这里是用户名</n-button>
      </n-space>
    </n-layout-header>

    <n-layout>
      <n-layout-sider width="250" style="background-color: #f0f0f0;">
        <div class="sidebar">
          <n-input
            placeholder="搜索文件"
            style="opacity: 0.7; margin-bottom: 20px;"
            clearable
          />
          <n-collapse v-model:value="dropdownOpen">
            <n-collapse-item name="files" :title="collapseTitle">
              <div style="display: flex; flex-direction: column;">
                <template v-for="(subItem, subIndex) in fileItems" :key="subIndex">
                  <router-link :to="subItem.path" style="margin-bottom: 5px;">{{ subItem.label }}</router-link>
                </template>
              </div>
            </n-collapse-item>
          </n-collapse>
          <AiText />
        </div>
      </n-layout-sider>

      <n-layout-content style="padding: 0; overflow: auto; height: calc(100vh - 60px);">
        <div style="display: flex; height: 100%;">
          <div id="vditor" style="height: 100%; width: 100%;"></div>
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { NInput, NCollapse, NCollapseItem, NButton, NSpace, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent } from 'naive-ui';
import { useRouter } from 'vue-router';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import AiText from './AiText.vue';

const router = useRouter();
const fileItems = ref([
  { label: '文件1', path: '/file1' },
  { label: '文件2', path: '/file2' }
]);
const dropdownOpen = ref(false);

// 计算属性，判断是否展开以更改标题
const collapseTitle = computed(() => {
  return dropdownOpen.value ? '折叠面板标题 - ' : '折叠面板标题';
});

// 切换折叠面板的状态
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// 添加返回主页面功能
const goHome = () => {
  router.push('/home/Home'); // 使用 `router.push` 跳转到 HomeView.vue 页面
};

onMounted(() => {
  new Vditor('vditor', { height: 500, cache: { enable: false } });
});
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

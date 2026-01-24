import { createApp } from 'vue';

// 導入組件
import App from './App.vue';

// 導入樣式
import './style.css';

// 創建 Vue 應用
const app = createApp(App);

// 註冊全局組件（如果需要）
// app.component('business-card-editor', BusinessCardEditor);

// 掛載應用
app.mount('#app');

// 初始化 Lucide 圖標
if (window.lucide) {
    window.lucide.createIcons();
}

// 使用 CDN 引入的 Vue 全局變量
const { createApp } = Vue;

// 導入組件（需要調整為相對路徑）
import App from './App.vue';

// 創建 Vue 應用
const app = createApp(App);

// 手動註冊所有組件（因為瀏覽器不支持 import/export）
app.component('business-card-editor', BusinessCardEditor);
app.component('business-card-preview', BusinessCardPreview);
// ... 註冊其他組件

// 掛載應用
app.mount('#app');

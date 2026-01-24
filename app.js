// 主應用程式
document.addEventListener('DOMContentLoaded', function() {
    const { createApp, ref, computed, onMounted } = Vue;
    
    // 檢查所有模組是否已加載
    console.log('SidebarComponent:', window.SidebarComponent);
    console.log('EditorComponent:', window.EditorComponent);
    console.log('PreviewComponent:', window.PreviewComponent);
    
    if (!window.SidebarComponent || !window.EditorComponent || !window.PreviewComponent) {
        console.error('有模組未正確加載！');
        alert('頁面加載錯誤，請刷新頁面');
        return;
    }
    
    // 創建主應用
    const app = createApp({
        components: {
            Sidebar: window.SidebarComponent,
            Editor: window.EditorComponent,
            Preview: window.PreviewComponent
        },
        
        template: `
            <div class="flex h-screen overflow-hidden text-gray-800">
                <!-- 側邊欄 -->
                <Sidebar 
                    :current-tab="currentTab"
                    :is-collapsed="isSidebarCollapsed"
                    @toggle-sidebar="toggleSidebar"
                    @switch-tab="switchTab"
                />
                
                <!-- 主要內容 -->
                <main class="flex-grow flex flex-col h-full bg-gray-50">
                    <!-- 頂部欄 -->
                    <header class="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                        <h2 class="text-xl font-bold text-gray-800">LINEOA 插件管理平台</h2>
                        <div class="flex items-center gap-4">
                            <button @click="login" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                <i class="fas fa-sign-in-alt mr-2"></i> 登入 LINE
                            </button>
                        </div>
                    </header>
                    
                    <!-- 編輯器區域 -->
                    <div class="flex-grow flex overflow-hidden">
                        <!-- 編輯器 -->
                        <div class="flex-1 overflow-auto p-8">
                            <div class="max-w-4xl mx-auto">
                                <h3 class="text-2xl font-bold text-gray-800 mb-8">插件編輯器</h3>
                                
                                <Editor 
                                    :data="flexData"
                                    :chat-message="chatMessage"
                                    @update:data="updateFlexData"
                                    @update:chat-message="updateChatMessage"
                                />
                                
                                <!-- JSON 預覽 -->
                                <div class="mt-12">
                                    <h4 class="text-sm font-bold text-gray-700 mb-4">JSON 輸出</h4>
                                    <pre class="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto">{{ jsonOutput }}</pre>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 預覽 -->
                        <div class="w-96 border-l bg-white overflow-auto p-8">
                            <h3 class="text-xl font-bold text-gray-800 mb-6">預覽</h3>
                            <Preview :data="{ ...flexData, chatMessage }" />
                        </div>
                    </div>
                </main>
            </div>
        `,
        
        setup() {
            // 狀態
            const isSidebarCollapsed = ref(false);
            const currentTab = ref('messages');
            const chatMessage = ref('歡迎使用 LINEOA 插件平台！');
            const flexData = ref({
                title: '範例插件',
                content: '這是一個範例插件內容...'
            });
            
            // 計算屬性
            const jsonOutput = computed(() => {
                return JSON.stringify({
                    chatMessage: chatMessage.value,
                    ...flexData.value
                }, null, 2);
            });
            
            // 方法
            const toggleSidebar = () => {
                isSidebarCollapsed.value = !isSidebarCollapsed.value;
            };
            
            const switchTab = (tab) => {
                currentTab.value = tab;
                alert(`切換到 ${tab} 頁面`);
            };
            
            const updateFlexData = (newData) => {
                flexData.value = { ...newData };
            };
            
            const updateChatMessage = (newMessage) => {
                chatMessage.value = newMessage;
            };
            
            const login = () => {
                alert('登入功能');
            };
            
            // 初始化
            onMounted(() => {
                console.log('應用已啟動');
                
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
            
            return {
                isSidebarCollapsed,
                currentTab,
                chatMessage,
                flexData,
                jsonOutput,
                toggleSidebar,
                switchTab,
                updateFlexData,
                updateChatMessage,
                login
            };
        }
    });
    
    // 掛載應用
    app.mount('#app');
});

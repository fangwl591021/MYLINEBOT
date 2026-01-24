document.addEventListener('DOMContentLoaded', function() {
    const { createApp, ref, computed, onMounted } = Vue;
    
    // 默認數據
    const defaultBusinessCardData = {
        type: 'video',
        headerName: 'TONY',
        headerTitle: 'LINE行銷達人',
        headerDescription: '系統開發',
        headerImg: 'https://aiwe.cc/wp-content/uploads/2025/04/f9ebd0672d3b0ac370272909a493d4db.png',
        videoUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/mp4',
        previewUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXdigUOQpZHg/m800x1200',
        gridButtons: [
            { emoji: '🤖', label: 'AI 諮詢', uri: 'https://liff.line.me/2006625044-bPGxrB53/' },
            { emoji: '🎥', label: '產品介紹', uri: 'https://example.com/video' },
            { emoji: '🧾', label: '商品型錄', uri: 'https://example.com/catalog' },
            { emoji: '📍', label: '門市資訊', uri: 'https://example.com/map' }
        ],
        videoFooterButtons: [
            { label: '🚀 啟動 AI 小幫手', uri: 'https://liff.line.me/2006625044-bPGxrB53/index.php/colt_sp/6502/', color: '#C9A24D' },
            { label: '📤 分享好友', uri: 'https://liff.line.me/2006625044-J42EzjkZ/index.php/linecard_12/6816/' }
        ]
    };
    
    const defaultStandardData = {
        type: 'standard',
        imageUrl: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
        aspectRatio: '20:13',
        title: 'Brown Cafe',
        subtitle: '歡迎光臨！支援長文換行。',
        showBadge: true,
        badgeColor: '#FF0000',
        buttons: [
            { label: '了解更多', uri: 'https://example.com', color: '#00B900' }
        ]
    };
    
    // 創建主應用
    const app = createApp({
        components: {
            BusinessCardEditor: window.Components.BusinessCardEditor,
            BusinessCardPreview: window.Components.BusinessCardPreview,
            StandardEditor: window.Components.StandardEditor,
            StandardPreview: window.Components.StandardPreview,
            Sidebar: window.Components.Sidebar
        },
        
        template: `
            <div class="flex h-screen overflow-hidden text-gray-800">
                <!-- 側邊欄 -->
                <Sidebar 
                    :current-tab="currentTab"
                    :current-sub-tab="currentSubTab"
                    :is-collapsed="isSidebarCollapsed"
                    @toggle-sidebar="toggleSidebar"
                    @switch-tab="switchTab"
                    @switch-sub-tab="switchSubTab"
                />
                
                <!-- 主要內容區 -->
                <main class="flex-grow flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
                    <!-- 頂部欄 -->
                    <header class="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-10">
                        <h2 class="text-xl font-bold text-gray-800">{{ pageTitle }}</h2>
                        <div class="flex items-center gap-4">
                            <div v-if="isLoggedIn" class="flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full border border-green-100 shadow-sm">
                                <div class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(0,185,0,0.6)]"></div>
                                <span class="text-[10px] text-green-700 font-bold uppercase">LINE Connected</span>
                            </div>
                            <div v-else @click="liffLogin" class="flex items-center gap-2 px-4 py-1.5 bg-yellow-50 rounded-full border border-yellow-200 text-yellow-700 text-xs font-bold cursor-pointer hover:bg-yellow-100">
                                <i class="fas fa-sign-in-alt"></i> {{ isInIframe ? '新分頁登入' : '登入 LINE' }}
                            </div>
                            <div class="w-10 h-10 rounded-xl bg-line-green text-white flex items-center justify-center font-bold shadow-md">T</div>
                        </div>
                    </header>
                    
                    <!-- 動態內容 -->
                    <div class="flex-grow overflow-hidden flex">
                        <!-- 插件開發頁面 -->
                        <div v-if="currentTab === 'messages'" class="flex w-full overflow-hidden">
                            <!-- 編輯器區域 -->
                            <div class="flex-grow overflow-y-auto p-8 bg-white shadow-inner border-r no-scrollbar">
                                <div class="max-w-4xl mx-auto">
                                    <!-- 頂部按鈕 -->
                                    <div class="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 class="text-2xl font-bold text-gray-800">
                                                {{ flexData.type === 'video' ? '影片名片開發' : '文章型 Flex 開發' }}
                                            </h3>
                                            <p class="text-sm text-gray-400 mt-1">編輯參數後，可儲存為專案或直接推播至 LINE。</p>
                                        </div>
                                        <div class="flex gap-2">
                                            <button @click="shareToLine" class="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                                                <i class="fas fa-paper-plane"></i> 🚀 直接推播
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <!-- 聊天室文字設定 -->
                                    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                        <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                                            <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定
                                        </h4>
                                        <textarea v-model="chatMessage" rows="3"
                                                  class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                                  placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                                    </div>
                                    
                                    <!-- 動態編輯器 -->
                                    <BusinessCardEditor 
                                        v-if="flexData.type === 'video'"
                                        :data="flexData"
                                        @update:data="updateFlexData"
                                    />
                                    
                                    <StandardEditor 
                                        v-else
                                        :data="flexData"
                                        @update:data="updateFlexData"
                                    />
                                    
                                    <!-- JSON 輸出 -->
                                    <div class="mt-12 mb-20">
                                        <div class="flex items-center justify-between mb-3 px-2">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <i class="fas fa-code mr-2"></i>Raw Flex JSON Data
                                            </span>
                                            <button @click="copyJson" class="text-[10px] text-line-green font-bold hover:underline uppercase">
                                                Copy JSON
                                            </button>
                                        </div>
                                        <div class="bg-[#1e2124] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden">
                                            <pre class="text-[11px] text-green-400 font-mono leading-relaxed h-48 overflow-y-auto no-scrollbar">
                                                {{ generatedJson }}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 預覽區域 -->
                            <div class="w-[360px] flex-shrink-0 bg-gray-50 flex items-center justify-center py-8 shadow-inner overflow-y-auto no-scrollbar">
                                <div class="flex flex-col items-center gap-4">
                                    <div class="preview-window no-scrollbar shadow-2xl">
                                        <div class="p-3 border-b border-gray-800 bg-[#1A1B1E] flex items-center gap-2 sticky top-0 z-50">
                                            <i class="fas fa-chevron-left text-gray-600 text-xs"></i>
                                            <span class="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">LINE Preview</span>
                                        </div>
                                        
                                        <BusinessCardPreview 
                                            v-if="flexData.type === 'video'"
                                            :data="flexData"
                                        />
                                        
                                        <StandardPreview 
                                            v-else
                                            :data="flexData"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 其他頁面 -->
                        <div v-else class="w-full overflow-y-auto p-8">
                            <div class="max-w-6xl mx-auto">
                                <h3 class="text-2xl font-bold text-gray-800 mb-6">{{ pageTitle }}</h3>
                                
                                <div v-if="currentTab === 'templates'" class="space-y-6">
                                    <p class="text-gray-500">模板庫功能開發中...</p>
                                </div>
                                
                                <div v-if="currentTab === 'projects'" class="space-y-6">
                                    <p class="text-gray-500">專案管理功能開發中...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `,
        
        setup() {
            // 狀態
            const isSidebarCollapsed = ref(false);
            const currentTab = ref('messages');
            const currentSubTab = ref('single');
            const isLoggedIn = ref(false);
            const isInIframe = ref(false);
            const chatMessage = ref("🎉 限時優惠！精選商品特價中，點擊查看最新商品！");
            const flexData = ref({ ...defaultStandardData });
            
            // 計算屬性
            const pageTitle = computed(() => {
                const titles = {
                    'dashboard': '儀表板總覽',
                    'messages': '插件開發管理平台',
                    'templates': '插件模板選擇中心',
                    'projects': '專案管理'
                };
                return titles[currentTab.value] || 'LINEOA 插件管理平台';
            });
            
            const generatedJson = computed(() => {
                if (flexData.value.type === 'video') {
                    return JSON.stringify(window.Utils.generateBusinessCardJson(flexData.value), null, 2);
                } else {
                    return JSON.stringify(window.Utils.generateStandardJson(flexData.value), null, 2);
                }
            });
            
            // 方法
            const toggleSidebar = () => {
                isSidebarCollapsed.value = !isSidebarCollapsed.value;
            };
            
            const switchTab = (tab) => {
                currentTab.value = tab;
            };
            
            const switchSubTab = (tab, subTab) => {
                currentTab.value = tab;
                currentSubTab.value = subTab;
                flexData.value.type = subTab === 'video' ? 'video' : 'standard';
                
                if (subTab === 'video') {
                    flexData.value = { ...defaultBusinessCardData };
                } else {
                    flexData.value = { ...defaultStandardData };
                }
            };
            
            const updateFlexData = (newData) => {
                flexData.value = { ...newData };
            };
            
            const liffLogin = async () => {
                if (typeof liff !== 'undefined') {
                    try {
                        await liff.init({ liffId: "2008541971-XPIDtaaj" });
                        if (!liff.isLoggedIn()) {
                            liff.login();
                        } else {
                            isLoggedIn.value = true;
                            const profile = await liff.getProfile();
                            console.log('User Profile:', profile);
                        }
                    } catch (err) {
                        console.error('LIFF 初始化失敗:', err);
                    }
                }
            };
            
            const shareToLine = () => {
                if (!isLoggedIn.value) {
                    alert('請先登入 LINE');
                    liffLogin();
                    return;
                }
                
                alert('推播功能開發中...');
            };
            
            const copyJson = () => {
                const el = document.createElement('textarea');
                el.value = generatedJson.value;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                alert('JSON 已複製到剪貼簿！');
            };
            
            // 初始化
            onMounted(() => {
                isInIframe.value = window.self !== window.top;
                
                // 初始化 LIFF
                if (typeof liff !== 'undefined') {
                    liff.init({ liffId: "2008541971-XPIDtaaj" })
                        .then(() => {
                            if (liff.isLoggedIn()) {
                                isLoggedIn.value = true;
                                return liff.getProfile();
                            }
                        })
                        .then(profile => {
                            if (profile) console.log('User Profile:', profile);
                        })
                        .catch(err => {
                            console.error('LIFF 初始化失敗:', err);
                        });
                }
                
                // 初始化圖標
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            });
            
            return {
                // 狀態
                isSidebarCollapsed,
                currentTab,
                currentSubTab,
                isLoggedIn,
                isInIframe,
                chatMessage,
                flexData,
                
                // 計算屬性
                pageTitle,
                generatedJson,
                
                // 方法
                toggleSidebar,
                switchTab,
                switchSubTab,
                updateFlexData,
                liffLogin,
                shareToLine,
                copyJson
            };
        }
    });
    
    // 掛載應用
    app.mount('#app');
    
    console.log('LINEOA 插件管理平台已啟動');
});

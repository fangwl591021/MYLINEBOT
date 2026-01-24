// ========== 主應用程式 ==========

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
    
    // 工具函數
    function generateStandardJson(data) {
        const contents = [
            { 
                type: "image", 
                url: data.imageUrl || "https://via.placeholder.com/800x520?text=Image", 
                size: "full", 
                aspectRatio: data.aspectRatio || "20:13", 
                animated: true 
            }, 
            { 
                type: "text", 
                text: data.title || "標題", 
                weight: "bold", 
                size: "xl", 
                align: "center", 
                margin: "sm" 
            }, 
            { 
                type: "text", 
                text: data.subtitle || "內容區", 
                size: "sm", 
                margin: "sm", 
                offsetStart: "5px", 
                wrap: true 
            }
        ];
        
        const flex = {
            type: "bubble",
            body: { 
                type: "box", 
                layout: "vertical", 
                paddingAll: "0px", 
                contents: contents 
            }
        };
        
        if (data.buttons && data.buttons.length > 0) {
            flex.footer = {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: data.buttons.map(b => ({
                    type: "button",
                    style: "primary",
                    color: b.color || "#00B900",
                    height: "sm",
                    action: {
                        type: "uri",
                        label: b.label || "按鈕",
                        uri: b.uri || "https://example.com"
                    }
                }))
            };
        }
        
        return flex;
    }
    
    function generateBusinessCardJson(cardData) {
        const { 
            headerName, 
            headerTitle, 
            headerDescription, 
            headerImg,
            videoUrl,
            previewUrl,
            gridButtons = [],
            videoFooterButtons = []
        } = cardData;

        // 建立網格佈局
        const gridContents = [];
        const gridPairs = [];
        
        for (let i = 0; i < Math.min(4, gridButtons.length); i += 2) {
            const pair = gridButtons.slice(i, i + 2);
            if (pair.length > 0) {
                gridPairs.push(pair);
            }
        }

        gridPairs.forEach((pair) => {
            const row = {
                type: "box",
                layout: "horizontal",
                spacing: "sm",
                contents: pair.map((btn) => ({
                    type: "box",
                    layout: "vertical",
                    paddingAll: "12px",
                    backgroundColor: "#2A2C31",
                    cornerRadius: "12px",
                    action: {
                        type: "uri",
                        label: btn.label,
                        uri: btn.uri
                    },
                    contents: [
                        {
                            type: "text",
                            text: btn.emoji || "🌟",
                            size: "xl",
                            align: "center"
                        },
                        {
                            type: "text",
                            text: btn.label || "按鈕",
                            size: "sm",
                            align: "center",
                            color: "#E6E6E6"
                        }
                    ],
                    flex: 1,
                    margin: "none"
                }))
            };
            
            gridContents.push(row);
        });

        // 建立底部按鈕
        const footerButtons = videoFooterButtons.map((btn, index) => ({
            type: "button",
            style: index === 0 ? "primary" : "secondary",
            color: index === 0 ? (btn.color || "#C9A24D") : undefined,
            height: "sm",
            action: {
                type: "uri",
                label: btn.label || "按鈕",
                uri: btn.uri || "#"
            }
        }));

        return {
            type: "bubble",
            size: "mega",
            header: {
                type: "box",
                layout: "horizontal",
                spacing: "md",
                paddingAll: "8px",
                backgroundColor: "#1A1B1E",
                contents: [
                    {
                        type: "image",
                        url: headerImg || "https://via.placeholder.com/40x40?text=Avatar",
                        size: "xs",
                        aspectRatio: "1:1",
                        aspectMode: "cover",
                        gravity: "center"
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        spacing: "xs",
                        flex: 3,
                        contents: [
                            {
                                type: "text",
                                text: headerName || "未設定姓名",
                                weight: "bold",
                                size: "lg",
                                color: "#D4AF37"
                            },
                            {
                                type: "text",
                                text: headerTitle || "未設定職稱",
                                size: "sm",
                                color: "#E6E6E6"
                            },
                            {
                                type: "text",
                                text: headerDescription || "未設定描述",
                                size: "xs",
                                color: "#A0A0A0",
                                wrap: true
                            }
                        ]
                    }
                ]
            },
            hero: {
                type: "video",
                url: videoUrl || "",
                previewUrl: previewUrl || "https://via.placeholder.com/800x500?text=Preview",
                aspectRatio: "800:500",
                altContent: {
                    type: "image",
                    url: previewUrl || "https://via.placeholder.com/800x500?text=Preview",
                    size: "full",
                    aspectRatio: "800:500",
                    aspectMode: "cover"
                }
            },
            body: {
                type: "box",
                layout: "vertical",
                paddingAll: "8px",
                contents: [
                    {
                        type: "box",
                        layout: "vertical",
                        spacing: "sm",
                        paddingAll: "12px",
                        backgroundColor: "#1F2024",
                        cornerRadius: "14px",
                        contents: gridContents.length > 0 ? gridContents : [
                            {
                                type: "text",
                                text: "請設定網格按鈕",
                                align: "center",
                                color: "#666666"
                            }
                        ]
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                paddingAll: "8px",
                contents: footerButtons.length > 0 ? footerButtons : [
                    {
                        type: "text",
                        text: "請設定底部按鈕",
                        align: "center",
                        color: "#666666"
                    }
                ]
            },
            styles: {
                body: {
                    backgroundColor: "#0F0F10"
                },
                footer: {
                    backgroundColor: "#0F0F10"
                }
            }
        };
    }
    
    // 簡單的側邊欄組件
    const Sidebar = {
        name: 'Sidebar',
        props: ['currentTab', 'currentSubTab', 'isCollapsed'],
        template: `
            <aside :class="isCollapsed ? 'w-collapsed' : 'w-expanded'" 
                   class="sidebar-container text-gray-400 shadow-2xl">
                <div class="h-16 flex items-center border-b border-gray-700 overflow-hidden flex-shrink-0 sidebar-transition" 
                     :class="isCollapsed ? 'justify-center px-0' : 'px-6 justify-start'">
                    <i class="fab fa-line text-3xl line-green"></i>
                    <span v-if="!isCollapsed" class="text-white text-xl font-bold ml-4 tracking-tighter whitespace-nowrap uppercase font-mono">
                        LINEOA PLUG
                    </span>
                </div>
                
                <nav class="mt-6 flex-grow overflow-y-auto no-scrollbar whitespace-nowrap">
                    <a href="#" @click="switchTab('messages')" 
                       :class="{'sidebar-item-active': currentTab === 'messages'}" 
                       class="flex items-center py-4 hover:bg-gray-700 transition-colors sidebar-transition"
                       :style="getItemStyle()">
                        <i class="fas fa-layer-group w-8 text-lg text-center flex-shrink-0"></i>
                        <span v-if="!isCollapsed" class="ml-2 font-medium">
                            插件開發管理
                        </span>
                    </a>

                    <a href="#" @click="switchTab('templates')" 
                       :class="{'sidebar-item-active': currentTab === 'templates'}"
                       class="flex items-center py-4 hover:bg-gray-700 mt-2 sidebar-transition"
                       :style="getItemStyle()">
                        <i class="fas fa-folder-open w-8 text-lg text-center flex-shrink-0"></i>
                        <span v-if="!isCollapsed" class="ml-2 font-medium">
                            插件模板庫
                        </span>
                    </a>

                    <a href="#" @click="switchTab('projects')" 
                       :class="{'sidebar-item-active': currentTab === 'projects'}"
                       class="flex items-center py-4 hover:bg-gray-700 mt-2 sidebar-transition"
                       :style="getItemStyle()">
                        <i class="fas fa-box w-8 text-lg text-center flex-shrink-0"></i>
                        <span v-if="!isCollapsed" class="ml-2 font-medium">
                            專案管理
                        </span>
                    </a>
                </nav>
                
                <button @click="$emit('toggle-sidebar')" 
                        class="p-4 w-full flex items-center justify-center border-t border-gray-700 hover:text-white transition-colors text-gray-500 bg-gray-900 bg-opacity-30 sidebar-transition">
                    <i class="fas" :class="isCollapsed ? 'fa-indent text-xl' : 'fa-outdent text-xl'"></i>
                    <span v-if="!isCollapsed" class="ml-3 text-xs font-bold uppercase tracking-widest">
                        收合左側欄
                    </span>
                </button>
            </aside>
        `,
        methods: {
            getItemStyle() {
                return this.isCollapsed ? 
                    'justify-content: center; padding-left: 0; padding-right: 0;' : 
                    'padding-left: 1.5rem; padding-right: 1.5rem;';
            },
            switchTab(tab) {
                this.$emit('switch-tab', tab);
            }
        }
    };
    
    // 創建主應用
    const app = createApp({
        components: {
            Sidebar
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
                    
                    <!-- 主內容 -->
                    <div class="flex-grow overflow-auto p-8">
                        <div class="max-w-6xl mx-auto">
                            <div v-if="currentTab === 'messages'" class="space-y-6">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4">插件開發管理平台</h3>
                                <p class="text-gray-600 mb-6">選擇您要創建的插件類型：</p>
                                
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="bg-white rounded-xl shadow-lg p-6">
                                        <div class="flex items-center mb-4">
                                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                                <i class="fas fa-file-alt text-blue-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-gray-800">文章型 Flex</h4>
                                                <p class="text-sm text-gray-500">創建單頁文章訊息</p>
                                            </div>
                                        </div>
                                        <button @click="switchSubTab('single')" 
                                                class="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            開始創建
                                        </button>
                                    </div>
                                    
                                    <div class="bg-white rounded-xl shadow-lg p-6">
                                        <div class="flex items-center mb-4">
                                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                                <i class="fas fa-video text-purple-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-gray-800">影片名片插件</h4>
                                                <p class="text-sm text-gray-500">創建影片名片訊息</p>
                                            </div>
                                        </div>
                                        <button @click="switchSubTab('video')" 
                                                class="w-full mt-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                                            開始創建
                                        </button>
                                    </div>
                                    
                                    <div class="bg-white rounded-xl shadow-lg p-6">
                                        <div class="flex items-center mb-4">
                                            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                                <i class="fas fa-shopping-cart text-orange-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 class="font-bold text-gray-800">電商型插件</h4>
                                                <p class="text-sm text-gray-500">創建電商型訊息</p>
                                            </div>
                                        </div>
                                        <button @click="switchSubTab('ecommerce')" 
                                                class="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                                            開始創建
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div v-else-if="currentTab === 'templates'" class="space-y-6">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4">插件模板庫</h3>
                                <p class="text-gray-600">模板庫功能開發中...</p>
                            </div>
                            
                            <div v-else-if="currentTab === 'projects'" class="space-y-6">
                                <h3 class="text-2xl font-bold text-gray-800 mb-4">專案管理</h3>
                                <p class="text-gray-600">專案管理功能開發中...</p>
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
            const currentSubTab = ref('');
            const isLoggedIn = ref(false);
            const isInIframe = ref(false);
            
            // 計算屬性
            const pageTitle = computed(() => {
                const titles = {
                    'messages': '插件開發管理平台',
                    'templates': '插件模板選擇中心',
                    'projects': '專案管理'
                };
                return titles[currentTab.value] || 'LINEOA 插件管理平台';
            });
            
            // 方法
            const toggleSidebar = () => {
                isSidebarCollapsed.value = !isSidebarCollapsed.value;
            };
            
            const switchTab = (tab) => {
                currentTab.value = tab;
            };
            
            const switchSubTab = (subTab) => {
                currentSubTab.value = subTab;
                alert('即將進入 ' + subTab + ' 編輯器');
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
                
                // 計算屬性
                pageTitle,
                
                // 方法
                toggleSidebar,
                switchTab,
                switchSubTab,
                liffLogin
            };
        }
    });
    
    // 掛載應用
    app.mount('#app');
    
    console.log('LINEOA 插件管理平台已啟動');
});

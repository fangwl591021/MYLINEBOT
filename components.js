// ========== 側邊欄組件 ==========
const Sidebar = {
    name: 'Sidebar',
    props: ['currentTab', 'currentSubTab', 'isCollapsed'],
    template: `
        <aside :class="isCollapsed ? 'w-collapsed' : 'w-expanded'" 
               class="sidebar-container text-gray-400 shadow-2xl">
            <div class="h-16 flex items-center border-b border-gray-700 overflow-hidden flex-shrink-0 sidebar-transition" 
                 :class="isCollapsed ? 'justify-center px-0' : 'px-6 justify-start'">
                <i class="fab fa-line text-3xl line-green"></i>
                <span v-if="!isCollapsed" class="text-white text-xl font-bold ml-4 tracking-tighter whitespace-nowrap uppercase font-mono opacity-0 transition-opacity duration-300" 
                      :class="{'opacity-100': !isCollapsed}">
                    LINEOA PLUG
                </span>
            </div>
            
            <nav class="mt-6 flex-grow overflow-y-auto no-scrollbar whitespace-nowrap">
                <a href="#" @click="switchTab('dashboard')" 
                   :class="{'sidebar-item-active': currentTab === 'dashboard'}" 
                   class="flex items-center py-4 hover:bg-gray-700 transition-colors sidebar-transition"
                   :style="getItemStyle()">
                    <i class="fas fa-chart-pie w-8 text-lg text-center flex-shrink-0"></i>
                    <span v-if="!isCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                          :class="{'opacity-100': !isCollapsed}">
                        儀表板總覽
                    </span>
                </a>

                <div>
                    <button @click="toggleSidebarMenu" 
                            :class="{'text-white': currentTab === 'messages'}"
                            class="w-full flex items-center py-4 hover:bg-gray-700 focus:outline-none overflow-hidden sidebar-transition"
                            :style="getItemStyle()">
                        <i class="fas fa-layer-group w-8 text-lg text-center flex-shrink-0"></i>
                        <template v-if="!isCollapsed">
                            <span class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                                  :class="{'opacity-100': !isCollapsed}">
                                插件開發管理
                            </span>
                            <i class="fas fa-chevron-down text-[10px] ml-auto transition-transform sidebar-transition"
                               :class="{'rotate-180': isMessageMenuOpen, 'opacity-0': isCollapsed, 'opacity-100': !isCollapsed}"></i>
                        </template>
                    </button>
                    
                    <div v-if="isMessageMenuOpen && !isCollapsed" class="bg-black bg-opacity-20 py-2 sidebar-transition">
                        <a href="#" @click="switchSubTab('messages', 'single')" 
                           :class="{'submenu-item-active': currentSubTab === 'single'}" 
                           class="flex items-center pl-16 py-2.5 text-sm hover:text-white transition-colors sidebar-transition">
                            單頁文章 Flex
                        </a>
                        <a href="#" @click="switchSubTab('messages', 'video')" 
                           :class="{'submenu-item-active': currentSubTab === 'video'}" 
                           class="flex items-center pl-16 py-2.5 text-sm hover:text-white transition-colors sidebar-transition">
                            影片名片插件
                        </a>
                        <a href="#" @click="switchSubTab('messages', 'ecommerce')" 
                           :class="{'submenu-item-active': currentSubTab === 'ecommerce'}" 
                           class="flex items-center pl-16 py-2.5 text-sm hover:text-white transition-colors sidebar-transition">
                            電商型插件
                        </a>
                    </div>
                </div>

                <a href="#" @click="switchTab('templates')" 
                   :class="{'sidebar-item-active': currentTab === 'templates'}"
                   class="flex items-center py-4 hover:bg-gray-700 mt-2 sidebar-transition"
                   :style="getItemStyle()">
                    <i class="fas fa-folder-open w-8 text-lg text-center flex-shrink-0"></i>
                    <span v-if="!isCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                          :class="{'opacity-100': !isCollapsed}">
                        插件模板庫
                    </span>
                </a>

                <a href="#" @click="switchTab('projects')" 
                   :class="{'sidebar-item-active': currentTab === 'projects'}"
                   class="flex items-center py-4 hover:bg-gray-700 mt-2 sidebar-transition"
                   :style="getItemStyle()">
                    <i class="fas fa-box w-8 text-lg text-center flex-shrink-0"></i>
                    <span v-if="!isCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                          :class="{'opacity-100': !isCollapsed}">
                        專案管理
                    </span>
                </a>
            </nav>
            
            <button @click="$emit('toggle-sidebar')" 
                    class="p-4 w-full flex items-center justify-center border-t border-gray-700 hover:text-white transition-colors text-gray-500 bg-gray-900 bg-opacity-30 sidebar-transition">
                <i class="fas sidebar-transition" :class="isCollapsed ? 'fa-indent text-xl' : 'fa-outdent text-xl'"></i>
                <span v-if="!isCollapsed" class="ml-3 text-xs font-bold uppercase tracking-widest opacity-0 transition-opacity duration-300"
                      :class="{'opacity-100': !isCollapsed}">
                    收合左側欄
                </span>
            </button>
        </aside>
    `,
    data() {
        return {
            isMessageMenuOpen: true
        };
    },
    methods: {
        getItemStyle() {
            return this.isCollapsed ? 
                'justify-content: center; padding-left: 0; padding-right: 0;' : 
                'padding-left: 1.5rem; padding-right: 1.5rem;';
        },
        toggleSidebarMenu() {
            if (this.isCollapsed) {
                this.$emit('toggle-sidebar');
                setTimeout(() => {
                    this.isMessageMenuOpen = true;
                }, 100);
            } else {
                this.isMessageMenuOpen = !this.isMessageMenuOpen;
            }
        },
        switchTab(tab) {
            this.$emit('switch-tab', tab);
        },
        switchSubTab(tab, subTab) {
            this.$emit('switch-sub-tab', tab, subTab);
        }
    }
};

// ========== 文章型編輯器 ==========
const StandardEditor = {
    name: 'StandardEditor',
    props: ['data', 'chatMessage'],
    template: `
        <div class="space-y-6">
            <!-- 聊天室文字設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定
                </h4>
                <div class="space-y-4">
                    <div>
                        <textarea v-model="localChatMessage" rows="3"
                                  class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                  placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                    </div>
                </div>
            </div>

            <!-- 視覺內容設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-image mr-2 text-line-green"></i> 視覺內容設定
                </h4>
                <div class="space-y-4">
                    <input type="text" v-model="localData.imageUrl" 
                           class="w-full px-4 py-2 border rounded-xl text-sm focus:border-line-green shadow-sm" 
                           placeholder="圖片網址">
                    
                    <div class="flex items-center gap-3 mt-3">
                        <button v-for="ratio in ['1:1', '20:13', '4:6']" 
                                @click="localData.aspectRatio = ratio" 
                                :class="localData.aspectRatio === ratio ? 'ratio-btn-active' : 'ratio-btn'" 
                                class="ratio-btn shadow-sm">{{ ratio }}</button>
                    </div>
                    
                    <input type="text" v-model="localData.title" 
                           class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-line-green shadow-sm" 
                           placeholder="輸入大標題">
                    
                    <textarea v-model="localData.subtitle" rows="6" 
                              class="w-full px-4 py-3 border rounded-xl text-sm outline-none leading-relaxed focus:border-line-green shadow-sm" 
                              placeholder="輸入文章內容..."></textarea>
                </div>
            </div>

            <!-- 底部行為按鈕設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 mt-6 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
                    <span><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部行為按鈕設定</span>
                </h4>
                <div class="space-y-3">
                    <div v-for="(btn, index) in localData.buttons" :key="index" 
                         class="flex gap-3 items-center group bg-white p-3 rounded-xl border transition-all hover:border-green-100 shadow-sm">
                        <div class="relative">
                            <input type="color" v-model="btn.color">
                        </div>
                        <input type="text" v-model="btn.label" maxlength="10" 
                               class="w-32 px-4 py-2 border rounded-lg text-sm" placeholder="文字">
                        <input type="text" v-model="btn.uri" 
                               class="flex-grow px-4 py-2 border rounded-lg text-sm" placeholder="網址">
                        <button @click="removeButton(index)" 
                                class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <button v-if="localData.buttons.length < 3" @click="addButton" 
                            class="w-full py-3 mt-2 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
                        + 新增功能按鈕
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            localData: JSON.parse(JSON.stringify(this.data)),
            localChatMessage: this.chatMessage
        };
    },
    watch: {
        data: {
            handler(newVal) {
                this.localData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
        localData: {
            handler(newVal) {
                this.$emit('update:data', JSON.parse(JSON.stringify(newVal)));
            },
            deep: true
        },
        localChatMessage(newVal) {
            this.$emit('update:chat-message', newVal);
        }
    },
    methods: {
        addButton() {
            this.localData.buttons.push({
                label: '新按鈕',
                uri: 'https://example.com',
                color: '#00B900'
            });
        },
        removeButton(index) {
            if (this.localData.buttons.length > 1) {
                this.localData.buttons.splice(index, 1);
            }
        }
    }
};

// ========== 名片型編輯器 ==========
const BusinessCardEditor = {
    name: 'BusinessCardEditor',
    props: ['data', 'chatMessage'],
    template: `
        <div class="space-y-6">
            <!-- 聊天室文字設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定
                </h4>
                <div class="space-y-4">
                    <div>
                        <textarea v-model="localChatMessage" rows="3"
                                  class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                  placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                    </div>
                </div>
            </div>

            <!-- 名片與 Header 設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-id-card mr-2 text-line-green"></i> 影片與名片 Header 設定
                </h4>
                <div class="grid grid-cols-2 gap-4">
                    <input type="text" v-model="localData.headerName" 
                           class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="品牌姓名">
                    <input type="text" v-model="localData.headerTitle" 
                           class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="職位/稱號">
                    <input type="text" v-model="localData.headerDescription" 
                           class="col-span-2 px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="描述/公司">
                    <input type="text" v-model="localData.headerImg" 
                           class="col-span-2 px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="頭像圖片 URL">
                </div>
            </div>

            <!-- 影片設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-video mr-2 text-line-green"></i> 影片設定
                </h4>
                <div class="space-y-4">
                    <input type="text" v-model="localData.videoUrl" 
                           class="w-full px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="影片 MP4 連結">
                    <input type="text" v-model="localData.previewUrl" 
                           class="w-full px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="影片預覽圖 (Preview URL)">
                </div>
            </div>

            <!-- 網格按鈕設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-th mr-2 text-line-green"></i> 網格按鈕設定
                </h4>
                <div class="space-y-3">
                    <div v-for="(grid, index) in localData.gridButtons" :key="index" 
                         class="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg border">
                        <input type="text" v-model="grid.emoji" 
                               class="w-16 px-3 py-2 border rounded-lg text-sm text-center" 
                               placeholder="emoji" maxlength="2">
                        <input type="text" v-model="grid.label" 
                               class="flex-1 px-3 py-2 border rounded-lg text-sm" 
                               placeholder="標籤文字">
                        <input type="text" v-model="grid.uri" 
                               class="flex-1 px-3 py-2 border rounded-lg text-sm" 
                               placeholder="URL">
                        <button @click="removeGridButton(index)" 
                                class="col-span-3 text-xs text-red-500 hover:text-red-700 flex items-center justify-center gap-1">
                            <i class="fas fa-trash"></i> 移除
                        </button>
                    </div>
                    <button @click="addGridButton" v-if="localData.gridButtons.length < 8"
                            class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
                        + 新增網格按鈕
                    </button>
                </div>
            </div>

            <!-- 影片底部主按鈕設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 影片底部主按鈕設定
                </h4>
                <div class="space-y-3">
                    <div v-for="(vBtn, vIdx) in localData.videoFooterButtons" :key="vIdx" 
                         class="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center transition-all hover:border-blue-100">
                        <div v-if="vIdx === 0" class="flex flex-col items-center gap-1 relative">
                            <span class="text-[9px] text-gray-400 font-bold">主色</span>
                            <input type="color" v-model="vBtn.color">
                        </div>
                        <input type="text" v-model="vBtn.label"
                               class="w-40 border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                               placeholder="按鈕文字">
                        <input type="text" v-model="vBtn.uri"
                               class="flex-grow border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                               placeholder="按鈕 URL">
                        <button @click="removeFooterButton(vIdx)" 
                                class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <button @click="addFooterButton" v-if="localData.videoFooterButtons.length < 4"
                            class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
                        + 新增底部按鈕
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            localData: JSON.parse(JSON.stringify(this.data)),
            localChatMessage: this.chatMessage
        };
    },
    watch: {
        data: {
            handler(newVal) {
                this.localData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
        localData: {
            handler(newVal) {
                this.$emit('update:data', JSON.parse(JSON.stringify(newVal)));
            },
            deep: true
        },
        localChatMessage(newVal) {
            this.$emit('update:chat-message', newVal);
        }
    },
    methods: {
        addGridButton() {
            this.localData.gridButtons.push({
                emoji: '🌟',
                label: '新功能',
                uri: 'https://example.com'
            });
        },
        removeGridButton(index) {
            if (this.localData.gridButtons.length > 2) {
                this.localData.gridButtons.splice(index, 1);
            }
        },
        addFooterButton() {
            this.localData.videoFooterButtons.push({
                label: '新按鈕',
                uri: 'https://example.com',
                color: '#00B900'
            });
        },
        removeFooterButton(index) {
            if (this.localData.videoFooterButtons.length > 1) {
                this.localData.videoFooterButtons.splice(index, 1);
            }
        }
    }
};

// ========== 電商型編輯器 ==========
const EcommerceEditor = {
    name: 'EcommerceEditor',
    props: ['data', 'chatMessage'],
    template: `
        <div class="space-y-6">
            <!-- 聊天室文字設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定
                </h4>
                <div class="space-y-4">
                    <div>
                        <textarea v-model="localChatMessage" rows="3"
                                  class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                  placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                    </div>
                </div>
            </div>

            <!-- 電商編輯器內容 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-shopping-cart mr-2 text-line-green"></i> 電商型插件設定
                </h4>
                <p class="text-sm text-gray-500 mb-4">電商型插件功能開發中...</p>
                
                <!-- 這裡可以添加電商編輯器的具體內容 -->
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">商品標題</label>
                        <input type="text" v-model="localData.title" 
                               class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                               placeholder="商品標題">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">商品描述</label>
                        <textarea v-model="localData.description" rows="3"
                                  class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                                  placeholder="商品描述"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">商品圖片</label>
                        <input type="text" v-model="localData.imageUrl" 
                               class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                               placeholder="圖片網址">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">價格</label>
                        <input type="text" v-model="localData.price" 
                               class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                               placeholder="$ 價格">
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            localData: JSON.parse(JSON.stringify(this.data)),
            localChatMessage: this.chatMessage
        };
    },
    watch: {
        data: {
            handler(newVal) {
                this.localData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
        localData: {
            handler(newVal) {
                this.$emit('update:data', JSON.parse(JSON.stringify(newVal)));
            },
            deep: true
        },
        localChatMessage(newVal) {
            this.$emit('update:chat-message', newVal);
        }
    }
};

// ========== 預覽組件 ==========
const StandardPreview = {
    name: 'StandardPreview',
    props: ['data'],
    template: `
        <div class="p-4">
            <div class="flex-bubble shadow-xl relative overflow-hidden">
                <div class="relative">
                    <img :src="data.imageUrl || defaultImage" 
                         :style="{ aspectRatio: aspectRatio }" 
                         class="w-full object-cover transition-all"
                         @error="handleImageError">
                    <div v-if="data.showBadge" class="flex-badge shadow-md" 
                         :style="{ backgroundColor: data.badgeColor || '#FF0000' }">
                        分享
                    </div>
                </div>
                <div class="p-4 text-center">
                    <div class="text-base font-bold truncate">{{ data.title || '標題' }}</div>
                    <div class="text-[10px] text-gray-500 preview-article mt-2">
                        {{ data.subtitle || '內容區...' }}
                    </div>
                </div>
                <div class="p-3 pt-0 space-y-1.5">
                    <button v-for="(btn, index) in data.buttons" :key="index"
                            class="w-full py-1.5 text-white text-[10px] font-bold rounded shadow-sm hover:opacity-90 transition-opacity"
                            :style="{ backgroundColor: btn.color || '#00B900' }">
                        {{ btn.label || '按鈕' }}
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            defaultImage: 'https://via.placeholder.com/250x160?text=Image'
        };
    },
    computed: {
        aspectRatio() {
            return this.data.aspectRatio ? 
                this.data.aspectRatio.replace(':', '/') : '20/13';
        }
    },
    methods: {
        handleImageError(e) {
            e.target.src = this.defaultImage;
        }
    }
};

const BusinessCardPreview = {
    name: 'BusinessCardPreview',
    props: ['data'],
    template: `
        <div class="p-4">
            <div class="flex-bubble flex-bubble-dark shadow-2xl border-gray-800 overflow-hidden">
                <!-- Header -->
                <div class="header-box">
                    <img :src="data.headerImg || defaultAvatar" 
                         class="w-10 h-10 rounded-full object-cover border border-gray-700"
                         @error="handleImageError">
                    <div class="flex-1 min-w-0">
                        <div class="text-[11px] font-bold truncate uppercase" style="color:#D4AF37">
                            {{ data.headerName || '姓名' }}
                        </div>
                        <div class="text-[9px] text-gray-300 truncate">
                            {{ data.headerTitle || '職位/稱號' }}
                        </div>
                        <div class="text-[8px] text-gray-400 truncate">
                            {{ data.headerDescription || '描述' }}
                        </div>
                    </div>
                </div>
                
                <!-- Video Hero -->
                <div class="video-hero">
                    <img :src="data.previewUrl || defaultPreview" 
                         class="w-full h-full object-cover opacity-60"
                         @error="handlePreviewError">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-play-circle text-white text-4xl opacity-90 drop-shadow-lg"></i>
                    </div>
                </div>
                
                <!-- Grid Buttons -->
                <div class="grid-box">
                    <div v-for="(grid, gIdx) in data.gridButtons.slice(0, 4)" :key="gIdx" 
                         class="grid-item">
                        <div class="text-xl mb-1">{{ grid.emoji || '🌟' }}</div>
                        <div class="text-[8px] text-gray-300 font-bold truncate uppercase tracking-tighter">
                            {{ grid.label || 'Grid' }}
                        </div>
                    </div>
                </div>
                
                <!-- Footer Buttons -->
                <div class="p-3 pt-0 space-y-2 bg-[#0F0F10]">
                    <button v-for="(vBtn, vI) in data.videoFooterButtons" :key="vI" 
                            class="w-full py-2 text-[10px] font-bold rounded shadow-md transition-all active:scale-95"
                            :style="getButtonStyle(vI, vBtn)">
                        {{ vBtn.label || '按鈕' }}
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            defaultAvatar: 'https://via.placeholder.com/40x40?text=Avatar',
            defaultPreview: 'https://via.placeholder.com/250x160?text=Preview'
        };
    },
    methods: {
        getButtonStyle(index, button) {
            if (index === 0) {
                return { 
                    backgroundColor: button.color || '#C9A24D', 
                    color: '#fff' 
                };
            } else {
                return { 
                    backgroundColor: '#2A2C31', 
                    color: '#999' 
                };
            }
        },
        handleImageError(e) {
            e.target.src = this.defaultAvatar;
        },
        handlePreviewError(e) {
            e.target.src = this.defaultPreview;
        }
    }
};

// ========== 工具函數 ==========
const Utils = {
    WORKER_URL: "https://lineoa.fangwl591021.workers.dev",
    
    formatDate(dateString) {
        if (!dateString) return '無日期';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return '日期格式錯誤';
        }
    },
    
    generateStandardJson(data) {
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
    },
    
    generateBusinessCardJson(cardData) {
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
};

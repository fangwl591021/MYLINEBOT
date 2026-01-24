// app.js - Vue應用主入口 (完整版 - 包含HTML模板)
const { createApp, ref, computed, onMounted } = Vue;

// Cloudflare Worker URL
const WORKER_URL = "https://lineoa.fangwl591021.workers.dev";

// 模板字符串 - 這是應用程式的HTML結構
const AppTemplate = `
<div id="app" class="flex h-screen overflow-hidden text-gray-800">
    <!-- 側邊欄 -->
    <aside :class="isSidebarCollapsed ? 'w-collapsed' : 'w-expanded'" class="sidebar-container text-gray-400 shadow-2xl">
        <div class="h-16 flex items-center border-b border-gray-700 overflow-hidden flex-shrink-0 sidebar-transition" 
             :class="isSidebarCollapsed ? 'justify-center px-0' : 'px-6 justify-start'">
            <i class="fab fa-line text-3xl line-green"></i>
            <span v-if="!isSidebarCollapsed" class="text-white text-xl font-bold ml-4 tracking-tighter whitespace-nowrap uppercase font-mono opacity-0 transition-opacity duration-300" 
                  :class="{'opacity-100': !isSidebarCollapsed}">
                LINEOA PLUG
            </span>
        </div>
        
        <nav class="mt-6 flex-grow overflow-y-auto no-scrollbar whitespace-nowrap">
            <a href="#" @click="switchTab('dashboard')" 
               :class="{'sidebar-item-active': currentTab === 'dashboard'}" 
               class="flex items-center py-4 hover:bg-gray-700 transition-colors sidebar-transition"
               :style="isSidebarCollapsed ? 'justify-content: center; padding-left: 0; padding-right: 0;' : 'padding-left: 1.5rem; padding-right: 1.5rem;'">
                <i class="fas fa-chart-pie w-8 text-lg text-center flex-shrink-0"></i>
                <span v-if="!isSidebarCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                      :class="{'opacity-100': !isSidebarCollapsed}">
                    儀表板總覽
                </span>
            </a>

            <div>
                <button @click="toggleSidebarMenu" 
                        :class="{'text-white': currentTab === 'messages'}"
                        class="w-full flex items-center py-4 hover:bg-gray-700 focus:outline-none overflow-hidden sidebar-transition"
                        :style="isSidebarCollapsed ? 'justify-content: center; padding-left: 0; padding-right: 0;' : 'padding-left: 1.5rem; padding-right: 1.5rem;'">
                    <i class="fas fa-layer-group w-8 text-lg text-center flex-shrink-0"></i>
                    <template v-if="!isSidebarCollapsed">
                        <span class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                              :class="{'opacity-100': !isSidebarCollapsed}">
                            插件開發管理
                        </span>
                        <i class="fas fa-chevron-down text-[10px] ml-auto transition-transform sidebar-transition"
                           :class="{'rotate-180': isMessageMenuOpen, 'opacity-0': isSidebarCollapsed, 'opacity-100': !isSidebarCollapsed}"></i>
                    </template>
                </button>
                
                <div v-if="isMessageMenuOpen && !isSidebarCollapsed" class="bg-black bg-opacity-20 py-2 sidebar-transition">
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
               :style="isSidebarCollapsed ? 'justify-content: center; padding-left: 0; padding-right: 0;' : 'padding-left: 1.5rem; padding-right: 1.5rem;'">
                <i class="fas fa-folder-open w-8 text-lg text-center flex-shrink-0"></i>
                <span v-if="!isSidebarCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                      :class="{'opacity-100': !isSidebarCollapsed}">
                    插件模板庫
                </span>
            </a>

            <a href="#" @click="switchTab('projects')" 
               :class="{'sidebar-item-active': currentTab === 'projects'}"
               class="flex items-center py-4 hover:bg-gray-700 mt-2 sidebar-transition"
               :style="isSidebarCollapsed ? 'justify-content: center; padding-left: 0; padding-right: 0;' : 'padding-left: 1.5rem; padding-right: 1.5rem;'">
                <i class="fas fa-box w-8 text-lg text-center flex-shrink-0"></i>
                <span v-if="!isSidebarCollapsed" class="ml-2 font-medium opacity-0 transition-opacity duration-300"
                      :class="{'opacity-100': !isSidebarCollapsed}">
                    專案管理
                </span>
            </a>
        </nav>
        
        <button @click="isSidebarCollapsed = !isSidebarCollapsed" 
                class="p-4 w-full flex items-center justify-center border-t border-gray-700 hover:text-white transition-colors text-gray-500 bg-gray-900 bg-opacity-30 sidebar-transition">
            <i class="fas sidebar-transition" :class="isSidebarCollapsed ? 'fa-indent text-xl' : 'fa-outdent text-xl'"></i>
            <span v-if="!isSidebarCollapsed" class="ml-3 text-xs font-bold uppercase tracking-widest opacity-0 transition-opacity duration-300"
                  :class="{'opacity-100': !isSidebarCollapsed}">
                收合左側欄
            </span>
        </button>
    </aside>

    <!-- 主要內容區 -->
    <main class="flex-grow flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
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

        <div class="flex-grow overflow-hidden flex">
            <!-- 編輯與預覽區 -->
            <div v-if="currentTab === 'messages'" class="flex w-full overflow-hidden">
                <!-- 單頁文章和影片名片的編輯器 -->
                <div v-if="flexData.type !== 'ecommerce'" class="flex-grow overflow-y-auto p-8 bg-white shadow-inner border-r no-scrollbar">
                    <div class="max-w-4xl mx-auto">
                        <!-- 共用頂部按鈕區域 -->
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800">{{ flexData.type === 'video' ? '影片名片開發' : '文章型 Flex 開發' }}</h3>
                                <p class="text-sm text-gray-400 mt-1">編輯參數後，可儲存為專案或直接推播至 LINE。</p>
                            </div>
                            <div class="flex gap-2">
                                <button v-if="currentProjectId" @click="saveProject(true)" :disabled="isSaving" class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
                                    <i class="fas fa-save"></i> 更新專案
                                </button>
                                <button v-else @click="showNewProjectModal = true" :disabled="isSaving" class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
                                    <i class="fas fa-plus"></i> 儲存為新專案
                                </button>
                                <button @click="shareToLine" class="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                                    <i class="fas fa-paper-plane"></i> 🚀 直接推播
                                </button>
                                <button @click="saveToCloudflare" :disabled="isSaving" class="px-6 py-2.5 bg-line-green text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300">
                                    {{ isSaving ? '同步中...' : '儲存到雲端' }}
                                </button>
                            </div>
                        </div>

                        <!-- 專案顯示區域 -->
                        <div v-if="currentProjectId" class="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <i class="fas fa-box text-purple-500"></i>
                                    <div>
                                        <div class="font-bold text-gray-800">{{ currentProjectName }}</div>
                                        <div class="text-xs text-gray-500">專案ID: {{ currentProjectId }}</div>
                                    </div>
                                </div>
                                <button @click="clearCurrentProject" class="text-sm text-gray-500 hover:text-red-500">
                                    <i class="fas fa-times"></i> 清除選擇
                                </button>
                            </div>
                        </div>

                        <!-- 聊天室文字設定區域 -->
                        <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                            <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定</h4>
                            <div class="space-y-4">
                                <div>
                                    <label class="block mb-2">
                                        <span class="text-[11px] font-bold text-slate-700 uppercase block">聊天室訊息文字</span>
                                        <span class="text-[10px] text-slate-400 font-normal">※ 在 LINE 聊天室中顯示的文字訊息</span>
                                    </label>
                                    <textarea v-model="chatMessage" rows="3"
                                              class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                              placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 編輯器內容 -->
                        <div v-if="flexData.type === 'standard'" class="space-y-6">
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-image mr-2 text-line-green"></i> 視覺內容設定</h4>
                                <div class="space-y-4">
                                    <input type="text" v-model="flexData.imageUrl" class="w-full px-4 py-2 border rounded-xl text-sm focus:border-line-green shadow-sm" placeholder="圖片網址">
                                    <div class="flex items-center gap-3 mt-3">
                                        <button v-for="ratio in ['1:1', '20:13', '4:6']" @click="flexData.aspectRatio = ratio" :class="flexData.aspectRatio === ratio ? 'ratio-btn-active' : ''" class="ratio-btn shadow-sm">{{ ratio }}</button>
                                    </div>
                                    <input type="text" v-model="flexData.title" class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-line-green shadow-sm" placeholder="輸入大標題">
                                    <textarea v-model="flexData.subtitle" rows="6" class="w-full px-4 py-3 border rounded-xl text-sm outline-none leading-relaxed focus:border-line-green shadow-sm" placeholder="輸入文章內容..."></textarea>
                                </div>
                            </div>
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 mt-6 shadow-sm">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
                                    <span><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部行為按鈕設定</span>
                                </h4>
                                <div class="space-y-3">
                                    <div v-for="(btn, index) in flexData.buttons" :key="index" class="flex gap-3 items-center group bg-white p-3 rounded-xl border transition-all hover:border-green-100 shadow-sm">
                                        <div class="relative">
                                            <input type="color" v-model="btn.color">
                                            <button @click="showColorPalette($event, 'buttonColor', index)" class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
                                                <i class="fas fa-palette"></i>
                                            </button>
                                        </div>
                                        <input type="text" v-model="btn.label" maxlength="10" class="w-32 px-4 py-2 border rounded-lg text-sm" placeholder="文字">
                                        <input type="text" v-model="btn.uri" class="flex-grow px-4 py-2 border rounded-lg text-sm" placeholder="網址">
                                        <button @click="removeButton(index)" class="p-2 text-gray-300 hover:text-red-500 transition-colors"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                    <button v-if="flexData.buttons.length < 3" @click="addButton" class="w-full py-3 mt-2 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">+ 新增功能按鈕</button>
                                </div>
                            </div>
                        </div>

                        <div v-if="flexData.type === 'video'" class="space-y-6">
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-id-card mr-2 text-line-green"></i> 影片與名片 Header 設定</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="text" v-model="flexData.headerName" class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" placeholder="品牌姓名">
                                    <input type="text" v-model="flexData.headerTitle" class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" placeholder="職位/稱號">
                                    <input type="text" v-model="flexData.videoUrl" class="col-span-2 px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" placeholder="影片 MP4 連結">
                                    <div class="col-span-2">
                                        <input type="text" v-model="flexData.previewUrl" class="w-full px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" placeholder="影片預覽圖 (Preview URL)">
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-th mr-2 text-line-green"></i> 網格按鈕設定</h4>
                                <div class="space-y-3">
                                    <div v-for="(grid, index) in flexData.gridButtons" :key="index" class="grid grid-cols-2 gap-3">
                                        <div class="flex items-center gap-2">
                                            <input type="text" v-model="grid.emoji" class="w-16 px-3 py-2 border rounded-lg text-sm" placeholder="emoji">
                                            <input type="text" v-model="grid.label" class="flex-1 px-3 py-2 border rounded-lg text-sm" placeholder="標籤文字">
                                        </div>
                                        <input type="text" v-model="grid.uri" class="px-3 py-2 border rounded-lg text-sm" placeholder="URL">
                                    </div>
                                </div>
                            </div>
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 影片底部主按鈕設定</h4>
                                <div class="space-y-3">
                                    <div v-for="(vBtn, vIdx) in flexData.videoFooterButtons" :key="vIdx" class="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center transition-all hover:border-blue-100">
                                        <div v-if="vIdx === 0" class="flex flex-col items-center gap-1 relative">
                                            <span class="text-[9px] text-gray-400 font-bold">主色</span>
                                            <input type="color" v-model="vBtn.color">
                                            <button @click="showColorPalette($event, 'videoButtonColor', vIdx)" class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
                                                <i class="fas fa-palette"></i>
                                            </button>
                                        </div>
                                        <input type="text" v-model="vBtn.label" class="w-40 border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" placeholder="文字">
                                        <input type="text" v-model="vBtn.uri" class="flex-grow border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" placeholder="URL">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- JSON 輸出 -->
                        <div class="mt-12 mb-20">
                            <div class="flex items-center justify-between mb-3 px-2">
                                <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><i class="fas fa-code mr-2"></i>Raw Flex JSON Data</span>
                                <button @click="copyJson" class="text-[10px] text-line-green font-bold hover:underline uppercase">Copy JSON</button>
                            </div>
                            <div class="bg-[#1e2124] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden">
                                <pre class="text-[11px] text-green-400 font-mono leading-relaxed h-48 overflow-y-auto no-scrollbar">{{ generatedJson }}</pre>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 電子商務版編輯器 -->
                <div v-if="flexData.type === 'ecommerce'" class="flex w-full overflow-hidden">
                    <!-- 左側編輯器 -->
                    <div class="flex-grow overflow-y-auto p-8 bg-white shadow-inner border-r no-scrollbar">
                        <div class="max-w-4xl mx-auto">
                            <!-- 共用頂部按鈕區域 -->
                            <div class="flex items-center justify-between mb-8">
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-800">電商型插件開發</h3>
                                    <p class="text-sm text-gray-400 mt-1">編輯參數後，可儲存為專案或直接推播至 LINE。</p>
                                </div>
                                <div class="flex gap-2">
                                    <button v-if="currentProjectId" @click="saveProject(true)" :disabled="isSaving" class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
                                        <i class="fas fa-save"></i> 更新專案
                                    </button>
                                    <button v-else @click="showNewProjectModal = true" :disabled="isSaving" class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
                                        <i class="fas fa-plus"></i> 儲存為新專案
                                    </button>
                                    <button @click="shareToLine" class="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                                        <i class="fas fa-paper-plane"></i> 🚀 直接推播
                                    </button>
                                    <button @click="saveToCloudflare" :disabled="isSaving" class="px-6 py-2.5 bg-line-green text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300">
                                        {{ isSaving ? '同步中...' : '儲存到雲端' }}
                                    </button>
                                </div>
                            </div>

                            <!-- 專案顯示區域 -->
                            <div v-if="currentProjectId" class="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <i class="fas fa-box text-purple-500"></i>
                                        <div>
                                            <div class="font-bold text-gray-800">{{ currentProjectName }}</div>
                                            <div class="text-xs text-gray-500">專案ID: {{ currentProjectId }}</div>
                                        </div>
                                    </div>
                                    <button @click="clearCurrentProject" class="text-sm text-gray-500 hover:text-red-500">
                                        <i class="fas fa-times"></i> 清除選擇
                                    </button>
                                </div>
                            </div>

                            <!-- 聊天室文字設定區域 -->
                            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
                                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定</h4>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block mb-2">
                                            <span class="text-[11px] font-bold text-slate-700 uppercase block">聊天室訊息文字</span>
                                            <span class="text-[10px] text-slate-400 font-normal">※ 在 LINE 聊天室中顯示的文字訊息</span>
                                        </label>
                                        <textarea v-model="chatMessage" @input="saveEcomHistory" rows="3"
                                                  class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                                                  placeholder="請輸入在聊天室中顯示的文字訊息..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- 編輯器內容 -->
                            <div class="space-y-6">
                                <!-- Hero 設定 -->
                                <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-image mr-2 text-line-green"></i> 頂部 Hero 視覺</h4>
                                    <div class="space-y-4">
                                        <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-300">
                                            <button @click="updateHeroType('image')" :class="ecomState.hero.type === 'image' ? 'flex-1 py-1.5 text-xs font-bold rounded-md transition bg-white shadow-sm text-line-green border border-line-green' : 'flex-1 py-1.5 text-xs font-bold rounded-md transition text-slate-600 hover:bg-slate-200'">靜態圖片</button>
                                            <button @click="updateHeroType('video')" :class="ecomState.hero.type === 'video' ? 'flex-1 py-1.5 text-xs font-bold rounded-md transition bg-white shadow-sm text-line-green border border-line-green' : 'flex-1 py-1.5 text-xs font-bold rounded-md transition text-slate-600 hover:bg-slate-200'">影片播放</button>
                                            <button @click="updateHeroType('none')" :class="ecomState.hero.type === 'none' ? 'flex-1 py-1.5 text-xs font-bold rounded-md transition bg-white shadow-sm text-line-green border border-line-green' : 'flex-1 py-1.5 text-xs font-bold rounded-md transition text-slate-600 hover:bg-slate-200'">無</button>
                                        </div>

                                        <div v-show="ecomState.hero.type !== 'none'" class="space-y-4">
                                            <div>
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">顯示比例</label>
                                                <select v-model="ecomState.hero.aspectRatio" @change="saveEcomHistory" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-line-green outline-none">
                                                    <option value="16:9">16:9 (寬螢幕)</option>
                                                    <option value="1:1">1:1 (正方形)</option>
                                                    <option value="4:3">4:3 (矩形)</option>
                                                    <option value="1.91:1">1.91:1 (橫幅)</option>
                                                    <option value="3:4">3:4 (直式)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label class="block mb-1">
                                                    <span class="text-[11px] font-bold text-slate-700 uppercase block">{{ ecomState.hero.type === 'video' ? '預覽封面圖 URL (Preview)' : '圖片網址 (Image URL)' }}</span>
                                                    <span class="text-[10px] text-slate-400 font-normal">※ 請輸入公開連結</span>
                                                </label>
                                                <input type="text" v-model="ecomState.hero.url" @input="saveEcomHistory" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none">
                                            </div>
                                            
                                            <div v-if="ecomState.hero.type === 'video'">
                                                <label class="block mb-1">
                                                    <span class="text-[11px] font-bold text-slate-700 uppercase block">影片網址 (Video URL)</span>
                                                    <span class="text-[10px] text-slate-400 font-normal">※ 請輸入 .mp4 結尾的影片連結</span>
                                                </label>
                                                <input type="text" v-model="ecomState.hero.videoUrl" @input="saveEcomHistory" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none">
                                            </div>

                                            <div>
                                                <label class="block mb-1">
                                                    <span class="text-[11px] font-bold text-slate-700 uppercase block">點擊連結 (Action URL)</span>
                                                    <span class="text-[10px] text-slate-400 font-normal">※ 點擊圖片或影片後跳轉的網址</span>
                                                </label>
                                                <input type="text" v-model="ecomState.hero.link" @input="saveEcomHistory" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none">
                                            </div>
                                        </div>

                                        <div v-show="ecomState.hero.type === 'none'" class="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                            已隱藏 Hero 區塊
                                        </div>
                                    </div>
                                </div>

                                <!-- Body 設定 -->
                                <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center justify-between">
                                        <span><i class="fas fa-palette mr-2 text-line-green"></i> Body 內容與尺寸</span>
                                        <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded text-slate-700 font-mono">{{ ecomState.body.items.length }} items</span>
                                    </h4>
                                    <div class="space-y-4">
                                        <!-- 尺寸與欄位 -->
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">卡片尺寸 (Size)</label>
                                                <select v-model="ecomState.body.bubbleSize" @change="saveEcomHistory" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-line-green outline-none">
                                                    <option value="mega">MEGA (標準)</option>
                                                    <option value="giga">GIGA (寬版)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">每行欄數</label>
                                                <select v-model="ecomState.body.columns" @change="saveEcomHistory" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-line-green outline-none">
                                                    <option value="3">3 欄位</option>
                                                    <option value="4">4 欄位</option>
                                                </select>
                                            </div>
                                        </div>

                                        <!-- 標籤顏色設定 -->
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">標籤背景色</label>
                                                <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 h-[42px]">
                                                    <input type="color" v-model="ecomState.body.tagBgColor" @change="saveEcomHistory" class="w-7 h-7 rounded cursor-pointer border-none p-0 flex-shrink-0">
                                                    <input type="text" v-model="ecomState.body.tagBgColor" @input="saveEcomHistory" class="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none uppercase">
                                                    <button @click="showColorPalette($event, 'tagBgColor')" class="p-1 text-slate-500 hover:text-line-green">
                                                        <i class="fas fa-palette"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">標籤文字色</label>
                                                <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 h-[42px]">
                                                    <input type="color" v-model="ecomState.body.tagTextColor" @change="saveEcomHistory" class="w-7 h-7 rounded cursor-pointer border-none p-0 flex-shrink-0">
                                                    <input type="text" v-model="ecomState.body.tagTextColor" @input="saveEcomHistory" class="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none uppercase">
                                                    <button @click="showColorPalette($event, 'tagTextColor')" class="p-1 text-slate-500 hover:text-line-green">
                                                        <i class="fas fa-palette"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- 背景類型切換 -->
                                        <div>
                                            <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">背景類型</label>
                                            <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-300">
                                                <button @click="updateBodyType('color')" :class="ecomState.body.bgType === 'color' ? 'flex-1 py-1.5 text-xs font-bold rounded-md transition bg-white shadow-sm text-line-green border border-line-green' : 'flex-1 py-1.5 text-xs font-bold rounded-md transition text-slate-600 hover:bg-slate-200'">純色背景</button>
                                                <button @click="updateBodyType('image')" :class="ecomState.body.bgType === 'image' ? 'flex-1 py-1.5 text-xs font-bold rounded-md transition bg-white shadow-sm text-line-green border border-line-green' : 'flex-1 py-1.5 text-xs font-bold rounded-md transition text-slate-600 hover:bg-slate-200'">圖片背景</button>
                                            </div>
                                        </div>
                                        
                                        <!-- 背景詳細設定 -->
                                        <div class="space-y-4">
                                            <div v-if="ecomState.body.bgType === 'color'">
                                                <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">背景底色</label>
                                                <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 h-[42px]">
                                                    <input type="color" v-model="ecomState.body.bgColor" @change="saveEcomHistory" class="w-7 h-7 rounded cursor-pointer border-none p-0 flex-shrink-0">
                                                    <input type="text" v-model="ecomState.body.bgColor" @input="saveEcomHistory" class="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none uppercase">
                                                    <button @click="showColorPalette($event, 'bgColor')" class="p-1 text-slate-500 hover:text-line-green">
                                                        <i class="fas fa-palette"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div v-if="ecomState.body.bgType === 'image'" class="space-y-4">
                                                <div class="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">圖片模式</label>
                                                        <select v-model="ecomState.body.bgMode" @change="saveEcomHistory" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-line-green outline-none">
                                                            <option value="cover">全版拉伸 (Cover)</option>
                                                            <option value="top">等比縮放 (Fit Width)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">背景底色 (補白用)</label>
                                                        <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 h-[42px]">
                                                            <input type="color" v-model="ecomState.body.bgColor" @change="saveEcomHistory" class="w-7 h-7 rounded cursor-pointer border-none p-0 flex-shrink-0">
                                                            <input type="text" v-model="ecomState.body.bgColor" @input="saveEcomHistory" class="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none uppercase">
                                                            <button @click="showColorPalette($event, 'bgColor')" class="p-1 text-slate-500 hover:text-line-green">
                                                                <i class="fas fa-palette"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label class="block mb-1">
                                                        <span class="text-[11px] font-bold text-slate-700 uppercase block">背景圖片網址</span>
                                                        <span class="text-[10px] text-slate-400 font-normal">※ 滿版背景圖 (Absolute Background)</span>
                                                    </label>
                                                    <input type="text" v-model="ecomState.body.bg" @input="saveEcomHistory" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="space-y-3">
                                            <div v-for="(item, index) in ecomState.body.items" :key="index" class="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-2 relative group shadow-sm">
                                                <button @click="deleteEcomItem(index)" class="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </button>
                                                <div class="flex items-center gap-3">
                                                    <img :src="item.img" class="w-10 h-10 rounded-md object-cover border border-slate-300 bg-white">
                                                    <div class="flex-1 grid grid-cols-1 gap-2 mr-6">
                                                        <label class="text-[10px] text-slate-500 font-bold block mb-0.5">標籤文字</label>
                                                        <input type="text" :value="item.title" @input="updateEcomItem(index, 'title', $event.target.value)" class="text-xs p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-800 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="標籤文字">
                                                    </div>
                                                </div>
                                                <div class="flex gap-2">
                                                    <div class="flex-1">
                                                        <label class="text-[10px] text-slate-500 font-bold block mb-0.5">圖片連結 (Image URL)</label>
                                                        <input type="text" :value="item.img" @input="updateEcomItem(index, 'img', $event.target.value)" class="w-full text-[10px] p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-600 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="圖片 URL">
                                                    </div>
                                                </div>
                                                <div>
                                                    <label class="text-[10px] text-slate-500 font-bold block mb-0.5">點擊連結 (Action URL)</label>
                                                    <input type="text" :value="item.url" @input="updateEcomItem(index, 'url', $event.target.value)" class="w-full text-[10px] p-1.5 bg-white border border-slate-300 rounded font-mono text-slate-600 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="https://...">
                                                </div>
                                            </div>
                                        </div>

                                        <button @click="addEcomItem" class="w-full py-2.5 border-2 border-dashed border-slate-400 rounded-xl text-slate-600 text-xs font-bold hover:border-line-green hover:text-line-green hover:bg-emerald-50 transition flex items-center justify-center gap-2">
                                            <i data-lucide="plus" class="w-4 h-4"></i> 新增商品
                                        </button>
                                    </div>
                                </div>

                                <!-- Footer 設定 -->
                                <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center"><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部按鈕</h4>
                                    <div class="space-y-4">
                                        
                                        <!-- Footer 背景色 -->
                                        <div>
                                            <label class="text-[11px] font-bold text-slate-600 uppercase mb-1 block">底部背景顏色</label>
                                            <div class="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-300 h-[42px]">
                                                <input type="color" v-model="ecomState.footer.bg" @change="saveEcomHistory" class="w-7 h-7 rounded cursor-pointer border-none p-0 flex-shrink-0">
                                                <input type="text" v-model="ecomState.footer.bg" @input="saveEcomHistory" class="flex-1 bg-transparent text-xs font-mono text-slate-700 outline-none uppercase">
                                                <button @click="showColorPalette($event, 'footerBg')" class="p-1 text-slate-500 hover:text-line-green">
                                                    <i class="fas fa-palette"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Footer 說明文字開關 -->
                                        <div class="flex items-center justify-between">
                                            <label class="text-[11px] font-bold text-slate-600 uppercase">啟用說明文字</label>
                                            <label class="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="ecomState.footer.textEnabled" @change="saveEcomHistory" class="sr-only peer">
                                                <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-line-green"></div>
                                            </label>
                                        </div>

                                        <div v-show="ecomState.footer.textEnabled" class="space-y-3">
                                            <div class="flex justify-between items-center">
                                                <label class="block text-[11px] font-bold text-slate-600 uppercase">說明內容</label>
                                                <div class="flex gap-2">
                                                    <!-- Text Color Picker -->
                                                    <div class="flex items-center gap-1 border border-slate-300 rounded bg-white px-1 py-0.5" title="文字顏色">
                                                        <input type="color" v-model="ecomState.footer.textColor" @change="saveEcomHistory" class="w-4 h-4 rounded cursor-pointer border-none p-0">
                                                        <input type="text" v-model="ecomState.footer.textColor" @input="saveEcomHistory" class="w-12 text-[10px] font-mono text-slate-600 outline-none uppercase">
                                                        <button @click="showColorPalette($event, 'footerTextColor')" class="p-0.5 text-slate-500 hover:text-line-green">
                                                            <i class="fas fa-palette text-xs"></i>
                                                        </button>
                                                    </div>
                                                    <!-- Alignment -->
                                                    <div class="flex bg-slate-200 rounded p-0.5 space-x-0.5">
                                                        <button @click="updateFooterTextAlign('start')" :class="ecomState.footer.textAlign === 'start' ? 'p-1 rounded bg-white shadow-sm text-line-green border border-slate-200 transition' : 'p-1 rounded hover:bg-white transition text-slate-600'" title="靠左對齊" class="tooltip">
                                                            <i data-lucide="align-left" class="w-3 h-3"></i>
                                                            <span class="tooltiptext">靠左對齊</span>
                                                        </button>
                                                        <button @click="updateFooterTextAlign('center')" :class="ecomState.footer.textAlign === 'center' ? 'p-1 rounded bg-white shadow-sm text-line-green border border-slate-200 transition' : 'p-1 rounded hover:bg-white transition text-slate-600'" title="置中對齊" class="tooltip">
                                                            <i data-lucide="align-center" class="w-3 h-3"></i>
                                                            <span class="tooltiptext">置中對齊</span>
                                                        </button>
                                                        <button @click="updateFooterTextAlign('end')" :class="ecomState.footer.textAlign === 'end' ? 'p-1 rounded bg-white shadow-sm text-line-green border border-slate-200 transition' : 'p-1 rounded hover:bg-white transition text-slate-600'" title="靠右對齊" class="tooltip">
                                                            <i data-lucide="align-right" class="w-3 h-3"></i>
                                                            <span class="tooltiptext">靠右對齊</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea v-model="ecomState.footer.text" @input="saveEcomHistory" rows="3" class="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="請輸入說明文字..."></textarea>
                                        </div>

                                        <div class="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                                            <div class="text-[11px] font-bold text-slate-700 mb-2">按鈕 1 (Primary)</div>
                                            <div class="flex gap-2 mb-2">
                                                <input type="text" v-model="ecomState.footer.btn1.label" @input="saveEcomHistory" class="flex-1 text-xs p-2 border border-slate-300 rounded bg-white focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="名稱">
                                                <div class="flex items-center gap-1 border border-slate-300 rounded bg-white px-2 py-1 w-32 relative">
                                                    <input type="color" v-model="ecomState.footer.btn1.color" @change="saveEcomHistory" class="w-5 h-5 rounded cursor-pointer border-none shadow-sm">
                                                    <input type="text" v-model="ecomState.footer.btn1.color" @input="saveEcomHistory" class="flex-1 text-[10px] font-mono text-slate-600 outline-none uppercase text-center">
                                                    <button @click="showColorPalette($event, 'btn1Color')" class="p-1 text-slate-500 hover:text-line-green">
                                                        <i class="fas fa-palette text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="text" v-model="ecomState.footer.btn1.uri" @input="saveEcomHistory" class="w-full text-xs p-2 border border-slate-300 rounded font-mono bg-white text-slate-600 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="https://...">
                                        </div>
                                        <div class="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                                            <div class="text-[11px] font-bold text-slate-700 mb-2">按鈕 2 (Primary)</div>
                                            <div class="flex gap-2 mb-2">
                                                <input type="text" v-model="ecomState.footer.btn2.label" @input="saveEcomHistory" class="flex-1 text-xs p-2 border border-slate-300 rounded bg-white focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="名稱">
                                                <div class="flex items-center gap-1 border border-slate-300 rounded bg-white px-2 py-1 w-32 relative">
                                                    <input type="color" v-model="ecomState.footer.btn2.color" @change="saveEcomHistory" class="w-5 h-5 rounded cursor-pointer border-none shadow-sm">
                                                    <input type="text" v-model="ecomState.footer.btn2.color" @input="saveEcomHistory" class="flex-1 text-[10px] font-mono text-slate-600 outline-none uppercase text-center">
                                                    <button @click="showColorPalette($event, 'btn2Color')" class="p-1 text-slate-500 hover:text-line-green">
                                                        <i class="fas fa-palette text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <input type="text" v-model="ecomState.footer.btn2.uri" @input="saveEcomHistory" class="w-full text-xs p-2 border border-slate-300 rounded font-mono bg-white text-slate-600 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none" placeholder="https://...">
                                        </div>
                                    </div>
                                </div>

                                <!-- JSON 輸出 -->
                                <div class="mt-12 mb-20">
                                    <div class="flex items-center justify-between mb-3 px-2">
                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"><i class="fas fa-code mr-2"></i>Raw Flex JSON Data</span>
                                        <button @click="copyEcommerceJson" class="text-[10px] text-line-green font-bold hover:underline uppercase">Copy JSON</button>
                                    </div>
                                    <div class="bg-[#1e2124] rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden">
                                        <pre class="text-[11px] text-green-400 font-mono leading-relaxed h-48 overflow-y-auto no-scrollbar">{{ generateEcommerceJson() }}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右側預覽區 -->
                    <div class="w-[360px] flex-shrink-0 bg-slate-100 relative overflow-hidden flex flex-col">
                        <div class="chat-room-bg custom-scrollbar">
                            <!-- 模擬日期標籤 -->
                            <div class="text-center my-4">
                                <span class="bg-black/20 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">Today</span>
                            </div>

                            <!-- Flex 氣泡本體 -->
                            <div class="flex items-start gap-2 mb-8 w-full justify-center">
                                <!-- 頭像 -->
                                <div class="w-8 h-8 rounded-full bg-slate-400 shrink-0 self-start mt-1"></div>
                                
                                <!-- 氣泡內容 -->
                                <div class="bg-white rounded-xl overflow-hidden flex-bubble-container flex flex-col">
                                    
                                    <!-- Hero Area -->
                                    <div v-show="ecomState.hero.type !== 'none'" :class="getAspectClass(ecomState.hero.aspectRatio)" class="relative w-full bg-black overflow-hidden group cursor-pointer shrink-0">
                                        <img v-show="ecomState.hero.type === 'image'" :src="ecomState.hero.url" class="w-full h-full object-cover">
                                        <div v-show="ecomState.hero.type === 'video'" class="absolute inset-0 flex items-center justify-center">
                                            <img :src="ecomState.hero.url" class="absolute inset-0 w-full h-full object-cover opacity-70">
                                            <div class="relative z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                <i data-lucide="play" class="w-5 h-5 text-slate-900 fill-slate-900 ml-1"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Body Area -->
                                    <div class="relative w-full" :style="{ backgroundColor: ecomState.body.bgColor }">
                                        <!-- 背景圖 -->
                                        <img v-if="ecomState.body.bgType === 'image' && ecomState.body.bg" :src="ecomState.body.bg" 
                                             :class="ecomState.body.bgMode === 'top' ? 'object-contain' : 'object-cover'"
                                             class="absolute inset-0 w-full h-full z-0">
                                        
                                        <!-- 內容網格 -->
                                        <div class="relative z-10 p-4">
                                            <div :class="ecomState.body.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'" class="grid gap-2">
                                                <div v-for="(item, index) in ecomState.body.items" :key="index" class="bg-white rounded-md p-1 shadow-sm flex flex-col">
                                                    <div class="relative w-full aspect-square bg-slate-100 rounded-sm overflow-hidden mb-1">
                                                        <img :src="item.img" class="w-full h-full object-cover">
                                                    </div>
                                                    <div :style="{ backgroundColor: ecomState.body.tagBgColor, color: ecomState.body.tagTextColor }" class="text-[8px] font-bold text-center py-1 px-1 rounded-sm truncate">
                                                        {{ item.title }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Footer Area -->
                                    <div class="p-3 border-t border-slate-100 flex flex-col gap-2 shrink-0 relative z-10" :style="{ backgroundColor: ecomState.footer.bg }">
                                        <div v-show="ecomState.footer.textEnabled" :style="{ color: ecomState.footer.textColor }" 
                                             :class="getTextAlignClass(ecomState.footer.textAlign)"
                                             class="text-xs whitespace-pre-wrap mb-2 w-full">
                                            {{ ecomState.footer.text }}
                                        </div>
                                        <div class="flex gap-2 w-full">
                                            <button :style="{ backgroundColor: ecomState.footer.btn1.color }" 
                                                    class="flex-1 py-2 rounded text-[10px] font-bold text-white text-center transition hover:opacity-90">
                                                {{ ecomState.footer.btn1.label }}
                                            </button>
                                            <button :style="{ backgroundColor: ecomState.footer.btn2.color }" 
                                                    class="flex-1 py-2 rounded text-[10px] font-bold text-white text-center transition hover:opacity-90">
                                                {{ ecomState.footer.btn2.label }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 聊天室文字輸入區域 -->
                            <div class="chat-input-container">
                                <textarea v-model="chatMessage" 
                                          class="chat-input" 
                                          placeholder="輸入聊天室顯示文字..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 手機預覽區（單頁文章和影片名片） -->
                <div v-if="flexData.type !== 'ecommerce'" class="w-[360px] flex-shrink-0 bg-gray-50 flex items-center justify-center py-8 shadow-inner overflow-y-auto no-scrollbar">
                    <div class="flex flex-col items-center gap-4">
                        <div class="preview-window no-scrollbar shadow-2xl">
                            <div class="p-3 border-b border-gray-800 bg-[#1A1B1E] flex items-center gap-2 sticky top-0 z-50">
                                <i class="fas fa-chevron-left text-gray-600 text-xs"></i>
                                <span class="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">LINE Preview</span>
                            </div>

                            <div v-if="flexData.type === 'standard'" class="p-4">
                                <div class="flex-bubble shadow-xl relative overflow-hidden">
                                    <div class="relative">
                                        <img :src="flexData.imageUrl" :style="{ aspectRatio: flexData.aspectRatio.replace(':', '/') }" class="w-full object-cover transition-all" onerror="this.src='https://via.placeholder.com/250x160?text=Image'">
                                        <div class="flex-badge shadow-md" v-if="flexData.showBadge" :style="{ backgroundColor: flexData.badgeColor }">分享</div>
                                    </div>
                                    <div class="p-4 text-center">
                                        <div class="text-base font-bold truncate">{{ flexData.title || '標題' }}</div>
                                        <div class="text-[10px] text-gray-500 preview-article mt-2">{{ flexData.subtitle || '內容區...' }}</div>
                                    </div>
                                    <div class="p-3 pt-0 space-y-1.5">
                                        <button v-for="btn in flexData.buttons" class="w-full py-1.5 text-white text-[10px] font-bold rounded shadow-sm" :style="{ backgroundColor: btn.color }">{{ btn.label }}</button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="flexData.type === 'video'" class="p-4">
                                <div class="flex-bubble flex-bubble-dark shadow-2xl border-gray-800 overflow-hidden">
                                    <div class="header-box">
                                        <img :src="flexData.headerImg" class="w-10 h-10 rounded-full object-cover border border-gray-700">
                                        <span class="text-[11px] font-bold truncate uppercase" style="color:#D4AF37">{{flexData.headerName || '姓名'}}</span>
                                    </div>
                                    <div class="video-hero">
                                        <img :src="flexData.previewUrl" class="w-full h-full object-cover opacity-60">
                                        <div class="absolute inset-0 flex items-center justify-center"><i class="fas fa-play-circle text-white text-4xl opacity-90 drop-shadow-lg"></i></div>
                                    </div>
                                    <div class="grid-box">
                                        <div v-for="(grid, gIdx) in flexData.gridButtons" :key="gIdx" class="grid-item">
                                            <div class="text-xl mb-1">{{grid.emoji}}</div>
                                            <div class="text-[8px] text-gray-300 font-bold truncate uppercase tracking-tighter">{{grid.label || 'Grid'}}</div>
                                        </div>
                                    </div>
                                    <div class="p-3 pt-0 space-y-2 bg-[#0F0F10]">
                                        <button v-for="(vBtn, vI) in flexData.videoFooterButtons" :key="vI" 
                                                class="w-full py-2 text-[10px] font-bold rounded shadow-md transition-all active:scale-95"
                                                :style="vI === 0 ? { backgroundColor: vBtn.color, color: '#fff' } : { backgroundColor: '#2A2C31', color: '#999' }">
                                            {{vBtn.label || '按鈕'}}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 聊天室文字輸入區域 -->
                            <div class="chat-input-container">
                                <textarea v-model="chatMessage" 
                                          class="chat-input" 
                                          placeholder="輸入聊天室顯示文字..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 插件模板庫 -->
            <div v-if="currentTab === 'templates'" class="w-full overflow-y-auto p-8">
                <div class="max-w-7xl mx-auto">
                    <h3 class="text-2xl font-bold text-gray-800 mb-2">插件模板庫</h3>
                    <p class="text-gray-500 mb-8">選擇模板快速開始你的插件設計</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(template, idx) in templates" :key="idx" 
                             @click="applyTemplate(template)"
                             class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                            <div class="template-aspect overflow-hidden bg-gray-100">
                                <img :src="template.thumbnail" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            </div>
                            <div class="p-5">
                                <div class="flex items-center justify-between mb-2">
                                    <h4 class="font-bold text-gray-800">{{ template.name }}</h4>
                                    <span class="px-2 py-1 text-xs rounded-full" 
                                          :class="template.type === 'video' ? 'bg-purple-100 text-purple-700' : 
                                                 template.type === 'ecommerce' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'">
                                        {{ template.type === 'video' ? '影片型' : 
                                           template.type === 'ecommerce' ? '電商型' : '文章型' }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500 mb-4">點擊立即套用模板</p>
                                <button class="w-full py-2.5 bg-line-green text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                                    立即套用
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 專案管理頁面 -->
            <div v-if="currentTab === 'projects'" class="w-full overflow-y-auto p-8">
                <div class="max-w-7xl mx-auto">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">專案管理</h3>
                            <p class="text-gray-500">管理您的插件設計專案，可以儲存、編輯和刪除</p>
                        </div>
                        <button @click="showNewProjectModal = true" 
                                class="px-6 py-3 bg-line-green text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                            <i class="fas fa-plus"></i> 新增專案
                        </button>
                    </div>
                    
                    <!-- 專案篩選器 -->
                    <div class="mb-6 p-4 bg-white rounded-xl border shadow-sm">
                        <div class="flex items-center gap-4">
                            <div class="flex-1">
                                <input type="text" v-model="projectSearch" 
                                       placeholder="搜尋專案名稱或類型..." 
                                       class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none">
                            </div>
                            <div class="flex gap-2">
                                <button @click="loadProjects" class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                                    <i class="fas fa-sync-alt"></i> 重新整理
                                </button>
                                <button @click="initializeSheets" class="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                                    <i class="fas fa-database"></i> 初始化
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 載入中狀態 -->
                    <div v-if="loadingProjects" class="text-center py-12">
                        <div class="spinner mx-auto mb-4"></div>
                        <p class="text-gray-500">載入專案中...</p>
                    </div>
                    
                    <!-- 錯誤訊息 -->
                    <div v-else-if="loadError" class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <h4 class="text-lg font-bold text-gray-800 mb-2">載入專案失敗</h4>
                        <p class="text-gray-600 mb-4">{{ loadError }}</p>
                        <button @click="loadProjects" class="retry-button">
                            <i class="fas fa-redo-alt mr-2"></i> 重試載入
                        </button>
                    </div>
                    
                    <!-- 專案列表 -->
                    <div v-else-if="!loadingProjects && projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="project in filteredProjects" :key="project.id" 
                             class="project-card">
                            <div class="p-5">
                                <div class="flex items-start justify-between mb-3">
                                    <div>
                                        <div class="flex items-center gap-2 mb-1">
                                            <span class="px-2 py-1 text-xs rounded-full" 
                                                  :class="project.type === 'video' ? 'bg-purple-100 text-purple-700' : 
                                                         project.type === 'ecommerce' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'">
                                                {{ project.type === 'video' ? '影片型' : 
                                                   project.type === 'ecommerce' ? '電商型' : '文章型' }}
                                            </span>
                                            <span class="text-xs text-gray-500">{{ formatDate(project.created_at) }}</span>
                                        </div>
                                        <h4 class="font-bold text-lg text-gray-800">{{ project.name }}</h4>
                                        <p class="text-sm text-gray-500 mt-1">{{ project.description || '未添加描述' }}</p>
                                    </div>
                                    <button @click="deleteProject(project.id)" 
                                            class="text-gray-400 hover:text-red-500 transition-colors">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                                
                                <div class="mt-4 flex gap-2">
                                    <button @click="loadProject(project)" 
                                            class="flex-1 py-2 bg-line-green text-white rounded-lg text-sm font-bold hover:opacity-90">
                                        <i class="fas fa-edit"></i> 編輯
                                    </button>
                                    <button @click="pushProject(project)" 
                                            class="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:opacity-90">
                                        <i class="fas fa-paper-plane"></i> 推播
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 無專案時的提示 -->
                    <div v-else-if="!loadingProjects && projects.length === 0 && !loadError" class="text-center py-16">
                        <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                        <h4 class="text-xl font-bold text-gray-500 mb-2">尚無專案</h4>
                        <p class="text-gray-400 mb-6">開始創建您的第一個插件專案吧！</p>
                        <button @click="showNewProjectModal = true" 
                                class="px-6 py-3 bg-line-green text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90">
                            創建第一個專案
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- 新增專案模態視窗 -->
    <div v-if="showNewProjectModal" class="modal-overlay" @click.self="showNewProjectModal = false">
        <div class="modal-content">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">儲存為新專案</h3>
                <button @click="showNewProjectModal = false" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">專案名稱 *</label>
                    <input type="text" v-model="newProject.name" 
                           class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                           placeholder="例如：產品介紹卡片">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">專案描述</label>
                    <textarea v-model="newProject.description" rows="3"
                              class="w-full px-4 py-2 border rounded-lg focus:border-line-green outline-none"
                              placeholder="描述此專案的用途和內容"></textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">專案類型</label>
                    <div class="flex gap-2">
                        <button @click="newProject.type = 'standard'" 
                                :class="newProject.type === 'standard' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700'"
                                class="flex-1 py-2 border rounded-lg text-sm font-medium">
                            文章型
                        </button>
                        <button @click="newProject.type = 'video'" 
                                :class="newProject.type === 'video' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-gray-100 text-gray-700'"
                                class="flex-1 py-2 border rounded-lg text-sm font-medium">
                            影片型
                        </button>
                        <button @click="newProject.type = 'ecommerce'" 
                                :class="newProject.type === 'ecommerce' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-100 text-gray-700'"
                                class="flex-1 py-2 border rounded-lg text-sm font-medium">
                            電商型
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 flex gap-3">
                <button @click="showNewProjectModal = false" 
                        class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    取消
                </button>
                <button @click="saveProject(false)" 
                        :disabled="!newProject.name || isSaving"
                        class="flex-1 py-3 bg-line-green text-white rounded-lg font-bold hover:opacity-90 disabled:bg-gray-300">
                    {{ isSaving ? '儲存中...' : '儲存專案' }}
                </button>
            </div>
        </div>
    </div>
    
    <!-- 刪除確認模態視窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal-content">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">確認刪除</h3>
                <p class="text-gray-600 mb-6">您確定要刪除此專案嗎？此動作無法復原。</p>
                
                <div class="flex gap-3">
                    <button @click="showDeleteConfirm = false" 
                            class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        取消
                    </button>
                    <button @click="confirmDelete" 
                            class="flex-1 py-3 bg-red-500 text-white rounded-lg font-bold hover:opacity-90">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 調色盤彈出視窗 -->
<div v-if="showColorPalettePopup" class="color-palette-popup" :style="colorPalettePosition">
    <div class="color-preset-label">預設顏色</div>
    <div class="color-palette-grid">
        <div v-for="color in colorPresets" :key="color" 
             :style="{ backgroundColor: color }" 
             class="color-swatch"
             @click="selectColor(color)"></div>
    </div>
    <div class="flex justify-between">
        <button @click="copyCurrentColor" class="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
            複製
        </button>
        <button @click="closeColorPalette" class="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            關閉
        </button>
    </div>
</div>
`;

// 完整的Vue應用設定
createApp({
  // 使用模板字符串
  template: AppTemplate,
  
  setup() {
    // ============ 狀態變數 (從原HTML提取) ============
    
    // 側邊欄狀態
    const isSidebarCollapsed = ref(false);
    const isMessageMenuOpen = ref(true);
    const currentTab = ref('messages');
    const currentSubTab = ref('single');
    
    // 用戶狀態
    const isSaving = ref(false);
    const isLoggedIn = ref(false);
    const isInIframe = ref(false);
    const liffProfile = ref(null);
    const chatMessage = ref("🎉 限時優惠！精選商品特價中，點擊查看最新商品！");
    
    // 調色盤狀態
    const showColorPalettePopup = ref(false);
    const colorPalettePosition = ref({ top: '0px', left: '0px' });
    const currentColorTarget = ref('');
    const currentColorIndex = ref(0);
    const colorPresets = ref([
      '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#ADFF2F', '#32CD32', '#00FF7F',
      '#00CED1', '#1E90FF', '#4169E1', '#8A2BE2', '#FF69B4', '#FF1493', '#C71585',
      '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9',
      '#06C755', '#00B900', '#00A0E9', '#FFCC00', '#FF6666', '#6666FF'
    ]);

    // 專案管理狀態
    const showNewProjectModal = ref(false);
    const showDeleteConfirm = ref(false);
    const projectSearch = ref('');
    const projects = ref([]);
    const loadingProjects = ref(false);
    const loadError = ref(null);
    const currentProjectId = ref(null);
    const currentProjectName = ref('');
    const projectToDelete = ref(null);
    
    // 新專案資料
    const newProject = ref({
      name: '',
      description: '',
      type: 'standard'
    });

    // ============ 數據模型 ============
    
    // 電子商務版數據
    const ecomState = ref({
      hero: {
        type: 'video', 
        aspectRatio: '16:9',
        url: "https://lihi.cc/5OXMZ", 
        videoUrl: "https://lihi.cc/YsmAp", 
        link: "https://line.me"
      },
      body: {
        columns: 3,
        bubbleSize: "mega", 
        bgType: "image", // color | image
        bgMode: "cover", // cover | top
        bgColor: "#F8F8F8", // Body 預設底色
        bg: "https://lihi.cc/l5qqU",
        tagBgColor: "#0D0D0D",
        tagTextColor: "#FFFFFF",
        items: [
          { title: "商品 A", img: "https://lihi.cc/mwMvo", url: "https://line.me" },
          { title: "商品 B", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
          { title: "商品 C", img: "https://lihi.cc/yRfpn", url: "https://line.me" },
          { title: "商品 D", img: "https://lihi.cc/yRfpn", url: "https://line.me" },
          { title: "商品 E", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
          { title: "商品 F", img: "https://lihi.cc/mwMvo", url: "https://line.me" }
        ]
      },
      footer: {
        bg: "#ffffff", 
        textEnabled: false,
        text: "※ 請注意：優惠商品數量有限，售完為止。",
        textColor: "#666666",
        textAlign: "center", // start, center, end
        btn1: { label: "品牌故事", color: "#000000", uri: "https://liff.line.me/2008704329-cTkwlRHm" },
        btn2: { label: "好友分享", color: "#000000", uri: "line://nv/recommendOA/@754tjssx" }
      }
    });

    const ecomHistory = ref([]);

    // 原有Flex數據
    const flexData = ref({
      type: 'standard', 
      imageUrl: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
      aspectRatio: '20:13', 
      title: 'Brown Cafe', 
      subtitle: '歡迎光臨！支援長文換行。', 
      showBadge: true, 
      badgeColor: '#FF0000',
      buttons: [{ label: '了解更多', uri: 'https://example.com', color: '#00B900' }],
      
      // 影片模板數據
      headerImg: 'https://aiwe.cc/wp-content/uploads/2025/04/f9ebd0672d3b0ac370272909a493d4db.png',
      headerName: 'TONY', 
      headerTitle: 'LINE行銷達人',
      headerDescription: '系統開發',
      videoUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/mp4',
      previewUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/m800x1200',
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
    });

    // 模板數據
    const templates = ref([
      { 
        name: '文章型模板', 
        type: 'standard', 
        thumbnail: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png', 
        payload: { 
          type:'standard', 
          imageUrl:'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png', 
          aspectRatio:'20:13', 
          title:'經典咖啡', 
          subtitle:'支援換行。', 
          showBadge:true, 
          badgeColor:'#FF0000', 
          buttons:[{label:'了解更多', uri:'#', color:'#00B900'}]
        } 
      },
      { 
        name: '影片名片模板', 
        type: 'video', 
        thumbnail: 'https://aiwe.cc/wp-content/uploads/2025/04/f9ebd0672d3b0ac370272909a493d4db.png', 
        payload: { 
          type:'video', 
          headerName:'TONY', 
          headerTitle: 'LINE行銷達人',
          headerDescription: '系統開發',
          headerImg:'https://aiwe.cc/wp-content/uploads/2025/04/f9ebd0672d3b0ac370272909a493d4db.png', 
          videoUrl:'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/mp4',
          previewUrl:'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/m800x1200',
          gridButtons: [
            {emoji:'🤖',label:'AI 諮詢',uri:'https://liff.line.me/2006625044-bPGxrB53/'},
            {emoji:'🎥',label:'產品介紹',uri:'https://example.com/video'},
            {emoji:'🧾',label:'商品型錄',uri:'https://example.com/catalog'},
            {emoji:'📍',label:'門市資訊',uri:'https://example.com/map'}
          ], 
          videoFooterButtons:[
            {label:'🚀 啟動 AI 小幫手',uri:'https://liff.line.me/2006625044-bPGxrB53/index.php/colt_sp/6502/',color:'#C9A24D'},
            {label:'📤 分享好友',uri:'https://liff.line.me/2006625044-J42EzjkZ/index.php/linecard_12/6816/'}
          ]
        } 
      },
      { 
        name: '電商型模板', 
        type: 'ecommerce', 
        thumbnail: 'https://lihi.cc/l5qqU', 
        payload: {
          type: 'ecommerce',
          ecomState: {
            hero: {
              type: 'video', 
              aspectRatio: '16:9',
              url: "https://lihi.cc/5OXMZ", 
              videoUrl: "https://lihi.cc/YsmAp", 
              link: "https://line.me"
            },
            body: {
              columns: 3,
              bubbleSize: "mega", 
              bgType: "image",
              bgMode: "cover",
              bgColor: "#F8F8F8",
              bg: "https://lihi.cc/l5qqU",
              tagBgColor: "#0D0D0D",
              tagTextColor: "#FFFFFF",
              items: [
                { title: "商品 A", img: "https://lihi.cc/mwMvo", url: "https://line.me" },
                { title: "商品 B", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
                { title: "商品 C", img: "https://lihi.cc/yRfpn", url: "https://line.me" },
                { title: "商品 D", img: "https://lihi.cc/yRfpn", url: "https://line.me" },
                { title: "商品 E", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
                { title: "商品 F", img: "https://lihi.cc/mwMvo", url: "https://line.me" }
              ]
            },
            footer: {
              bg: "#ffffff", 
              textEnabled: false,
              text: "※ 請注意：優惠商品數量有限，售完為止。",
              textColor: "#666666",
              textAlign: "center",
              btn1: { label: "品牌故事", color: "#000000", uri: "https://liff.line.me/2008704329-cTkwlRHm" },
              btn2: { label: "好友分享", color: "#000000", uri: "line://nv/recommendOA/@754tjssx" }
            }
          }
        }
      }
    ]);

    // ============ 計算屬性 ============
    
    const pageTitle = computed(() => {
      const titles = {
        'dashboard': '儀表板總覽',
        'messages': '插件開發管理平台',
        'templates': '插件模板選擇中心',
        'projects': '專案管理'
      };
      return titles[currentTab.value] || 'LINEOA 插件管理平台';
    });
    
    const filteredProjects = computed(() => {
      if (!projectSearch.value) return projects.value;
      const search = projectSearch.value.toLowerCase();
      return projects.value.filter(project => 
        (project.name && project.name.toLowerCase().includes(search)) ||
        (project.type && project.type.toLowerCase().includes(search)) ||
        (project.description && project.description.toLowerCase().includes(search))
      );
    });

    const generatedJson = computed(() => {
      // 簡化版本，完整邏輯在下一階段拆分
      if (flexData.value.type === 'ecommerce') {
        return { type: 'ecommerce', message: 'JSON generation will be implemented in phase 2' };
      }
      
      if (flexData.value.type === 'standard') {
        return { 
          type: "bubble", 
          body: { 
            type: "box", 
            layout: "vertical", 
            contents: [] 
          }
        };
      } else {
        return { 
          type: "bubble",
          size: "mega"
        };
      }
    });

    // ============ 生命週期鉤子 ============
    
    onMounted(async () => {
      isInIframe.value = window.self !== window.top;
      if (typeof liff !== 'undefined') {
        try {
          await liff.init({ liffId: "2008541971-XPIDtaaj" });
          console.log("LIFF Ready");
          isLoggedIn.value = liff.isLoggedIn();
          
          if (isLoggedIn.value) {
            liffProfile.value = await liff.getProfile();
            console.log("User Profile:", liffProfile.value);
          }
        } catch (err) {
          console.error("LIFF Init failed", err);
        }
      }
      
      // 初始化圖標
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      // 檢查並初始化 Google Sheets
      await checkSheetsStatus();
    });

    // ============ 基本方法 ============
    
    const switchTab = (t) => {
      currentTab.value = t;
      if (t === 'projects') {
        loadProjects();
      }
    };
    
    const toggleSidebarMenu = () => { 
      if (isSidebarCollapsed.value) {
        isSidebarCollapsed.value = false;
        setTimeout(() => {
          isMessageMenuOpen.value = true;
        }, 100);
      } else {
        isMessageMenuOpen.value = !isMessageMenuOpen.value;
      }
    };
    
    const switchSubTab = (t, s) => { 
      currentTab.value = t; 
      currentSubTab.value = s; 
      flexData.value.type = (s === 'video' ? 'video' : s === 'ecommerce' ? 'ecommerce' : 'standard'); 
      
      // 初始化電子商務歷史記錄
      if (s === 'ecommerce') {
        ecomHistory.value = [];
        saveEcomHistory();
      }
    };
    
    const applyTemplate = (tpl) => { 
      if (tpl.type === 'ecommerce') {
        ecomState.value = JSON.parse(JSON.stringify(tpl.payload.ecomState));
      } else {
        flexData.value = JSON.parse(JSON.stringify(tpl.payload)); 
      }
      currentTab.value = 'messages'; 
      currentSubTab.value = (tpl.type === 'video' ? 'video' : tpl.type === 'ecommerce' ? 'ecommerce' : 'single'); 
    };
    
    const addButton = () => { 
      if (flexData.value.buttons.length < 3) {
        flexData.value.buttons.push({ 
          label: '新按鈕', 
          uri: 'https://example.com', 
          color: '#00B900' 
        }); 
      }
    };
    
    const removeButton = (idx) => flexData.value.buttons.splice(idx, 1);

    const liffLogin = () => {
      if (isInIframe.value) window.open("https://liff.line.me/2008541971-XPIDtaaj", "_blank");
      else liff.login();
    };

    // ============ 電子商務方法 ============
    
    const saveEcomHistory = () => {
      if (ecomHistory.value.length > 20) ecomHistory.value.shift();
      ecomHistory.value.push(JSON.parse(JSON.stringify(ecomState.value)));
    };

    const updateHeroType = (type) => {
      saveEcomHistory();
      ecomState.value.hero.type = type;
    };

    const updateBodyType = (type) => {
      saveEcomHistory();
      ecomState.value.body.bgType = type;
    };

    const updateFooterTextAlign = (align) => {
      saveEcomHistory();
      ecomState.value.footer.textAlign = align;
    };

    const updateEcomItem = (index, field, value) => {
      saveEcomHistory();
      ecomState.value.body.items[index][field] = value;
    };

    const addEcomItem = () => {
      saveEcomHistory();
      ecomState.value.body.items.push({ 
        title: "新商品", 
        img: "https://lihi.cc/mwMvo", 
        url: "https://line.me" 
      });
    };

    const deleteEcomItem = (index) => {
      saveEcomHistory();
      ecomState.value.body.items.splice(index, 1);
    };

    const getAspectClass = (aspect) => {
      const ratioMap = { 
        '1:1': 'aspect-1-1', 
        '16:9': 'aspect-16-9', 
        '4:3': 'aspect-4-3', 
        '1.91:1': 'aspect-1_91-1', 
        '3:4': 'aspect-3-4' 
      };
      return ratioMap[aspect] || 'aspect-16-9';
    };

    const getTextAlignClass = (align) => {
      const alignMap = { 
        'start': 'text-left', 
        'center': 'text-center', 
        'end': 'text-right' 
      };
      return alignMap[align] || 'text-center';
    };

    // ============ 調色盤功能 ============
    
    const showColorPalette = (event, target, index = 0) => {
      event.stopPropagation();
      currentColorTarget.value = target;
      currentColorIndex.value = index;
      
      const rect = event.target.getBoundingClientRect();
      colorPalettePosition.value = {
        top: `${rect.bottom + window.scrollY + 5}px`,
        left: `${rect.left + window.scrollX}px`
      };
      
      showColorPalettePopup.value = true;
    };

    const closeColorPalette = () => {
      showColorPalettePopup.value = false;
      currentColorTarget.value = '';
      currentColorIndex.value = 0;
    };

    const selectColor = (color) => {
      switch (currentColorTarget.value) {
        case 'tagBgColor':
          ecomState.value.body.tagBgColor = color;
          saveEcomHistory();
          break;
        case 'tagTextColor':
          ecomState.value.body.tagTextColor = color;
          saveEcomHistory();
          break;
        case 'bgColor':
          ecomState.value.body.bgColor = color;
          saveEcomHistory();
          break;
        case 'footerBg':
          ecomState.value.footer.bg = color;
          saveEcomHistory();
          break;
        case 'footerTextColor':
          ecomState.value.footer.textColor = color;
          saveEcomHistory();
          break;
        case 'btn1Color':
          ecomState.value.footer.btn1.color = color;
          saveEcomHistory();
          break;
        case 'btn2Color':
          ecomState.value.footer.btn2.color = color;
          saveEcomHistory();
          break;
        case 'buttonColor':
          flexData.value.buttons[currentColorIndex.value].color = color;
          break;
        case 'videoButtonColor':
          flexData.value.videoFooterButtons[currentColorIndex.value].color = color;
          break;
      }
      closeColorPalette();
    };

    const copyCurrentColor = () => {
      let colorToCopy = '';
      switch (currentColorTarget.value) {
        case 'tagBgColor':
          colorToCopy = ecomState.value.body.tagBgColor;
          break;
        case 'tagTextColor':
          colorToCopy = ecomState.value.body.tagTextColor;
          break;
        case 'bgColor':
          colorToCopy = ecomState.value.body.bgColor;
          break;
        case 'footerBg':
          colorToCopy = ecomState.value.footer.bg;
          break;
        case 'footerTextColor':
          colorToCopy = ecomState.value.footer.textColor;
          break;
        case 'btn1Color':
          colorToCopy = ecomState.value.footer.btn1.color;
          break;
        case 'btn2Color':
          colorToCopy = ecomState.value.footer.btn2.color;
          break;
        case 'buttonColor':
          colorToCopy = flexData.value.buttons[currentColorIndex.value].color;
          break;
        case 'videoButtonColor':
          colorToCopy = flexData.value.videoFooterButtons[currentColorIndex.value].color;
          break;
      }
      
      if (colorToCopy) {
        navigator.clipboard.writeText(colorToCopy)
          .then(() => alert('顏色已複製到剪貼簿'))
          .catch(err => console.error('複製失敗:', err));
      }
    };

    // ============ API方法 (簡化版本) ============
    
    async function checkSheetsStatus() {
      console.log('檢查工作表狀態...');
      // 簡化版本，完整邏輯在下一階段
    }
    
    async function loadProjects() {
      loadingProjects.value = true;
      loadError.value = null;
      console.log('載入專案...');
      // 簡化版本，完整邏輯在下一階段
      setTimeout(() => {
        projects.value = [];
        loadingProjects.value = false;
      }, 1000);
    }
    
    async function saveProject(isUpdate = false) {
      isSaving.value = true;
      console.log('儲存專案...', isUpdate ? '更新' : '新增');
      // 簡化版本，完整邏輯在下一階段
      setTimeout(() => {
        alert(isUpdate ? '專案更新成功！' : '專案儲存成功！');
        isSaving.value = false;
        showNewProjectModal.value = false;
      }, 1500);
    }
    
    function loadProject(project) {
      console.log('載入專案:', project);
      alert(`已載入專案: ${project.name}`);
    }
    
    function deleteProject(projectId) {
      projectToDelete.value = projectId;
      showDeleteConfirm.value = true;
    }

    async function confirmDelete() {
      console.log('刪除專案:', projectToDelete.value);
      // 簡化版本
      setTimeout(() => {
        alert('專案刪除成功！');
        showDeleteConfirm.value = false;
        projectToDelete.value = null;
      }, 1000);
    }
    
    async function pushProject(project) {
      console.log('推播專案:', project);
      alert('專案推播成功！');
    }
    
    async function saveToCloudflare() {
      isSaving.value = true;
      console.log('儲存到 Cloudflare...');
      // 簡化版本
      setTimeout(() => {
        alert('數據已成功儲存到 Google Sheets！');
        isSaving.value = false;
      }, 1500);
    }

    const clearCurrentProject = () => {
      currentProjectId.value = null;
      currentProjectName.value = '';
      chatMessage.value = "🎉 限時優惠！精選商品特價中，點擊查看最新商品！";
    };

    const shareToLine = () => {
      if (!liff.isLoggedIn()) { 
        alert("請先登入 LINE。"); 
        liffLogin(); 
        return; 
      }
      alert("直接推播功能將在下一階段實現");
    };

    const copyJson = () => { 
      const el = document.createElement('textarea'); 
      el.value = JSON.stringify(generatedJson.value, null, 2); 
      document.body.appendChild(el); 
      el.select(); 
      document.execCommand('copy'); 
      document.body.removeChild(el); 
      alert('JSON 已複製！'); 
    };

    const copyEcommerceJson = () => { 
      const el = document.createElement('textarea'); 
      el.value = JSON.stringify({ type: 'ecommerce', message: 'JSON generation will be implemented in phase 2' }, null, 2); 
      document.body.appendChild(el); 
      el.select(); 
      document.execCommand('copy'); 
      document.body.removeChild(el); 
      alert('JSON 已複製！'); 
    };

    // 檢查工作表狀態
const checkSheetsStatus = async () => {
  try {
    const response = await fetch(`${WORKER_URL}/api/sheets/status`);
    const data = await response.json();
    
    if (data.success) {
      const missingSheets = Object.entries(data.sheets)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
      
      if (missingSheets.length > 0) {
        console.log('缺少工作表，正在初始化...', missingSheets);
        await initializeSheets();
      }
    }
  } catch (error) {
    console.error('檢查工作表狀態失敗:', error);
  }
};

// 初始化工作表
const initializeSheets = async () => {
  try {
    const response = await fetch(`${WORKER_URL}/api/sheets/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    console.log('工作表初始化結果:', data);
    if (data.success) {
      alert('Google Sheets 初始化完成！');
    } else {
      alert('初始化失敗: ' + (data.error || '未知錯誤'));
    }
  } catch (error) {
    console.error('初始化工作表失敗:', error);
    alert('初始化失敗，請檢查控制台');
  }
};

// 載入專案列表 - 完整版本
const loadProjects = async () => {
  loadingProjects.value = true;
  loadError.value = null;
  
  try {
    console.log('開始載入專案...');
    const response = await fetch(`${WORKER_URL}/api/projects`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('收到專案數據:', data);
    
    if (data && data.success) {
      // 檢查是否有 projects 數據
      if (data.projects && Array.isArray(data.projects)) {
        // 過濾無效數據並格式化
        projects.value = data.projects
          .filter(project => project && 
            (project.name && project.name.trim() !== '') || 
            (project.id && project.id.toString().trim() !== '')
          )
          .map(project => ({
            id: project.id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: project.name || `專案 ${project.id || '未命名'}`,
            description: project.description || '',
            type: project.type || 'standard',
            data: project.data || '',
            flex_json: project.flex_json || '',
            created_at: project.created_at || new Date().toISOString(),
            updated_at: project.updated_at || new Date().toISOString()
          }));
        
        console.log(`成功載入 ${projects.value.length} 個專案`);
      } else {
        // 沒有專案數據
        projects.value = [];
        console.log('沒有找到專案數據');
      }
    } else {
      console.error('API 返回失敗:', data);
      projects.value = [];
      
      // 設置錯誤訊息
      if (data && data.error) {
        loadError.value = data.error;
      } else {
        loadError.value = '伺服器返回格式錯誤';
      }
    }
  } catch (error) {
    console.error('載入專案時發生錯誤:', error);
    projects.value = [];
    
    // 設置錯誤訊息
    if (error.message.includes('Failed to fetch')) {
      loadError.value = '無法連接到伺服器，請檢查網路連線';
    } else if (error.message.includes('HTTP')) {
      loadError.value = `伺服器錯誤: ${error.message}`;
    } else {
      loadError.value = `載入失敗: ${error.message}`;
    }
  } finally {
    loadingProjects.value = false;
  }
};

// 儲存專案 - 完整版本
const saveProject = async (isUpdate = false) => {
  if (!newProject.value.name && !isUpdate) {
    alert('請輸入專案名稱');
    return;
  }

  isSaving.value = true;
  try {
    // 準備專案數據
    const projectData = {
      name: isUpdate ? currentProjectName.value : newProject.value.name,
      description: newProject.value.description || '',
      type: flexData.value.type,
      data: flexData.value.type === 'ecommerce' ? JSON.stringify({
        chatMessage: chatMessage.value,
        ...ecomState.value
      }) : JSON.stringify({
        chatMessage: chatMessage.value,
        ...flexData.value
      }),
      flex_json: flexData.value.type === 'ecommerce' ? 
        JSON.stringify(generateEcommerceJson()) : 
        JSON.stringify(generatedJson.value)
    };

    // 如果是更新，添加專案ID
    if (isUpdate) {
      projectData.id = currentProjectId.value;
    }

    console.log('儲存專案數據:', projectData);

    const endpoint = isUpdate ? '/api/projects/update' : '/api/projects/create';
    const response = await fetch(`${WORKER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('儲存專案回應:', data);
    
    if (data.success) {
      alert(isUpdate ? '專案更新成功！' : '專案儲存成功！');
      
      if (!isUpdate && data.id) {
        currentProjectId.value = data.id;
        currentProjectName.value = projectData.name;
        showNewProjectModal.value = false;
        
        // 重置新專案表單
        newProject.value = {
          name: '',
          description: '',
          type: 'standard'
        };
      }
      
      // 重新載入專案列表
      await loadProjects();
      
      if (!isUpdate) {
        // 切換到專案管理頁面
        currentTab.value = 'projects';
      }
    } else {
      const errorMsg = data.error || data.message || '未知錯誤';
      alert(`儲存失敗: ${errorMsg}`);
    }
  } catch (error) {
    console.error('儲存專案時發生錯誤:', error);
    alert(`儲存失敗: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

// 載入專案 - 完整版本
const loadProject = (project) => {
  try {
    console.log('載入專案:', project);
    
    if (!project) {
      alert('專案數據無效');
      return;
    }
    
    // 設置當前專案
    currentProjectId.value = project.id;
    currentProjectName.value = project.name;
    
    // 根據專案類型載入數據
    if (project.type === 'ecommerce') {
      try {
        const projectData = typeof project.data === 'string' ? 
          JSON.parse(project.data) : project.data;
        
        if (projectData) {
          // 載入電子商務數據
          if (projectData.ecomState) {
            ecomState.value = projectData.ecomState;
          } else {
            ecomState.value = projectData;
          }
          
          // 載入聊天室訊息
          chatMessage.value = projectData.chatMessage || 
            projectData.chatMessage || 
            "🎉 限時優惠！精選商品特價中，點擊查看最新商品！";
        }
      } catch (e) {
        console.error('解析電子商務數據失敗:', e);
        alert('載入電子商務數據失敗，使用預設模板');
        // 使用預設模板
        ecomState.value = {
          hero: {
            type: 'video', 
            aspectRatio: '16:9',
            url: "https://lihi.cc/5OXMZ", 
            videoUrl: "https://lihi.cc/YsmAp", 
            link: "https://line.me"
          },
          body: {
            columns: 3,
            bubbleSize: "mega", 
            bgType: "image",
            bgMode: "cover",
            bgColor: "#F8F8F8",
            bg: "https://lihi.cc/l5qqU",
            tagBgColor: "#0D0D0D",
            tagTextColor: "#FFFFFF",
            items: [
              { title: "商品 A", img: "https://lihi.cc/mwMvo", url: "https://line.me" },
              { title: "商品 B", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
              { title: "商品 C", img: "https://lihi.cc/yRfpn", url: "https://line.me" }
            ]
          },
          footer: {
            bg: "#ffffff", 
            textEnabled: false,
            text: "※ 請注意：優惠商品數量有限，售完為止。",
            textColor: "#666666",
            textAlign: "center",
            btn1: { label: "品牌故事", color: "#000000", uri: "https://liff.line.me/2008704329-cTkwlRHm" },
            btn2: { label: "好友分享", color: "#000000", uri: "line://nv/recommendOA/@754tjssx" }
          }
        };
      }
      
      // 設置當前頁面
      currentTab.value = 'messages';
      currentSubTab.value = 'ecommerce';
      flexData.value.type = 'ecommerce';
      
    } else {
      // 載入標準或影片型專案
      try {
        const projectData = typeof project.data === 'string' ? 
          JSON.parse(project.data) : project.data;
        
        if (projectData) {
          // 載入主要數據
          if (projectData.type) {
            flexData.value = projectData;
          } else {
            // 合併現有數據
            Object.assign(flexData.value, projectData);
          }
          
          // 載入聊天室訊息
          chatMessage.value = projectData.chatMessage || 
            "📢 歡迎查看我的分享！";
        }
      } catch (e) {
        console.error('解析專案數據失敗:', e);
        alert('載入專案數據失敗，使用預設模板');
        // 使用預設模板
        flexData.value = {
          type: project.type || 'standard', 
          imageUrl: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
          aspectRatio: '20:13', 
          title: '', 
          subtitle: '', 
          showBadge: true, 
          badgeColor: '#FF0000',
          buttons: [{ label: '了解更多', uri: 'https://example.com', color: '#00B900' }]
        };
      }
      
      // 設置當前頁面
      currentTab.value = 'messages';
      currentSubTab.value = project.type === 'video' ? 'video' : 'single';
      flexData.value.type = project.type || 'standard';
    }
    
    alert(`已載入專案: ${project.name}`);
    
  } catch (error) {
    console.error('載入專案時發生錯誤:', error);
    alert('載入專案失敗: ' + (error.message || '未知錯誤'));
  }
};

// 刪除專案 - 完整版本
const deleteProject = (projectId) => {
  if (!projectId) {
    alert('無效的專案ID');
    return;
  }
  
  projectToDelete.value = projectId;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!projectToDelete.value) {
    alert('無效的專案ID');
    showDeleteConfirm.value = false;
    return;
  }

  try {
    const payload = { id: projectToDelete.value };
    console.log('刪除專案:', payload);
    
    const response = await fetch(`${WORKER_URL}/api/projects/delete`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('刪除專案回應:', data);
    
    if (data.success) {
      alert('專案刪除成功！');
      
      // 如果刪除的是當前編輯的專案，清除當前專案
      if (currentProjectId.value === projectToDelete.value) {
        clearCurrentProject();
      }
      
      // 重新載入專案列表
      await loadProjects();
    } else {
      const errorMsg = data.error || data.message || '未知錯誤';
      alert(`刪除失敗: ${errorMsg}`);
    }
  } catch (error) {
    console.error('刪除專案時發生錯誤:', error);
    alert(`刪除失敗: ${error.message}`);
  } finally {
    showDeleteConfirm.value = false;
    projectToDelete.value = null;
  }
};

// 推播專案 - 完整版本
const pushProject = async (project) => {
  if (!liffProfile.value) {
    alert("請先登入 LINE");
    liffLogin();
    return;
  }

  if (!project || !project.id) {
    alert("無效的專案數據");
    return;
  }

  try {
    const payload = {
      projectId: project.id,
      userId: liffProfile.value.userId
    };

    console.log('推播專案:', payload);
    
    const response = await fetch(`${WORKER_URL}/api/plugins/push`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('推播專案回應:', data);
    
    if (data.success) {
      alert('專案推播成功！');
    } else {
      const errorMsg = data.error || data.message || '未知錯誤';
      alert(`推播失敗: ${errorMsg}`);
    }
  } catch (error) {
    console.error('推播專案時發生錯誤:', error);
    alert(`推播失敗: ${error.message}`);
  }
};

// 儲存到 Cloudflare Worker - 完整版本
const saveToCloudflare = async () => {
  if (!liffProfile.value) {
    alert("請先登入 LINE");
    liffLogin();
    return;
  }

  isSaving.value = true;
  try {
    const payload = {
      userId: liffProfile.value.userId,
      type: flexData.value.type,
      name: flexData.value.type === 'ecommerce' ? 
        '電商型專案' : 
        (flexData.value.title || flexData.value.headerName || '未命名專案'),
      params: flexData.value.type === 'ecommerce' ? {
        chatMessage: chatMessage.value,
        ...ecomState.value
      } : {
        chatMessage: chatMessage.value,
        ...flexData.value
      },
      flexPayload: flexData.value.type === 'ecommerce' ? 
        generateEcommerceJson() : 
        generatedJson.value
    };

    console.log('儲存到 Cloudflare:', payload);
    
    const response = await fetch(`${WORKER_URL}/api/plugins/save`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Cloudflare 儲存回應:', data);
    
    if (data.success) {
      alert('數據已成功儲存到 Google Sheets！');
    } else {
      const errorMsg = data.error || data.message || '未知錯誤';
      alert(`儲存失敗: ${errorMsg}`);
    }
    
  } catch (error) {
    console.error('儲存失敗:', error);
    alert(`儲存失敗: ${error.message}`);
  } finally {
    isSaving.value = false;
  }
};

// 直接推播功能
const shareToLine = () => {
  if (!liff.isLoggedIn()) { 
    alert("請先登入 LINE。"); 
    liffLogin(); 
    return; 
  }
  
  // 創建包含聊天室文字的完整訊息
  const flexMessage = {
    type: "flex",
    altText: chatMessage.value || (flexData.value.type === 'ecommerce' ? "電商型插件訊息" : 
             flexData.value.type === 'video' ? "影片名片訊息" : "文章型插件訊息"),
    contents: flexData.value.type === 'ecommerce' ? generateEcommerceJson() : generatedJson.value
  };
  
  liff.shareTargetPicker([flexMessage])
  .then(res => { 
    if (res) alert("發送成功！"); 
  })
  .catch(err => alert("發送失敗：" + err));
};

// 清除當前專案
const clearCurrentProject = () => {
  currentProjectId.value = null;
  currentProjectName.value = '';
  chatMessage.value = "🎉 限時優惠！精選商品特價中，點擊查看最新商品！";
  
  if (flexData.value.type === 'ecommerce') {
    ecomState.value = {
      hero: {
        type: 'video', 
        aspectRatio: '16:9',
        url: "https://lihi.cc/5OXMZ", 
        videoUrl: "https://lihi.cc/YsmAp", 
        link: "https://line.me"
      },
      body: {
        columns: 3,
        bubbleSize: "mega", 
        bgType: "image",
        bgMode: "cover",
        bgColor: "#F8F8F8",
        bg: "https://lihi.cc/l5qqU",
        tagBgColor: "#0D0D0D",
        tagTextColor: "#FFFFFF",
        items: [
          { title: "商品 A", img: "https://lihi.cc/mwMvo", url: "https://line.me" },
          { title: "商品 B", img: "https://lihi.cc/2Nu8G", url: "https://line.me" },
          { title: "商品 C", img: "https://lihi.cc/yRfpn", url: "https://line.me" }
        ]
      },
      footer: {
        bg: "#ffffff", 
        textEnabled: false,
        text: "※ 請注意：優惠商品數量有限，售完為止。",
        textColor: "#666666",
        textAlign: "center",
        btn1: { label: "品牌故事", color: "#000000", uri: "https://liff.line.me/2008704329-cTkwlRHm" },
        btn2: { label: "好友分享", color: "#000000", uri: "line://nv/recommendOA/@754tjssx" }
      }
    };
  } else {
    flexData.value = {
      type: 'standard', 
      imageUrl: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
      aspectRatio: '20:13', 
      title: '', 
      subtitle: '', 
      showBadge: true, 
      badgeColor: '#FF0000',
      buttons: [{ label: '了解更多', uri: 'https://example.com', color: '#00B900' }]
    };
  }
};

    const formatDate = (dateString) => {
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
    };

    // ============ 公開的狀態和方法 ============
    
    return {
      // 狀態變數
      isSidebarCollapsed, 
      isMessageMenuOpen, 
      currentTab, 
      currentSubTab, 
      flexData, 
      ecomState,
      chatMessage,
      templates,
      projects,
      projectSearch,
      loadingProjects,
      loadError,
      newProject,
      currentProjectId,
      currentProjectName,
      showNewProjectModal,
      showDeleteConfirm,
      showColorPalettePopup,
      colorPalettePosition,
      colorPresets,
      
      // 計算屬性
      pageTitle, 
      generatedJson, 
      filteredProjects,
      
      // 狀態標誌
      isSaving, 
      isLoggedIn, 
      isInIframe,
      
      // 基本方法
      switchTab, 
      toggleSidebarMenu, 
      switchSubTab,
      applyTemplate, 
      addButton, 
      removeButton, 
      copyJson, 
      saveToCloudflare, 
      shareToLine,
      loadProjects,
      saveProject,
      loadProject,
      deleteProject,
      confirmDelete,
      clearCurrentProject,
      pushProject,
      checkSheetsStatus,
      formatDate,
      liffLogin,
      
      // 電子商務版方法
      updateHeroType,
      updateBodyType,
      updateFooterTextAlign,
      updateEcomItem,
      addEcomItem,
      deleteEcomItem,
      getAspectClass,
      getTextAlignClass,
      saveEcomHistory,
      generateEcommerceJson,
      copyEcommerceJson,
      
      // 調色盤方法
      showColorPalette,
      closeColorPalette,
      selectColor,
      copyCurrentColor
    };
  }
}).mount('#app');

// 點擊其他地方關閉調色盤
document.addEventListener('click', (event) => {
  const colorPalettePopup = document.querySelector('.color-palette-popup');
  if (colorPalettePopup && !event.target.closest('.color-palette-popup')) {
    // 這裡需要觸發Vue的closeColorPalette方法
    // 在下一階段我們會更好地處理這個
  }
});

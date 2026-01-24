// 側邊欄模組
window.SidebarComponent = {
    name: 'Sidebar',
    props: ['currentTab', 'currentSubTab', 'isCollapsed'],
    template: `
        <aside :class="isCollapsed ? 'w-collapsed' : 'w-expanded'" 
               class="sidebar-container text-gray-400 shadow-2xl">
            <!-- 側邊欄內容 (從原始版本複製過來) -->
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

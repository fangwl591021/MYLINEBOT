<template>
  <div id="app" class="flex h-screen overflow-hidden text-gray-800">
    <!-- 側邊欄 -->
    <Sidebar 
      :current-tab="currentTab"
      :current-sub-tab="currentSubTab"
      :is-collapsed="isSidebarCollapsed"
      @toggle-sidebar="isSidebarCollapsed = !isSidebarCollapsed"
      @switch-tab="switchTab"
      @switch-sub-tab="switchSubTab"
    />
    
    <!-- 主要內容區 -->
    <main class="flex-grow flex flex-col h-full relative overflow-hidden bg-[#f8fafc]">
      <Header 
        :page-title="pageTitle"
        :is-logged-in="isLoggedIn"
        :liff-profile="liffProfile"
        @login="liffLogin"
      />
      
      <!-- 動態內容區域 -->
      <div class="flex-grow overflow-hidden flex">
        <!-- 插件開發頁面 -->
        <PluginDevelopment 
          v-if="currentTab === 'messages'"
          :flex-data="flexData"
          :current-project-id="currentProjectId"
          :current-project-name="currentProjectName"
          :is-saving="isSaving"
          :chat-message="chatMessage"
          @update-flex-data="updateFlexData"
          @save-project="saveProject"
          @share-to-line="shareToLine"
          @save-to-cloudflare="saveToCloudflare"
          @clear-current-project="clearCurrentProject"
          @show-project-modal="showNewProjectModal = true"
        />
        
        <!-- 模板庫頁面 -->
        <Templates 
          v-else-if="currentTab === 'templates'"
          @apply-template="applyTemplate"
        />
        
        <!-- 專案管理頁面 -->
        <Projects 
          v-else-if="currentTab === 'projects'"
          :projects="projects"
          :loading-projects="loadingProjects"
          :load-error="loadError"
          :project-search="projectSearch"
          @search-projects="projectSearch = $event"
          @load-projects="loadProjects"
          @initialize-sheets="initializeSheets"
          @load-project="loadProject"
          @delete-project="deleteProject"
          @push-project="pushProject"
          @create-project="showNewProjectModal = true"
        />
      </div>
    </main>
    
    <!-- 模態視窗 -->
    <ProjectModal 
      v-if="showNewProjectModal"
      :new-project="newProject"
      :is-saving="isSaving"
      @update:new-project="updateNewProject"
      @save="saveProject"
      @close="showNewProjectModal = false"
    />
    
    <DeleteConfirmModal 
      v-if="showDeleteConfirm"
      @confirm="confirmDelete"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import PluginDevelopment from './views/PluginDevelopment.vue'
import Templates from './views/Templates.vue'
import Projects from './views/Projects.vue'
import ProjectModal from './components/ProjectModal.vue'
import DeleteConfirmModal from './components/DeleteConfirmModal.vue'
import { defaultBusinessCardData } from './utils/businessCardGenerator'
import { defaultStandardData } from './utils/standardGenerator'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    PluginDevelopment,
    Templates,
    Projects,
    ProjectModal,
    DeleteConfirmModal
  },
  data() {
    return {
      // 狀態變數
      isSidebarCollapsed: false,
      currentTab: 'messages',
      currentSubTab: 'single',
      isSaving: false,
      isLoggedIn: false,
      isInIframe: false,
      liffProfile: null,
      
      // 數據
      flexData: defaultStandardData,
      chatMessage: "🎉 限時優惠！精選商品特價中，點擊查看最新商品！",
      
      // 專案相關
      showNewProjectModal: false,
      showDeleteConfirm: false,
      projectSearch: '',
      projects: [],
      loadingProjects: false,
      loadError: null,
      currentProjectId: null,
      currentProjectName: '',
      projectToDelete: null,
      
      // 新專案
      newProject: {
        name: '',
        description: '',
        type: 'standard'
      }
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        'dashboard': '儀表板總覽',
        'messages': '插件開發管理平台',
        'templates': '插件模板選擇中心',
        'projects': '專案管理'
      }
      return titles[this.currentTab] || 'LINEOA 插件管理平台'
    }
  },
  mounted() {
    this.initApp()
  },
  methods: {
    async initApp() {
      this.isInIframe = window.self !== window.top
      
      // 初始化 LIFF
      if (typeof liff !== 'undefined') {
        try {
          await liff.init({ liffId: "2008541971-XPIDtaaj" })
          console.log("LIFF Ready")
          this.isLoggedIn = liff.isLoggedIn()
          
          if (this.isLoggedIn) {
            this.liffProfile = await liff.getProfile()
            console.log("User Profile:", this.liffProfile)
          }
        } catch (err) {
          console.error("LIFF Init failed", err)
        }
      }
      
      // 初始化圖標
      if (window.lucide) {
        window.lucide.createIcons()
      }
    },
    
    // 頁面切換方法
    switchTab(tab) {
      this.currentTab = tab
      if (tab === 'projects') {
        this.loadProjects()
      }
    },
    
    switchSubTab(tab, subTab) {
      this.currentTab = tab
      this.currentSubTab = subTab
      this.flexData.type = subTab === 'video' ? 'video' : 
                          subTab === 'ecommerce' ? 'ecommerce' : 'standard'
    },
    
    // 數據更新方法
    updateFlexData(newData) {
      this.flexData = { ...this.flexData, ...newData }
    },
    
    updateNewProject(newData) {
      this.newProject = { ...this.newProject, ...newData }
    },
    
    // 模板應用
    applyTemplate(template) {
      if (template.type === 'video') {
        this.flexData = { ...defaultBusinessCardData, ...template.payload }
      } else if (template.type === 'standard') {
        this.flexData = { ...defaultStandardData, ...template.payload }
      }
      this.currentTab = 'messages'
      this.currentSubTab = template.type === 'video' ? 'video' : 
                          template.type === 'ecommerce' ? 'ecommerce' : 'single'
    },
    
    // 其他方法（從原代碼複製並改寫）...
    // liffLogin, saveProject, loadProjects, deleteProject, confirmDelete 等方法
  }
}
</script>

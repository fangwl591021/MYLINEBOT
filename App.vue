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
      chatMessage: "🎉 限時優惠！精選商品特價

<template>
  <div class="flex w-full overflow-hidden">
    <!-- 編輯器區域 -->
    <div class="flex-grow overflow-y-auto p-8 bg-white shadow-inner border-r no-scrollbar">
      <div class="max-w-4xl mx-auto">
        <!-- 共用頂部按鈕區域 -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">
              {{ flexData.type === 'video' ? '影片名片開發' : 
                 flexData.type === 'ecommerce' ? '電商型插件開發' : '文章型 Flex 開發' }}
            </h3>
            <p class="text-sm text-gray-400 mt-1">編輯參數後，可儲存為專案或直接推播至 LINE。</p>
          </div>
          <div class="flex gap-2">
            <button v-if="currentProjectId" @click="$emit('save-project', true)" 
                    :disabled="isSaving" 
                    class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
              <i class="fas fa-save"></i> 更新專案
            </button>
            <button v-else @click="$emit('show-project-modal')" 
                    :disabled="isSaving" 
                    class="px-6 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 flex items-center gap-2">
              <i class="fas fa-plus"></i> 儲存為新專案
            </button>
            <button @click="$emit('share-to-line')" 
                    class="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
              <i class="fas fa-paper-plane"></i> 🚀 直接推播
            </button>
            <button @click="$emit('save-to-cloudflare')" 
                    :disabled="isSaving" 
                    class="px-6 py-2.5 bg-line-green text-white rounded-xl text-sm font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300">
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
            <button @click="$emit('clear-current-project')" 
                    class="text-sm text-gray-500 hover:text-red-500">
              <i class="fas fa-times"></i> 清除選擇
            </button>
          </div>
        </div>

        <!-- 聊天室文字設定 -->
        <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
          <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
            <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字設定
          </h4>
          <div class="space-y-4">
            <div>
              <label class="block mb-2">
                <span class="text-[11px] font-bold text-slate-700 uppercase block">聊天室訊息文字</span>
                <span class="text-[10px] text-slate-400 font-normal">※ 在 LINE 聊天室中顯示的文字訊息</span>
              </label>
              <textarea v-model="localChatMessage" rows="3"
                        class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:border-line-green focus:ring-1 focus:ring-line-green outline-none"
                        placeholder="請輸入在聊天室中顯示的文字訊息..."
                        @input="updateChatMessage"></textarea>
            </div>
          </div>
        </div>

        <!-- 動態編輯器組件 -->
        <component 
          :is="currentEditor"
          :data="flexData"
          @update:data="$emit('update-flex-data', $event)"
        />
        
        <!-- JSON 輸出 -->
        <div class="mt-12 mb-20">
          <div class="flex items-center justify-between mb-3 px-2">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <i class="fas fa-code mr-2"></i>Raw Flex JSON Data
            </span>
            <button @click="copyJson" 
                    class="text-[10px] text-line-green font-bold hover:underline uppercase">
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
          
          <component 
            :is="currentPreview"
            :data="flexData"
          />
          
          <!-- 聊天室文字輸入區域 -->
          <div class="chat-input-container">
            <textarea v-model="localChatMessage" 
                      class="chat-input" 
                      placeholder="輸入聊天室顯示文字..."
                      @input="updateChatMessage"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BusinessCardEditor from '../components/BusinessCardEditor.vue'
import BusinessCardPreview from '../components/BusinessCardPreview.vue'
import StandardEditor from '../components/StandardEditor.vue'
import StandardPreview from '../components/StandardPreview.vue'
import EcommerceEditor from '../components/EcommerceEditor.vue'
import EcommercePreview from '../components/EcommercePreview.vue'

export default {
  name: 'PluginDevelopment',
  components: {
    BusinessCardEditor,
    BusinessCardPreview,
    StandardEditor,
    StandardPreview,
    EcommerceEditor,
    EcommercePreview
  },
  props: {
    flexData: {
      type: Object,
      required: true
    },
    currentProjectId: String,
    currentProjectName: String,
    isSaving: Boolean,
    chatMessage: String
  },
  data() {
    return {
      localChatMessage: this.chatMessage
    }
  },
  computed: {
    currentEditor() {
      switch (this.flexData.type) {
        case 'video': return 'BusinessCardEditor'
        case 'ecommerce': return 'EcommerceEditor'
        default: return 'StandardEditor'
      }
    },
    currentPreview() {
      switch (this.flexData.type) {
        case 'video': return 'BusinessCardPreview'
        case 'ecommerce': return 'EcommercePreview'
        default: return 'StandardPreview'
      }
    },
    generatedJson() {
      // 這裡可以調用相應的 JSON 生成器
      return JSON.stringify(this.flexData, null, 2)
    }
  },
  methods: {
    updateChatMessage() {
      this.$emit('update:chatMessage', this.localChatMessage)
    },
    copyJson() {
      const el = document.createElement('textarea')
      el.value = this.generatedJson
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      alert('JSON 已複製！')
    }
  }
}
</script>

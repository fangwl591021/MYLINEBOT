<template>
  <div class="space-y-6">
    <!-- 名片與 Header 設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-id-card mr-2 text-line-green"></i> 影片與名片 Header 設定
      </h4>
      <div class="grid grid-cols-2 gap-4">
        <input type="text" v-model="data.headerName" 
               class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
               placeholder="品牌姓名">
        <input type="text" v-model="data.headerTitle" 
               class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
               placeholder="職位/稱號">
        <input type="text" v-model="data.headerDescription" 
               class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
               placeholder="描述/公司">
        <input type="text" v-model="data.headerImg" 
               class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
               placeholder="頭像圖片 URL">
      </div>
    </div>

    <!-- 影片設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-video mr-2 text-line-green"></i> 影片設定
      </h4>
      <div class="space-y-4">
        <input type="text" v-model="data.videoUrl" 
               class="w-full px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
               placeholder="影片 MP4 連結">
        <input type="text" v-model="data.previewUrl" 
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
        <div v-for="(grid, index) in data.gridButtons" :key="index" class="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg border">
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
        <button @click="addGridButton" v-if="data.gridButtons.length < 8"
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
        <div v-for="(vBtn, vIdx) in data.videoFooterButtons" :key="vIdx" 
             class="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center transition-all hover:border-blue-100">
          <div v-if="vIdx === 0" class="flex flex-col items-center gap-1 relative">
            <span class="text-[9px] text-gray-400 font-bold">主色</span>
            <input type="color" v-model="vBtn.color" @change="emitChange">
            <button @click="showColorPalette($event, 'videoButtonColor', vIdx)" 
                    class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
              <i class="fas fa-palette"></i>
            </button>
          </div>
          <input type="text" v-model="vBtn.label" @input="emitChange"
                 class="w-40 border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                 placeholder="按鈕文字">
          <input type="text" v-model="vBtn.uri" @input="emitChange"
                 class="flex-grow border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                 placeholder="按鈕 URL">
          <button @click="removeFooterButton(vIdx)" 
                  class="p-2 text-gray-300 hover:text-red-500 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <button @click="addFooterButton" v-if="data.videoFooterButtons.length < 4"
                class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
          + 新增底部按鈕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCardEditor',
  props: {
    cardData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: { ...this.cardData }
    }
  },
  watch: {
    cardData: {
      handler(newVal) {
        this.data = { ...newVal }
      },
      deep: true
    },
    data: {
      handler(newVal) {
        this.$emit('update:cardData', { ...newVal })
      },
      deep: true
    }
  },
  methods: {
    emitChange() {
      this.$emit('change', this.data)
    },
    addGridButton() {
      this.data.gridButtons.push({
        emoji: '🌟',
        label: '新功能',
        uri: 'https://example.com'
      })
      this.emitChange()
    },
    removeGridButton(index) {
      if (this.data.gridButtons.length > 2) {
        this.data.gridButtons.splice(index, 1)
        this.emitChange()
      }
    },
    addFooterButton() {
      this.data.videoFooterButtons.push({
        label: '新按鈕',
        uri: 'https://example.com',
        color: '#00B900'
      })
      this.emitChange()
    },
    removeFooterButton(index) {
      if (this.data.videoFooterButtons.length > 1) {
        this.data.videoFooterButtons.splice(index, 1)
        this.emitChange()
      }
    },
    showColorPalette(event, target, index) {
      this.$emit('show-color-palette', { event, target, index })
    }
  }
}
</script>

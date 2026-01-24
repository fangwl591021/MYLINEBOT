<template>
  <div class="space-y-6">
    <!-- 視覺內容設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-image mr-2 text-line-green"></i> 視覺內容設定
      </h4>
      <div class="space-y-4">
        <input type="text" v-model="data.imageUrl" 
               class="w-full px-4 py-2 border rounded-xl text-sm focus:border-line-green shadow-sm" 
               placeholder="圖片網址">
        
        <div class="flex items-center gap-3 mt-3">
          <button v-for="ratio in ['1:1', '20:13', '4:6']" 
                  @click="data.aspectRatio = ratio" 
                  :class="data.aspectRatio === ratio ? 'ratio-btn-active' : ''" 
                  class="ratio-btn shadow-sm">
            {{ ratio }}
          </button>
        </div>
        
        <input type="text" v-model="data.title" 
               class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-line-green shadow-sm" 
               placeholder="輸入大標題">
        
        <textarea v-model="data.subtitle" rows="6" 
                  class="w-full px-4 py-3 border rounded-xl text-sm outline-none leading-relaxed focus:border-line-green shadow-sm" 
                  placeholder="輸入文章內容..."></textarea>
      </div>
    </div>

    <!-- 底部行為按鈕設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 mt-6 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
        <span><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部行為按鈕設定</span>
        <span class="text-xs text-gray-500">{{ data.buttons.length }}/3</span>
      </h4>
      <div class="space-y-3">
        <div v-for="(btn, index) in data.buttons" :key="index" 
             class="flex gap-3 items-center group bg-white p-3 rounded-xl border transition-all hover:border-green-100 shadow-sm">
          <div class="relative">
            <input type="color" v-model="btn.color" @change="emitChange">
            <button @click="showColorPalette($event, 'buttonColor', index)" 
                    class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
              <i class="fas fa-palette"></i>
            </button>
          </div>
          <input type="text" v-model="btn.label" maxlength="10" @input="emitChange"
                 class="w-32 px-4 py-2 border rounded-lg text-sm" placeholder="文字">
          <input type="text" v-model="btn.uri" @input="emitChange"
                 class="flex-grow px-4 py-2 border rounded-lg text-sm" placeholder="網址">
          <button @click="removeButton(index)" 
                  class="p-2 text-gray-300 hover:text-red-500 transition-colors">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <button v-if="data.buttons.length < 3" @click="addButton" 
                class="w-full py-3 mt-2 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
          + 新增功能按鈕
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StandardEditor',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localData: { ...this.data }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.localData = { ...newVal }
      },
      deep: true
    },
    localData: {
      handler(newVal) {
        this.$emit('update:data', { ...newVal })
      },
      deep: true
    }
  },
  methods: {
    emitChange() {
      this.$emit('change', this.localData)
    },
    addButton() {
      this.localData.buttons.push({
        label: '新按鈕',
        uri: 'https://example.com',
        color: '#00B900'
      })
      this.emitChange()
    },
    removeButton(index) {
      if (this.localData.buttons.length > 1) {
        this.localData.buttons.splice(index, 1)
        this.emitChange()
      }
    },
    showColorPalette(event, target, index) {
      this.$emit('show-color-palette', { event, target, index })
    }
  }
}
</script>

<style scoped>
.ratio-btn {
  @apply px-3 py-1 text-xs border border-gray-200 rounded-md transition-all cursor-pointer hover:bg-gray-50 bg-white;
}
.ratio-btn-active {
  @apply border-line-green bg-green-50 text-line-green font-bold;
}
</style>

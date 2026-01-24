<template>
  <div class="space-y-6">
    <!-- Hero 設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-image mr-2 text-line-green"></i> 頂部 Hero 視覺
      </h4>
      <!-- Hero 設定內容 (從原代碼複製) -->
      <!-- 因代碼較長，這裡簡化顯示 -->
    </div>

    <!-- Body 設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center justify-between">
        <span><i class="fas fa-palette mr-2 text-line-green"></i> Body 內容與尺寸</span>
        <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded text-slate-700 font-mono">
          {{ data.body.items.length }} items
        </span>
      </h4>
      <!-- Body 設定內容 -->
    </div>

    <!-- Footer 設定 -->
    <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
        <i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部按鈕
      </h4>
      <!-- Footer 設定內容 -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcommerceEditor',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      localData: JSON.parse(JSON.stringify(this.data))
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.localData = JSON.parse(JSON.stringify(newVal))
      },
      deep: true
    },
    localData: {
      handler(newVal) {
        this.$emit('update:data', JSON.parse(JSON.stringify(newVal)))
        this.$emit('change', newVal)
      },
      deep: true
    }
  },
  methods: {
    updateHeroType(type) {
      this.localData.hero.type = type
      this.saveHistory()
    },
    
    updateBodyType(type) {
      this.localData.body.bgType = type
      this.saveHistory()
    },
    
    updateFooterTextAlign(align) {
      this.localData.footer.textAlign = align
      this.saveHistory()
    },
    
    updateEcomItem(index, field, value) {
      this.localData.body.items[index][field] = value
      this.saveHistory()
    },
    
    addEcomItem() {
      this.localData.body.items.push({ 
        title: "新商品", 
        img: "https://lihi.cc/mwMvo", 
        url: "https://line.me" 
      })
      this.saveHistory()
    },
    
    deleteEcomItem(index) {
      this.localData.body.items.splice(index, 1)
      this.saveHistory()
    },
    
    saveHistory() {
      this.$emit('change', this.localData)
    },
    
    showColorPalette(event, target, index = 0) {
      this.$emit('show-color-palette', { event, target, index })
    }
  }
}
</script>

<template>
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
        <div v-show="data.hero.type !== 'none'" 
             :class="getAspectClass(data.hero.aspectRatio)" 
             class="relative w-full bg-black overflow-hidden group cursor-pointer shrink-0">
          <img v-show="data.hero.type === 'image'" 
               :src="data.hero.url" 
               class="w-full h-full object-cover"
               @error="handleHeroError">
          <div v-show="data.hero.type === 'video'" class="absolute inset-0 flex items-center justify-center">
            <img :src="data.hero.url" 
                 class="absolute inset-0 w-full h-full object-cover opacity-70"
                 @error="handleHeroError">
            <div class="relative z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <i data-lucide="play" class="w-5 h-5 text-slate-900 fill-slate-900 ml-1"></i>
            </div>
          </div>
        </div>

        <!-- Body Area -->
        <div class="relative w-full" :style="{ backgroundColor: data.body.bgColor }">
          <!-- 背景圖 -->
          <img v-if="data.body.bgType === 'image' && data.body.bg" 
               :src="data.body.bg" 
               :class="data.body.bgMode === 'top' ? 'object-contain' : 'object-cover'"
               class="absolute inset-0 w-full h-full z-0"
               @error="handleBgError">
          
          <!-- 內容網格 -->
          <div class="relative z-10 p-4">
            <div :class="data.body.columns === 3 ? 'grid-cols-3' : 'grid-cols-4'" 
                 class="grid gap-2">
              <div v-for="(item, index) in data.body.items" 
                   :key="index" 
                   class="bg-white rounded-md p-1 shadow-sm flex flex-col cursor-pointer hover:scale-105 transition-transform"
                   @click="handleItemClick(item.url)">
                <div class="relative w-full aspect-square bg-slate-100 rounded-sm overflow-hidden mb-1">
                  <img :src="item.img" 
                       class="w-full h-full object-cover"
                       @error="handleItemImageError(index)">
                </div>
                <div :style="{ 
                  backgroundColor: data.body.tagBgColor, 
                  color: data.body.tagTextColor 
                }" 
                class="text-[8px] font-bold text-center py-1 px-1 rounded-sm truncate">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Area -->
        <div class="p-3 border-t border-slate-100 flex flex-col gap-2 shrink-0 relative z-10" 
             :style="{ backgroundColor: data.footer.bg }">
          <div v-show="data.footer.textEnabled" 
               :style="{ color: data.footer.textColor }" 
               :class="getTextAlignClass(data.footer.textAlign)"
               class="text-xs whitespace-pre-wrap mb-2 w-full">
            {{ data.footer.text }}
          </div>
          <div class="flex gap-2 w-full">
            <button :style="{ backgroundColor: data.footer.btn1.color }" 
                    class="flex-1 py-2 rounded text-[10px] font-bold text-white text-center transition hover:opacity-90"
                    @click="handleButtonClick(data.footer.btn1.uri)">
              {{ data.footer.btn1.label }}
            </button>
            <button :style="{ backgroundColor: data.footer.btn2.color }" 
                    class="flex-1 py-2 rounded text-[10px] font-bold text-white text-center transition hover:opacity-90"
                    @click="handleButtonClick(data.footer.btn2.uri)">
              {{ data.footer.btn2.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EcommercePreview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultHeroImage: 'https://via.placeholder.com/800x450?text=Hero',
      defaultBgImage: 'https://via.placeholder.com/300x400?text=BG',
      defaultItemImage: 'https://via.placeholder.com/100x100?text=Item'
    }
  },
  methods: {
    getAspectClass(aspect) {
      const ratioMap = { 
        '1:1': 'aspect-1-1', 
        '16:9': 'aspect-16-9', 
        '4:3': 'aspect-4-3', 
        '1.91:1': 'aspect-1_91-1', 
        '3:4': 'aspect-3-4' 
      }
      return ratioMap[aspect] || 'aspect-16-9'
    },
    
    getTextAlignClass(align) {
      const alignMap = { 
        'start': 'text-left', 
        'center': 'text-center', 
        'end': 'text-right' 
      }
      return alignMap[align] || 'text-center'
    },
    
    handleHeroError(e) {
      e.target.src = this.defaultHeroImage
    },
    
    handleBgError(e) {
      e.target.src = this.defaultBgImage
    },
    
    handleItemImageError(index) {
      const items = this.data.body.items
      if (items[index]) {
        items[index].img = this.defaultItemImage
      }
    },
    
    handleItemClick(url) {
      if (url && url !== 'https://line.me') {
        window.open(url, '_blank')
      }
    },
    
    handleButtonClick(url) {
      if (url && url !== 'https://line.me') {
        window.open(url, '_blank')
      }
    }
  }
}
</script>

<template>
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
                :style="{ backgroundColor: btn.color || '#00B900' }"
                @click="handleButtonClick(btn.uri)">
          {{ btn.label || '按鈕' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StandardPreview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage: 'https://via.placeholder.com/250x160?text=Image'
    }
  },
  computed: {
    aspectRatio() {
      return this.data.aspectRatio ? 
        this.data.aspectRatio.replace(':', '/') : '20/13'
    }
  },
  methods: {
    handleButtonClick(url) {
      if (url && url !== 'https://example.com') {
        window.open(url, '_blank')
      }
    },
    handleImageError(e) {
      e.target.src = this.defaultImage
    }
  }
}
</script>

<style scoped>
.preview-article {
  white-space: pre-wrap;
  word-break: break-all;
  padding-left: 5px;
}
</style>

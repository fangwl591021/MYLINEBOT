<template>
  <div class="p-4">
    <div class="flex-bubble flex-bubble-dark shadow-2xl border-gray-800 overflow-hidden">
      <!-- Header -->
      <div class="header-box">
        <img :src="data.headerImg || defaultAvatar" 
             class="w-10 h-10 rounded-full object-cover border border-gray-700"
             @error="handleImageError">
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-bold truncate uppercase" style="color:#D4AF37">
            {{ data.headerName || '姓名' }}
          </div>
          <div class="text-[9px] text-gray-300 truncate">
            {{ data.headerTitle || '職位/稱號' }}
          </div>
          <div class="text-[8px] text-gray-400 truncate">
            {{ data.headerDescription || '描述' }}
          </div>
        </div>
      </div>
      
      <!-- Video Hero -->
      <div class="video-hero" @click="playVideo">
        <img :src="data.previewUrl || defaultPreview" 
             class="w-full h-full object-cover opacity-60"
             @error="handlePreviewError">
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="fas fa-play-circle text-white text-4xl opacity-90 drop-shadow-lg"></i>
        </div>
        <div v-if="isPlaying" class="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div class="relative">
            <button @click.stop="stopVideo" class="absolute -top-8 right-0 text-white">
              <i class="fas fa-times"></i>
            </button>
            <video ref="videoPlayer" class="w-full h-auto max-h-64" controls>
              <source :src="data.videoUrl" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
      
      <!-- Grid Buttons -->
      <div class="grid-box">
        <div v-for="(grid, gIdx) in data.gridButtons.slice(0, 4)" :key="gIdx" 
             class="grid-item cursor-pointer hover:bg-gray-800 transition-colors"
             @click="handleGridClick(grid.uri)">
          <div class="text-xl mb-1">{{ grid.emoji || '🌟' }}</div>
          <div class="text-[8px] text-gray-300 font-bold truncate uppercase tracking-tighter">
            {{ grid.label || 'Grid' }}
          </div>
        </div>
      </div>
      
      <!-- Footer Buttons -->
      <div class="p-3 pt-0 space-y-2 bg-[#0F0F10]">
        <button v-for="(vBtn, vI) in data.videoFooterButtons" :key="vI" 
                class="w-full py-2 text-[10px] font-bold rounded shadow-md transition-all active:scale-95"
                :style="getButtonStyle(vI, vBtn)"
                @click="handleButtonClick(vBtn.uri)">
          {{ vBtn.label || '按鈕' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessCardPreview',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPlaying: false,
      defaultAvatar: 'https://via.placeholder.com/40x40?text=Avatar',
      defaultPreview: 'https://via.placeholder.com/250x160?text=Preview'
    }
  },
  methods: {
    getButtonStyle(index, button) {
      if (index === 0) {
        return { 
          backgroundColor: button.color || '#C9A24D', 
          color: '#fff' 
        }
      } else {
        return { 
          backgroundColor: '#2A2C31', 
          color: '#999' 
        }
      }
    },
    playVideo() {
      if (this.data.videoUrl) {
        this.isPlaying = true
        this.$nextTick(() => {
          if (this.$refs.videoPlayer) {
            this.$refs.videoPlayer.play()
          }
        })
      }
    },
    stopVideo() {
      this.isPlaying = false
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause()
        this.$refs.videoPlayer.currentTime = 0
      }
    },
    handleGridClick(url) {
      if (url && url !== '#') {
        window.open(url, '_blank')
      }
    },
    handleButtonClick(url) {
      if (url && url !== '#') {
        window.open(url, '_blank')
      }
    },
    handleImageError(e) {
      e.target.src = this.defaultAvatar
    },
    handlePreviewError(e) {
      e.target.src = this.defaultPreview
    }
  }
}
</script>

<style scoped>
.header-box { 
  background: #1A1B1E; 
  padding: 10px; 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}
.video-hero { 
  position: relative; 
  background: #000; 
  width: 100%; 
  aspect-ratio: 800/500; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
}
.grid-box { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 8px; 
  padding: 10px; 
  background: #0F0F10; 
}
.grid-item { 
  background: #2A2C31; 
  padding: 10px; 
  border-radius: 10px; 
  text-align: center; 
}
</style>

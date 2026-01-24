// 名片編輯器組件
const BusinessCardEditor = {
    name: 'BusinessCardEditor',
    props: ['data'],
    template: `
        <div class="space-y-6">
            <!-- 名片與 Header 設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-id-card mr-2 text-line-green"></i> 影片與名片 Header 設定
                </h4>
                <div class="grid grid-cols-2 gap-4">
                    <input type="text" v-model="localData.headerName" 
                           class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="品牌姓名">
                    <input type="text" v-model="localData.headerTitle" 
                           class="px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="職位/稱號">
                    <input type="text" v-model="localData.headerDescription" 
                           class="col-span-2 px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="描述/公司">
                    <input type="text" v-model="localData.headerImg" 
                           class="col-span-2 px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="頭像圖片 URL">
                </div>
            </div>

            <!-- 影片設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-video mr-2 text-line-green"></i> 影片設定
                </h4>
                <div class="space-y-4">
                    <input type="text" v-model="localData.videoUrl" 
                           class="w-full px-4 py-2 border rounded-lg text-sm focus:border-line-green outline-none shadow-sm" 
                           placeholder="影片 MP4 連結">
                    <input type="text" v-model="localData.previewUrl" 
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
                    <div v-for="(grid, index) in localData.gridButtons" :key="index" 
                         class="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg border">
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
                    <button @click="addGridButton" v-if="localData.gridButtons.length < 8"
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
                    <div v-for="(vBtn, vIdx) in localData.videoFooterButtons" :key="vIdx" 
                         class="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center transition-all hover:border-blue-100">
                        <div v-if="vIdx === 0" class="flex flex-col items-center gap-1 relative">
                            <span class="text-[9px] text-gray-400 font-bold">主色</span>
                            <input type="color" v-model="vBtn.color">
                            <button @click="showColorPalette($event, 'videoButtonColor', vIdx)" 
                                    class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
                                <i class="fas fa-palette"></i>
                            </button>
                        </div>
                        <input type="text" v-model="vBtn.label"
                               class="w-40 border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                               placeholder="按鈕文字">
                        <input type="text" v-model="vBtn.uri"
                               class="flex-grow border rounded px-3 py-2 text-sm focus:border-blue-300 outline-none" 
                               placeholder="按鈕 URL">
                        <button @click="removeFooterButton(vIdx)" 
                                class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <button @click="addFooterButton" v-if="localData.videoFooterButtons.length < 4"
                            class="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
                        + 新增底部按鈕
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            localData: JSON.parse(JSON.stringify(this.data))
        };
    },
    watch: {
        data: {
            handler(newVal) {
                this.localData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
        localData: {
            handler(newVal) {
                this.$emit('update:data', JSON.parse(JSON.stringify(newVal)));
                this.$emit('change', newVal);
            },
            deep: true
        }
    },
    methods: {
        addGridButton() {
            this.localData.gridButtons.push({
                emoji: '🌟',
                label: '新功能',
                uri: 'https://example.com'
            });
        },
        removeGridButton(index) {
            if (this.localData.gridButtons.length > 2) {
                this.localData.gridButtons.splice(index, 1);
            }
        },
        addFooterButton() {
            this.localData.videoFooterButtons.push({
                label: '新按鈕',
                uri: 'https://example.com',
                color: '#00B900'
            });
        },
        removeFooterButton(index) {
            if (this.localData.videoFooterButtons.length > 1) {
                this.localData.videoFooterButtons.splice(index, 1);
            }
        },
        showColorPalette(event, target, index) {
            this.$emit('show-color-palette', { event, target, index });
        }
    }
};

// 名片預覽組件
const BusinessCardPreview = {
    name: 'BusinessCardPreview',
    props: ['data'],
    template: `
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
    `,
    data() {
        return {
            isPlaying: false,
            defaultAvatar: 'https://via.placeholder.com/40x40?text=Avatar',
            defaultPreview: 'https://via.placeholder.com/250x160?text=Preview'
        };
    },
    methods: {
        getButtonStyle(index, button) {
            if (index === 0) {
                return { 
                    backgroundColor: button.color || '#C9A24D', 
                    color: '#fff' 
                };
            } else {
                return { 
                    backgroundColor: '#2A2C31', 
                    color: '#999' 
                };
            }
        },
        playVideo() {
            if (this.data.videoUrl) {
                this.isPlaying = true;
                this.$nextTick(() => {
                    if (this.$refs.videoPlayer) {
                        this.$refs.videoPlayer.play();
                    }
                });
            }
        },
        stopVideo() {
            this.isPlaying = false;
            if (this.$refs.videoPlayer) {
                this.$refs.videoPlayer.pause();
                this.$refs.videoPlayer.currentTime = 0;
            }
        },
        handleGridClick(url) {
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        },
        handleButtonClick(url) {
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        },
        handleImageError(e) {
            e.target.src = this.defaultAvatar;
        },
        handlePreviewError(e) {
            e.target.src = this.defaultPreview;
        }
    }
};

// 標準編輯器組件
const StandardEditor = {
    name: 'StandardEditor',
    props: ['data'],
    template: `
        <div class="space-y-6">
            <!-- 視覺內容設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex items-center">
                    <i class="fas fa-image mr-2 text-line-green"></i> 視覺內容設定
                </h4>
                <div class="space-y-4">
                    <input type="text" v-model="localData.imageUrl" 
                           class="w-full px-4 py-2 border rounded-xl text-sm focus:border-line-green shadow-sm" 
                           placeholder="圖片網址">
                    
                    <div class="flex items-center gap-3 mt-3">
                        <button v-for="ratio in ['1:1', '20:13', '4:6']" 
                                @click="localData.aspectRatio = ratio" 
                                :class="localData.aspectRatio === ratio ? 'ratio-btn-active' : 'ratio-btn'" 
                                class="px-3 py-1 text-xs border rounded-md transition-all cursor-pointer">
                            {{ ratio }}
                        </button>
                    </div>
                    
                    <input type="text" v-model="localData.title" 
                           class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-line-green shadow-sm" 
                           placeholder="輸入大標題">
                    
                    <textarea v-model="localData.subtitle" rows="6" 
                              class="w-full px-4 py-3 border rounded-xl text-sm outline-none leading-relaxed focus:border-line-green shadow-sm" 
                              placeholder="輸入文章內容..."></textarea>
                </div>
            </div>

            <!-- 底部行為按鈕設定 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 mt-6 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4 flex justify-between items-center">
                    <span><i class="fas fa-mouse-pointer mr-2 text-line-green"></i> 底部行為按鈕設定</span>
                    <span class="text-xs text-gray-500">{{ localData.buttons.length }}/3</span>
                </h4>
                <div class="space-y-3">
                    <div v-for="(btn, index) in localData.buttons" :key="index" 
                         class="flex gap-3 items-center group bg-white p-3 rounded-xl border transition-all hover:border-green-100 shadow-sm">
                        <div class="relative">
                            <input type="color" v-model="btn.color">
                            <button @click="showColorPalette($event, 'buttonColor', index)" 
                                    class="absolute -right-1 -bottom-1 p-1 bg-white rounded-full border shadow-sm text-xs text-gray-600 hover:text-line-green">
                                <i class="fas fa-palette"></i>
                            </button>
                        </div>
                        <input type="text" v-model="btn.label" maxlength="10"
                               class="w-32 px-4 py-2 border rounded-lg text-sm" placeholder="文字">
                        <input type="text" v-model="btn.uri"
                               class="flex-grow px-4 py-2 border rounded-lg text-sm" placeholder="網址">
                        <button @click="removeButton(index)" 
                                class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <button v-if="localData.buttons.length < 3" @click="addButton" 
                            class="w-full py-3 mt-2 border-2 border-dashed border-gray-200 rounded-2xl text-sm text-gray-400 bg-white font-bold hover:border-line-green transition-all">
                        + 新增功能按鈕
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            localData: JSON.parse(JSON.stringify(this.data))
        };
    },
    watch: {
        data: {
            handler(newVal) {
                this.localData = JSON.parse(JSON.stringify(newVal));
            },
            deep: true
        },
        localData: {
            handler(newVal) {
                this.$emit('update:data', JSON.parse(JSON.stringify(newVal)));
            },
            deep: true
        }
    },
    methods: {
        addButton() {
            this.localData.buttons.push({
                label: '新按鈕',
                uri: 'https://example.com',
                color: '#00B900'
            });
        },
        removeButton(index) {
            if (this.localData.buttons.length > 1) {
                this.localData.buttons.splice(index, 1);
            }
        },
        showColorPalette(event, target, index) {
            this.$emit('show-color-palette', { event, target, index });
        }
    }
};

// 標準預覽組件
const StandardPreview = {
    name: 'StandardPreview',
    props: ['data'],
    template: `
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
    `,
    data() {
        return {
            defaultImage: 'https://via.placeholder.com/250x160?text=Image'
        };
    },
    computed: {
        aspectRatio() {
            return this.data.aspectRatio ? 
                this.data.aspectRatio.replace(':', '/') : '20/13';
        }
    },
    methods: {
        handleButtonClick(url) {
           

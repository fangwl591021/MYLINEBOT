// 編輯器模組 - 先只放一個最簡單的編輯器
window.EditorComponent = {
    name: 'Editor',
    props: ['data', 'chatMessage'],
    template: `
        <div class="space-y-6">
            <!-- 聊天室文字 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4">
                    <i class="fas fa-comment-dots mr-2 text-line-green"></i> 聊天室顯示文字
                </h4>
                <textarea v-model="localChatMessage" rows="3"
                          class="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg"
                          placeholder="請輸入聊天室文字..."></textarea>
            </div>

            <!-- 簡單編輯器 -->
            <div class="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-sm font-bold text-gray-700 mb-4">
                    <i class="fas fa-edit mr-2 text-line-green"></i> 基本設定
                </h4>
                <input type="text" v-model="localData.title" 
                       class="w-full px-4 py-2 border rounded-lg mb-4"
                       placeholder="標題">
                <textarea v-model="localData.content" rows="4"
                          class="w-full px-4 py-2 border rounded-lg"
                          placeholder="內容"></textarea>
            </div>
        </div>
    `,
    data() {
        return {
            localData: { ...this.data },
            localChatMessage: this.chatMessage
        };
    },
    watch: {
        localData: {
            handler(newVal) {
                this.$emit('update:data', { ...newVal });
            },
            deep: true
        },
        localChatMessage(newVal) {
            this.$emit('update:chat-message', newVal);
        }
    }
};

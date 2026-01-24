// 預覽模組
window.PreviewComponent = {
    name: 'Preview',
    props: ['data'],
    template: `
        <div class="p-4">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="font-bold text-gray-800 text-lg mb-2">{{ data.title || '預覽標題' }}</h3>
                <p class="text-gray-600 text-sm">{{ data.content || '預覽內容...' }}</p>
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p class="text-xs text-gray-500">聊天室文字：</p>
                    <p class="text-sm">{{ data.chatMessage || '無聊天室文字' }}</p>
                </div>
            </div>
        </div>
    `
};

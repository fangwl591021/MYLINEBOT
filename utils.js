// 工具函數
const WORKER_URL = "https://lineoa.fangwl591021.workers.dev";

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '無日期';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return '日期格式錯誤';
    }
}

// 生成標準型 JSON
function generateStandardJson(data) {
    const contents = [
        { 
            type: "image", 
            url: data.imageUrl || "https://via.placeholder.com/800x520?text=Image", 
            size: "full", 
            aspectRatio: data.aspectRatio || "20:13", 
            animated: true 
        }, 
        { 
            type: "text", 
            text: data.title || "標題", 
            weight: "bold", 
            size: "xl", 
            align: "center", 
            margin: "sm" 
        }, 
        { 
            type: "text", 
            text: data.subtitle || "內容區", 
            size: "sm", 
            margin: "sm", 
            offsetStart: "5px", 
            wrap: true 
        }
    ];
    
    const flex = {
        type: "bubble",
        body: { 
            type: "box", 
            layout: "vertical", 
            paddingAll: "0px", 
            contents: contents 
        }
    };
    
    if (data.buttons && data.buttons.length > 0) {
        flex.footer = {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: data.buttons.map(b => ({
                type: "button",
                style: "primary",
                color: b.color || "#00B900",
                height: "sm",
                action: {
                    type: "uri",
                    label: b.label || "按鈕",
                    uri: b.uri || "https://example.com"
                }
            }))
        };
    }
    
    return flex;
}

// 生成名片型 JSON
function generateBusinessCardJson(cardData) {
    const { 
        headerName, 
        headerTitle, 
        headerDescription, 
        headerImg,
        videoUrl,
        previewUrl,
        gridButtons = [],
        videoFooterButtons = []
    } = cardData;

    // 建立網格佈局
    const gridContents = [];
    const gridPairs = [];
    
    for (let i = 0; i < Math.min(4, gridButtons.length); i += 2) {
        const pair = gridButtons.slice(i, i + 2);
        if (pair.length > 0) {
            gridPairs.push(pair);
        }
    }

    gridPairs.forEach((pair) => {
        const row = {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: pair.map((btn) => ({
                type: "box",
                layout: "vertical",
                paddingAll: "12px",
                backgroundColor: "#2A2C31",
                cornerRadius: "12px",
                action: {
                    type: "uri",
                    label: btn.label,
                    uri: btn.uri
                },
                contents: [
                    {
                        type: "text",
                        text: btn.emoji || "🌟",
                        size: "xl",
                        align: "center"
                    },
                    {
                        type: "text",
                        text: btn.label || "按鈕",
                        size: "sm",
                        align: "center",
                        color: "#E6E6E6"
                    }
                ],
                flex: 1,
                margin: "none"
            }))
        };
        
        gridContents.push(row);
    });

    // 建立底部按鈕
    const footerButtons = videoFooterButtons.map((btn, index) => ({
        type: "button",
        style: index === 0 ? "primary" : "secondary",
        color: index === 0 ? (btn.color || "#C9A24D") : undefined,
        height: "sm",
        action: {
            type: "uri",
            label: btn.label || "按鈕",
            uri: btn.uri || "#"
        }
    }));

    return {
        type: "bubble",
        size: "mega",
        header: {
            type: "box",
            layout: "horizontal",
            spacing: "md",
            paddingAll: "8px",
            backgroundColor: "#1A1B1E",
            contents: [
                {
                    type: "image",
                    url: headerImg || "https://via.placeholder.com/40x40?text=Avatar",
                    size: "xs",
                    aspectRatio: "1:1",
                    aspectMode: "cover",
                    gravity: "center"
                },
                {
                    type: "box",
                    layout: "vertical",
                    spacing: "xs",
                    flex: 3,
                    contents: [
                        {
                            type: "text",
                            text: headerName || "未設定姓名",
                            weight: "bold",
                            size: "lg",
                            color: "#D4AF37"
                        },
                        {
                            type: "text",
                            text: headerTitle || "未設定職稱",
                            size: "sm",
                            color: "#E6E6E6"
                        },
                        {
                            type: "text",
                            text: headerDescription || "未設定描述",
                            size: "xs",
                            color: "#A0A0A0",
                            wrap: true
                        }
                    ]
                }
            ]
        },
        hero: {
            type: "video",
            url: videoUrl || "",
            previewUrl: previewUrl || "https://via.placeholder.com/800x500?text=Preview",
            aspectRatio: "800:500",
            altContent: {
                type: "image",
                url: previewUrl || "https://via.placeholder.com/800x500?text=Preview",
                size: "full",
                aspectRatio: "800:500",
                aspectMode: "cover"
            }
        },
        body: {
            type: "box",
            layout: "vertical",
            paddingAll: "8px",
            contents: [
                {
                    type: "box",
                    layout: "vertical",
                    spacing: "sm",
                    paddingAll: "12px",
                    backgroundColor: "#1F2024",
                    cornerRadius: "14px",
                    contents: gridContents.length > 0 ? gridContents : [
                        {
                            type: "text",
                            text: "請設定網格按鈕",
                            align: "center",
                            color: "#666666"
                        }
                    ]
                }
            ]
        },
        footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            paddingAll: "8px",
            contents: footerButtons.length > 0 ? footerButtons : [
                {
                    type: "text",
                    text: "請設定底部按鈕",
                    align: "center",
                    color: "#666666"
                }
            ]
        },
        styles: {
            body: {
                backgroundColor: "#0F0F10"
            },
            footer: {
                backgroundColor: "#0F0F10"
            }
        }
    };
}

// API 服務
const apiService = {
    async loadProjects() {
        try {
            const response = await fetch(`${WORKER_URL}/api/projects`, {
                headers: { 'Accept': 'application/json' }
            });
            return await response.json();
        } catch (error) {
            console.error('載入專案失敗:', error);
            throw error;
        }
    },
    
    async saveProject(projectData, isUpdate = false) {
        try {
            const endpoint = isUpdate ? '/api/projects/update' : '/api/projects/create';
            const response = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(projectData)
            });
            return await response.json();
        } catch (error) {
            console.error('儲存專案失敗:', error);
            throw error;
        }
    },
    
    async deleteProject(projectId) {
        try {
            const response = await fetch(`${WORKER_URL}/api/projects/delete`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ id: projectId })
            });
            return await response.json();
        } catch (error) {
            console.error('刪除專案失敗:', error);
            throw error;
        }
    }
};

// 暴露到全局
window.Utils = {
    WORKER_URL,
    formatDate,
    generateStandardJson,
    generateBusinessCardJson,
    apiService
};

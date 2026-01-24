export const generateBusinessCardJson = (cardData) => {
  const { 
    headerName, 
    headerTitle, 
    headerDescription, 
    headerImg,
    videoUrl,
    previewUrl,
    gridButtons,
    videoFooterButtons 
  } = cardData;

  const gridContents = [];
  const gridPairs = [];
  
  // 將網格按鈕分組成 2x2 的對
  for (let i = 0; i < Math.min(4, gridButtons.length); i += 2) {
    const pair = gridButtons.slice(i, i + 2);
    if (pair.length > 0) {
      gridPairs.push(pair);
    }
  }

  // 建立網格佈局
  gridPairs.forEach((pair, rowIndex) => {
    const row = {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: pair.map((btn, colIndex) => ({
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
            text: btn.emoji,
            size: "xl",
            align: "center"
          },
          {
            type: "text",
            text: btn.label,
            size: "sm",
            align: "center",
            color: "#E6E6E6"
          }
        ],
        flex: 1,
        margin: colIndex === 0 ? "none" : "sm"
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
      label: btn.label,
      uri: btn.uri
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
};

export const defaultBusinessCardData = {
  headerName: 'TONY',
  headerTitle: 'LINE行銷達人',
  headerDescription: '系統開發',
  headerImg: 'https://aiwe.cc/wp-content/uploads/2025/04/f9ebd0672d3b0ac370272909a493d4db.png',
  videoUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXDigUOQpZHg/mp4',
  previewUrl: 'https://voom-obs.line-scdn.net/ho1sEMNWDLB8UUD8RLAYrZjJoJzAxV3cPGT8MeBQ_J2YzD3JIGgELJDl3bm4xeSUUJy9_IhBjCiYfajYJIBEMORdaCXUceRQXdigUOQpZHg/m800x1200',
  gridButtons: [
    { emoji: '🤖', label: 'AI 諮詢', uri: 'https://liff.line.me/2006625044-bPGxrB53/' },
    { emoji: '🎥', label: '產品介紹', uri: 'https://example.com/video' },
    { emoji: '🧾', label: '商品型錄', uri: 'https://example.com/catalog' },
    { emoji: '📍', label: '門市資訊', uri: 'https://example.com/map' }
  ],
  videoFooterButtons: [
    { label: '🚀 啟動 AI 小幫手', uri: 'https://liff.line.me/2006625044-bPGxrB53/index.php/colt_sp/6502/', color: '#C9A24D' },
    { label: '📤 分享好友', uri: 'https://liff.line.me/2006625044-J42EzjkZ/index.php/linecard_12/6816/' }
  ]
};

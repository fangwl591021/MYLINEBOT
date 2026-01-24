export const generateStandardJson = (data) => {
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
  ]
  
  const flex = {
    type: "bubble",
    body: { 
      type: "box", 
      layout: "vertical", 
      paddingAll: "0px", 
      contents: contents 
    }
  }
  
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
    }
  }
  
  return flex
}

export const defaultStandardData = {
  type: 'standard',
  imageUrl: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png',
  aspectRatio: '20:13',
  title: 'Brown Cafe',
  subtitle: '歡迎光臨！支援長文換行。',
  showBadge: true,
  badgeColor: '#FF0000',
  buttons: [
    { label: '了解更多', uri: 'https://example.com', color: '#00B900' }
  ]
}

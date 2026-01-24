const WORKER_URL = "https://lineoa.fangwl591021.workers.dev"

export const apiService = {
  // 檢查工作表狀態
  async checkSheetsStatus() {
    try {
      const response = await fetch(`${WORKER_URL}/api/sheets/status`)
      return await response.json()
    } catch (error) {
      console.error('檢查工作表狀態失敗:', error)
      throw error
    }
  },
  
  // 初始化工作表
  async initializeSheets() {
    try {
      const response = await fetch(`${WORKER_URL}/api/sheets/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      return await response.json()
    } catch (error) {
      console.error('初始化工作表失敗:', error)
      throw error
    }
  },
  
  // 載入專案列表
  async loadProjects() {
    try {
      const response = await fetch(`${WORKER_URL}/api/projects`, {
        headers: { 'Accept': 'application/json' }
      })
      return await response.json()
    } catch (error) {
      console.error('載入專案失敗:', error)
      throw error
    }
  },
  
  // 儲存專案
  async saveProject(projectData, isUpdate = false) {
    try {
      const endpoint = isUpdate ? '/api/projects/update' : '/api/projects/create'
      const response = await fetch(`${WORKER_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData)
      })
      return await response.json()
    } catch (error) {
      console.error('儲存專案失敗:', error)
      throw error
    }
  },
  
  // 刪除專案
  async deleteProject(projectId) {
    try {
      const response = await fetch(`${WORKER_URL}/api/projects/delete`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      })
      return await response.json()
    } catch (error) {
      console.error('刪除專案失敗:', error)
      throw error
    }
  },
  
  // 推播專案
  async pushProject(projectId, userId) {
    try {
      const response = await fetch(`${WORKER_URL}/api/plugins/push`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ projectId, userId })
      })
      return await response.json()
    } catch (error) {
      console.error('推播專案失敗:', error)
      throw error
    }
  },
  
  // 儲存到 Cloudflare
  async saveToCloudflare(data) {
    try {
      const response = await fetch(`${WORKER_URL}/api/plugins/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      console.error('儲存到 Cloudflare 失敗:', error)
      throw error
    }
  }
}

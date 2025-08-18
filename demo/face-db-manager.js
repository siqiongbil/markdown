/**
 * 人脸数据库管理器 - 基于 IndexedDB
 * 提供完整的本地人脸库存储和管理功能
 */
class FaceDBManager {
    constructor() {
        this.dbName = 'FaceLibraryDB'
        this.dbVersion = 2
        this.storeName = 'faces'
        this.db = null
    }

    /**
     * 初始化数据库
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion)
            
            request.onerror = () => {
                console.error('数据库打开失败:', request.error)
                reject(request.error)
            }
            
            request.onsuccess = () => {
                this.db = request.result
                console.log('人脸数据库初始化成功')
                resolve(this.db)
            }
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result
                
                // 删除旧的 object store（如果存在）
                if (db.objectStoreNames.contains(this.storeName)) {
                    db.deleteObjectStore(this.storeName)
                }
                
                // 创建新的 object store
                const store = db.createObjectStore(this.storeName, { 
                    keyPath: 'id'
                })
                
                // 创建索引
                store.createIndex('name', 'name', { unique: false })
                store.createIndex('timestamp', 'timestamp', { unique: false })
                store.createIndex('hasDescriptor', 'hasDescriptor', { unique: false })
                
                console.log('数据库结构升级完成')
            }
        })
    }

    /**
     * 添加人脸到数据库
     */
    async addFace(faceData) {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)
            
            // 添加额外字段用于索引和查询
            const enhancedData = {
                ...faceData,
                hasDescriptor: !!(faceData.descriptor && faceData.descriptor.length > 0),
                addedDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
            
            const request = store.add(enhancedData)
            
            request.onsuccess = () => {
                console.log('人脸数据已保存到数据库:', faceData.name)
                resolve(enhancedData)
            }
            
            request.onerror = () => {
                console.error('保存人脸数据失败:', request.error)
                reject(request.error)
            }
        })
    }

    /**
     * 获取所有人脸数据
     */
    async getAllFaces() {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)
            const request = store.getAll()
            
            request.onsuccess = () => {
                const faces = request.result || []
                console.log(`从数据库加载了 ${faces.length} 个人脸`)
                resolve(faces)
            }
            
            request.onerror = () => {
                console.error('加载人脸数据失败:', request.error)
                reject(request.error)
            }
        })
    }

    /**
     * 根据ID获取单个人脸
     */
    async getFaceById(id) {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)
            const request = store.get(id)
            
            request.onsuccess = () => {
                resolve(request.result)
            }
            
            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * 更新人脸数据
     */
    async updateFace(faceData) {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)
            
            const enhancedData = {
                ...faceData,
                hasDescriptor: !!(faceData.descriptor && faceData.descriptor.length > 0),
                lastModified: new Date().toISOString()
            }
            
            const request = store.put(enhancedData)
            
            request.onsuccess = () => {
                console.log('人脸数据已更新:', faceData.name)
                resolve(enhancedData)
            }
            
            request.onerror = () => {
                console.error('更新人脸数据失败:', request.error)
                reject(request.error)
            }
        })
    }

    /**
     * 删除人脸数据
     */
    async deleteFace(id) {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)
            const request = store.delete(id)
            
            request.onsuccess = () => {
                console.log('人脸数据已删除:', id)
                resolve(true)
            }
            
            request.onerror = () => {
                console.error('删除人脸数据失败:', request.error)
                reject(request.error)
            }
        })
    }

    /**
     * 获取有描述符的人脸（可用于识别）
     */
    async getFacesWithDescriptors() {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)
            const index = store.index('hasDescriptor')
            const request = index.getAll(true)
            
            request.onsuccess = () => {
                const faces = request.result || []
                console.log(`找到 ${faces.length} 个可用于识别的人脸`)
                resolve(faces)
            }
            
            request.onerror = () => {
                reject(request.error)
            }
        })
    }

    /**
     * 清空所有人脸数据
     */
    async clearAllFaces() {
        if (!this.db) await this.init()
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)
            const request = store.clear()
            
            request.onsuccess = () => {
                console.log('所有人脸数据已清空')
                resolve(true)
            }
            
            request.onerror = () => {
                console.error('清空人脸数据失败:', request.error)
                reject(request.error)
            }
        })
    }

    /**
     * 导出所有人脸数据
     */
    async exportData() {
        const faces = await this.getAllFaces()
        const exportData = {
            version: '2.0',
            timestamp: new Date().toISOString(),
            totalFaces: faces.length,
            facesWithDescriptors: faces.filter(f => f.hasDescriptor).length,
            faces: faces
        }
        return exportData
    }

    /**
     * 导入人脸数据
     */
    async importData(data) {
        if (!data.faces || !Array.isArray(data.faces)) {
            throw new Error('无效的导入数据格式')
        }
        
        const results = {
            total: data.faces.length,
            success: 0,
            failed: 0,
            errors: []
        }
        
        for (const face of data.faces) {
            try {
                // 生成新的ID避免冲突
                const newFace = {
                    ...face,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    importedFrom: data.version || 'unknown',
                    importedAt: new Date().toISOString()
                }
                
                await this.addFace(newFace)
                results.success++
            } catch (error) {
                results.failed++
                results.errors.push(`${face.name || face.id}: ${error.message}`)
            }
        }
        
        return results
    }

    /**
     * 获取数据库统计信息
     */
    async getStats() {
        const faces = await this.getAllFaces()
        const facesWithDescriptors = faces.filter(f => f.hasDescriptor)
        
        return {
            totalFaces: faces.length,
            facesWithDescriptors: facesWithDescriptors.length,
            facesWithoutDescriptors: faces.length - facesWithDescriptors.length,
            oldestFace: faces.length > 0 ? Math.min(...faces.map(f => new Date(f.timestamp || f.addedDate).getTime())) : null,
            newestFace: faces.length > 0 ? Math.max(...faces.map(f => new Date(f.timestamp || f.addedDate).getTime())) : null,
            databaseSize: await this.getDatabaseSize()
        }
    }

    /**
     * 估算数据库大小
     */
    async getDatabaseSize() {
        if (!navigator.storage || !navigator.storage.estimate) {
            return { estimated: false, size: 'unknown' }
        }
        
        try {
            const estimate = await navigator.storage.estimate()
            return {
                estimated: true,
                usage: estimate.usage,
                quota: estimate.quota,
                usageInMB: (estimate.usage / 1024 / 1024).toFixed(2),
                quotaInMB: (estimate.quota / 1024 / 1024).toFixed(2)
            }
        } catch (error) {
            return { estimated: false, error: error.message }
        }
    }

    /**
     * 搜索人脸
     */
    async searchFaces(query) {
        const faces = await this.getAllFaces()
        const lowerQuery = query.toLowerCase()
        
        return faces.filter(face => 
            face.name.toLowerCase().includes(lowerQuery) ||
            (face.note && face.note.toLowerCase().includes(lowerQuery))
        )
    }

    /**
     * 批量删除人脸
     */
    async deleteFaces(ids) {
        const results = {
            total: ids.length,
            success: 0,
            failed: 0,
            errors: []
        }
        
        for (const id of ids) {
            try {
                await this.deleteFace(id)
                results.success++
            } catch (error) {
                results.failed++
                results.errors.push(`${id}: ${error.message}`)
            }
        }
        
        return results
    }

    /**
     * 关闭数据库连接
     */
    close() {
        if (this.db) {
            this.db.close()
            this.db = null
            console.log('数据库连接已关闭')
        }
    }

    /**
     * 彻底清除缓存和数据库
     * 包括：IndexedDB、LocalStorage、SessionStorage、Cache API
     */
    async clearAllCache() {
        const results = {
            indexedDB: false,
            localStorage: false,
            sessionStorage: false,
            cacheAPI: false,
            serviceWorker: false,
            cookies: false,
            errors: []
        }
        
        try {
            // 1. 清除 IndexedDB
            try {
                if (this.db) {
                    this.db.close()
                    this.db = null
                }
                
                // 删除数据库
                await new Promise((resolve, reject) => {
                    const deleteRequest = indexedDB.deleteDatabase(this.dbName)
                    deleteRequest.onsuccess = () => resolve()
                    deleteRequest.onerror = () => reject(deleteRequest.error)
                    deleteRequest.onblocked = () => {
                        console.warn('数据库删除被阻塞，可能有其他标签页在使用')
                        resolve() // 继续执行其他清理
                    }
                })
                
                results.indexedDB = true
                console.log('IndexedDB 已清除')
            } catch (error) {
                results.errors.push(`IndexedDB清除失败: ${error.message}`)
                console.error('IndexedDB 清除失败:', error)
            }

            // 2. 清除 LocalStorage
            try {
                // 清除人脸识别相关的所有 localStorage 数据
                const keysToRemove = []
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key && (
                        key.includes('face') || 
                        key.includes('Face') || 
                        key.includes('recognition') ||
                        key.includes('faceLibrary') ||
                        key.includes('faceDB')
                    )) {
                        keysToRemove.push(key)
                    }
                }
                
                keysToRemove.forEach(key => localStorage.removeItem(key))
                results.localStorage = true
                console.log(`LocalStorage 已清除 (${keysToRemove.length} 项)`)
            } catch (error) {
                results.errors.push(`LocalStorage清除失败: ${error.message}`)
                console.error('LocalStorage 清除失败:', error)
            }

            // 3. 清除 SessionStorage
            try {
                const sessionKeysToRemove = []
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i)
                    if (key && (
                        key.includes('face') || 
                        key.includes('Face') || 
                        key.includes('recognition')
                    )) {
                        sessionKeysToRemove.push(key)
                    }
                }
                
                sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
                results.sessionStorage = true
                console.log(`SessionStorage 已清除 (${sessionKeysToRemove.length} 项)`)
            } catch (error) {
                results.errors.push(`SessionStorage清除失败: ${error.message}`)
                console.error('SessionStorage 清除失败:', error)
            }

            // 4. 清除 Cache API (PWA 缓存)
            try {
                if ('caches' in window) {
                    const cacheNames = await caches.keys()
                    const deletePromises = cacheNames.map(name => caches.delete(name))
                    await Promise.all(deletePromises)
                    results.cacheAPI = true
                    console.log(`Cache API 已清除 (${cacheNames.length} 个缓存)`)
                } else {
                    results.cacheAPI = true // 不支持则标记为成功
                }
            } catch (error) {
                results.errors.push(`Cache API清除失败: ${error.message}`)
                console.error('Cache API 清除失败:', error)
            }

            // 5. 注销 Service Worker
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations()
                    const unregisterPromises = registrations.map(registration => registration.unregister())
                    await Promise.all(unregisterPromises)
                    results.serviceWorker = true
                    console.log(`Service Worker 已注销 (${registrations.length} 个)`)
                } else {
                    results.serviceWorker = true // 不支持则标记为成功
                }
            } catch (error) {
                results.errors.push(`Service Worker清除失败: ${error.message}`)
                console.error('Service Worker 清除失败:', error)
            }

            // 6. 清除相关 Cookies (仅限同域)
            try {
                const cookies = document.cookie.split(';')
                let clearedCount = 0
                
                cookies.forEach(cookie => {
                    const [name] = cookie.split('=')
                    const cookieName = name.trim()
                    if (cookieName && (
                        cookieName.includes('face') || 
                        cookieName.includes('Face') || 
                        cookieName.includes('recognition')
                    )) {
                        // 清除 cookie
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
                        clearedCount++
                    }
                })
                
                results.cookies = true
                console.log(`Cookies 已清除 (${clearedCount} 个)`)
            } catch (error) {
                results.errors.push(`Cookies清除失败: ${error.message}`)
                console.error('Cookies 清除失败:', error)
            }

        } catch (error) {
            results.errors.push(`清除过程中发生未知错误: ${error.message}`)
            console.error('清除过程中发生未知错误:', error)
        }

        return results
    }

    /**
     * 检查存储使用情况
     */
    async getStorageUsage() {
        const usage = {
            indexedDB: { size: 0, description: 'IndexedDB 数据库' },
            localStorage: { size: 0, description: 'LocalStorage 缓存' },
            sessionStorage: { size: 0, description: 'SessionStorage 缓存' },
            total: 0,
            quota: 0,
            percentage: 0
        }

        try {
            // 计算 LocalStorage 大小
            let localStorageSize = 0
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    localStorageSize += localStorage[key].length + key.length
                }
            }
            usage.localStorage.size = localStorageSize

            // 计算 SessionStorage 大小
            let sessionStorageSize = 0
            for (let key in sessionStorage) {
                if (sessionStorage.hasOwnProperty(key)) {
                    sessionStorageSize += sessionStorage[key].length + key.length
                }
            }
            usage.sessionStorage.size = sessionStorageSize

            // 获取总体存储使用情况
            if (navigator.storage && navigator.storage.estimate) {
                const estimate = await navigator.storage.estimate()
                usage.total = estimate.usage || 0
                usage.quota = estimate.quota || 0
                usage.percentage = usage.quota > 0 ? (usage.total / usage.quota * 100) : 0
                
                // IndexedDB 大小约等于总使用量减去其他存储
                usage.indexedDB.size = Math.max(0, usage.total - localStorageSize - sessionStorageSize)
            }

        } catch (error) {
            console.warn('获取存储使用情况失败:', error)
        }

        return usage
    }

    /**
     * 格式化字节大小
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
}

// 创建全局实例
window.faceDB = new FaceDBManager()

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaceDBManager
}
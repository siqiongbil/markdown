/**
 * 人脸识别系统调试助手
 * 帮助排查"添加到人脸库"功能的问题
 */

window.DebugHelper = {
    // 检查系统状态
    checkSystemStatus() {
        console.log('开始系统状态检查...')
        
        const status = {
            faceDB: !!window.faceDB,
            vueApp: !!window.app || !!document.querySelector('#app').__vue__,
            faceAPI: !!window.faceapi,
            indexedDB: !!window.indexedDB,
            mediaDevices: !!navigator.mediaDevices,
            timestamp: new Date().toISOString()
        }
        
        console.log('系统状态:', status)
        
        // 检查关键组件
        if (!status.faceDB) {
            console.error('FaceDB 数据库管理器未初始化')
        }
        
        if (!status.faceAPI) {
            console.error('face-api.js 未加载')
        }
        
        if (!status.indexedDB) {
            console.error('IndexedDB 不可用')
        }
        
        return status
    },
    
    // 检查Vue应用状态
    checkVueAppStatus() {
        console.log('检查Vue应用状态...')
        
        try {
            const app = document.querySelector('#app').__vue__
            
            const appStatus = {
                isRunning: app.isRunning,
                modelsLoaded: app.modelsLoaded,
                faceDataLength: app.faceData.length,
                faceLibraryLength: app.faceLibrary.length,
                hasFaceDB: !!app.faceDB,
                showAddDialog: app.showAddDialog,
                hasVideoRef: !!app.$refs.video,
                hasCaptureCanvasRef: !!app.$refs.captureCanvas,
                videoReadyState: app.$refs.video ? app.$refs.video.readyState : 'not found'
            }
            
            console.log('Vue应用状态:', appStatus)
            
            // 检查关键状态
            if (!appStatus.modelsLoaded) {
                console.warn('AI模型尚未加载完成')
            }
            
            if (!appStatus.isRunning) {
                console.warn('摄像头未启动')
            }
            
            if (appStatus.faceDataLength === 0) {
                console.warn('未检测到人脸')
            }
            
            if (!appStatus.hasVideoRef) {
                console.warn('视频元素引用缺失')
            }
            
            if (appStatus.showAddDialog && !appStatus.hasCaptureCanvasRef) {
                console.warn('对话框显示但canvas元素引用缺失')
            }
            
            return appStatus
        } catch (error) {
            console.error('无法访问Vue应用:', error)
            return null
        }
    },
    
    // 检查数据库状态
    async checkDatabaseStatus() {
        console.log('检查数据库状态...')
        
        try {
            if (!window.faceDB) {
                console.error('FaceDB未初始化')
                return null
            }
            
            const stats = await window.faceDB.getStats()
            const usage = await window.faceDB.getStorageUsage()
            
            const dbStatus = {
                totalFaces: stats.totalFaces,
                facesWithDescriptors: stats.facesWithDescriptors,
                storageUsage: window.faceDB.formatBytes(usage.total),
                storageQuota: window.faceDB.formatBytes(usage.quota)
            }
            
            console.log('数据库状态:', dbStatus)
            return dbStatus
        } catch (error) {
            console.error('数据库检查失败:', error)
            return null
        }
    },
    
    // 模拟添加人脸操作
    async simulateAddFace() {
        console.log('🧪 模拟添加人脸操作...')
        
        try {
            const app = document.querySelector('#app').__vue__
            
            if (!app) {
                console.error('无法访问Vue应用')
                return false
            }
            
            // 检查前置条件
            if (!app.isRunning) {
                console.error('摄像头未启动')
                return false
            }
            
            if (app.faceData.length === 0) {
                console.error('未检测到人脸')
                return false
            }
            
            // 模拟创建人脸数据
            const testFace = {
                id: 'test_' + Date.now(),
                name: '测试人脸_' + Date.now(),
                note: '调试测试',
                image: 'data:image/jpeg;base64,test',
                descriptor: new Array(128).fill(0).map(() => Math.random()),
                timestamp: new Date().toISOString(),
                source: 'debug'
            }
            
            console.log('测试人脸数据:', testFace)
            
            // 尝试保存到数据库
            if (app.faceDB) {
                const savedFace = await app.faceDB.addFace(testFace)
                console.log('测试保存成功:', savedFace.id)
                
                // 验证保存
                const allFaces = await app.faceDB.getAllFaces()
                console.log('验证：数据库中的人脸总数:', allFaces.length)
                
                return true
            } else {
                console.error('FaceDB未初始化')
                return false
            }
            
        } catch (error) {
            console.error('模拟操作失败:', error)
            return false
        }
    },
    
    // 完整诊断
    async fullDiagnosis() {
        console.log('🩺 开始完整系统诊断...')
        console.log('='.repeat(50))
        
        // 1. 系统状态检查
        const systemStatus = this.checkSystemStatus()
        
        // 2. Vue应用状态检查
        const appStatus = this.checkVueAppStatus()
        
        // 3. 数据库状态检查
        const dbStatus = await this.checkDatabaseStatus()
        
        // 4. 模拟操作测试
        const simulationResult = await this.simulateAddFace()
        
        console.log('='.repeat(50))
        console.log('诊断报告:')
        console.log('系统组件:', systemStatus ? '正常' : '异常')
        console.log('Vue应用:', appStatus ? '正常' : '异常')
        console.log('数据库:', dbStatus ? '正常' : '异常')
        console.log('功能测试:', simulationResult ? '通过' : '失败')
        console.log('='.repeat(50))
        
        // 生成建议
        const suggestions = []
        
        if (!systemStatus?.faceDB) {
            suggestions.push('请确保 face-db-manager.js 文件已正确加载')
        }
        
        if (!systemStatus?.faceAPI) {
            suggestions.push('请确保 face-api.js 文件已正确加载')
        }
        
        if (!appStatus?.modelsLoaded) {
            suggestions.push('请等待AI模型加载完成')
        }
        
        if (!appStatus?.isRunning) {
            suggestions.push('请先启动摄像头')
        }
        
        if (appStatus?.faceDataLength === 0) {
            suggestions.push('请确保摄像头前有人脸，并且光线充足')
        }
        
        if (!simulationResult) {
            suggestions.push('功能测试失败，请检查数据库连接')
        }
        
        if (suggestions.length > 0) {
            console.log('建议:')
            suggestions.forEach((suggestion, index) => {
                console.log(`${index + 1}. ${suggestion}`)
            })
        } else {
            console.log('系统状态良好，如果仍有问题请手动操作测试')
        }
        
        return {
            systemStatus,
            appStatus,
            dbStatus,
            simulationResult,
            suggestions
        }
    },
    
    // 测试canvas元素状态
    testCanvasElements() {
        console.log('检查Canvas元素状态...')
        
        try {
            const app = document.querySelector('#app').__vue__
            
            const canvasStatus = {
                videoRef: {
                    exists: !!app.$refs.video,
                    readyState: app.$refs.video ? app.$refs.video.readyState : 'N/A',
                    videoWidth: app.$refs.video ? app.$refs.video.videoWidth : 'N/A',
                    videoHeight: app.$refs.video ? app.$refs.video.videoHeight : 'N/A'
                },
                captureCanvas: {
                    exists: !!app.$refs.captureCanvas,
                    canGetContext: false,
                    width: 'N/A',
                    height: 'N/A'
                },
                overlayCanvas: {
                    exists: !!app.$refs.overlay,
                    canGetContext: false,
                    width: 'N/A',
                    height: 'N/A'
                },
                dialogVisible: app.showAddDialog
            }
            
            // 测试captureCanvas
            if (app.$refs.captureCanvas) {
                try {
                    const ctx = app.$refs.captureCanvas.getContext('2d')
                    canvasStatus.captureCanvas.canGetContext = !!ctx
                    canvasStatus.captureCanvas.width = app.$refs.captureCanvas.width
                    canvasStatus.captureCanvas.height = app.$refs.captureCanvas.height
                } catch (error) {
                    canvasStatus.captureCanvas.error = error.message
                }
            }
            
            // 测试overlayCanvas
            if (app.$refs.overlay) {
                try {
                    const ctx = app.$refs.overlay.getContext('2d')
                    canvasStatus.overlayCanvas.canGetContext = !!ctx
                    canvasStatus.overlayCanvas.width = app.$refs.overlay.width
                    canvasStatus.overlayCanvas.height = app.$refs.overlay.height
                } catch (error) {
                    canvasStatus.overlayCanvas.error = error.message
                }
            }
            
            console.log('Canvas元素状态:', canvasStatus)
            
            // 给出建议
            if (!canvasStatus.videoRef.exists) {
                console.error('视频元素不存在')
            } else if (canvasStatus.videoRef.readyState < 2) {
                console.warn('视频尚未准备就绪')
            }
            
            if (!canvasStatus.captureCanvas.exists && canvasStatus.dialogVisible) {
                console.error('对话框已显示但captureCanvas不存在')
            }
            
            return canvasStatus
        } catch (error) {
            console.error('Canvas状态检查失败:', error)
            return null
        }
    },
    
    // 清理测试数据
    async cleanTestData() {
        console.log('🧹 清理测试数据...')
        
        try {
            if (!window.faceDB) {
                console.log('FaceDB未初始化')
                return
            }
            
            const allFaces = await window.faceDB.getAllFaces()
            const testFaces = allFaces.filter(face => face.source === 'debug' || face.name.includes('测试'))
            
            console.log(`找到 ${testFaces.length} 个测试数据`)
            
            for (const face of testFaces) {
                await window.faceDB.deleteFace(face.id)
                console.log(`删除测试数据: ${face.name}`)
            }
            
            console.log('测试数据清理完成')
        } catch (error) {
            console.error('清理失败:', error)
        }
    }
}

// 添加快捷命令
window.checkFaceSystem = () => window.DebugHelper.fullDiagnosis()
window.testAddFace = () => window.DebugHelper.simulateAddFace()
window.cleanTests = () => window.DebugHelper.cleanTestData()
window.checkCanvas = () => window.DebugHelper.testCanvasElements()

console.log('调试助手已加载！')
console.log('使用方法:')
console.log('  • checkFaceSystem() - 完整系统诊断')
console.log('  • testAddFace() - 测试添加功能')
console.log('  • cleanTests() - 清理测试数据')
console.log('  • checkCanvas() - 检查Canvas元素状态')
console.log('  • DebugHelper.checkSystemStatus() - 检查系统状态')
console.log('  • DebugHelper.checkVueAppStatus() - 检查应用状态')
console.log('  • DebugHelper.checkDatabaseStatus() - 检查数据库状态')
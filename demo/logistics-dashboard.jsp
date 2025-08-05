<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>物流配送大屏监控系统</title>
    
    <!-- EasyUI CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/jquery-easyui@1.9.20/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/jquery-easyui@1.9.20/themes/icon.css">
    
    <!-- jQuery -->
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js"></script>
    
    <!-- EasyUI JS -->
    <script src="https://cdn.jsdelivr.net/npm/jquery-easyui@1.9.20/jquery.easyui.min.js"></script>
    
    <!-- 百度地图API -->
    <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=YOUR_BAIDU_MAP_AK"></script>
    
    <!-- 数字滚动插件 -->
    <script src="https://cdn.jsdelivr.net/npm/countup.js@2.0.7/dist/countUp.min.js"></script>
    
    <!-- 图表库 -->
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js"></script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            background: linear-gradient(135deg, #0c1426 0%, #1a2332 100%);
            color: #fff;
            overflow: hidden;
        }
        
        .dashboard-container {
            width: 100vw;
            height: 100vh;
            padding: 20px;
            display: grid;
            grid-template-rows: 80px 1fr 300px;
            grid-template-columns: 1fr 400px;
            gap: 20px;
            grid-template-areas: 
                "header header"
                "map stats"
                "lists lists";
        }
        
        .header {
            grid-area: header;
            background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            font-weight: 300;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            background: linear-gradient(45deg, #fff, #87ceeb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .map-container {
            grid-area: map;
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
            position: relative;
        }
        
        #baiduMap {
            width: 100%;
            height: 100%;
        }
        
        .stats-container {
            grid-area: stats;
            display: grid;
            grid-template-rows: repeat(2, 1fr);
            gap: 20px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        .stat-card:nth-child(1) {
            background: linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(52, 152, 219, 0.1) 100%);
            border-color: rgba(52, 152, 219, 0.3);
        }
        
        .stat-card:nth-child(2) {
            background: linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%);
            border-color: rgba(46, 204, 113, 0.3);
        }
        
        .stat-card:nth-child(3) {
            background: linear-gradient(135deg, rgba(155, 89, 182, 0.2) 0%, rgba(155, 89, 182, 0.1) 100%);
            border-color: rgba(155, 89, 182, 0.3);
        }
        
        .stat-card:nth-child(4) {
            background: linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%);
            border-color: rgba(231, 76, 60, 0.3);
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .stat-label {
            font-size: 1.1em;
            opacity: 0.9;
            text-align: center;
        }
        
        .lists-container {
            grid-area: lists;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .list-panel {
            background: rgba(255,255,255,0.05);
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
        }
        
        .list-header {
            background: linear-gradient(90deg, #2c3e50 0%, #34495e 100%);
            padding: 15px 20px;
            font-size: 1.2em;
            font-weight: bold;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .list-content {
            height: 250px;
            overflow: hidden;
        }
        
        /* EasyUI 样式覆盖 */
        .datagrid {
            background: transparent !important;
            border: none !important;
        }
        
        .datagrid-header {
            background: rgba(255,255,255,0.1) !important;
            border-bottom: 1px solid rgba(255,255,255,0.2) !important;
        }
        
        .datagrid-header td {
            background: transparent !important;
            color: #fff !important;
            border: none !important;
        }
        
        .datagrid-body {
            background: transparent !important;
        }
        
        .datagrid-body td {
            background: transparent !important;
            color: #fff !important;
            border-bottom: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        .datagrid-row:hover {
            background: rgba(255,255,255,0.1) !important;
        }
        
        .datagrid-row-selected {
            background: rgba(52, 152, 219, 0.3) !important;
        }
        
        /* 状态样式 */
        .status-online {
            color: #2ecc71;
            font-weight: bold;
        }
        
        .status-offline {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .status-busy {
            color: #f39c12;
            font-weight: bold;
        }
        
        .warning-high {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .warning-medium {
            color: #f39c12;
            font-weight: bold;
        }
        
        .warning-low {
            color: #2ecc71;
            font-weight: bold;
        }
        
        /* 进度条样式 */
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3498db, #2ecc71);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        /* 动画效果 */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        /* 响应式设计 */
        @media (max-width: 1200px) {
            .dashboard-container {
                grid-template-columns: 1fr;
                grid-template-areas: 
                    "header"
                    "stats"
                    "map"
                    "lists";
            }
            
            .lists-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <!-- 头部标题 -->
        <div class="header">
            <h1>🚚 物流配送大屏监控系统</h1>
        </div>
        
        <!-- 百度地图 -->
        <div class="map-container">
            <div id="baiduMap"></div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-number" id="todayOrders">0</div>
                <div class="stat-label">当天配送单数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="completedOrders">0</div>
                <div class="stat-label">已完成配送数量</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="onTimeRate">0%</div>
                <div class="stat-label">配送及时性率</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="exceptionOrders">0</div>
                <div class="stat-label">异常订单数量</div>
            </div>
        </div>
        
        <!-- 数据列表 -->
        <div class="lists-container">
            <!-- 车辆状态列表 -->
            <div class="list-panel">
                <div class="list-header">
                    🚛 车辆实时状态监控
                </div>
                <div class="list-content">
                    <table id="vehicleGrid" class="easyui-datagrid" 
                           data-options="
                               url:'',
                               method:'get',
                               singleSelect:true,
                               fit:true,
                               fitColumns:true,
                               rownumbers:true,
                               pagination:false,
                               nowrap:false,
                               striped:true,
                               scrollbarSize:0
                           ">
                        <thead>
                            <tr>
                                <th data-options="field:'vehicleId',width:80,title:'车辆编号'"></th>
                                <th data-options="field:'status',width:80,title:'状态',formatter:formatStatus"></th>
                                <th data-options="field:'location',width:120,title:'当前位置'"></th>
                                <th data-options="field:'progress',width:100,title:'任务进度',formatter:formatProgress"></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            
            <!-- 时效预警列表 -->
            <div class="list-panel">
                <div class="list-header">
                    ⏰ 时效预警监控
                </div>
                <div class="list-content">
                    <table id="warningGrid" class="easyui-datagrid" 
                           data-options="
                               url:'',
                               method:'get',
                               singleSelect:true,
                               fit:true,
                               fitColumns:true,
                               rownumbers:true,
                               pagination:false,
                               nowrap:false,
                               striped:true,
                               scrollbarSize:0
                           ">
                        <thead>
                            <tr>
                                <th data-options="field:'warningLevel',width:80,title:'预警等级',formatter:formatWarning"></th>
                                <th data-options="field:'orderId',width:120,title:'订单号'"></th>
                                <th data-options="field:'remainingTime',width:100,title:'剩余时间',formatter:formatTime"></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 全局变量
        let map;
        let vehicleMarkers = [];
        let orderMarkers = [];
        let updateTimer;
        
        // 初始化页面
        $(document).ready(function() {
            initMap();
            initData();
            startRealTimeUpdate();
        });
        
        // 初始化百度地图
        function initMap() {
            // 创建地图实例
            map = new BMap.Map("baiduMap");
            
            // 设置地图中心点（这里设置为北京，你可以根据实际需要调整）
            const point = new BMap.Point(116.404, 39.915);
            map.centerAndZoom(point, 12);
            
            // 添加地图控件
            map.addControl(new BMap.NavigationControl());
            map.addControl(new BMap.ScaleControl());
            map.addControl(new BMap.OverviewMapControl());
            map.addControl(new BMap.MapTypeControl());
            
            // 启用滚轮放大缩小
            map.enableScrollWheelZoom(true);
            
            // 设置地图样式
            map.setMapStyle({
                style: 'midnight'  // 夜间模式，适合大屏显示
            });
        }
        
        // 初始化数据
        function initData() {
            // 初始化统计数据
            updateStatistics();
            
            // 初始化车辆列表
            initVehicleGrid();
            
            // 初始化预警列表
            initWarningGrid();
            
            // 添加车辆标记到地图
            addVehicleMarkers();
        }
        
        // 更新统计数据
        function updateStatistics() {
            // 模拟数据，实际项目中应该从后端API获取
            const stats = {
                todayOrders: 1250,
                completedOrders: 980,
                onTimeRate: 94.5,
                exceptionOrders: 23
            };
            
            // 使用CountUp.js实现数字滚动效果
            new CountUp('todayOrders', 0, stats.todayOrders, 0, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            }).start();
            
            new CountUp('completedOrders', 0, stats.completedOrders, 0, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            }).start();
            
            new CountUp('onTimeRate', 0, stats.onTimeRate, 1, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                suffix: '%'
            }).start();
            
            new CountUp('exceptionOrders', 0, stats.exceptionOrders, 0, {
                duration: 2.5,
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            }).start();
        }
        
        // 初始化车辆列表
        function initVehicleGrid() {
            // 模拟车辆数据
            const vehicleData = [
                {
                    vehicleId: 'V001',
                    status: 'online',
                    location: '北京市朝阳区',
                    progress: 85
                },
                {
                    vehicleId: 'V002',
                    status: 'busy',
                    location: '北京市海淀区',
                    progress: 60
                },
                {
                    vehicleId: 'V003',
                    status: 'online',
                    location: '北京市西城区',
                    progress: 95
                },
                {
                    vehicleId: 'V004',
                    status: 'offline',
                    location: '北京市东城区',
                    progress: 0
                },
                {
                    vehicleId: 'V005',
                    status: 'busy',
                    location: '北京市丰台区',
                    progress: 45
                }
            ];
            
            $('#vehicleGrid').datagrid('loadData', vehicleData);
        }
        
        // 初始化预警列表
        function initWarningGrid() {
            // 模拟预警数据
            const warningData = [
                {
                    warningLevel: 'high',
                    orderId: 'ORD20241201001',
                    remainingTime: 30
                },
                {
                    warningLevel: 'medium',
                    orderId: 'ORD20241201002',
                    remainingTime: 45
                },
                {
                    warningLevel: 'low',
                    orderId: 'ORD20241201003',
                    remainingTime: 90
                },
                {
                    warningLevel: 'high',
                    orderId: 'ORD20241201004',
                    remainingTime: 15
                },
                {
                    warningLevel: 'medium',
                    orderId: 'ORD20241201005',
                    remainingTime: 60
                }
            ];
            
            $('#warningGrid').datagrid('loadData', warningData);
        }
        
        // 添加车辆标记到地图
        function addVehicleMarkers() {
            // 清除现有标记
            vehicleMarkers.forEach(marker => map.removeOverlay(marker));
            vehicleMarkers = [];
            
            // 模拟车辆位置数据
            const vehiclePositions = [
                { id: 'V001', lng: 116.404, lat: 39.915, status: 'online' },
                { id: 'V002', lng: 116.320, lat: 39.960, status: 'busy' },
                { id: 'V003', lng: 116.380, lat: 39.900, status: 'online' },
                { id: 'V004', lng: 116.450, lat: 39.920, status: 'offline' },
                { id: 'V005', lng: 116.350, lat: 39.940, status: 'busy' }
            ];
            
            vehiclePositions.forEach(vehicle => {
                const point = new BMap.Point(vehicle.lng, vehicle.lat);
                const marker = new BMap.Marker(point, {
                    icon: getVehicleIcon(vehicle.status)
                });
                
                // 添加信息窗口
                const infoWindow = new BMap.InfoWindow(`
                    <div style="padding: 10px;">
                        <h4>车辆 ${vehicle.id}</h4>
                        <p>状态: ${getStatusText(vehicle.status)}</p>
                        <p>位置: ${vehicle.lng.toFixed(3)}, ${vehicle.lat.toFixed(3)}</p>
                    </div>
                `);
                
                marker.addEventListener('click', function() {
                    map.openInfoWindow(infoWindow, point);
                });
                
                map.addOverlay(marker);
                vehicleMarkers.push(marker);
            });
        }
        
        // 获取车辆图标
        function getVehicleIcon(status) {
            const iconUrl = status === 'online' ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iIzJlY2M3MSIvPgo8L3N2Zz4K' :
                           status === 'busy' ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iI2YzOWMxMiIvPgo8L3N2Zz4K' :
                           'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iI2U3NGMzMCIvPgo8L3N2Zz4K';
            
            return new BMap.Icon(iconUrl, new BMap.Size(24, 24));
        }
        
        // 获取状态文本
        function getStatusText(status) {
            const statusMap = {
                'online': '在线',
                'busy': '忙碌',
                'offline': '离线'
            };
            return statusMap[status] || status;
        }
        
        // 格式化状态列
        function formatStatus(value, row) {
            const statusClass = value === 'online' ? 'status-online' : 
                              value === 'busy' ? 'status-busy' : 'status-offline';
            return `<span class="${statusClass}">${getStatusText(value)}</span>`;
        }
        
        // 格式化进度列
        function formatProgress(value, row) {
            return `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${value}%"></div>
                    </div>
                    <span>${value}%</span>
                </div>
            `;
        }
        
        // 格式化预警等级
        function formatWarning(value, row) {
            const warningClass = value === 'high' ? 'warning-high' : 
                               value === 'medium' ? 'warning-medium' : 'warning-low';
            const warningText = value === 'high' ? '高' : 
                              value === 'medium' ? '中' : '低';
            return `<span class="${warningClass}">${warningText}</span>`;
        }
        
        // 格式化时间
        function formatTime(value, row) {
            const minutes = Math.floor(value / 60);
            const seconds = value % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // 开始实时更新
        function startRealTimeUpdate() {
            updateTimer = setInterval(function() {
                updateStatistics();
                updateVehiclePositions();
                updateWarningData();
            }, 30000); // 每30秒更新一次
        }
        
        // 更新车辆位置
        function updateVehiclePositions() {
            // 模拟车辆位置变化
            vehicleMarkers.forEach((marker, index) => {
                const currentPoint = marker.getPosition();
                const newLng = currentPoint.lng + (Math.random() - 0.5) * 0.01;
                const newLat = currentPoint.lat + (Math.random() - 0.5) * 0.01;
                const newPoint = new BMap.Point(newLng, newLat);
                
                marker.setPosition(newPoint);
            });
        }
        
        // 更新预警数据
        function updateWarningData() {
            const warningData = $('#warningGrid').datagrid('getData');
            warningData.rows.forEach(row => {
                if (row.remainingTime > 0) {
                    row.remainingTime -= 30; // 减少30秒
                }
            });
            $('#warningGrid').datagrid('loadData', warningData);
        }
        
        // 页面卸载时清理定时器
        $(window).on('beforeunload', function() {
            if (updateTimer) {
                clearInterval(updateTimer);
            }
        });
        
        // 窗口大小改变时重新调整布局
        $(window).on('resize', function() {
            if (map) {
                map.reset();
            }
        });
    </script>
</body>
</html> 
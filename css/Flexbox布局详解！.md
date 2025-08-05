# CSS Flexbox 完整指南

---

## 🚀 项目效果演示

点击按钮即可打开
[DEMO](https://demo.siqiongbiluo.love/flex.html)

---


## 什么是Flexbox

Flexbox（Flexible Box Layout）是CSS3引入的一种布局模式，用于创建响应式的弹性布局。它可以让容器中的元素能够灵活地调整大小、对齐和分布。

### 基本概念

- **Flex容器（Flex Container）**：设置了 `display: flex` 或 `display: inline-flex` 的元素
- **Flex项目（Flex Items）**：Flex容器的直接子元素
- **主轴（Main Axis）**：Flex项目排列的主要方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向



## Flex容器属性

### display

定义容器为flex容器。

```css
.container {
  display: flex;        /* 块级flex容器 */
  display: inline-flex; /* 行内flex容器 */
}
```

### flex-direction

定义主轴方向。

```css
.container {
  flex-direction: row;             /* 默认值：水平从左到右 */
  flex-direction: row-reverse;     /* 水平从右到左 */
  flex-direction: column;          /* 垂直从上到下 */
  flex-direction: column-reverse;  /* 垂直从下到上 */
}
```



### flex-wrap

定义是否换行。

```css
.container {
  flex-wrap: nowrap;    /* 默认值：不换行 */
  flex-wrap: wrap;      /* 换行 */
  flex-wrap: wrap-reverse; /* 换行并反转 */
}
```

### flex-flow

`flex-direction` 和 `flex-wrap` 的简写属性。

```css
.container {
  flex-flow: row wrap;           /* 水平排列并换行 */
  flex-flow: column nowrap;      /* 垂直排列不换行 */
}
```

### justify-content

定义主轴上的对齐方式。

```css
.container {
  justify-content: flex-start;    /* 默认值：起点对齐 */
  justify-content: flex-end;      /* 终点对齐 */
  justify-content: center;        /* 居中对齐 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 环绕对齐 */
  justify-content: space-evenly;  /* 均匀分布 */
}
```



### align-items

定义交叉轴上的对齐方式。

```css
.container {
  align-items: stretch;     /* 默认值：拉伸填充 */
  align-items: flex-start;  /* 起点对齐 */
  align-items: flex-end;    /* 终点对齐 */
  align-items: center;      /* 居中对齐 */
  align-items: baseline;    /* 基线对齐 */
}
```

### align-content

定义多行在交叉轴上的对齐方式（仅当有换行时有效）。

```css
.container {
  align-content: stretch;      /* 默认值：拉伸填充 */
  align-content: flex-start;   /* 起点对齐 */
  align-content: flex-end;     /* 终点对齐 */
  align-content: center;       /* 居中对齐 */
  align-content: space-between; /* 两端对齐 */
  align-content: space-around;  /* 环绕对齐 */
}
```

## Flex项目属性

### order

定义项目的排列顺序。

```css
.item {
  order: 0;    /* 默认值 */
  order: 1;    /* 排在后面 */
  order: -1;   /* 排在前面 */
}
```

### flex-grow

定义项目的放大比例。

```css
.item {
  flex-grow: 0;    /* 默认值：不放大 */
  flex-grow: 1;    /* 放大1倍 */
  flex-grow: 2;    /* 放大2倍 */
}
```

### flex-shrink

定义项目的缩小比例。

```css
.item {
  flex-shrink: 1;  /* 默认值：可以缩小 */
  flex-shrink: 0;  /* 不缩小 */
  flex-shrink: 2;  /* 缩小2倍 */
}
```

### flex-basis

定义项目在分配空间之前的初始大小。

```css
.item {
  flex-basis: auto;    /* 默认值：基于内容 */
  flex-basis: 0;       /* 基于flex-grow分配 */
  flex-basis: 200px;   /* 固定宽度 */
  flex-basis: 50%;     /* 百分比 */
}
```

### flex

`flex-grow`、`flex-shrink` 和 `flex-basis` 的简写属性。

```css
.item {
  flex: 0 1 auto;    /* 默认值 */
  flex: 1;           /* 等同于 flex: 1 1 0% */
  flex: 1 1 auto;    /* 可放大可缩小，基于内容 */
  flex: 0 0 200px;   /* 固定大小，不放大不缩小 */
  flex: 2 1 0%;      /* 放大2倍，可缩小，基于flex-grow分配 */
}
```

### align-self

定义单个项目的对齐方式，覆盖容器的 `align-items`。

```css
.item {
  align-self: auto;      /* 默认值：继承父容器 */
  align-self: flex-start; /* 起点对齐 */
  align-self: flex-end;   /* 终点对齐 */
  align-self: center;     /* 居中对齐 */
  align-self: baseline;   /* 基线对齐 */
  align-self: stretch;    /* 拉伸填充 */
}
```

## 常用布局示例

### 1. 水平居中布局

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

### 2. 导航栏布局

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}
```

### 3. 卡片网格布局

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* 最小300px，可放大可缩小 */
}
```

### 4. 侧边栏布局

```css
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  flex: 0 0 250px; /* 固定宽度250px */
}

.main-content {
  flex: 1; /* 占据剩余空间 */
}
```

### 5. 等高列布局

```css
.equal-height {
  display: flex;
  align-items: stretch; /* 默认值，确保等高 */
}

.column {
  flex: 1;
}
```

### 6. 响应式布局

```css
.responsive-container {
  display: flex;
  flex-wrap: wrap;
}

.responsive-item {
  flex: 1 1 100%; /* 移动端：占满宽度 */
}

@media (min-width: 768px) {
  .responsive-item {
    flex: 1 1 50%; /* 平板：占50%宽度 */
  }
}

@media (min-width: 1024px) {
  .responsive-item {
    flex: 1 1 33.333%; /* 桌面：占33.333%宽度 */
  }
}
```

## 浏览器兼容性

### 现代浏览器支持
- Chrome 29+
- Firefox 28+
- Safari 9+
- Edge 12+
- IE 11（部分支持）

### 前缀支持
```css
.container {
  display: -webkit-flex;  /* Safari */
  display: -ms-flexbox;   /* IE10 */
  display: flex;          /* 标准语法 */
}
```

## 最佳实践

### 1. 选择合适的布局方式
- **Flexbox**：一维布局（行或列）
- **Grid**：二维布局（行和列）
- **传统布局**：简单静态布局

### 2. 使用语义化的类名
```css
.flex-container { /* 而不是 .flex */
  display: flex;
}

.flex-item { /* 而不是 .item */
  flex: 1;
}
```

### 3. 合理使用flex简写
```css
/* 推荐 */
.item {
  flex: 1; /* 简洁明了 */
}

/* 不推荐 */
.item {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

### 4. 注意性能
- 避免在大型列表中使用复杂的flex计算
- 使用 `will-change: flex` 优化动画性能

### 5. 移动端优化
```css
.mobile-optimized {
  display: flex;
  flex-direction: column; /* 移动端垂直排列 */
}

@media (min-width: 768px) {
  .mobile-optimized {
    flex-direction: row; /* 桌面端水平排列 */
  }
}
```

## 常见问题解决

### 1. 内容溢出
```css
.container {
  display: flex;
  min-width: 0; /* 防止子元素溢出 */
}

.item {
  flex: 1;
  min-width: 0; /* 允许内容收缩 */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 2. 等高问题
```css
.container {
  display: flex;
  align-items: stretch; /* 确保等高 */
}
```

### 3. 居中对齐
```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```


[在线可视化演示示例：https://demo.siqiongbiluo.love/flex.html](https://demo.siqiongbiluo.love/flex.html)

> 你可以通过上面的网址，在线体验和查看所有 CSS Flexbox 属性的可视化效果，非常适合学习和截图。

# CSS 盒模型详解

## 1. 什么是盒模型

盒模型（Box Model）是 CSS 布局的基础。每个 HTML 元素都被看作一个矩形盒子，盒子由以下几部分组成：

- **content**：内容区，显示文本或图片
- **padding**：内边距，内容与边框之间的空间
- **border**：边框，包裹内容和内边距
- **margin**：外边距，盒子与其他元素之间的距离

## 2. 结构示意图

```
+---------------------------+
|        margin             |
|  +---------------------+  |
|  |      border         |  |
|  |  +---------------+  |  |
|  |  |   padding     |  |  |
|  |  | +----------+  |  |  |
|  |  | | content  |  |  |  |
|  |  | +----------+  |  |  |
|  |  +---------------+  |  |
|  +---------------------+  |
+---------------------------+
```

## 3. box-sizing 属性

`box-sizing` 决定了元素的宽高计算方式：

- `content-box`（默认）：width/height 只包含内容区，不包括 padding 和 border
- `border-box`：width/height 包含内容区、padding 和 border

**示例：**

```css
.box1 {
  width: 200px;
  box-sizing: content-box; /* 只包含内容区 */
  padding: 20px;
  border: 5px solid #333;
}

.box2 {
  width: 200px;
  box-sizing: border-box; /* 包含内容区+内边距+边框 */
  padding: 20px;
  border: 5px solid #333;
}
```

## 4. 盒模型调试技巧

- 使用浏览器开发者工具（F12）查看和调试盒模型
- 使用 `outline` 辅助调试，不影响布局

```css
.box {
  outline: 1px dashed red;
}
```

## 5. 常见问题

- **为什么设置了200px宽度，实际比200px大？**  
  因为默认是 content-box，padding 和 border 会额外增加宽度。
- **如何让盒子宽度始终等于设置值？**  
  使用 `box-sizing: border-box;`。

## 6. 最佳实践

- 推荐全局设置 `box-sizing: border-box;`，更易于布局和维护：

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

---


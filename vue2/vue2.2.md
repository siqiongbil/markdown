# Vue2 学习笔记 - 第二篇：模板语法与指令系统

## 摘要

本文是Vue2学习笔记的第二篇，深入探讨Vue2的模板语法和指令系统。从内置指令的使用开始，详细介绍了Vue2的核心语法特性，包括条件渲染、列表渲染、事件绑定、修饰符等。通过丰富的指令示例和语法说明，帮助读者掌握Vue2的模板开发技巧，理解Vue2的指令系统设计理念，为构建交互丰富的Vue2应用提供全面的语法指导。

---

## 一、内置指令（核心语法）

Vue 2 提供一套内置指令，用于在模板中实现控制逻辑：

- `v-bind`: 绑定属性
- `v-model`: 双向数据绑定（表单）
- `v-on`: 绑定事件监听器
- `v-if`, `v-else-if`, `v-else`: 条件渲染
- `v-show`: 条件显示（通过 CSS 控制 display）
- `v-for`: 列表渲染
- `v-pre`: 跳过编译
- `v-cloak`: 防止闪烁（用于 CSS）
- `v-once`: 只渲染一次

## 二、指令语法说明

简写形式：

- `v-bind:href` 可简写为 `:href`
- `v-on:click` 可简写为 `@click`

## 三、事件绑定与修饰符

事件处理函数通过 `methods` 提供，支持以下修饰符：

- `.stop`: 阻止事件冒泡
- `.prevent`: 阻止默认行为
- `.capture`: 使用捕获模式
- `.once`: 事件只触发一次
- `.self`: 只在自身元素上触发
- `.native`: 用于子组件绑定原生事件

示例（结构）：

```js
methods: {
  submitForm(e) {
    e.preventDefault();
    // 处理逻辑
  }
}
```

## 四、键盘/鼠标事件修饰符

Vue 允许在事件上使用键名或修饰：

- `@keyup.enter`：按下 Enter 键触发
- `@keydown.esc`：按下 Esc 键触发
- `@click.right`：右键点击

## 五、动态参数

`v-bind:[attr]` 和 `v-on:[event]` 允许绑定动态属性或事件名：

```js
data: {
  attrName: 'href',
  eventName: 'click'
}
```

---


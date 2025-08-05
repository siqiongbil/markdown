# Vue2 学习笔记 - 第三篇：组件系统与通信机制

## 摘要

本文是Vue2学习笔记的第三篇，专注于Vue2的组件系统和通信机制。从组件基础概念开始，详细介绍了组件的注册方式、组件通信方法、插槽机制、生命周期等核心特性。通过组件注册、父子通信、插槽使用的具体示例，帮助读者掌握Vue2的组件开发技巧，理解组件化开发的设计思想，为构建可复用、可维护的Vue2应用提供全面的组件开发指导。

---

## 一、组件基础

Vue 组件是可复用的 Vue 实例，拥有独立作用域。组件必须通过 `Vue.component()` 注册或在父组件中使用 `components` 局部注册。

### 全局注册

```js
Vue.component('my-component', {
  data() {
    return {
      msg: 'Hello'
    };
  },
  methods: {
    greet() {
      console.log(this.msg);
    }
  },
  template: '<div>{{ msg }}</div>'  // 字符串模板，实际开发建议使用 .vue 文件
});
```

### 局部注册

```js
const Child = {
  data() {
    return { count: 0 };
  },
  template: '<span>{{ count }}</span>'
};

new Vue({
  components: {
    'child-component': Child
  }
});
```

---

## 二、组件通信

### 父 → 子：props

```js
props: ['title']
```

- 父组件传递属性，子组件声明接收

### 子 → 父：$emit

```js
this.$emit('eventName', data);
```

- 子组件使用 `$emit` 触发事件，父组件监听

---

## 三、插槽机制（Slot）

Vue 2 提供 `<slot>` 标签用于父组件向子组件插入内容。

### 默认插槽

```html
<slot></slot>
```

### 具名插槽

```html
<slot name="header"></slot>
```

---

## 四、组件生命周期（与实例类似）

组件的生命周期钩子与 Vue 实例一致，如：

- `created`
- `mounted`
- `updated`
- `destroyed`

可以在这些钩子中处理数据、发送请求或清理资源。

---

## 五、注意事项

- `data` 在组件中必须是函数，返回对象。
- 子组件不能直接修改父组件传入的 prop，需使用事件或 Vuex 等中间机制。

---

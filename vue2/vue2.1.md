# Vue2 学习笔记 - 第一篇：基础概念与响应式原理

## 摘要

本文是Vue2学习笔记的第一篇，全面介绍Vue2的基础概念和核心原理。从Vue构造函数的使用开始，深入讲解了Vue2的响应式原理、常用选项结构、生命周期钩子等核心概念。通过丰富的代码示例和详细说明，帮助读者理解Vue2的响应式系统工作原理，掌握Vue2的基础开发模式，为后续学习Vue2的高级特性打下坚实基础。

---

## 一、Vue 构造函数基础

Vue 构造函数用于创建响应式实例：

```js
const vm = new Vue({
  el: '#app',
  data: {
    msg: 'Hello Vue!'
  },
  methods: {
    greet() {
      console.log(this.msg);
    }
  }
});
```

说明：
- `el`: 绑定目标 DOM 元素（选择器字符串）
- `data`: 状态对象
- `methods`: 方法定义，`this` 指向 Vue 实例

---

## 二、响应式原理概念

Vue 2 基于 `Object.defineProperty` 对数据做劫持：

```js
Object.defineProperty(obj, 'key', {
  get() {
    // 依赖收集
    return value;
  },
  set(newVal) {
    // 派发更新
    value = newVal;
  }
});
```

Vue 会递归地对 `data` 中所有对象属性进行代理。

---

## 三、常用选项结构

```js
new Vue({
  el,
  data,
  methods,
  computed,
  watch,
  created,
  mounted,
  updated,
  destroyed
});
```

- `computed`: 计算属性，具有缓存
- `watch`: 侦听器，监听 `data` 或 `computed` 的变化

---

## 四、生命周期钩子概览

按顺序执行：

1. beforeCreate
2. created
3. beforeMount
4. mounted
5. beforeUpdate
6. updated
7. beforeDestroy
8. destroyed

---

## 五、示例：带计算属性和侦听器

```js
new Vue({
  data: {
    msg: 'abc'
  },
  computed: {
    reversed() {
      return this.msg.split('').reverse().join('');
    }
  },
  watch: {
    msg(newVal, oldVal) {
      console.log('changed:', oldVal, '→', newVal);
    }
  }
});
```

---

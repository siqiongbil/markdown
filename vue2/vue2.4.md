# Vue2 学习笔记 - 第四篇：路由管理与应用架构

## 摘要

本文是Vue2学习笔记的第四篇，深入探讨Vue2的路由管理和应用架构。从Vue Router的基础概念开始，详细介绍了路由配置、动态路由、嵌套路由、导航方式、路由守卫等核心功能。通过完整的路由配置示例和最佳实践，帮助读者掌握Vue2的单页面应用开发技巧，理解现代前端应用的路由管理机制，为构建复杂的企业级Vue2应用提供全面的架构指导。

---

## 一、Vue Router 简介

Vue Router 是 Vue.js 的官方路由管理器，用于构建单页面应用（SPA）。支持：

- 嵌套路由
- 动态路由匹配
- 编程式导航
- 命名路由和命名视图
- 路由守卫

---

## 二、基本使用

### 安装

```bash
npm install vue-router@3
```

### 路由配置结构

```js
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
```

---

## 三、动态路由参数

```js
{
  path: '/user/:id',
  component: User
}
```

可通过 `this.$route.params.id` 获取动态参数。

---

## 四、嵌套路由

```js
{
  path: '/parent',
  component: Parent,
  children: [
    {
      path: 'child',
      component: Child
    }
  ]
}
```

---

## 五、导航方式

### 声明式

```html
<router-link to="/about">About</router-link>
```

### 编程式

```js
this.$router.push('/about');
```

支持 `push`, `replace`, `go`, `back`, `forward`。

---

## 六、路由守卫

### 全局守卫

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 验证逻辑
  } else {
    next();
  }
});
```

### 组件内守卫

```js
beforeRouteEnter(to, from, next) {
  next(vm => {
    // 可访问组件实例
  });
}
```

---

## 七、命名路由

```js
{ path: '/user/:id', name: 'user', component: User }
```

使用时：

```js
this.$router.push({ name: 'user', params: { id: 123 } });
```

---

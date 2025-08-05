# Vite 学习笔记 - 第一篇：快速开始

## 摘要

本文是Vite学习笔记的第一篇，全面介绍Vite的基础知识和快速上手方法。从Vite的概念和特点开始，详细讲解了Node.js环境准备、项目创建、依赖安装、开发服务器启动等基础操作。通过清晰的项目结构说明和操作步骤，帮助读者快速搭建Vite开发环境，为后续深入学习Vite的配置和优化打下坚实基础。

---

## 什么是 Vite？

Vite 是一个现代前端构建工具，支持极速启动和模块热更新，适用于 Vue、React 等现代框架。

## 1. 安装 Node.js

推荐版本：Node.js 16 及以上。

检查版本命令：

    node -v
    npm -v

如果未安装，请访问：https://nodejs.org

## 2. 创建 Vite 项目

在终端执行：

    npm create vite@latest

交互式选择：

- 输入项目名，例如：my-vite-app
- 选择框架：Vue / React / Vanilla
- 选择语言：JavaScript / TypeScript

## 3. 安装依赖

进入项目目录并运行：

    cd my-vite-app
    npm install

## 4. 启动开发服务器

启动项目：

    npm run dev

终端会显示本地访问地址：

    ➜  Local:   http://localhost:5173/

在浏览器中打开即可查看。

## 5. 项目结构说明

项目目录结构如下：

    my-vite-app/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.js
        └── App.vue

## 6. 下一步

- 修改 src/App.vue 测试热更新
- 尝试引入组件库（如 Element Plus）
- 阅读官方文档了解配置项和插件系统


# Vite 学习笔记 - 第三篇：构建与部署

## 摘要

本文是Vite学习笔记的第三篇，专注于Vite的构建和部署流程。从项目构建命令开始，详细讲解了构建结果预览、构建目录结构、自定义构建输出路径等核心概念。同时涵盖了多种部署方式，包括静态服务器部署、云平台部署等，并提供了常见部署问题的解决方案。通过完整的构建部署流程，帮助读者掌握Vite项目的生产环境部署技巧，为项目上线提供全面指导。

---

## 1. 项目构建

开发完成后，可以使用 Vite 内置的构建命令打包项目：

```bash
npm run build
```

构建完成后，Vite 会生成一个 `dist` 文件夹，里面包含可部署的静态文件。

---

## 2. 预览构建结果（本地）

可以用 Vite 提供的预览命令在本地启动构建后的静态服务器：

```bash
npm run preview
```

默认访问地址为：

```
http://localhost:4173/
```

---

## 3. 构建目录说明

构建后的 `dist/` 目录通常包含以下内容：

```
dist/
├── index.html          # 入口 HTML
├── assets/             # 所有静态资源（JS、CSS、图片等）
│   ├── index-xxxx.js
│   ├── style-xxxx.css
```

文件名中带有 hash 值，方便浏览器缓存控制。

---

## 4. 自定义构建输出路径

可以在 `vite.config.js` 中通过 `build.outDir` 设置构建目录：

```js
export default defineConfig({
  build: {
    outDir: 'build'
  }
})
```

---

## 5. 部署到服务器（静态资源部署）

Vite 构建输出的是纯静态文件，可部署到任意静态服务器：

### 常见部署方式：

- nginx / Apache
- Netlify / Vercel
- GitHub Pages
- 腾讯云 / 阿里云 OSS
- 自建 Node.js 静态服务器

### 示例：使用 nginx 部署

1. 将 dist/ 拷贝至服务器指定目录
2. 配置 nginx.conf：

```nginx
server {
  listen 80;
  server_name example.com;
  root /path/to/dist;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 6. 部署常见问题

- **白屏问题**：检查是否正确设置了 `base`，默认为 `'/'`，子目录部署时需设置：

```js
export default defineConfig({
  base: '/子目录名/',
})
```

- **刷新 404 问题**：对于 SPA 项目，服务器需要设置 fallback 到 `index.html`，如上 nginx 示例中的 `try_files`。

---

## 小结

- `npm run build` 用于生产环境构建
- `dist/` 目录即为部署内容
- 可部署到任意静态服务器
- 子路径部署需配置 `base` 选项

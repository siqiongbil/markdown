# 📸 使用 HTML5 在网页中调用摄像头并拍照（含 Base64 转换）

本文将介绍如何使用 JavaScript + HTML5 的 `getUserMedia()` 接口调用摄像头进行拍照，并将拍下的图片转换为 Base64 字符串进行处理。还将讲解不同浏览器中如何开启摄像头权限以及常见的访问错误处理方法。

---

## 🚀 项目效果演示

点击按钮即可打开摄像头、拍照并在下方预览图片（同时生成 Base64 字符串）。
[DEMO](https://demo.siqiongbiluo.love)

---

## 💻 示例代码（HTML + JavaScript）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>摄像头拍照并转Base64</title>
  <style>
    video, canvas, img {
      display: block;
      margin: 10px auto;
      max-width: 100%;
    }
    button {
      display: block;
      margin: 10px auto;
      padding: 8px 16px;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <h2 style="text-align: center;">📷 调用摄像头拍照并转为 Base64</h2>

  <video id="video" autoplay playsinline width="320" height="240"></video>
  <button id="snap">📸 拍照</button>
  <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
  <img id="photo" alt="拍摄照片">
  <textarea id="base64" rows="6" style="width: 90%; display: block; margin: 10px auto;" placeholder="Base64 输出..."></textarea>

  <script>
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snap = document.getElementById('snap');
    const photo = document.getElementById('photo');
    const base64Output = document.getElementById('base64');

    // 访问摄像头
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
      } catch (error) {
        alert('🚫 无法访问摄像头：' + error.message);
        console.error('摄像头错误：', error);
      }
    }

    // 拍照并转换为 Base64
    snap.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataURL = canvas.toDataURL('image/png');
      photo.src = dataURL;
      base64Output.value = dataURL;
    });

    initCamera();
  </script>
</body>
</html>
```

---

## 🔍 功能说明

1. 网页加载后调用 `getUserMedia()` 请求摄像头权限；
2. 将摄像头视频流展示在 `<video>` 元素中；
3. 用户点击“拍照”按钮后，将当前视频帧绘制到 `<canvas>` 上；
4. 使用 `canvas.toDataURL()` 将图像转为 base64 编码的 PNG 字符串；
5. 显示预览图片和 base64 文本框输出。

---

## 🔐 不同浏览器中开启摄像头权限的方法

为了正常访问摄像头，用户必须**授权摄像头访问权限**。以下是不同浏览器中开启权限的方法：

### 🌐 Chrome 浏览器

- 首次访问网页时，会弹出摄像头权限提示框；
- 若不小心点击了“禁止”，请按以下方式处理：
  1. 点击地址栏左侧的🔒图标；
  2. 找到 **摄像头**，设为 “允许”；
  3. 刷新页面。

🛠️ 若摄像头无法访问，可手动放行当前网页地址：

> `chrome://settings/content/camera`  
> 搜索你的网址（如 `localhost` 或你的网站），将其设置为“允许”。

---

### 🦊 Firefox 浏览器

- 首次访问页面时，浏览器会弹出权限提示，点击“允许”；
- 若拒绝了访问，可以点击🔒图标修改权限，或进入设置页面：

> `about:preferences#privacy` → 权限 → 设置 → 摄像头

---

### 🧭 Safari 浏览器（macOS）

- 允许使用摄像头需 macOS 10.14+ 且 Safari 12+；
- 若未自动弹出权限提示，请前往：

> Safari → 偏好设置 → 网站 → 摄像头 → 设置为“允许”

📱 在 iOS 上需手动授权：
> 设置 → Safari → 相机 → 设置为“允许访问”

---

### 🖥 Microsoft Edge

- 和 Chrome 类似，首次访问时会弹出提示；
- 若误点“阻止”，点击地址栏左侧的图标进行修改；
- 或前往设置页面：

> `edge://settings/content/camera` 手动放行你的地址

---

## ❗ 常见错误与提示

在调用摄像头时，有些环境下可能遇到以下问题：

| 错误信息                           | 原因说明                                     | 解决办法 |
|------------------------------------|----------------------------------------------|----------|
| `Permission denied`                | 用户拒绝了权限或未授权摄像头                 | 手动开启权限，刷新页面重试 |
| `getUserMedia is not a function`  | 使用了不支持的浏览器                         | 使用现代浏览器如 Chrome 95+ |
| `NotAllowedError: Permission denied` | 站点未启用 HTTPS 或非本地测试环境             | 使用 `https://` 或 `localhost` 测试 |
| 空白画面 / 摄像头无响应             | 浏览器插件、杀毒软件或系统权限拦截摄像头     | 检查杀毒软件和系统摄像头权限设置 |

---

## 📌 小结

- 使用 HTML5 + JavaScript 可以方便地接入摄像头实现拍照；
- 必须在 HTTPS 或 localhost 环境中使用；
- 不同浏览器授权逻辑略有不同，需提示用户正确放行地址；
- 拍照后可使用 Base64 数据上传到服务器或进行图像处理。

---

你可以将这段代码部署到任何支持 HTTPS 的 Web 服务器上测试，例如：

- 本地开发时使用 `localhost`
- 使用 [GitHub Pages](https://pages.github.com)
- 使用 Vercel / Netlify 等免费部署平台

如需进一步将照片上传到后台保存为文件或存入数据库，可结合服务端语言（如 Node.js、PHP、Python）进行扩展。

Happy Coding! 😄

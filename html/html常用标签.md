# HTML 常用标签及示例

## 1. 文本标签

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<p>这是一个段落。</p>
<strong>加粗文字</strong>
<em>斜体文字</em>
<br> 换行
<hr> 分割线
```

## 2. 链接和图片

```html
<a href="https://example.com">点击访问</a>

<img src="https://example.com/image.jpg" alt="示例图片" width="200">
```

## 3. 列表

```html
<!-- 无序列表 -->
<ul>
  <li>苹果</li>
  <li>香蕉</li>
</ul>

<!-- 有序列表 -->
<ol>
  <li>第一步</li>
  <li>第二步</li>
</ol>
```

## 4. 表格

```html
<table border="1">
  <tr>
    <th>姓名</th>
    <th>年龄</th>
  </tr>
  <tr>
    <td>张三</td>
    <td>25</td>
  </tr>
</table>
```

## 5. 表单

```html
<form action="/submit" method="post">
  姓名：<input type="text" name="name"><br>
  密码：<input type="password" name="password"><br>
  <input type="submit" value="提交">
</form>
```

## 6. 布局标签

```html
<div>块级元素（常用于布局）</div>
<span>行内元素（常用于文本）</span>
```

## 7. 媒体标签

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg">
</audio>

<video controls width="300">
  <source src="movie.mp4" type="video/mp4">
</video>
```

## 8. 语义标签（HTML5）

```html
<header>头部</header>
<nav>导航</nav>
<main>主要内容</main>
<article>文章内容</article>
<footer>页脚</footer>
```

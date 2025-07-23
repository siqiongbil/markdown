# Vue3 学习笔记 1

## 目录
- [Vue3 简介](#vue3-简介)
- [安装与环境配置](#安装与环境配置)
- [创建Vue应用](#创建vue应用)
- [组合式API (Composition API)](#组合式api-composition-api)
- [响应式系统](#响应式系统)
- [模板语法](#模板语法)
- [事件处理](#事件处理)
- [计算属性与侦听器](#计算属性与侦听器)

## Vue3 简介

Vue3 是 Vue.js 的第三个主要版本，于2020年9月发布。相比Vue2，Vue3带来了许多重要改进：

### 主要特性
- **更好的性能**: 重写了虚拟DOM，编译时优化，更快的渲染
- **更小的包体积**: 支持tree-shaking，按需打包
- **更好的TypeScript支持**: 从头开始使用TypeScript重写
- **组合式API**: 更灵活的代码组织方式
- **多个根节点**: Fragment支持
- **新的内置组件**: Teleport、Suspense等

### Vue3 vs Vue2
| 特性 | Vue2 | Vue3 |
|------|------|------|
| 入口API | `new Vue()` | `createApp()` |
| 组件API | 选项式API | 组合式API + 选项式API |
| 多根节点 | ❌ | ✅ |
| TypeScript | 有限支持 | 完全支持 |
| 包大小 | ~34KB | ~10KB (tree-shaking) |

## 安装与环境配置

### 使用 Vite 创建项目 (推荐)
```bash
# npm
npm create vue@latest my-vue-project

# yarn
yarn create vue my-vue-project

# pnpm
pnpm create vue my-vue-project
```

### 通过CDN使用
```html
<script src="https://unpkg.com/vue@next"></script>
```

### 项目结构
```
my-vue-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
└── vite.config.js
```

## 创建Vue应用

### 基本应用结构
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

### 应用配置
```javascript
const app = createApp(App)

// 全局属性
app.config.globalProperties.$myGlobalMethod = () => {
  // 方法逻辑
}

// 全局组件
app.component('MyComponent', MyComponent)

// 插件
app.use(router)
app.use(store)

app.mount('#app')
```

## 组合式API (Composition API)

组合式API是Vue3最重要的新特性，提供了更灵活的代码组织方式。

### setup() 函数
```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    // 响应式数据
    const count = ref(0)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 返回模板需要的数据和方法
    return {
      count,
      increment
    }
  }
}
</script>
```

### &lt;script setup&gt; 语法糖
```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 直接声明响应式数据
const count = ref(0)

// 直接声明方法
const increment = () => {
  count.value++
}
</script>
```

## 响应式系统

### ref() - 基础响应式
```javascript
import { ref } from 'vue'

// 基本类型响应式
const count = ref(0)
const message = ref('Hello')

// 访问值需要使用 .value
console.log(count.value) // 0
count.value++ // 修改值
```

### reactive() - 对象响应式
```javascript
import { reactive } from 'vue'

// 对象响应式
const state = reactive({
  count: 0,
  name: 'Vue3',
  nested: {
    value: 'deep'
  }
})

// 直接访问属性
console.log(state.count) // 0
state.count++ // 修改值
```

### ref vs reactive
| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 + 对象 | 仅对象 |
| 访问方式 | `.value` | 直接访问 |
| 解构 | 失去响应性 | 失去响应性 |
| 模板中 | 自动解包 | 直接使用 |

### toRef() 和 toRefs()
```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2
})

// 转换单个属性为ref
const fooRef = toRef(state, 'foo')

// 转换所有属性为ref
const stateAsRefs = toRefs(state)
const { foo, bar } = stateAsRefs // 解构不会失去响应性
```

## 模板语法

### 文本插值
```vue
<template>
  <!-- 基本插值 -->
  <p>{{ message }}</p>
  
  <!-- JavaScript表达式 -->
  <p>{{ number + 1 }}</p>
  <p>{{ ok ? 'YES' : 'NO' }}</p>
  <p>{{ message.split('').reverse().join('') }}</p>
</template>
```

### 指令
```vue
<template>
  <!-- v-bind 属性绑定 -->
  <div v-bind:id="dynamicId"></div>
  <div :id="dynamicId"></div> <!-- 简写 -->
  
  <!-- v-if 条件渲染 -->
  <p v-if="seen">现在你看到我了</p>
  
  <!-- v-for 列表渲染 -->
  <li v-for="item in items" :key="item.id">
    {{ item.text }}
  </li>
  
  <!-- v-on 事件监听 -->
  <button v-on:click="doSomething">点击</button>
  <button @click="doSomething">点击</button> <!-- 简写 -->
</template>
```

### 双向绑定
```vue
<template>
  <!-- 表单输入绑定 -->
  <input v-model="message" />
  <textarea v-model="text"></textarea>
  
  <!-- 复选框 -->
  <input type="checkbox" v-model="checked" />
  
  <!-- 单选框 -->
  <input type="radio" v-model="picked" value="a" />
  <input type="radio" v-model="picked" value="b" />
  
  <!-- 选择框 -->
  <select v-model="selected">
    <option disabled value="">请选择</option>
    <option>A</option>
    <option>B</option>
  </select>
</template>
```

## 事件处理

### 基本事件处理
```vue
<template>
  <!-- 内联处理器 -->
  <button @click="count++">增加 1</button>
  
  <!-- 方法处理器 -->
  <button @click="greet">问候</button>
  
  <!-- 内联调用方法 -->
  <button @click="say('hello')">Say hello</button>
  <button @click="say('bye')">Say bye</button>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)

const greet = (event) => {
  alert('Hello!')
  console.log(event.target.tagName)
}

const say = (message) => {
  alert(message)
}
</script>
```

### 事件修饰符
```vue
<template>
  <!-- 阻止默认行为 -->
  <form @submit.prevent="onSubmit"></form>
  
  <!-- 阻止事件冒泡 -->
  <div @click.stop="doThis"></div>
  
  <!-- 修饰符可以串联 -->
  <a @click.stop.prevent="doThat"></a>
  
  <!-- 只有修饰符 -->
  <form @submit.prevent></form>
  
  <!-- 添加事件监听器时使用事件捕获模式 -->
  <div @click.capture="doThis">...</div>
  
  <!-- 只触发一次 -->
  <button @click.once="doThis">Click me</button>
</template>
```

### 按键修饰符
```vue
<template>
  <!-- 只有在 key 是 Enter 时调用 -->
  <input @keyup.enter="submit" />
  
  <!-- Alt + Enter -->
  <input @keyup.alt.enter="clear" />
  
  <!-- Ctrl + Click -->
  <div @click.ctrl="doSomething">Do something</div>
</template>
```

## 计算属性与侦听器

### computed() 计算属性
```vue
<template>
  <div>
    <p>原始消息: {{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
    <p>作者: {{ author.name }}</p>
    <p>已发布的书籍:</p>
    <span>{{ publishedBooksMessage }}</span>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

const message = ref('Hello')
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 只读计算属性
const reversedMessage = computed(() => {
  return message.value.split('').reverse().join('')
})

// 可写计算属性
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>
```

### watch() 侦听器
```vue
<script setup>
import { ref, watch, reactive } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 侦听单个ref
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      answer.value = (await res.json()).answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})

// 侦听多个源
const x = ref(0)
const y = ref(0)

watch([x, y], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})

// 侦听reactive对象
const obj = reactive({ count: 0 })

watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)

// 深度侦听
watch(
  obj,
  (newValue, oldValue) => {
    // 在嵌套的属性变更时触发
  },
  { deep: true }
)

// 立即执行
watch(
  question,
  (newQuestion) => {
    // 立即执行一次，然后在question改变时再次执行
  },
  { immediate: true }
)
</script>
```

### watchEffect()
```javascript
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

watchEffect(async () => {
  // 自动跟踪依赖
  const response = await fetch(`/api/todos/${todoId.value}`)
  data.value = await response.json()
})

// 停止侦听
const stop = watchEffect(() => {
  // 副作用
})

// 当不再需要时停止侦听器
stop()
```

---

## 总结

这是Vue3学习笔记的第一部分，涵盖了：
- Vue3的基本概念和特性
- 组合式API的使用
- 响应式系统
- 模板语法和指令
- 事件处理
- 计算属性和侦听器

在下一部分笔记中，我们将学习：
- 组件基础和组件通信
- 生命周期钩子
- 组件插槽
- 状态管理
- 路由等高级主题

继续学习，掌握Vue3的强大功能！ 
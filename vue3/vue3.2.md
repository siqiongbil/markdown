 # Vue3 学习笔记 - 第二篇：组件与高级特性

## 摘要

本文是Vue3学习笔记的第二篇，深入探讨Vue3的组件系统和高级特性。从组件基础开始，详细介绍了组件注册、组件通信、生命周期钩子、插槽系统等核心概念。同时涵盖了状态管理、Vue Router 4路由管理、组合式函数等高级主题。通过实际的项目示例和最佳实践，帮助读者掌握Vue3的组件开发技巧和架构设计思路，为构建复杂应用奠定基础。

---

## 组件基础

### 组件注册

#### 全局组件
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './components/MyComponent.vue'

const app = createApp(App)

// 全局注册组件
app.component('my-component', MyComponent)

app.mount('#app')
```

#### 局部组件
```vue
<template>
  <div>
    <my-component />
    <child-component />
  </div>
</template>

<script setup>
import MyComponent from './MyComponent.vue'
import ChildComponent from './ChildComponent.vue'
</script>
```

### 组件通信

#### Props 父传子
```vue
<!-- Parent.vue -->
<template>
  <div>
    <child-component 
      :title="title" 
      :count="count"
      :user="user"
      @update-count="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ChildComponent from './ChildComponent.vue'

const title = ref('Hello Vue3')
const count = ref(0)
const user = reactive({
  name: 'John',
  age: 30
})

const handleUpdate = (newCount) => {
  count.value = newCount
}
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <p>User: {{ user.name }} ({{ user.age }})</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
// 定义props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  user: {
    type: Object,
    required: true
  }
})

// 定义emits
const emit = defineEmits(['update-count'])

const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

#### Emits 子传父
```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <input v-model="inputValue" @input="handleInput" />
    <button @click="submit">提交</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputValue = ref('')

// 定义事件
const emit = defineEmits({
  // 验证事件
  submit: (value) => {
    if (value && value.length > 0) {
      return true
    }
    return false
  },
  // 简单事件
  input: null
})

const handleInput = () => {
  emit('input', inputValue.value)
}

const submit = () => {
  emit('submit', inputValue.value)
}
</script>
```

#### 使用 v-model
```vue
<!-- Parent.vue -->
<template>
  <div>
    <custom-input v-model="searchText" />
    <p>搜索内容: {{ searchText }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'

const searchText = ref('')
</script>
```

```vue
<!-- CustomInput.vue -->
<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
```

### 生命周期钩子

```vue
<template>
  <div>
    <h2>{{ title }}</h2>
    <button @click="updateTitle">更新标题</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onBeforeMount } from 'vue'

const title = ref('Vue3 生命周期')

// 组件挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 组件挂载后
onMounted(() => {
  console.log('组件已挂载')
  // 可以访问DOM元素
  document.title = title.value
})

// 组件更新后
onUpdated(() => {
  console.log('组件已更新')
})

// 组件卸载前
onUnmounted(() => {
  console.log('组件即将卸载')
  // 清理工作
  document.title = 'Vue App'
})

const updateTitle = () => {
  title.value = '标题已更新'
}
</script>
```

### 完整的生命周期

```javascript
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onActivated,
  onDeactivated
} from 'vue'

// 组件挂载前
onBeforeMount(() => {
  console.log('beforeMount')
})

// 组件挂载后
onMounted(() => {
  console.log('mounted')
})

// 组件更新前
onBeforeUpdate(() => {
  console.log('beforeUpdate')
})

// 组件更新后
onUpdated(() => {
  console.log('updated')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('beforeUnmount')
})

// 组件卸载后
onUnmounted(() => {
  console.log('unmounted')
})

// 错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('Error captured:', err)
  return false // 阻止错误继续传播
})

// keep-alive 激活
onActivated(() => {
  console.log('activated')
})

// keep-alive 停用
onDeactivated(() => {
  console.log('deactivated')
})
```

## 插槽 (Slots)

### 默认插槽
```vue
<!-- Parent.vue -->
<template>
  <div>
    <child-component>
      <p>这是默认插槽的内容</p>
    </child-component>
  </div>
</template>

<script setup>
import ChildComponent from './ChildComponent.vue'
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="child">
    <h3>子组件标题</h3>
    <!-- 默认插槽 -->
    <slot>
      <!-- 默认内容 -->
      <p>如果没有提供内容，显示这个默认内容</p>
    </slot>
  </div>
</template>
```

### 具名插槽
```vue
<!-- Parent.vue -->
<template>
  <div>
    <base-layout>
      <template #header>
        <h1>页面标题</h1>
      </template>
      
      <template #default>
        <p>主要内容</p>
      </template>
      
      <template #footer>
        <p>页脚信息</p>
      </template>
    </base-layout>
  </div>
</template>

<script setup>
import BaseLayout from './BaseLayout.vue'
</script>
```

```vue
<!-- BaseLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    
    <main>
      <slot></slot>
    </main>
    
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

### 作用域插槽
```vue
<!-- Parent.vue -->
<template>
  <div>
    <todo-list :todos="todos">
      <template #default="{ todo, index }">
        <span :style="{ color: todo.completed ? 'green' : 'red' }">
          {{ todo.text }}
        </span>
      </template>
    </todo-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TodoList from './TodoList.vue'

const todos = ref([
  { id: 1, text: '学习Vue3', completed: true },
  { id: 2, text: '写代码', completed: false },
  { id: 3, text: '睡觉', completed: false }
])
</script>
```

```vue
<!-- TodoList.vue -->
<template>
  <ul>
    <li v-for="(todo, index) in todos" :key="todo.id">
      <slot :todo="todo" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps(['todos'])
</script>
```

## 状态管理

### 使用 reactive 进行简单状态管理
```javascript
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  user: {
    name: '',
    email: ''
  },
  increment() {
    this.count++
  },
  setUser(user) {
    this.user = user
  }
})
```

```vue
<!-- ComponentA.vue -->
<template>
  <div>
    <h2>组件A</h2>
    <p>Count: {{ store.count }}</p>
    <button @click="store.increment">增加</button>
  </div>
</template>

<script setup>
import { store } from './store.js'
</script>
```

```vue
<!-- ComponentB.vue -->
<template>
  <div>
    <h2>组件B</h2>
    <p>Count: {{ store.count }}</p>
    <p>User: {{ store.user.name }}</p>
  </div>
</template>

<script setup>
import { store } from './store.js'
</script>
```

### 使用 provide/inject
```vue
<!-- App.vue -->
<template>
  <div>
    <h1>Vue3 应用</h1>
    <parent-component />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import ParentComponent from './ParentComponent.vue'

const theme = ref('dark')
const user = ref({
  name: 'John',
  age: 30
})

// 提供数据给后代组件
provide('theme', theme)
provide('user', user)
provide('updateTheme', (newTheme) => {
  theme.value = newTheme
})
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>子组件</h3>
    <p>主题: {{ theme }}</p>
    <p>用户: {{ user.name }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入数据
const theme = inject('theme')
const user = inject('user')
const updateTheme = inject('updateTheme')

const toggleTheme = () => {
  updateTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>
```

## 路由 (Vue Router 4)

### 基本路由配置
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import User from '../views/User.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User,
    props: true
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'), // 懒加载
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
```

### 在组件中使用路由
```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link> |
      <router-link to="/about">关于</router-link> |
      <router-link to="/user/123">用户</router-link>
    </nav>
    
    <router-view />
  </div>
</template>
```

```vue
<!-- Home.vue -->
<template>
  <div>
    <h1>首页</h1>
    <p>欢迎来到Vue3应用</p>
  </div>
</template>
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h1>用户页面</h1>
    <p>用户ID: {{ $route.params.id }}</p>
    <p>用户ID (props): {{ id }}</p>
  </div>
</template>

<script setup>
defineProps(['id'])
</script>
```

### 编程式导航
```vue
<template>
  <div>
    <button @click="goHome">回到首页</button>
    <button @click="goToUser">查看用户</button>
    <button @click="goBack">返回</button>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const goHome = () => {
  router.push('/')
}

const goToUser = () => {
  router.push({
    name: 'User',
    params: { id: 123 }
  })
}

const goBack = () => {
  router.go(-1)
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    console.log('路由变化:', newPath)
  }
)
</script>
```

## 组合式函数 (Composables)

### 创建自定义组合式函数
```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}
```

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)
  
  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  })
  
  return value
}
```

```javascript
// composables/useFetch.js
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)
  
  const fetchData = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchData)
  
  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}
```

### 使用组合式函数
```vue
<template>
  <div>
    <h2>计数器</h2>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="reset">重置</button>
    
    <h2>本地存储</h2>
    <input v-model="username" placeholder="输入用户名" />
    <p>保存的用户名: {{ username }}</p>
    
    <h2>数据获取</h2>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <div v-else>
      <pre>{{ data }}</pre>
      <button @click="refetch">重新获取</button>
    </div>
  </div>
</template>

<script setup>
import { useCounter } from './composables/useCounter'
import { useLocalStorage } from './composables/useLocalStorage'
import { useFetch } from './composables/useFetch'

// 使用计数器组合式函数
const { count, doubleCount, increment, decrement, reset } = useCounter(10)

// 使用本地存储组合式函数
const username = useLocalStorage('username', '')

// 使用数据获取组合式函数
const { data, error, loading, refetch } = useFetch('https://api.example.com/data')
</script>
```

## 性能优化

### 异步组件
```vue
<template>
  <div>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <div>加载中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
</script>
```

### 虚拟滚动
```vue
<template>
  <div>
    <VirtualList 
      :items="items" 
      :item-height="50"
      :container-height="400"
    >
      <template #default="{ item }">
        <div class="item">
          {{ item.name }}
        </div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VirtualList from './VirtualList.vue'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))
</script>
```

### 内存泄漏防护
```vue
<script setup>
import { onUnmounted } from 'vue'

let timer = null

// 设置定时器
const startTimer = () => {
  timer = setInterval(() => {
    console.log('Timer tick')
  }, 1000)
}

// 组件卸载时清理
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
```

## 错误处理

### 全局错误处理
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
  // 可以发送错误到监控服务
}

app.mount('#app')
```

### 错误边界组件
```vue
<!-- ErrorBoundary.vue -->
<template>
  <div v-if="error">
    <h2>出错了！</h2>
    <p>{{ error.message }}</p>
    <button @click="resetError">重试</button>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  return false // 阻止错误继续传播
})

const resetError = () => {
  error.value = null
}
</script>
```

## 总结

这是Vue3学习笔记的第二部分，涵盖了：
- 组件基础和组件通信
- 生命周期钩子
- 插槽的使用
- 状态管理方案
- Vue Router 4 路由管理
- 组合式函数 (Composables)
- 性能优化技巧
- 错误处理

Vue3提供了强大的组合式API和现代化的开发体验，通过这些特性可以构建出高性能、可维护的应用程序。

继续深入学习Vue3，探索更多高级特性和最佳实践！
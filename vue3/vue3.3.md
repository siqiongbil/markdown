# Vue3 学习笔记 - 第三篇：高级特性与实战应用

## 摘要

本文是Vue3学习笔记的第三篇，专注于Vue3的高级特性和实战应用。深入讲解了高级响应式特性、模板引用、依赖注入、异步组件、自定义指令、插件系统等高级概念。通过一个完整的Todo应用实战项目，展示了Vue3在实际开发中的应用。同时涵盖了性能优化、测试策略、部署和构建优化等工程化主题，帮助读者掌握Vue3的高级开发技巧和最佳实践，为构建企业级应用提供全面指导。

---



## 高级响应式特性

### shallowRef 和 shallowReactive

```javascript
import { ref, shallowRef, reactive, shallowReactive } from 'vue'

// 深度响应式
const deepRef = ref({ count: 0 })
deepRef.value.count++ // 触发更新

// 浅层响应式
const shallowRef = shallowRef({ count: 0 })
shallowRef.value.count++ // 不会触发更新
shallowRef.value = { count: 1 } // 会触发更新

// 深度响应式对象
const deepReactive = reactive({ 
  nested: { count: 0 } 
})
deepReactive.nested.count++ // 触发更新

// 浅层响应式对象
const shallowReactive = shallowReactive({ 
  nested: { count: 0 } 
})
shallowReactive.nested.count++ // 不会触发更新
shallowReactive.nested = { count: 1 } // 会触发更新
```

### readonly 和 shallowReadonly

```javascript
import { reactive, readonly, shallowReadonly } from 'vue'

const original = reactive({ count: 0 })

// 深度只读
const readOnly = readonly(original)
// readOnly.count++ // 错误：无法修改只读属性

// 浅层只读
const shallowReadOnly = shallowReadonly(original)
// shallowReadOnly.count++ // 错误：无法修改只读属性
shallowReadOnly.nested = {} // 可以修改嵌套对象
```

### toRaw 和 markRaw

```javascript
import { reactive, toRaw, markRaw } from 'vue'

const obj = reactive({ count: 0 })

// 获取原始对象
const rawObj = toRaw(obj)
console.log(rawObj === obj) // false

// 标记对象为非响应式
const nonReactive = markRaw({ count: 0 })
const reactiveObj = reactive({ data: nonReactive })
// reactiveObj.data.count++ // 不会触发更新
```

## 模板引用 (Template Refs)

### 基本用法

```vue
<template>
  <div>
    <input ref="inputRef" v-model="text" />
    <button @click="focusInput">聚焦输入框</button>
    <p>输入内容: {{ text }}</p>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputRef = ref(null)
const text = ref('')

const focusInput = async () => {
  // 等待DOM更新
  await nextTick()
  inputRef.value?.focus()
}
</script>
```

### 动态模板引用

```vue
<template>
  <div>
    <div v-for="item in items" :key="item.id">
      <input :ref="el => setItemRef(el, item.id)" />
    </div>
    <button @click="focusById">聚焦指定输入框</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' }
])

const itemRefs = ref(new Map())

const setItemRef = (el, id) => {
  if (el) {
    itemRefs.value.set(id, el)
  } else {
    itemRefs.value.delete(id)
  }
}

const focusById = (id) => {
  const input = itemRefs.value.get(id)
  input?.focus()
}
</script>
```

## 依赖注入 (Dependency Injection)

### 提供和注入值

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>Vue3 依赖注入示例</h1>
    <parent-component />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import ParentComponent from './ParentComponent.vue'

const theme = ref('dark')
const user = ref({
  name: 'John Doe',
  role: 'admin'
})

// 提供响应式数据
provide('theme', theme)
provide('user', user)

// 提供方法
provide('updateTheme', (newTheme) => {
  theme.value = newTheme
})

// 提供计算属性
provide('isDarkTheme', computed(() => theme.value === 'dark'))
</script>
```

```vue
<!-- DeepChild.vue -->
<template>
  <div>
    <h3>深层子组件</h3>
    <p>当前主题: {{ theme }}</p>
    <p>用户: {{ user.name }} ({{ user.role }})</p>
    <p>是否深色主题: {{ isDarkTheme }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 注入数据，提供默认值
const theme = inject('theme', ref('light'))
const user = inject('user', ref({ name: 'Guest', role: 'user' }))
const updateTheme = inject('updateTheme', () => {})
const isDarkTheme = inject('isDarkTheme', ref(false))

const toggleTheme = () => {
  updateTheme(theme.value === 'dark' ? 'light' : 'dark')
}
</script>
```

### 注入 Symbol 键

```javascript
// keys.js
export const THEME_KEY = Symbol('theme')
export const USER_KEY = Symbol('user')
export const UPDATE_THEME_KEY = Symbol('updateTheme')
```

```vue
<!-- App.vue -->
<script setup>
import { ref, provide } from 'vue'
import { THEME_KEY, USER_KEY, UPDATE_THEME_KEY } from './keys'

const theme = ref('dark')
const user = ref({ name: 'John', role: 'admin' })

provide(THEME_KEY, theme)
provide(USER_KEY, user)
provide(UPDATE_THEME_KEY, (newTheme) => {
  theme.value = newTheme
})
</script>
```

```vue
<!-- ChildComponent.vue -->
<script setup>
import { inject } from 'vue'
import { THEME_KEY, USER_KEY, UPDATE_THEME_KEY } from './keys'

const theme = inject(THEME_KEY)
const user = inject(USER_KEY)
const updateTheme = inject(UPDATE_THEME_KEY)
</script>
```

## 异步组件

### 基本异步组件

```vue
<template>
  <div>
    <Suspense>
      <template #default>
        <AsyncComponent />
      </template>
      <template #fallback>
        <div class="loading">加载中...</div>
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

### 高级异步组件

```javascript
// 带加载和错误处理的异步组件
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./HeavyComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000,
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry()
    } else {
      fail()
    }
  }
})
```

### 异步组件示例

```vue
<!-- AsyncUserProfile.vue -->
<template>
  <div class="user-profile">
    <h2>{{ user.name }}</h2>
    <img :src="user.avatar" :alt="user.name" />
    <p>{{ user.bio }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)

onMounted(async () => {
  // 模拟API调用
  const response = await fetch('/api/user/123')
  user.value = await response.json()
})
</script>
```

## 自定义指令

### 基本自定义指令

```javascript
// directives/focus.js
export const focus = {
  mounted(el) {
    el.focus()
  }
}
```

```vue
<template>
  <div>
    <input v-focus />
    <button @click="showInput">显示输入框</button>
    <input v-if="show" v-focus />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { focus } from './directives/focus'

const show = ref(false)

const showInput = () => {
  show.value = true
}
</script>
```

### 高级自定义指令

```javascript
// directives/v-click-outside.js
export const clickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
```

```vue
<template>
  <div>
    <div v-click-outside="handleClickOutside" class="dropdown">
      <button @click="toggleDropdown">下拉菜单</button>
      <div v-if="isOpen" class="dropdown-menu">
        <a href="#">选项1</a>
        <a href="#">选项2</a>
        <a href="#">选项3</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { clickOutside } from './directives/v-click-outside'

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = () => {
  isOpen.value = false
}
</script>
```

### 全局注册指令

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { focus } from './directives/focus'
import { clickOutside } from './directives/v-click-outside'

const app = createApp(App)

app.directive('focus', focus)
app.directive('click-outside', clickOutside)

app.mount('#app')
```

## 插件系统

### 创建插件

```javascript
// plugins/myPlugin.js
export default {
  install(app, options) {
    // 全局属性
    app.config.globalProperties.$myMethod = () => {
      console.log('My plugin method')
    }
    
    // 全局组件
    app.component('my-component', {
      template: '<div>My Component</div>'
    })
    
    // 全局指令
    app.directive('my-directive', {
      mounted(el, binding) {
        el.style.color = binding.value
      }
    })
    
    // 注入
    app.provide('myPlugin', {
      version: '1.0.0',
      options
    })
  }
}
```

### 使用插件

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyPlugin from './plugins/myPlugin'

const app = createApp(App)

app.use(MyPlugin, {
  // 插件选项
  debug: true
})

app.mount('#app')
```

## 实战项目：Todo应用

### 项目结构

```
todo-app/
├── src/
│   ├── components/
│   │   ├── TodoList.vue
│   │   ├── TodoItem.vue
│   │   ├── TodoForm.vue
│   │   └── TodoFilter.vue
│   ├── composables/
│   │   ├── useTodos.js
│   │   └── useLocalStorage.js
│   ├── stores/
│   │   └── todoStore.js
│   ├── App.vue
│   └── main.js
├── index.html
└── package.json
```

### 核心组件

```vue
<!-- App.vue -->
<template>
  <div class="todo-app">
    <h1>Vue3 Todo 应用</h1>
    <todo-form @add-todo="addTodo" />
    <todo-filter v-model="filter" />
    <todo-list 
      :todos="filteredTodos" 
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
      @edit-todo="editTodo"
    />
    <div class="stats">
      <p>总计: {{ totalTodos }}</p>
      <p>已完成: {{ completedTodos }}</p>
      <p>未完成: {{ activeTodos }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'
import { useTodos } from './composables/useTodos'

const { todos, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos()
const filter = ref('all')

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const totalTodos = computed(() => todos.value.length)
const completedTodos = computed(() => todos.value.filter(todo => todo.completed).length)
const activeTodos = computed(() => totalTodos.value - completedTodos.value)
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.stats {
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>
```

```vue
<!-- components/TodoForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <input 
      v-model="newTodo" 
      placeholder="添加新任务..."
      class="todo-input"
    />
    <button type="submit" class="todo-button">添加</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add-todo'])
const newTodo = ref('')

const handleSubmit = () => {
  if (newTodo.value.trim()) {
    emit('add-todo', newTodo.value.trim())
    newTodo.value = ''
  }
}
</script>

<style scoped>
.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-button:hover {
  background: #369870;
}
</style>
```

```vue
<!-- components/TodoList.vue -->
<template>
  <div class="todo-list">
    <todo-item
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle-todo', todo.id)"
      @delete="$emit('delete-todo', todo.id)"
      @edit="$emit('edit-todo', $event)"
    />
  </div>
</template>

<script setup>
import TodoItem from './TodoItem.vue'

defineProps(['todos'])
defineEmits(['toggle-todo', 'delete-todo', 'edit-todo'])
</script>
```

```vue
<!-- components/TodoItem.vue -->
<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <input 
      type="checkbox" 
      :checked="todo.completed"
      @change="$emit('toggle')"
    />
    <span v-if="!isEditing" @dblclick="startEdit" class="todo-text">
      {{ todo.text }}
    </span>
    <input 
      v-else
      v-model="editText"
      @blur="saveEdit"
      @keyup.enter="saveEdit"
      @keyup.esc="cancelEdit"
      ref="editInput"
      class="edit-input"
    />
    <button @click="$emit('delete')" class="delete-button">删除</button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps(['todo'])
const emit = defineEmits(['toggle', 'delete', 'edit'])

const isEditing = ref(false)
const editText = ref('')
const editInput = ref(null)

const startEdit = () => {
  isEditing.value = true
  editText.value = props.todo.text
  nextTick(() => {
    editInput.value?.focus()
  })
}

const saveEdit = () => {
  if (editText.value.trim()) {
    emit('edit', { id: props.todo.id, text: editText.value.trim() })
  }
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = ''
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #999;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.edit-input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.delete-button {
  padding: 5px 10px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background: #ff3742;
}
</style>
```

### 组合式函数

```javascript
// composables/useTodos.js
import { ref, computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'

export function useTodos() {
  const todos = useLocalStorage('todos', [])
  
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }
    todos.value.push(newTodo)
  }
  
  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }
  
  const deleteTodo = (id) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }
  
  const editTodo = ({ id, text }) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.text = text
    }
  }
  
  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo
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
  }, { deep: true })
  
  return value
}
```

## 性能优化最佳实践

### 使用 v-memo 优化列表渲染

```vue
<template>
  <div>
    <div v-for="item in items" :key="item.id" v-memo="[item.id, item.name]">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
      <span>{{ item.price }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Product 1', description: 'Description 1', price: 100 },
  { id: 2, name: 'Product 2', description: 'Description 2', price: 200 }
])
</script>
```

### 使用 defineAsyncComponent 懒加载

```javascript
// 懒加载组件
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)

// 带错误处理的懒加载
const AsyncComponent = defineAsyncComponent({
  loader: () => import('./AsyncComponent.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,
  timeout: 3000
})
```

### 使用 shallowRef 优化大对象

```javascript
import { shallowRef } from 'vue'

// 对于大型对象，使用 shallowRef 避免深度响应式
const largeObject = shallowRef({
  // 大量数据
  data: new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() }))
})

// 只有替换整个对象时才触发更新
const updateData = () => {
  largeObject.value = {
    data: new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() }))
  }
}
```

## 测试策略

### 组件测试示例

```javascript
// tests/TodoItem.test.js
import { mount } from '@vue/test-utils'
import TodoItem from '../components/TodoItem.vue'

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo',
    completed: false
  }

  it('renders todo text', () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })
    
    expect(wrapper.text()).toContain('Test todo')
  })

  it('emits toggle event when checkbox is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: { todo: mockTodo }
    })
    
    await wrapper.find('input[type="checkbox"]').setChecked()
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('shows completed class when todo is completed', () => {
    const wrapper = mount(TodoItem, {
      props: { 
        todo: { ...mockTodo, completed: true } 
      }
    })
    
    expect(wrapper.classes()).toContain('completed')
  })
})
```

## 部署和构建优化

### Vite 配置优化

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          utils: ['lodash-es']
        }
      }
    },
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  }
})
```

### 环境变量配置

```javascript
// .env
VITE_APP_TITLE=Vue3 Todo App
VITE_API_BASE_URL=https://api.example.com

// .env.production
VITE_APP_TITLE=Vue3 Todo App (Production)
VITE_API_BASE_URL=https://api.production.com
```

```javascript
// 使用环境变量
console.log(import.meta.env.VITE_APP_TITLE)
console.log(import.meta.env.VITE_API_BASE_URL)
```

## 总结

这是Vue3学习笔记的第三部分，涵盖了：
- 高级响应式特性
- 模板引用和依赖注入
- 异步组件和自定义指令
- 插件系统
- 完整的Todo应用实战
- 性能优化最佳实践
- 测试策略
- 部署和构建优化

通过这些高级特性和实战经验，您可以构建出更加强大、高效和可维护的Vue3应用程序。

Vue3的学习之旅还在继续，探索更多可能性和创新应用！ 
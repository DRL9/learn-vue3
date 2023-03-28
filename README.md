# learn-vue3

## Essentials
### 创建应用
```tsx
const app = createApp(App);

app.use(createPinia());
app.use(router);

const instance = app.mount("#app");
```
- `app.use` 返回是是 Vue 应用实例
- `app.mount` 返回的是 *根组件* 实例 即 App

#### App Config
```tsx
// 处理 app 级别的异常
app.config.errorHandler = (err) => {
  console.log(err);
};
// 添加 全局 组件
app.component("HelloWorld", HelloWorld);
```

### 模板语法
文本
```html
<p>{{content}}</p>
```
原始html, 注意 XSS 攻击
```html
<p v-html="rawHtml"></p>
```

#### 属性绑定
```html
<p v-bind:id="id"></p>
<p :id="id"></p>
<div v-bind="obj">可以一次绑定多个属性</div>
```

#### js
- 模板中仅能访问部分 [全局变量](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3)
- 可以通过 `app.config.globalProperties` 扩展

#### 指令
动态指令参数
```html
<div :[attr]="value"></div>
<div @[event]="listener"></div>
```

指令修饰符
```html
<div @click.prevent="handleClick"></div>
```

### 响应式基础

#### reactive
```html
<script setup lang="ts">
import { reactive } from "vue";

let state = reactive({ count: 0 });
function addCount() {
  state.count++;
  state.nested = state.nested || {};
  state.nested.count = state.count + 1;
}

</script>

<template>
  <div>
    <button @click="addCount">{{ state.count }}</button>
    <div>{{ state.nested?.count }}</div>
  </div>
</template>
```
- `reactive` 返回的原始对象的 Proxy
- 嵌套的对象也是 Proxy
- 动态添加的对象和属性也具备响应式
- `reactive` 参数必须是 `object`, obj array Map Set

```html
<script setup lang="ts">
import { reactive } from "vue";
let { count } = reactive({ count: 0 });
function addCount() {
  count++;
}
</script>

<template>
  <div>
    <button @click="addCount">{{ count }}</button>
  </div>
</template>
```
> 因为响应式系统是跟踪属性访问，所以如果使用解构赋值， 或者把响应式对象的属性附给一个局部变量， 或者传递给函数，那么将跟踪不到其值的变化，从而不会触发更新

#### ref
```html
<script setup lang="ts">
import { reactive, ref } from "vue";
let count2 = ref(0);
function addCount2() {
    count2.value++;
}
</script>
<template>
  <div>
      <div>
          <button @click="addCount2">{{ count2 }}</button>
    </div>
  </div>
</template>
```
- 与 `reactive` 不同， `ref` 可以接受基础类型， 且不受 `reactive` 丢失响应性的限制

unwrapping
- 当 `ref` 的值在 template 中， 属于顶级属性时， 不需要使用 `ref.value`, 如果是嵌套的，那么需要(例如 `let obj = {state: ref(0)}`)
- 当 `ref` 传递给 `reactive` 时， 也会自动 unwrapping `let state = reactive({count: ref(2)})`, `statr.count`
- 在集合类型中， 不会 unwrapping, `const books = reactive([ref('Vue 3 Guide')])` 需要使用 `books[0].value`

> 未来可能不需要要 `.value`, Vue 会在编译时期进行转换

### 计算属性
```html
<script setup lang="ts">
import { computed } from "vue";
import { reactive, ref } from "vue";
const list = reactive([1]);
const listCount = computed(() => list.length);
function addList() {
  list.push(1);
}
</script>

<template>
  <div>
    <button @click="addList">add list {{ listCount }}</button>
  </div>
</template>
```
- `computed` 会基于传入的 响应式值 对计算结果进行缓存
- 设置 `set` 可以给计算属性赋值
```js
const fName = ref("John");
const lName = ref("Doe");
const fullName = computed({
  get() {
    return fName.value + "." + lName.value;
  },
  set(v) {
    [fName.value, lName.value] = v.split(".");
  },
});
```

### 类和样式绑定
#### class
`:class` 也可以接受对象和数组
```html
<template>
    <div :class="{isActive: true}">
        <div :class="['active', 'error']"></div>
    </div>
</template>
```
传递给组件的 `class` , 会运用在 根元素上， 如果有多个根元素，可通过 `$attrs.class` 指定
```html
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

#### style
- `:style` 可以接收对象和数组，
- 如果是数组，会合并对象

```html
<div :style="styleObject"></div>
<div :style="[baseStyles, overridingStyles]"></div>
```

### 条件渲染
`v-if` `v-else` `v-else-if` `v-show`
- `v-show` 只是改变 css 属性
- 如果初始值是 falcy, `v-if` 不会触发渲染

### 列表渲染
`v-for` 可以作用于对象
```html
<script setup lang="ts">
import { reactive, ref } from "vue";
const forObj = reactive({ a: "aValue", b: "bValue" });
</script>

<template>
  <ul>
    <li v-for="(value, key, index) in forObj" :key="key">
      {{ value }}- {{ key }}-{{ index }}
    </li>
  </ul>
</template>
```

`v-for` 作用为 range ， 从1开始
```html
<span v-for="i in 8" :key="i">{{ i }}</span>
```

> `v-if` 的优先级比 `v-for` 高， 所以 `v-if` 块访问不了 `v-for` 的变量

### 事件处理
```html
<div @click="count++"></div>
<div @click="handleClick"></div>
<div @click="handleClick(1, $event)"></div>
<div @click.self.prevent="handleClick"></div>
```
- 修饰符是按顺序执行， 比如 `.self.prevent` 阻止自身的默认行为， `.prevent.self` 会阻止自己和children的默认行为

按键修饰符
```html
<input v-model="inputValue" @keydown.alt.enter="inputValue = ''" />
```
`.exact` 可以精确匹配按键
```html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

`.left` `.right` `.middle` 鼠标按键

### 输入绑定
`v-model`
- `<input>` `<textarea>` 绑定 `value` , `input`
- `checkbox` `radio` 绑定 `checked`, `change`
- `select` 绑定 `value`, `change`

#### checkbox
- 单个， 为 boolean
- 多个， 为 数组 或 Set

#### radio
选项的值
```html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>

```

#### select
- 单个为对应的值
- 多个为数组

#### 绑定对象值
默认情况下， 输入绑定的值为 string, boolean, 但是可以通过下面方式指定其他类型
```html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />


<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />


<select v-model="selected">
  <!-- inline object literal -->
  <option :value="{ number: 123 }">123</option>
</select>

```
#### 修饰符
- `.lazy` 监听`input` 改成 `change`
- `.number` 自动`parseFloat`
- `.trim` 自动 trim

### 生命周期 hook
> 生命周期 hook 必须与 setup 的调用栈同步

`onMounted` `onUpdated` `onUnmounted`

![lifecycle](./lifecycle.png)

### Watch
监听响应式的值
```javascript
const x = ref(0)
const y = ref(0)

// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```
不能监听 reactive 的属性
```javascript
const obj = reactive({ count: 0 })

// this won't work because we are passing a number to watch()
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

```
使用下面方式替代
```javascript
watch(()=>obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

如果 watch 一个响应式对象， 那么会自动深层监听
```javascript
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // fires on nested property mutations
  // Note: `newValue` will be equal to `oldValue` here
  // because they both point to the same object!
})

obj.count++

```
如果 watch 一个 getter, 那么需要显式指定是否深层监听
```javascript
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // Note: `newValue` will be equal to `oldValue` here
    // *unless* state.someObject has been replaced
  },
  { deep: true }
)
```

#### watchEffect
```javascript
watchEffect(async () => {
  const response = await fetch(url.value)
  data.value = await response.json()
})
```
> callback 会立即执行一次。 同步执行时（await 之前）收集的响应式依赖 会作为监听的对象

#### 执行时机
默认是在 Vue 组件更新前， 可以通过以下方式放在之后
```javascript
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})

watchPostEffect(() => {
  /* executed after Vue updates */
})

```

#### 停止
- 如果 watch 于 setup 的调用栈同步， 那么组件 unmount 的时候， 会自动停止
- 如果是 异常创建的 watch ，必须通过下面方式停止

```javascript
let unwatch;
setTimeout(() => {
    unwatch = watchEffect(() => {})
}, 100)
onUnmounted(()=>unwatch())
```

### 模板引用
```html
<script setup>
import { ref, onMounted } from 'vue'

// declare a ref to hold the element reference
// the name must match template ref value
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>

```

运用在 `v-for` 时， 是个数组
```html
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>

```

可以使用函数指定 ref
```html
<input :ref="(el) => { /* assign el to a property or ref */ }">
```
运用在组件时，
- 如果是 option API 的组件， ref 就是 组件实例 this
- 如果是 setup 的组件，因为里面的变量都是私有的， 所以需要通过下面方式 指定导出的属性

```html
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>

```

### 组件基础
#### Props
```html
<script setup>
const props = defineProps(['title'])
</script>

<template>
都可以
  <h4>{{ title }}</h4>
  <h4>{{ props.title }}</h4>
</template>
```
- `defineProps` 是编译时的宏， 不需要 import


#### emit 事件
```html
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

```javascript
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```
- defineEmits 也只能在 setup 中使用

#### 插槽
```html
<AlertBox>
  Something bad happened.
</AlertBox>
```
使用 `<slot />`
```html
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>
```

#### 动态组件
使用 `is`
```html
<!-- Component changes when currentTab changes -->
<component :is="tabs[currentTab]"></component>
```

## 深入了解组件
### 注册组件
#### 全局注册
```javascript
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```
缺点
- 不能 tree-shaking
- 让组件间的依赖关系不清晰

#### 局部注册
```html
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>

```
```javascript
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```
### Props
#### 声明
如果使用 ts 可以这么声明
```typescript
defineProps<{
  title?: string;
  name: string;
  count: number;
}>();
```

如果是 setup
```javascript
const props = defineProps(['foo'])

console.log(props.foo)
```
或
```javascript
defineProps({
  title: String,
  likes: Number
})
```

#### Props 传递
下面两种方式命名都可以
```html
<BlogPost is-published firstName="d" />
```
#### 单一数据流
如果只希望 props 作为初始值， 不响应后续值的变更
```javascript
const props = defineProps(['initialCounter'])

// counter only uses props.initialCounter as the initial value;
// it is disconnected from future prop updates.
const counter = ref(props.initialCounter)
```
如果希望 转换 props
```javascript
const props = defineProps(['size'])

// computed property that auto-updates when the prop changes
const normalizedSize = computed(() => props.size.trim().toLowerCase())
```
#### 校验
```javascript
defineProps({
  // Basic type check
  //  (`null` and `undefined` values will allow any type)
  propA: Number,
  // Multiple possible types
  propB: [String, Number],
  // Required string
  propC: {
    type: String,
    required: true
  },
  // Number with a default value
  propD: {
    type: Number,
    default: 100
  },
  // Object with a default value
  propE: {
    type: Object,
    // Object or array defaults must be returned from
    // a factory function. The function receives the raw
    // props received by the component as the argument.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Custom validator function
  propF: {
    validator(value) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Function with a default value
  propG: {
    type: Function,
    // Unlike object or array default, this is not a factory function - this is a function to serve as a default value
    default() {
      return 'Default function'
    }
  }
})
```
- defineProps 里面的参数， 不能访问外部的变量
- 如果 type 是自定义 class, 那么会使用 instanceof
- 对于 boolean, 如果没有传递那么会映射成 false

对于 ts ，可以通过下面方式提供默认值
```typescript
const props = withDefaults(
  defineProps<{
    title?: string;
    name: string;
    count: number;
    firstName: string;
    isValid?: boolean;
  }>(),
  {
    title: "default title",
  }
);
```

### 事件
在 template 中 emit
```html
<!-- MyComponent -->
<button @click="$emit('someEvent',1,2,3)">click me</button>
```
在 script 中 emit
```javascript
const emit = defineEmits(['inFocus', 'submit'])
function buttonClick() {
  emit('submit')
}
```
或
```javascript
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```
对于 ts
```typescript
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```
- 自定义事件不会冒泡
- 如果自定义事件与原生事件同名，那么会覆盖原生事件

在 js 中验证事件
```javascript
const emit = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
```

#### v-model
v-model 是如下的简写
```html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

组件按照如下写
```html
<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as any)?.value)"
  />
</template>
```

也可以使用可写的 computed 实现
```html
<!-- CustomInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value" />
</template>
```

多个 v-model
```javascript
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
```

```html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

修饰符， 相当于是定义一个 props, 命名规则为 `prop + 'Modifiers'`
```typescript
const props = defineProps<{
  modelValue: string;
  suffix: string;
  suffixModifiers?: { uppercase: boolean };
}>();
const suffixValue = computed({
  get() {
    return props.suffix;
  },
  set(v) {
    console.log(props.suffixModifiers);
    emit(
      "update:suffix",
      props.suffixModifiers?.uppercase ? v.toUpperCase() : v
    );
  },
});
```

### 属性
#### 属性继承
如果组件只有一个根元素， 下列属性会直接由 *根元素* 继承, 如果根元素存在对应属性，那么会合并
- class
- v-on
- style

> 如果根元素是自定义组件， 那么该规则会传递下去

禁用属性继承
```html
<script>
// use normal <script> to declare options
export default {
  inheritAttrs: false
}
</script>

<script setup>
// ...setup logic
</script>
```

- 当属性不是运用在 根元素， 而是其他元素时， 一般都需要禁用 属性继承
- 可以通过 `$attrs` 获得所有属性
- 对于 `v-on` ，可以通过 `$attrs.onClick` 类似的模式获取

例如一个自定义按钮
```html
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

> 如果有多个根元素， 需要指定 `$attrs` 运用在哪个元素上

在js中访问 attrs
```html
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```
> `$attrs` 不是响应式的

### 插槽
```html
<button class="fancy-btn">
  <slot></slot> <!-- slot outlet -->
</button>
```
内容默认值
```html
<button type="submit">
  <slot>
    Submit <!-- fallback content -->
  </slot>
</button>
```

多个插槽
```html
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
```
`v-slot:slotName` 或 `#slotName`
```html
<BaseLayout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
没有指定 slotName 的， 会自动合并到 default
```html
<BaseLayout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  <template #footer>
    <p>Here's some contact info</p>
  </template>
</BaseLayout>
```
动态 插槽名
```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- with shorthand -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

获取插槽 scope 数据
```html
<template>
  <slot name="header" message="hello"></slot>
  <slot :count="1"></slot>
</template>
```
```html
<MyComponent v-slot="{ text, count }">
  {{ text }} {{ count }}
</MyComponent>
```

当混合默认插槽和命名插槽时，用 template 包裹默认插槽
```html
<MyComponent>
  <template #header="headerProps">
    {{ headerProps.message }}
  </template>

  <template #default="defaultProps">
    {{ defaultProps.count }}
  </template>
</MyComponent>
```
数据传递一般运用于 组件既需要处理数据逻辑有需要处理呈现样式的情况


### Provide / inject
用来深层传递数据
```javascript
import { ref, provide } from 'vue'

const count = ref(0)
provide('message', count)

```

```javascript
import { inject } from 'vue'

const message = inject('message')
// 设置默认值
const m = inject('message', ()=>defaultValue)
const m1 = inject('message', defaultValue)
```

把 value 设置成只读
```javascript
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
```

为了减少冲突，使用 symbol 作为 key
```javascript
// keys.js
export const myInjectionKey = Symbol()

// in provider component
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* data to provide */
})

// in injector component
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

app 级别的 provide
```javascript
app.provide('key','value')
```

### 异步组件
```html
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

高级选项
```javascript
const AsyncComp = defineAsyncComponent({
  // the loader function
  loader: () => import('./Foo.vue'),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

## 复用性
### 组合
> 组合API 一般来用复用状态逻辑

一般实例
```javascript
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // if you want, you can also make this
  // support selector strings as target
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```
```html
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

数据拉取
```javascript
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { data, error }
}
```

#### 约定
对于输入值，如果需要 响应变更， 可以加上 `watch` 或 `watchEffect`
```javascript
import { unref } from 'vue'

function useFeature(maybeRef) {
  // if maybeRef is indeed a ref, its .value will be returned
  // otherwise, maybeRef is returned as-is
  const value = unref(maybeRef)
}
```

- 使用 `ref` 而不是 `reactive` ，这样子解构赋值时， 就不会丢失响应性
- 使用同步方法， 这样子可以保证生命周期 hook 正确调用， 且自动 销毁 watch

### 自定义指令
> 主要用来复用 涉及 底层 DOM 访问的逻辑

- 指令通过一个包含定义生命周期hooks 的对象来定义
- setup 中 `v` 开头的变量会被认为是 自定义指令

```html
<script setup>
// enables v-focus in templates
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

在其他地方
```javascript
export default {
  setup() {
    /*...*/
  },
  directives: {
    // enables v-focus in template
    focus: {
      /* ... */
    }
  }
}
```
全局指令
```javascript
const app = createApp({})

// make v-focus usable in all components
app.directive('focus', {
  /* ... */
})
```
hooks 列表
```javascript
const myDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode, prevVnode) {
    // see below for details on arguments
  },
  // called right before the element is inserted into the DOM.
  beforeMount(el, binding, vnode, prevVnode) {},
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted(el, binding, vnode, prevVnode) {},
  // called before the parent component is updated
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // called after the parent component and
  // all of its children have updated
  updated(el, binding, vnode, prevVnode) {},
  // called before the parent component is unmounted
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // called when the parent component is unmounted
  unmounted(el, binding, vnode, prevVnode) {}
}
```

参数说明
`binding`
- arg
- modifiers
- value
- oldValue
- instance
- dir 指令对象本身
```html
<div v-example:foo.bar="baz">
```
```javascript
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* value of `baz` */,
  oldValue: /* value of `baz` from previous update */
}
```

> 当指令运用在自定义组件时， 会自动传递到 根节点， 如果有多个根节点，那么会抛出警告
> 通常不建议将自定义指令运用在组件上

### 插件
作用
- 注册全局指令和组件
- 全局的 app.provide
- 添加全局的属性和方法

示例
```typescript
import type { Plugin } from "vue";

const $translate = (opts: any) => (key: string) => {
  return key.split(".").reduce((o, k) => {
    if (o) return o[k];
    return o;
  }, opts);
};

export const translatePlugin: Plugin = {
  install(app, opts) {
    app.config.globalProperties.$translate = $translate(opts);
    app.provide("version", "1.1");
  },
};

// work in vue3
declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $translate: ReturnType<typeof $translate>;
  }
}

```


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

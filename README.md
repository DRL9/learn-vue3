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

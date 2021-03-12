#### 概念

1.数据绑定：一旦更新了 data 中的某个属性数据，所有界面上直接使用或间接使用了此属性的节点都会更新

2.数据劫持

- 数据劫持是 vue 中用来实现数据绑定的一种技术
- 基本思想：通过 defineProperty()来监视 data 中所有属性（任意层次）数据的变化，一旦变化就去更新界面

  3.四个重要的对象

Observer

- 通过隐式递归调用实现所有层次属性的监视和劫持
- 给 data 重新定义属性，添加 setter/getter
- 为 data 中的每个属性创建对应的 dep 对象

Dep

- data 中的每个属性（所有层次）都对应一个 dep 对象
- 创建的时机：在初始化 defineReactive,data 中每个属性时创建对应的 dep 对象，或者在 data 中某个属性值被设置为新的对象时
- dep 对象的结构

```javascript
Dep {
  id, // 每个dep都有一个唯一的ID
  subs // 包含n个对应watcher的数组
}
```

- subs 属性说明：
  - 当一个 watcher 被创建时，内部会将当前 watcher 对象添加到对应的 dep 对象的 subs 中
  - 当此 data 属性的值发生改变时，所有 subs 中的 watcher 都会收到更新的通知，调用 update 从而最终更新对应的界面

Compile

- 用来解析模板页面的对象的构造函数（一个实例）
- 利用 compile 对象解析模板页面
- 插值语法和一般指令语法都会调用 bind，bind 中会创建 watcher
- 每解析一个表达式（非事件指令）都会创建一个对应的 watcher 对象，并建立 watcher 和 dep 的关系
- compile 和 watcher 关系：一对多的关系

Watcher

- 模板中每个非事件指令或表达式都对应一个 watcher 对象
- 每个 watcher 都包含一个用于更新对应节点的回调函数
- 创建的时机： 在初始化编译模板时
- 对象的组成

```javascript
watcher {
  vm, // vm对象
  exp,// 对应指令的表达式
  cb, // 表达式的值
  walue,// 表达式的值
  depIds // 表达式中各级属性所对应
}
```

总结：dep 与 watcher 的关系：多对多

- 一个 data 中的属性对应一个 dep，一个 dep 中可能包含多个 watcher（模板中有几个表达式使用到了属性）
- 模板中一个非事件表达式对应一个 watcher，一个 watcher 中可能包含多个 dep
- 数据绑定使用到两个技术

  - defineProperty()
  - 订阅者 - 发布者

    4.双向数据绑定

- 双向数据绑定是建立在单向数据绑定的基础上的
- 双向数据绑定的实现流程
  - 在解析 v-model 指令时，给当前元素添加 input 监听
  - 当 input 的 value 发生改变事，将最新的值赋值给当前表达式所对应的 data 属性

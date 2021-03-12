function Observer(data) {
	this.data = data
	this.walk(data)
}

Observer.prototype = {
	walk: function (data) {
		var me = this
		Object.keys(data).forEach(key => me.convert(key, data[key]))
	},
	convert(key, val) {
		this.defineReactive(this.data, key, val)
	},
	defineReactive(data, key, val) {
		// 创建与当前属性对应的dep对象（依赖）
		var dep = new Dep()
		// 间接递归调用实现对data中所有层次属性的劫持
		var childObj = observe(val)
		// 给data重新定义属性（添加set/get）
		Object.defineProperty(data, key, {
			enumerable: true, // 可枚举
			configurable: false, // 不能再define
			get() {
				// 建立关系
				if (Dep.target) {
					dep.depend()
				}
				// 返回属性值
				return val
			},
			set(newVal) {
				if (newVal === val) {
					return
				}
				val = newVal
				childObj = observe(newVal)
				dep.notify()
			},
		})
	},
}

function observe(value, vm) {
	// value必须是对象，因为监视的是对象内部的属性
	if (!value || typeof value !== 'object') {
		return
	}
	// 创建一个对应的观察对象
	return new Observer(value)
}

var uid = 0

function Dep() {
	// 标识属性
	this.id = uid++
	// 存放watcher
	this.subs = []
}

Dep.prototype = {
	addSub(sub) {
		this.subs.push(sub)
	},
	depend() {
		Dep.target.addDep(this)
	},
	removeSub(sub) {
		var index = this.subs.indexOf(sub)
		if (index != -1) {
			this.subs.splice(index, 1)
		}
	},
	notify() {
		this.subs.forEach(sub => sub.update())
	},
}

Dep.target = null

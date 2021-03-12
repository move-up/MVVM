function Watcher(vm, exp, cb) {
	this.cb = cb
	this.vm = vm
	this.exp = exp
	this.depIds = {}
	this.value = this.get()
}

Watcher.prototype = {
	update() {
		this.run()
	},
	run() {
		var value = this.get()
		var oldVal = this.value
		if (value !== oldVal) {
			this.value = value
			this.cb.call(this.vm, value, oldVal)
		}
	},
	addDep(dep) {
		if (!this.depIds.hasOwnProperty(dep.id)) {
			dep.addSub(this)
			this.depIds[dep.id] = dep
		}
	},
	get() {
		Dep.target = this
		var value = this.getVMVal()
		Dep.target = null
		return value
	},
	getVMVal() {
		var exp = this.exp.split('.')
		var val = this.vm._data
		exp.forEach(k => (val = val[k]))
		return val
	},
}

function Compiler(vm, el) {
	var dom = document.querySelector(el);
	this.vm = vm;
	this.$el = dom;
	this.init();
}

Compiler.prototype = {
	constructor: Compiler,
	init() {
		var childNodes = this.$el.childNodes;
		[].slice.call(childNodes).forEach(child => this.compile(child));
	},
	compile(child) {
		// 文本节点
		if (child.nodeType === 3) {
			var val = child.textContent;
			var reg = /\{\{(.*)\}\}/; // 匹配{{}}，并且花括号中间有任意个字符
			var result = val.match(reg);
			if (!result) return;
			this.bind(val.match(reg)[1], 'text', child);
		} else {
			// 元素节点
			var attrs = child.attributes;
			[].slice.call(attrs).forEach(attr => {
				var directiveReg = /v-/,
					eventDirectiveReg = /v-on/,
					attrName = attr.name,
					attrValue = attr.value;
				if (attrName.match(directiveReg)) {
					if (attrName.match(eventDirectiveReg)) {
						this.event(attrName.slice(5), attrValue, child);
					} else {
						this.bind(attrValue, attrName.slice(2), child);
					}
					child.removeAttribute(attrName);
				}
			});
			[].slice.call(child.childNodes).forEach(child => this.compile(child));
		}
	},
	bind(exp, type, node) {
		var me = this;
		if (type === 'model') {
			// 监听输入事件，更新数据
			node.addEventListener('input', function (e) {
				me.vm[exp] = e.target.value;
			});
		}
		// 更新节DOM点方法
		var updateFn = updateUtil[type];
		console.log('me.vm[exp]', me.vm[exp]);
		updateFn && updateFn(node, me.vm[exp]);
		new Watcher(me.vm, exp, function () {
			updateFn && updateFn(node, me.vm[exp]);
		});
	},
	event: function (eventType, exp, node) {
		var handler = this.vm.options.methods[exp].bind(this.vm);
		node.addEventListener(eventType, handler, false);
	},
};

var updateUtil = {
	text: function (node, newValue) {
		node.textContent = newValue;
	},
	model: function (node, newValue) {
		node.value = newValue;
	},
};

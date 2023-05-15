"use strict";
module.exports = {
	root: true,
	env: {
		node: true
	},
	parserOptions: {
		ecmaVersion: 2020,
		parser: "@typescript-eslint/parser",
		sourceType: "module"
	},
	extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "prettier"],
	plugins: ["@typescript-eslint", "prettier", "vue"],
	rules: {
		// "off" or 0 - 关闭规则
		// "warn" or 1 - 将规则视为一个警告
		// "error" or 2 - 将规则视为一个错误
		// 强制使用 === 和 !==
		eqeqeq: 2,
		"vue/eqeqeq": 2,
		"vue/multi-word-component-names": "off",
		//一行结束后面不要有空格
		"no-trailing-spaces": 1,
		// 禁止使用var，用let和const代替
		"no-var": 2,
		"@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
		"vue/attributes-order": "error" // vue api使用顺序，强制执行属性顺序
	}
};

module.exports = {
	"env": {
		"browser": true,
		"node": true,
		"mocha": true,
		"es6": true,
		"amd": false,
	},
	"parserOptions": {
		"ecmaVersion": 2017,
		"sourceType": "module"
	},
	"extends": ["eslint:recommended"],
	"rules": {
		"no-console": "off",
		"dot-location": ["error", "property"],
		"linebreak-style": ["error", "unix"],
		"eqeqeq": ["error"],
		"curly": ["error", "all"],
		"dot-notation": ["error"],
		"no-throw-literal": ["error"],
		"no-useless-call": ["error"],
		"no-unmodified-loop-condition": ["error"],
		"quote-props": ["error", "as-needed" /*"as-needed"*/],
		"quotes": ["error", "single"],
		"no-lonely-if": ["error"],
		"semi": ["error", "never"],
		//STYLE
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"no-multi-spaces": ["error"],
		"array-bracket-spacing": ["error", "never"],
		"block-spacing": ["error", "always"],
		"func-call-spacing": ["error", "never"],
		"key-spacing": ["error", { "beforeColon": true, "afterColon": true }],
		"brace-style": ["error", "1tbs"],
		"space-in-parens": ["error", "never"],
		"eol-last": ["error", "always"],
		"lines-between-class-members": ["error", "always"],
		"no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
		"no-unneeded-ternary": ["error"],
		"object-curly-spacing": ["error", "always"],
		"space-unary-ops": ["error", { "words": true, "nonwords": false }],
		"block-spacing": ["error", "always"],
		"keyword-spacing": ["error", { "before": true }],
		"space-before-function-paren": ["error", { "anonymous": "never", "named": "never", "asyncArrow": "always" }],
		"comma-spacing": ["error", { "before": false, "after": true }],
		"space-before-blocks": ["error", { "functions": "never", "keywords": "never", "classes": "always" }]
	}
};
module.exports = {
	plugins: [
		"unicorn",
		"sonarjs"
	],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"plugin:unicorn/recommended",
		"plugin:sonarjs/recommended"
	],
	rules: {
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "enum",
				"format": ["PascalCase"],
			},
			{
				"selector": "enumMember",
				"format": ["UPPER_CASE"]
			},
			{
				"selector": "classMethod",
				"format": ["camelCase"],
			},
			{
				"selector": "classProperty",
				"format": ["camelCase"],
			},
			{
				"selector": "class",
				"format": ["PascalCase"],
			}
		],

		"unicorn/filename-case": [
			"error",
			{
				"case": "camelCase"
			}
		],
		"object-curly-spacing": [
			"error",
			"always"
		],
		'unicorn/no-null': 'off',
		"no-var": "error",
		"prefer-const": 'off',
		"sonarjs/cognitive-complexity": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"unicorn/no-static-only-class": "off",
	}
};

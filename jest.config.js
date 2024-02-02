
module.exports = {

	"testMatch": [
		"**/*.spec.ts"
	],
	"testEnvironment": "node",
	"moduleFileExtensions": [
		"ts",
		"js"
	],
	"transform": {
		"^.+\\.ts$": "ts-jest"
	},
	"coverageDirectory": "coverage",
	"coverageReporters": [
		"text",
		"lcov"
	],
	"collectCoverageFrom": [
		"src/**/*.ts",
		"!src/**/*.d.ts"
	],
	"coverageThreshold": {
		"global": {
			"branches": 5,
			"functions": 5,
			"lines": 5,
		}
	},
	"preset": "ts-jest",
	"modulePathIgnorePatterns": [
		"<rootDir>/dist/",
		"<rootDir>/node_modules/",
	],
	"moduleNameMapper": {
		"@/(.*)": "<rootDir>/src/$1"
	}

}

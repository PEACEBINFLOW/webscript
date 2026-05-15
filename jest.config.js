module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
testMatch: ['/tests//.test.ts'],
collectCoverage: false,
moduleNameMapper: {
'^@/(.)$': '<rootDir>/src/$1'
}
};

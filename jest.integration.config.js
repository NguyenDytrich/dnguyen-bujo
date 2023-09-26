/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/$1",
  },
  globalSetup: "<rootDir>/tests/integration/setup.ts",
  globalTeardown: "<rootDir>/tests/integration/teardown.ts",
  setupFiles: ["dotenv/config"],
};

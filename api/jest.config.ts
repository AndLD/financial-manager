import type { Config } from 'jest'

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        testEnvironment: 'node',
        setupFilesAfterEnv: ['./tests/index.ts'],
        coverageDirectory: './tests/coverage',
        verbose: true
    }
}

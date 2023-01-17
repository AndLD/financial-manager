import type { Config } from 'jest'

export default async (): Promise<Config> => {
    return {
        preset: 'ts-jest',
        testEnvironment: 'node',
        setupFilesAfterEnv: ['./setup.ts'],
        verbose: true,
        rootDir: 'tests'
    }
}

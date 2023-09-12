export const END_OF_LINE = '\n'
export const END_OF_COMMENT = '*/'
export const TS_FILE_EXTENSION = '.ts'
export const IDENTIFIER_REGEX = /\/\*\s?doc\s?\*\//

export const promptify = (functionText: string): string =>
    'Generate a detailed JSDoc-style TypeDoc comment for the following TypeScript function:' +
    END_OF_LINE +
    '```typescript' +
    functionText +
    '```' +
    END_OF_LINE +
    'Ensure the description is accurate and clear. If any detail (e.g., return type, parameter types, parameter descriptions) cannot be determined, omit that part of the comment'

export const ignorables = [
    'node_modules',
    'dist',
    'build',
    'coverage',
    'test',
    'tests',
    'spec',
    'specs',
    'docs',
    'doc',
    'docs',
    'out',
    'docusaurus',
    'docusaurus.config.js',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    'tsconfig.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    "README.md",
    ".DS_Store",
    ".git",
    ".prettierrc.yml",
    ".gitignore",
    ".env",
    "bun.lockb"
]

export const END_OF_LINE = '\n'
export const END_OF_COMMENT = '*/'
export const TS_FILE_EXTENSION = '.ts'
export const IDENTIFIER_REGEX = /\/\*\s?doc\s?\*\//

export const promptify = (functionText: string): string => `
        Please generate a comprehensive and detailed JSDoc-style TypeDoc comment for the following TypeScript function:
        \`\`\`typescript
        ${functionText}
        \`\`\`
        The comment should offer a clear understanding of the function's purpose, its parameters, and its return value. Ensure that all explanations are accurate, thorough, and free of jargon. If certain details (like return type, parameter types, or parameter descriptions) cannot be confidently determined, please mention them as ambiguous or omit them.
    `

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
    'README.md',
    '.DS_Store',
    '.git',
    '.prettierrc.yml',
    '.gitignore',
    '.env',
    'bun.lockb'
]

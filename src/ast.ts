import ts from 'typescript'
import fs from 'fs'

import { config, fetchCompletion } from './api'
import { IDENTIFIER_REGEX } from './constants'

const isFunctionDeclaration = (node: ts.Node): node is ts.FunctionDeclaration => {
    return node.kind === ts.SyntaxKind.FunctionDeclaration || node.kind === ts.SyntaxKind.VariableStatement
}

const readFileContent = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf-8')
}

const getFunctionTextFromNode = (node: ts.Node, sourceFile: ts.SourceFile): string | null => {
    const nodeText = node.getFullText(sourceFile)
    const commentMatch = IDENTIFIER_REGEX.exec(nodeText)
    if (!commentMatch) return null
    return nodeText.slice(commentMatch.index + commentMatch[0].length).trim()
}

const generateDocumentationForFunction = async (functionText: string): Promise<string> => {
    const generatedDoc = await fetchCompletion(config(functionText))
    return `${generatedDoc}\n${functionText}`
}

const applyReplacementsToContent = (content: string, replacements: Array<{ original: string; replacement: string }>): string => {
    replacements.forEach(r => {
        if (content.includes(r.original)) {
            content = content.replace(r.original, r.replacement)
        } else {
            console.warn('Failed to replace', r.original)
        }
    })
    return content
}

const processNode = async (node: ts.Node, sourceFile: ts.SourceFile, dry: boolean, replacements: Array<{ original: string; replacement: string }>): Promise<void> => {
    if (!isFunctionDeclaration(node)) return
    const functionText = getFunctionTextFromNode(node, sourceFile)
    if (!functionText) return

    if (dry) {
        console.log('Function', functionText)
        return
    }

    const generatedDoc = await generateDocumentationForFunction(functionText)
    const nodeText = node.getFullText(sourceFile)
    replacements.push({
        original: nodeText,
        replacement: generatedDoc
    })
}

export const processFile = async (filePath: string, dry: boolean) => {
    let content = readFileContent(filePath)
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true)
    const replacements: Array<{ original: string; replacement: string }> = []

    const processChildNodes = async (node: ts.Node) => {
        await processNode(node, sourceFile, dry, replacements)
        for (const child of node.getChildren()) {
            await processChildNodes(child)
        }
    }

    await processChildNodes(sourceFile)

    if (!dry) {
        content = applyReplacementsToContent(content, replacements)
        fs.writeFileSync(filePath, content)
    }
}

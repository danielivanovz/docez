import ts from 'typescript'
import fs from 'fs'
import { config, fetchCompletion } from './api'
import { IDENTIFIER_REGEX } from './constants'
import { Replacement } from './types'

const generateDocForFunction = async (functionText: string): Promise<string> => fetchCompletion(config(functionText))
const readFile = (filePath: string): string => fs.readFileSync(filePath, 'utf-8')
const writeFile = (filePath: string, content: string): void => fs.writeFileSync(filePath, content)
const isFunctionDeclaration = (node: ts.Node): node is ts.FunctionDeclaration =>
    [
        ts.SyntaxKind.FunctionDeclaration,
        ts.SyntaxKind.FunctionExpression,
        ts.SyntaxKind.ArrowFunction,
        ts.SyntaxKind.MethodDeclaration,
        ts.SyntaxKind.VariableStatement
    ].includes(node.kind)

const applyReplacements = (content: string, replacements: Array<Replacement>): string => {
    return replacements
        .sort((a, b) => b.startPos - a.startPos)
        .reduce((acc, r) => acc.substring(0, r.startPos) + r.replacement + acc.substring(r.endPos), content)
}

const traverseNodes = async (node: ts.Node, callback: Function, ...args: any[]) => {
    await callback(node, ...args)
    for (const child of node.getChildren()) {
        await traverseNodes(child, callback, ...args)
    }
}

export const processFileForDocs = async (filePath: string, dry: boolean) => {
    let content = readFile(filePath)
    const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true)
    const replacements: Array<Replacement> = []

    await traverseNodes(sourceFile, processFunctionNodeForDocs, sourceFile, dry, replacements)

    if (!dry) {
        content = applyReplacements(content, replacements)
        writeFile(filePath, content)
    }
}

const getDocCommentFromNode = (node: ts.Node, sourceFile: ts.SourceFile): ts.CommentRange | null => {
    const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos)
    if (!comments) return null

    for (const comment of comments) {
        if (sourceFile.text.substring(comment.pos, comment.end).match(IDENTIFIER_REGEX)) {
            return comment
        }
    }

    return null
}

const processFunctionNodeForDocs = async (
    node: ts.Node,
    sourceFile: ts.SourceFile,
    dry: boolean,
    replacements: Array<Replacement>
): Promise<void> => {
    if (!isFunctionDeclaration(node)) return

    const comment = getDocCommentFromNode(node, sourceFile)
    if (!comment) return

    const functionText = node.getFullText(sourceFile).trim()
    if (dry) {
        console.log('Parsed function:', functionText)
        return
    }

    replacements.push({
        startPos: comment.pos,
        endPos: comment.end,
        replacement: await generateDocForFunction(functionText)
    })
}

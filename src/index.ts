import { walk } from './walk'

const run = async () => {
    try {
        const rootDirectory = './'
        await walk(rootDirectory, false)
        console.log('Documentation generated successfully!')
    } catch (error) {
        console.error('Failed to generate documentation:', error)
    }
}

run()

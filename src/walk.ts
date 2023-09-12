import fs from 'fs'
import path from 'path'
import { processFile } from './ast'
import { TS_FILE_EXTENSION, ignorables } from './constants'


export const walk = async (directoryPath: string, dry: boolean) => {
    console.log(`Entering directory: ${directoryPath}`);

    let files;
    try {
        files = fs.readdirSync(directoryPath);
    } catch (err) {
        console.error(`Error reading directory ${directoryPath}:`, err);
        return;
    }

    for (const file of files) {
        const fullPath = path.join(directoryPath, file);

        if (ignorables.includes(file)) {
            console.log(`Skipping ignorable: ${fullPath}`);
            continue;
        }

        if (fs.lstatSync(fullPath).isSymbolicLink()) {
            console.log(`Skipping symbolic link: ${fullPath}`);
            continue;
        }

        console.log('Processing', fullPath);

        if (fs.statSync(fullPath).isDirectory()) {
            await walk(fullPath, dry);
        } else if (path.extname(fullPath) === TS_FILE_EXTENSION) {
            try {
                await processFile(fullPath, dry);
            } catch (err) {
                console.error(`Error processing file ${fullPath}:`, err);
            }
        }
    }

    console.log(`Exiting directory: ${directoryPath}`);
};
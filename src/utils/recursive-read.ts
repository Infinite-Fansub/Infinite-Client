import { readdirSync } from "fs";

export default function recursiveReaddirSync(path: string): string[] {
    return readdirSync(path, { withFileTypes: true })
        .flatMap(dirent => dirent.isDirectory()
            ? recursiveReaddirSync(`${path}/${dirent.name}`)
            : `${path}/${dirent.name}`);
};
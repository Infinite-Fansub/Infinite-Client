import { readdir, stat } from "fs"
import { resolve } from "path"

export default function recursiveRead(dir: string, done: (err: Error | null, results?: string[]) => void, filter?: (f: string) => boolean) {
    let results: string[] = [];

    readdir(dir, (err: Error | null, list: string[]) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);

        list.forEach((file: string) => {
            file = resolve(dir, file);
            stat(file, (err2, stat) => {
                if (stat && stat.isDirectory()) {
                    recursiveRead(file, (err3, res) => {
                        if (res) results = results.concat(res);
                        if (!--pending) done(null, results);
                    }, filter);
                } else {
                    if (typeof filter === "undefined" || (filter && filter(file))) results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
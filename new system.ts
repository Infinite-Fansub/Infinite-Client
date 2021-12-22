type Guild = string | string[]
type Post = "ALL" | "GLOBAL" | Guild
interface Test {
    post?: Post
}

class Types {

    public type: string | [] = ""

    constructor(x: Post) {
        this.check(x)
    }

    private check(x: Post): void {
        if (this.isAll(x)) return
        if (this.isGlobal(x)) return
        if (this.isArray(x)) this.type = []
        else throw new Error("F")
    }

    private isAll(x: Post) {
        return x === "ALL" ? true : false
    }

    private isGlobal(x: Post) {
        return x === "GLOBAl" ? true : false
    }

    private isArray(x: Post) {
        return Array.isArray(x) ? true : false
    }

    get Type() {
        return this.type
    }
}

const b = new Types("ALL").Type

console.log(typeof b)
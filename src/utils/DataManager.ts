import log4js from "log4js"
import { exists, unlink, move, writeFile, existsSync, readFileSync } from "fs-extra"
import { join } from "path"

import { Store, Article } from "./Types"

const Logger = log4js.getLogger("DataManager")
const existsP = (path: string): Promise<boolean> => new Promise((resolve) => exists(path, resolve))

const path = join(__dirname, "../../src/data/")
const store = join(path, "store.json")
const oldstore = join(path, "store.json.old")
const defaultStore: Store = {
    lastID: "0",
    channels: []
}

export default class DataManager {
    store: Store = defaultStore
    articles: Article[] = []

    constructor() {
        this.articles = JSON.parse(readFileSync(join(path, "articles.json")).toString())
        Logger.info(`Loaded ${this.articles.length} articles`)

        try {
            if (existsSync(store))
                try {
                    this.store = Object.assign({}, defaultStore, JSON.parse(readFileSync(store).toString()))
                    return
                } catch (error) {
                    Logger.error("Failed to read/parse store.json")
                }

            if (existsSync(oldstore))
                try {
                    this.store = Object.assign({}, defaultStore, JSON.parse(readFileSync(oldstore).toString()))
                    Logger.error("Restored from old store!")
                    return
                } catch (error) {
                    Logger.error("Failed to read/parse store.json.old")
                }

            // writeFileSync(store, JSON.stringify(this.store))
        } catch (error) {
            Logger.error("Failed to open store.json", error)
        }
    }

    lastReleased = 0
    getLastReleasedIndex(): number {
        while (this.lastReleased < this.articles.length && this.articles[this.lastReleased].publishedDate <= Date.now())
            this.lastReleased++

        return this.lastReleased - 1
    }

    getLatestArticle(): Article {
        return this.articles[this.getLastReleasedIndex()]
    }

    getNextArticle(): Article | undefined {
        return this.articles[this.getLastReleasedIndex()+1]
    }

    getRandomArticle(): Article {
        return this.articles[Math.floor(Math.random() * (this.getLastReleasedIndex()+1))]
    }

    getArticle(id: string): Article | undefined {
        const article = this.articles.find(art => art.id === id)
        if (article && article.ind > this.getLastReleasedIndex())
            return undefined

        return article
    }

    searchArticles(query: string[]): Article[] {
        return this.articles.filter(art => art.ind <= this.getLastReleasedIndex() && query.every(q => art.headline.toLowerCase().includes(q.toLowerCase().trim())))
    }

    lastStore: number | NodeJS.Timeout | undefined = undefined
    saveStore(): void {
        if (this.lastStore == undefined) {
            this.lastStore = setTimeout(async () => {
                try {
                    if (await existsP(oldstore))
                        await unlink(oldstore)

                    if (await existsP(store))
                        await move(store, oldstore)

                    await writeFile(store, JSON.stringify(this.store, undefined, 4))
                } catch (error) {
                    Logger.error("Failed to save", error)
                }
                this.lastStore = undefined
            }, 1000)
        }
    }
}

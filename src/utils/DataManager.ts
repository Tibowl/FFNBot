import log4js from "log4js"
import { exists, unlink, move, writeFile, existsSync, readFileSync } from "fs-extra"
import { join } from "path"

import {   Store,   } from "./Types"

const Logger = log4js.getLogger("DataManager")
const existsP = (path: string): Promise<boolean> => new Promise((resolve) => exists(path, resolve))

const path = join(__dirname, "../../src/data/")
const store = join(path, "store.json")
const oldstore = join(path, "store.json.old")

export default class DataManager {
    store: Store = {  }

    constructor() {
        try {
            if (existsSync(store))
                try {
                    this.store = JSON.parse(readFileSync(store).toString())
                    return
                } catch (error) {
                    Logger.error("Failed to read/parse store.json")
                }

            if (existsSync(oldstore))
                try {
                    this.store = JSON.parse(readFileSync(oldstore).toString())
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
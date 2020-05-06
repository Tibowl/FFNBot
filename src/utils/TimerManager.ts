import log4js from "log4js"

import client from "../main"
import config from "../data/config.json"
import { Article } from "./Types"

const Logger = log4js.getLogger("TweetManager")

export default class TimerManager {
    activityTimer: NodeJS.Timeout | undefined = undefined
    previousPost: Article | undefined

    init(): void {
        const { data } = client
        this.previousPost = data.getArticle(data.store.lastID) ?? data.getNextArticle()

        data.store.lastID = this.previousPost.id
        data.saveStore()
        this.postNewArticles() // TODO put on timer? Use date?

        const updateActivity = (): void => {
            if (client.user == undefined) {
                this.activityTimer = setTimeout(updateActivity, 1000)
                return
            }

            client.user.setActivity(config.activity, {
                type: "LISTENING"
            })
        }

        if (this.activityTimer == undefined)
            setTimeout(updateActivity, 1000)
    }

    postNewArticles(): void {
        if (this.previousPost === undefined) return

        const { data } = client
        const newArticles = data.articles.slice(this.previousPost.ind+1, data.getLastReleasedIndex()+1)

        if (newArticles.length === 0) return
        Logger.info(`Found ${newArticles.length} new articles`)

        for (const article of newArticles) {
            this.previousPost = article
            data.store.lastID = this.previousPost.id

            Logger.info(`Posting ${article.id}: ${article.headline}...`)
            // TODO
        }
        data.saveStore()
    }
}

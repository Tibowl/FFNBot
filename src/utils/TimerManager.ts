import log4js from "log4js"

import client from "../main"
import config from "../data/config.json"
import { Article } from "./Types"
import { sendToChannels, displayArticle, getURL, truncate } from "../utils/Utils"

const Logger = log4js.getLogger("TimerManager")

export default class TimerManager {
    activityTimer: NodeJS.Timeout | undefined = undefined
    previousPost: Article | undefined

    init(): void {
        const { data } = client
        this.previousPost = data.getArticle(data.store.lastID) ?? data.getLatestArticle()

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

    async postNewArticles(): Promise<void> {
        if (this.previousPost === undefined) return

        const { data } = client
        const newArticles = data.articles.slice(this.previousPost.ind+1, data.getLastReleasedIndex()+1)

        Logger.info(`Found ${newArticles.length} new articles`)

        if (!config.production) {
            Logger.info("In dev mode, not posting")
            return
        }

        if (newArticles.length > 10) {
            Logger.error("More than 10 new articles, skipping posting")
            return
        }

        for (const article of newArticles) {
            this.previousPost = article
            data.store.lastID = this.previousPost.id

            Logger.info(`Posting ${article.id}: ${article.headline}...`)
            await sendToChannels(data.store.channels, "A new article has been published", displayArticle(article))
            await client.tweetManager.postTweet(`${truncate(article.headline, 220)} | #FakeFakeNews ${getURL(article, false)}`)
            await client.redditManager.post(article.headline, getURL(article, true))
        }
        data.saveStore()

        const next = data.getNextArticle()
        if (next == undefined) return

        const target = next.publishedDate + 60000
        const time = target - Date.now()
        Logger.info(`Next article at ${(time / 1000 / 60).toFixed(1)}m from now (at ${new Date(target).toISOString()})`)

        setTimeout(() => {
            this.postNewArticles()
        }, time)
    }
}

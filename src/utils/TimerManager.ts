import log4js from "log4js"

import client from "../main"
import config from "../data/config.json"
import { Article } from "./Types"
import { sendToChannels, displayArticle, getURL, truncate, sendError } from "../utils/Utils"

const Logger = log4js.getLogger("TimerManager")
const news = [
    "*NEWS FLASH*",
    "*BREAKING NEWS*",
    "**BREAKING NEWS**",
    "*NEWS UPDATE*",
    "**NEWS UPDATE**"
]

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

    getBreakingNews(): string {
        return news[Math.floor(Math.random() * news.length)]
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

        if (newArticles.length > 0) {
            const article = newArticles[0]
            this.previousPost = article
            data.store.lastID = this.previousPost.id

            Logger.info(`Posting ${article.id}: ${article.headline}...`)
            await this.postArticle(article)
        }
        data.saveStore()

        const next = data.articles[this.previousPost.ind+1]
        if (next == undefined) return

        const target = Math.max(next.publishedDate + 60*1000, Date.now() + 30*60*1000)
        const time = target - Date.now()
        Logger.info(`Next article in ${(time / 1000 / 60).toFixed(1)}m from now (at ${new Date(target).toISOString()})`)

        setTimeout(() => {
            this.postNewArticles()
        }, time)
    }

    async postArticle(article: Article): Promise<void> {
        const { data } = client

        try {
            await sendToChannels(data.store.channels, this.getBreakingNews(), displayArticle(article))
        } catch (error) {
            Logger.error(`Failed to post on discord: ${article.id}`)
            sendError(`Failed to post on discord: ${article.id}`)
        }
        try {
            await client.tweetManager.postTweet(`${truncate(article.headline, 220)} | #FakeFakeNews ${getURL(article, false)}`)
        } catch (error) {
            Logger.error(`Failed to tweet: ${article.id}`)
            sendError(`Failed to tweet: ${article.id}`)
        }
        try {
            await client.redditManager.post(article.headline, getURL(article, true))
        } catch (error) {
            Logger.error(`Failed to post on reddit: ${article.id}`)
            sendError(`Failed to post on reddit: ${article.id}`)
        }
    }
}

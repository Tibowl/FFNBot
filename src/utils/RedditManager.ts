import log4js from "log4js"
import Snoowrap from "snoowrap"

import config from "../data/config.json"

const Logger = log4js.getLogger("RedditManager")

export default class RedditManager {
    r: Snoowrap = new Snoowrap(config.reddit);

    async post(title: string, url: string): Promise<unknown> {
        Logger.info(`Posting ${title}`)
        return new Promise((resolve, reject) =>
            this.r.getSubreddit("FakeFakeNewsArticles").submitLink({
                title,
                url
            } as never)
                .then(submission => submission.assignFlair({
                    text: "News",
                    cssClass: "li-fl-news",
                }))
                .then(resolve)
                .catch(reject)
        )
    }
}

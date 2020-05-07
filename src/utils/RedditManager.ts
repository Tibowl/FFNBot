import log4js from "log4js"
import Snoowrap from "snoowrap"

import config from "../data/config.json"

const Logger = log4js.getLogger("RedditManager")

export default class RedditManager {
    r: Snoowrap = new Snoowrap(config.reddit);

    async post(title: string, url: string): Promise<void> {
        Logger.info(`Posting ${title}`)
        this.r.getSubreddit("FakeFakeNewsArticles").submitLink({
            title,
            url
        } as never)
    }
}

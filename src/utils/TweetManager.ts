import log4js from "log4js"
import Twit from "twit"
import { Status as Tweet, FullUser, User } from "twitter-d"

import config from "../data/config.json"

const Logger = log4js.getLogger("TweetManager")

function isFullUser(user: User): user is FullUser {
    return "screen_name" in user
}

export default class Tweetmanager {
    T: Twit = new Twit(config.twitter)

    async postTweet(status: string): Promise<void> {
        const tweet = { status }
        Logger.info(`Tweeting ${status}`)
        const response = await this.T.post("statuses/update", tweet)
        const data: Tweet = response.data as Tweet
        const user = data.user
        if (isFullUser(user))
            Logger.info(`Tweet: https://twitter.com/${user.screen_name}/${data.id_str}`)
    }
}

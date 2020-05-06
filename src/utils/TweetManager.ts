import log4js from "log4js"
import Twit from "twit"

import config from "../data/config.json"

const Logger = log4js.getLogger("TweetManager")


export default class Tweetmanager {
    T: Twit | undefined

    init(): void {
        this.T = new Twit(config.twitter)
        Logger.info("Loaded Twitter")
    }
}

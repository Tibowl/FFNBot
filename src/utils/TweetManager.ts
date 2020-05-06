import log4js from "log4js"

const Logger = log4js.getLogger("TweetManager")

export default class Tweetmanager {
    init(): void {
        //const T = new Twit(config.twitter)
        Logger.info("Loaded Twitter")
    }
}

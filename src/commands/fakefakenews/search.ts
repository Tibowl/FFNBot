import { Message } from "discord.js"

import Command from "../../utils/Command"
import client from "../../main"
import  { displayArticle } from "../../utils/Utils"

export default class SearchArticle extends Command {
    constructor(name: string) {
        super({
            name,
            category: "FakeFakeNews",
            help: "Search for an article, shows a random one if multiple matched",
            usage: "search <search terms>",
            aliases: ["find", "lookup"]
        })
    }

    async run(message: Message, args: string[]): Promise<Message | Message[]> {
        if (!args || args.length < 1) return message.reply("Must provide a search term.")
        const { data } = client

        const articles = data.searchArticles(args)

        if (articles.length === 0)
            return message.channel.send("Couldn't find any articles matching that!")

        const match = Math.floor(Math.random() * articles.length)
        const reply = articles.length > 1 ? `${articles.length} articles found, showing #${match+1}` : "1 article found"

        return message.channel.send(reply, displayArticle(articles[match]))
    }
}

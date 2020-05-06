import { Message } from "discord.js"

import Command from "../../utils/Command"
import client from "../../main"
import  { displayArticle } from "../../utils/Utils"

export default class Article extends Command {
    constructor(name: string) {
        super({
            name,
            category: "FakeFakeNews",
            help: "Show an article",
            usage: "article <id>",
            aliases: ["show", "id"]
        })
    }

    async run(message: Message, args: string[]): Promise<Message | Message[]> {
        if (!args || args.length < 1) return message.reply("Must provide an article ID.")
        const { data } = client

        const id = args[0]
        const article = data.getArticle(id)

        if (article === undefined)
            return message.channel.send("Couldn't find ID!")

        return message.channel.send(displayArticle(article))
    }
}

import { Message } from "discord.js"

import Command from "../../utils/Command"
import client from "../../main"
import  { listArticles } from "../../utils/Utils"

export default class Recent extends Command {
    constructor(name: string) {
        super({
            name,
            category: "FakeFakeNews",
            help: "List the most recent articles",
            usage: "recent",
            aliases: ["new", "articles", "r"]
        })
    }

    async run(message: Message): Promise<Message | Message[]> {
        const { data } = client
        return message.channel.send(
            listArticles(
                data.articles.slice(
                    data.getLastReleasedIndex()-4,
                    data.getLastReleasedIndex()+1
                ).reverse(), message.author
            )
        )
    }
}

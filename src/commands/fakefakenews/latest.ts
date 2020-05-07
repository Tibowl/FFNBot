import { Message } from "discord.js"

import Command from "../../utils/Command"
import client from "../../main"
import  { displayArticle } from "../../utils/Utils"

export default class Latest extends Command {
    constructor(name: string) {
        super({
            name,
            category: "FakeFakeNews",
            help: "Show latest article",
            usage: "latest",
            aliases: ["new"]
        })
    }

    async run(message: Message): Promise<Message | Message[]> {
        return message.channel.send(displayArticle(client.data.getLatestArticle()))
    }
}

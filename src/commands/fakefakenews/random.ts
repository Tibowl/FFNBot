import { Message } from "discord.js"

import Command from "../../utils/Command"
import client from "../../main"
import  { displayArticle } from "../../utils/Utils"

export default class RandomArticle extends Command {
    constructor(name: string) {
        super({
            name,
            category: "FakeFakeNews",
            help: "Show a random article",
            usage: "random",
            aliases: ["rng"]
        })
    }

    async run(message: Message): Promise<Message | Message[]> {
        return message.channel.send(displayArticle(client.data.getRandomArticle()))
    }
}

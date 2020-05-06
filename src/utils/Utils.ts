import {  Message, TextChannel, StringResolvable, MessageEmbed, MessageAttachment } from "discord.js"

import client from "./../main"
import { Article } from "./Types"

export function displayArticle(article: Article): MessageEmbed {
    const embed = new MessageEmbed()
        .setTitle(article.headline)
        .setAuthor(article.author, client.user?.avatarURL() ?? "https://cdn.discordapp.com/avatars/707704786253774852/b8d158121fca8e3ef692f17299107495.png?size=256", "https://www.fakefake.news/")
        .setDescription(article.description)
        .setTimestamp(article.publishedDate)
        .setURL(`https://www.fakefake.news/article/${article.id}`)
        .setFooter(article.category.replace(/^[a-z]/, a => a.toUpperCase()))
        .setColor("#ff0000")

    if (article.image !== "/")
        embed.setImage(`https://www.fakefake.news/_nuxt/assets/${article.image}`)

    return embed
}

export async function sendToChannels(channels: string[] | undefined, content?: StringResolvable, embed?: MessageEmbed | MessageAttachment): Promise<(Message | Message[])[]> {
    const messages = []
    if (!channels) return Promise.all([])

    for (const channel of channels) {
        const chanObj = await client.channels.fetch(channel)
        if (chanObj && chanObj instanceof TextChannel)
            messages.push(chanObj.send(content, embed))
    }

    return Promise.all(messages)
}

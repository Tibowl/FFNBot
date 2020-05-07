import {  Message, TextChannel, StringResolvable, MessageEmbed, MessageAttachment, User } from "discord.js"

import client from "./../main"
import { Article } from "./Types"


function limitIndex(words: string[], maxLength = 50): number {
    let end = 0; let currentLength = 0
    for (; end < words.length; end++) {
        if (currentLength + words[end].length >= maxLength) {
            break
        }
        currentLength += words[end].length + 1
    }
    return end
}

export function truncate(title: string, maxLength = 50): string {
    const words = title.split(" ")
    const end = limitIndex(words, maxLength)
    return `${words.slice(0, end).join(" ")}${end < words.length ? "..." : ""}`
}

function clean(title: string): string {
    const words = title.match(/[a-zA-Z\d'’]+/g)?.map(k => k.replace(/['’]/g, ""))
    if (words == undefined) return ""
    return words.slice(0, limitIndex(words)).filter(k => k.length > 0).join("-").toLowerCase()
}

export function getURL(article: Article, full: boolean): string {
    return `https://www.fakefake.news/article/${article.id}${full ? `-${clean(article.headline)}` : ""}`
}

function getAvatar(): string {
    return client.user?.avatarURL() ?? "https://cdn.discordapp.com/avatars/707704786253774852/b8d158121fca8e3ef692f17299107495.png?size=256"
}
function generalEmbed(): MessageEmbed {
    return new MessageEmbed()
        .setColor("#ff0000")
        .setThumbnail(getAvatar())
}

export function displayArticle(article: Article): MessageEmbed {
    const embed = generalEmbed()
        .setTitle(article.headline)
        .setAuthor(article.author, getAvatar(), "https://www.fakefake.news/")
        .setDescription(article.description)
        .setTimestamp(article.publishedDate)
        .setURL(`https://www.fakefake.news/article/${article.id}`)
        .setFooter(article.category.replace(/^[a-z]/, a => a.toUpperCase()))

    if (article.image !== "/") {
        embed.setImage(`https://www.fakefake.news/_nuxt/assets/${article.image}`)
            .setThumbnail("")
    }

    return embed
}

export function listArticles(articles: Article[], user: User): MessageEmbed {
    return generalEmbed()
        .setTitle("Most recent articles")
        .setURL("https://www.fakefake.news/")
        .setFooter(`Requested by ${user.tag}`)
        .setDescription(articles.map(
            (article, ind) =>
                `${ind+1}) \`${article.id}\`: [${article.headline}](${getURL(article, true)})`
        ).join("\n\n"))
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

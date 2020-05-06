import {  Message, TextChannel, StringResolvable, MessageEmbed, MessageAttachment } from "discord.js"
import client from "./../main"


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

export function shiftDate(date: Date, time: number): Date {
    date.setUTCDate(date.getUTCDate() + time)
    return date
}
export function shiftMonth(date: Date, time: number): Date {
    date.setUTCMonth(date.getUTCMonth() + time)
    return date
}
export function shiftHour(date: Date, time: number): Date {
    date.setUTCHours(date.getUTCHours() + time)
    return date
}
export function shiftMinute(date: Date, time: number): Date {
    date.setUTCMinutes(date.getUTCMinutes() + time)
    return date
}

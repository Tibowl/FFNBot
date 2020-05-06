import { shiftMinute } from "./Utils"
import client from "../main"
import config from "../data/config.json"

export default class TimerManager {
    activityTimer: NodeJS.Timeout | undefined = undefined

    init(): void {
        const updateActivity = (): void => {
            const now = new Date()
            const nextMinute = new Date()
            nextMinute.setUTCSeconds(0, 0)
            shiftMinute(nextMinute, 1)

            let delay = nextMinute.getTime() - now.getTime()
            if (delay < 15000)
                delay += 60000

            if (client.user == undefined)
                delay = 1000
            this.activityTimer = setTimeout(updateActivity, delay + 500)

            if (client.user == undefined)
                return

            client.user.setActivity(config.activity, {
                type: "LISTENING"
            })
        }

        if (this.activityTimer == undefined)
            updateActivity()
    }
}

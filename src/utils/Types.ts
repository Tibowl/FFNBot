export interface Store {
    stats?: Stats
}

export interface Stats {
    [key: string]: CommandStats
}
export interface CommandStats {
    [key: string]: number
}

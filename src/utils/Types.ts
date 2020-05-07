export interface Store {
    lastID: string
    channels: string[]
    stats?: Stats
}

export interface Stats {
    [key: string]: CommandStats
}
export interface CommandStats {
    [key: string]: number
}

export interface Article {
    id:            string
    headline:      string
    category:      Category
    date:          string
    description:   string
    author:        string
    image:         string
    size:          Size
    publishedDate: number
    ind:           number
    alt?:          string
}

export type Category = "entertainment" | "general" | "local" | "politics" | "sports"

export type Size = "large" | "medium" | "small"

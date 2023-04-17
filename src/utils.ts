export function makeImagePath(id : string, format?: string){
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`
}

export function makePosterPath(id : string){
    return `https://image.tmdb.org/t/p/original/${id}`
}

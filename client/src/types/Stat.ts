export interface Stat {
    _id?:string,
    userId: string,
    athleteId: string,
    type: string,
    value: number,
    recordedAt: Date,
}
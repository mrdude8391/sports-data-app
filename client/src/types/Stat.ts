import type { Athlete } from "./Athlete";

type BaseStatData = {
  attack: {
      kills: number,
      errors: number,
      total: number,
      percentage: number,
    },
    setting: {
      assists: number,
      errors: number,
      attempts: number,
    },
    serving: {
      rating: number,
      ratingTotal: number,
      aces: number,
      errors: number,
      attempts: number,
      percentage: number, 
    },
    receiving: {
      rating: number,
      ratingTotal: number,
      errors: number,
      attempts: number,
    },
    defense: {
      digs: number,
      rating: number,
      ratingTotal: number,
      errors: number,
      attempts: number,
    },
    blocking: {
      total: number,
      kills: number,
      solos: number,
      goodTouches: number,
      attempts: number,
      errors: number,
    },
}

export type Stat= {
    id?:string,
    userId: string,
    athleteId: string,
    attack: {
      kills: number,
      errors: number,
      total: number,
      percentage: number,
    },
    setting: {
      assists: number,
      errors: number,
      attempts: number,
    },
    serving: {
      rating: number,
      ratingTotal: number,
      aces: number,
      errors: number,
      attempts: number,
      percentage: number, 
    },
    receiving: {
      rating: number,
      ratingTotal: number,
      errors: number,
      attempts: number,
    },
    defense: {
      digs: number,
      rating: number,
      ratingTotal: number,
      errors: number,
      attempts: number,
    },
    blocking: {
      total: number,
      kills: number,
      solos: number,
      goodTouches: number,
      attempts: number,
      errors: number,
    },
    recordedAt: Date,
    createdAt: Date,
    updatedAt: Date
}

export type StatForm = BaseStatData & {
  recordedAt : Date
};

export type StatPayload = BaseStatData & {
    recordedAt: Date,
}

export type StatResponse= BaseStatData & {
    _id:string,
    userId: string,
    athleteId: string,
    recordedAt: Date,
    createdAt: Date,
    updatedAt: Date
}

export type AthleteStatResponse= {
  athlete : Athlete,
  stats: StatResponse[]
}

export type StatCategory = keyof BaseStatData;
export type StatFieldKey<C extends StatCategory> = keyof BaseStatData[C]

export const initialStatForm: StatForm = {
  attack: {
      kills: 0,
      errors: 0,
      total: 0,
      percentage: 0,
    },
    setting: {
      assists: 0,
      errors: 0,
      attempts: 0,

    },
    serving: {
      rating: 0,
      ratingTotal: 0,
      aces: 0,
      errors: 0,
      attempts: 0,
      percentage: 0, 
    },
    receiving: {
      rating: 0,
      ratingTotal: 0,
      errors: 0,
      attempts: 0,
    },
    defense: {
      digs: 0,
      rating: 0,
      ratingTotal: 0,
      errors: 0,
      attempts: 0,
    },
    blocking: {
      total: 0,
      kills: 0,
      solos: 0,
      goodTouches: 0,
      attempts: 0,
      errors: 0,
    },
  recordedAt: new Date()
};

// export const InitialStatPayload: StatPayload = {
//   attack: {
//       kills: 0,
//       errors: 0,
//       total: 0,
//       percentage: 0,
//     },
//     setting: {
//       assists: 0,
//       errors: 0,
//     },
//     serving: {
//       rating: 0,
//       ratingTotal: 0,
//       aces: 0,
//       errors: 0,
//       attempts: 0,
//       percentage: 0, 
//     },
//     receiving: {
//       rating: 0,
//       ratingTotal: 0,
//       errors: 0,
//       attempts: 0,
//     },
//     defense: {
//       digs: 0,
//       rating: 0,
//       ratingTotal: 0,
//       errors: 0,
//       attempts: 0,
//     },
//     blocking: {
//       total: 0,
//       kills: 0,
//       solos: 0,
//       goodTouches: 0,
//       attempts: 0,
//       errors: 0,
//     },
//   recordedAt: new Date()
// };

// type AttackStat = {
//       kills: number,
//       errors: number,
//       total: number,
//       percentage: number,
//     }

// type SettingStat ={
//       assists: number,
//       errors: number,
//     }
// type ServingStat ={
//       rating: number,
//       ratingTotal: number,
//       aces: number,
//       errors: number,
//       attempts: number,
//       percentage: number, 
//     }
// type ReceivingStat = {
//       rating: number,
//       ratingTotal: number,
//       errors: number,
//       attempts: number,
//     }
// type DefenseStat ={
//       digs: number,
//       rating: number,
//       ratingTotal: number,
//       errors: number,
//       attempts: number,
//     }
// type BlockingStat = {
//       total: number,
//       kills: number,
//       solos: number,
//       goodTouches: number,
//       attempts: number,
//       errors: number,
//     }

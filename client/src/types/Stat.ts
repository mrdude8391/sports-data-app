export type Stat= {
    _id?:string,
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

export type StatForm = {
  [category: string]: {
    [field: string]: number;
  };
};




export type StatPayload = {
    attack: {
      kills: number,
      errors: number,
      total: number,
      percentage: number,
    },
    setting: {
      assists: number,
      errors: number,
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
}



export type StatResponse= {
    _id:string,
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

export const InitialStatForm: StatForm = {
  attack: {
      kills: 0,
      errors: 0,
      total: 0,
      percentage: 0,
    },
    setting: {
      assists: 0,
      errors: 0,
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

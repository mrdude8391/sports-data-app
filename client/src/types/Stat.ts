export type   Stat = {
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
      aces: number,
      errors: number,
      attempts: number,
    },
    passing: {
      rating: number,
      errors: number,
      attempts: number,
    },
    defense: {
      digs: number,
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

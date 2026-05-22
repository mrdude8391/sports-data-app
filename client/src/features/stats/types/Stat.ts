import type { Athlete } from "@/features/athletes/types/Athlete";

type AttackStats = {
  kills: number;
  errors: number;
  total: number;
  percentage: number;
};

type SettingStats = {
  assists: number;
  errors: number;
  attempts: number;
};

type ServingStats = {
  rating: number;
  ratingTotal: number;
  aces: number;
  errors: number;
  attempts: number;
  percentage: number;
};

type ReceivingStats = {
  rating: number;
  ratingTotal: number;
  errors: number;
  attempts: number;
};

type DefenseStats = {
  digs: number;
  rating: number;
  ratingTotal: number;
  errors: number;
  attempts: number;
};

type BlockingStats = {
  total: number;
  kills: number;
  solos: number;
  goodTouches: number;
  attempts: number;
  errors: number;
};

export type BaseStatData = {
  attack: AttackStats;
  setting: SettingStats;
  serving: ServingStats;
  receiving: ReceivingStats;
  defense: DefenseStats;
  blocking: BlockingStats;
};

export type Stat = BaseStatData & {
  id: string;
  userId: string;
  athleteId: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type NewStat = Omit<Stat, "id">;

export type NewStatPayload = {
  athleteId: string;
  statForm: NewStat;
};

export type AthleteStatResponse = {
  athlete: Athlete;
  stats: Stat[];
};

/**
 * A blank stat form with all stats set to 0.
 */
export const DEFAULT_STAT_FORM: NewStat = {
  userId: "",
  athleteId: "",
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
  createdAt: new Date(),
  recordedAt: new Date(),
  updatedAt: new Date(),
};

export type StatCategory =
  | "attack"
  | "setting"
  | "serving"
  | "defense"
  | "receiving"
  | "blocking";

// eg. want the labels of "attack" or labels of "receiving"
export type StatLabel<T extends BaseStatData[keyof BaseStatData]> = {
  key: keyof T & string;
  label: string;
};

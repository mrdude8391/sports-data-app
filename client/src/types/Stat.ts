import type { Athlete } from "./Athlete";

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

type BaseStatData = {
  attack: AttackStats;
  setting: SettingStats;
  serving: ServingStats;
  receiving: ReceivingStats;
  defense: DefenseStats;
  blocking: BlockingStats;
};

export type Stat = BaseStatData & {
  id?: string;
  userId: string;
  athleteId: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type StatForm = BaseStatData & {
  recordedAt: Date;
};

export type NewStatPayload = {
  athleteId: string;
  statForm: StatForm;
};

export type StatResponse = BaseStatData & {
  _id: string;
  userId: string;
  athleteId: string;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AthleteStatResponse = {
  athlete: Athlete;
  stats: StatResponse[];
};

/**
 * A blank stat form with all stats set to 0.
 */
export const DEFAULT_STAT_FORM: StatForm = {
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
  recordedAt: new Date(),
};

export type StatCategory =
  | "attack"
  | "setting"
  | "serving"
  | "defense"
  | "receiving"
  | "blocking";

export type Label = {
  key: string;
  label: string;
};

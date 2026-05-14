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

export type NewStat = {
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

export type StatCategoryKey = keyof StatCategory;

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
  | AttackStats
  | SettingStats
  | ServingStats
  | DefenseStats
  | ReceivingStats
  | BlockingStats;

// // Type: "kills" | "errors" | "total" | "percentage"
// type AttackKeys = keyof typeof Attack;

// // Type: "Kills" | "Attack Errors" | "Total Attacks" | "Hitting %"
// // (Requires 'as const' on the original object to work)
// type AttackValues = typeof Attack[keyof typeof Attack];

const AttackLabels = {
  kills: "Kills",
  errors: "Attack Errors",
  total: "Total Attacks",
  percentage: "Hitting %",
} as const;

const SettingLabels = {
  assists: "Assists",
  errors: "Setting Errors",
  attempts: "Setting Attempts",
} as const;

const ServingLabels = {
  rating: "Serve Rating",
  ratingTotal: "Serve Rating Total",
  aces: "Aces",
  errors: "Serve Errors",
  attempts: "Serve Attempts",
  percentage: "Serving %",
} as const;

const ReceivingLabels = {
  rating: "Receive Rating",
  ratingTotal: "Receive Rating Total",
  errors: "Receive Errors",
  attempts: "Receive Attempts",
} as const;

const DefenseLabels = {
  digs: "Digs",
  rating: "Passing Rating",
  ratingTotal: "Passing Rating Total",
  errors: "Passing Errors",
  attempts: "Passing Attempts",
} as const;

const BlockingLabels = {
  total: "Total Blocks",
  kills: "Block Kills",
  solos: "Solo Blocks",
  goodTouches: "Good Block Touches",
  attempts: "Block Attempts",
  errors: "Block Errors (+ tools)",
} as const;

type AttackLabels = typeof AttackLabels;
type SettingLabels = typeof SettingLabels;
type ServingLabels = typeof ServingLabels;
type ReceivingLabels = typeof ReceivingLabels;
type DefenseLabels = typeof DefenseLabels;
type BlockingLabels = typeof BlockingLabels;

export const STAT_LABELS_INDEX = {
  attack: AttackLabels,
  setting: SettingLabels,
  serving: ServingLabels,
  receiving: ReceivingLabels,
  defense: DefenseLabels,
  blocking: BlockingLabels,
} as const;

export type StatCategoryName = keyof typeof STAT_LABELS_INDEX;
export type StatLabels<C extends StatCategoryName> =
  (typeof STAT_LABELS_INDEX)[C];

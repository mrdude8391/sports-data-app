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

/**
 * The fields the client sends when creating or editing a stat.
 * id, userId, athleteId and the timestamps are set by the server / URL.
 */
export type NewStat = BaseStatData & {
  recordedAt: Date;
};

export type NewStatPayload = {
  athleteId: string;
  statForm: NewStat;
};

export type AthleteStatResponse = {
  athlete: Athlete;
  stats: Stat[];
};

/**
 * Returns a fresh blank stat form with all stats set to 0.
 * Always call this instead of sharing one object, so forms never share
 * nested category objects and recordedAt is "now" at creation time.
 */
export const createEmptyStatForm = (): NewStat => ({
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
});

/**
 * True when every stat in every category is 0 (recordedAt is ignored).
 */
export const isBlankStatForm = (form: BaseStatData): boolean =>
  STAT_CATEGORIES.every((category) =>
    Object.values(form[category]).every((value) => value === 0),
  );

const STAT_CATEGORIES: StatCategory[] = [
  "attack",
  "setting",
  "serving",
  "receiving",
  "defense",
  "blocking",
];

export type StatCategory = keyof BaseStatData; // "attack | receive ..."

export type StatFields<C extends StatCategory> = BaseStatData[C]; // "AttackStats"

export type StatFieldKey<C extends StatCategory> = keyof StatFields<C>; // "kills"

//eg. want the labels of "attack" or labels of "receiving"
export type StatLabel<C extends StatCategory> = {
  key: StatFieldKey<C> & string;
  label: string;
};

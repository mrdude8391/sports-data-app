import {
  type StatFields,
  type StatCategory,
  type BaseStatData,
  createEmptyStatForm,
} from "../types/Stat";

export type ActionTone = "good" | "bad" | "neutral";

type StatAction<C extends StatCategory> = {
  id: string;
  label: string;
  tone: ActionTone;
  /** Pure function: returns the category's counters after this action. */
  apply: (s: StatFields<C>) => StatFields<C>;
};

type CategoryConfig<C extends StatCategory> = {
  label: string;
  actions: StatAction<C>[];
  /** Short running tally shown on the category button. */
  summary: (s: StatFields<C>) => string;
};

type StatConfig = {
  [C in StatCategory]: CategoryConfig<C>;
};

/** One tap = one event. Totals are always derived from the event list. */
export type StatEvent = {
  category: StatCategory;
  action: string;
  label: string;
};

/** UI-only view of an action (no apply), safe to map over for any category. */
export type ActionButton = Pick<
  StatAction<StatCategory>,
  "id" | "label" | "tone"
>;

// ---------- helpers ----------

/** 0–3 pass-scale buttons. 0 counts as an error. */
const passScale = <C extends "receiving" | "defense">(
  onRate: (s: StatFields<C>, rating: number) => StatFields<C>,
): StatAction<C>[] =>
  [0, 1, 2, 3].map(
    (n): StatAction<C> => ({
      id: String(n),
      label: String(n),
      tone: n === 0 ? "bad" : n === 3 ? "good" : "neutral",
      apply: (s) => onRate(s, n),
    }),
  );

const round = (n: number, places: number) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};
const ratio = (num: number, den: number) => (den > 0 ? num / den : 0);

// ---------- config ----------

export const STAT_CONFIG: StatConfig = {
  attack: {
    label: "Attack",
    actions: [
      {
        id: "kill",
        label: "Kill",
        tone: "good",
        apply: (s) => ({ ...s, kills: s.kills + 1, total: s.total + 1 }),
      },
      {
        id: "error",
        label: "Error",
        tone: "bad",
        apply: (s) => ({ ...s, errors: s.errors + 1, total: s.total + 1 }),
      },
      {
        id: "inPlay",
        label: "In Play",
        tone: "neutral",
        apply: (s) => ({ ...s, total: s.total + 1 }),
      },
    ],
    summary: (s) => `${s.kills}K · ${s.errors}E · ${s.total}TA`,
  },

  receiving: {
    label: "Serve Receive",
    actions: passScale<"receiving">((s, n) => ({
      ...s,
      attempts: s.attempts + 1,
      ratingTotal: s.ratingTotal + n,
      errors: s.errors + (n === 0 ? 1 : 0),
    })),
    summary: (s) => `${s.attempts} att · ${s.rating.toFixed(1)} avg`,
  },

  serving: {
    label: "Serving",
    actions: [
      // error, 1/2/3 options hit, ace
      {
        id: "error",
        label: "Error",
        tone: "bad",
        apply: (s) => ({
          ...s,
          attempts: s.attempts + 1,
          errors: s.errors + 1,
        }),
      },
      ...[1, 2, 3].map(
        (n): StatAction<"serving"> => ({
          id: String(n),
          label: String(n),
          tone: "neutral",
          apply: (s) => ({
            ...s,
            attempts: s.attempts + 1,
            ratingTotal: s.ratingTotal + n,
          }),
        }),
      ),
      {
        id: "ace",
        label: "Ace",
        tone: "good",
        apply: (s) => ({
          ...s,
          attempts: s.attempts + 1,
          aces: s.aces + 1,
          ratingTotal: s.ratingTotal + 4,
        }),
      },
    ],
    summary: (s) => `${s.aces} ace · ${s.errors} err · ${s.attempts} att`,
  },

  defense: {
    label: "Digging",
    actions: passScale<"defense">((s, n) => ({
      ...s,
      attempts: s.attempts + 1,
      ratingTotal: s.ratingTotal + n,
      digs: s.digs + (n > 0 ? 1 : 0),
      errors: s.errors + (n === 0 ? 1 : 0),
    })),
    summary: (s) => `${s.digs} digs · ${s.errors} err`,
  },

  setting: {
    label: "Setting",
    actions: [
      {
        id: "assist",
        label: "Assist",
        tone: "good",
        apply: (s) => ({
          ...s,
          assists: s.assists + 1,
          attempts: s.attempts + 1,
        }),
      },
      {
        id: "error",
        label: "Error",
        tone: "bad",
        apply: (s) => ({
          ...s,
          errors: s.errors + 1,
          attempts: s.attempts + 1,
        }),
      },
      {
        id: "attempt",
        label: "Attempt",
        tone: "neutral",
        apply: (s) => ({ ...s, attempts: s.attempts + 1 }),
      },
    ],
    summary: (s) => `${s.assists} ast · ${s.errors} err`,
  },

  blocking: {
    label: "Blocking",
    actions: [
      {
        id: "kill",
        label: "Kill",
        tone: "good",
        apply: (s) => ({
          ...s,
          kills: s.kills + 1,
          total: s.total + 1,
          attempts: s.attempts + 1,
        }),
      },
      {
        id: "assist",
        label: "Assist",
        tone: "good",
        apply: (s) => ({
          ...s,
          kills: s.kills + 1,
          total: s.total + 1,
          attempts: s.attempts + 1,
        }),
      },
      {
        id: "touch",
        label: "Good Touch",
        tone: "neutral",
        apply: (s) => ({
          ...s,
          goodTouches: s.goodTouches + 1,
          attempts: s.attempts + 1,
        }),
      },
      {
        id: "tooled",
        label: "Tooled",
        tone: "bad",
        apply: (s) => ({ ...s, attempts: s.attempts + 1 }),
      },
      {
        id: "error",
        label: "Error",
        tone: "bad",
        apply: (s) => ({
          ...s,
          errors: s.errors + 1,
          attempts: s.attempts + 1,
        }),
      },
    ],
    summary: (s) => `${s.kills} blk · ${s.goodTouches} touch · ${s.errors} err`,
  },
};

/** Display order of the category grid. */
export const CATEGORY_ORDER: StatCategory[] = [
  "attack",
  "receiving",
  "serving",
  "defense",
  "setting",
  "blocking",
];

// ---------- aggregation ----------

const emptyStats = (): BaseStatData => {
  const { attack, setting, serving, receiving, defense, blocking } =
    createEmptyStatForm();
  return { attack, setting, serving, receiving, defense, blocking };
};

const applyEvent = <C extends StatCategory>(
  stats: BaseStatData,
  category: C,
  actionId: string,
): BaseStatData => {
  const action = STAT_CONFIG[category].actions.find((a) => a.id === actionId);
  if (!action) return stats;
  return { ...stats, [category]: action.apply(stats[category]) };
};

/** Fills in percentages / ratings from the raw counters. */
const deriveStats = (s: BaseStatData): BaseStatData => ({
  ...s,
  attack: {
    ...s.attack,
    percentage: round(
      ratio(s.attack.kills - s.attack.errors, s.attack.total),
      3,
    ),
  },
  serving: {
    ...s.serving,
    rating: round(ratio(s.serving.ratingTotal, s.serving.attempts), 1),
    percentage: round(
      ratio(s.serving.attempts - s.serving.errors, s.serving.attempts),
      3,
    ),
  },
  receiving: {
    ...s.receiving,
    rating: round(ratio(s.receiving.ratingTotal, s.receiving.attempts), 1),
  },
  defense: {
    ...s.defense,
    rating: round(ratio(s.defense.ratingTotal, s.defense.attempts), 1),
  },
});

export const aggregateEvents = (events: StatEvent[]): BaseStatData =>
  deriveStats(
    events.reduce(
      (acc, e) => applyEvent(acc, e.category, e.action),
      emptyStats(),
    ),
  );

/** Buttons for a category, widened so the UI can map over any category. */
export const getActions = (category: StatCategory): ActionButton[] =>
  STAT_CONFIG[category].actions;

/** Running tally text for a category button. */
export const getSummary = <C extends StatCategory>(
  category: C,
  stats: BaseStatData,
) => STAT_CONFIG[category].summary(stats[category]);

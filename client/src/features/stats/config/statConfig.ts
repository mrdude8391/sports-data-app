import type { StatFieldKey, StatFields, StatCategory } from "../types/Stat";

type StatAction<C extends StatCategory> = {
  id: string;
  label: string;
  apply: (s: StatFields<C>) => StatFields<C>;
};

type CategoryConfig<C extends StatCategory> = {
  label: string;
  actions: StatAction<C>[];
};

type StatConfig = {
  [C in StatCategory]: CategoryConfig<C>;
};

export const STAT_CONFIG: StatConfig = {
  attack: {
    label: "Attack",
    actions: [
      {
        id: "kill",
        label: "Kill",
        apply: (s: StatFields<"attack">) => ({
          ...s,
          kills: s.kills + 1,
          total: s.total + 1,
        }),
      },
      {
        id: "error",
        label: "Error",
        apply: (s: StatFields<"attack">) => ({
          ...s,
          errors: s.errors + 1,
          total: s.total + 1,
        }),
      },
      {
        id: "inPlay",
        label: "Attempt",
        apply: (s: StatFields<"attack">) => ({
          ...s,
          total: s.total + 1,
        }),
      },
    ],
  },
  receiving: {
    label: "Serve Receive",
    actions: [0, 1, 2, 3].map((n) => ({
      id: String(n),
      label: String(n),
      apply: (s: StatFields<"receiving">) => ({
        ...s,
        ratingTotal: s.ratingTotal + n,
        attempts: s.attempts + 1,
        errors: s.errors + (n == 0 ? 1 : 0),
      }),
    })),
  },
  blocking: {
    label: "Blocking",
    actions: [],
  },
  setting: {
    label: "Setting",
    actions: [],
  },
  serving: {
    label: "Serving",
    actions: [],
  },
  defense: {
    label: "Digging",
    actions: [],
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

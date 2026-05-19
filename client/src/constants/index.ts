import type { StatLabel, StatCategory } from "@/types/Stat";

export const NAV_LINKS_LOGGED_IN = [
  { href: "/", key: "Home", label: "Home" },
  { href: "/about", key: "About", label: "About" },
  // { href: '/profile', key: "Profile", label: "Profile"  },
  { href: "/athletes", key: "Athletes", label: "Athletes" },
  { href: "/teamstats", key: "Team Stats", label: "Team Stats Entry" },
];

export const NAV_LINKS_LOGGED_OUT = [
  { href: "/", key: "Home", label: "Home" },
  { href: "/about", key: "About", label: "About" },
];

export const STAT_INDEX = [
  {
    category: "attack",
    labels: [
      { key: "kills", label: "Kills" },
      { key: "errors", label: "Attack Errors" },
      { key: "total", label: "Total Attacks" },
      { key: "percentage", label: "Hitting %" },
    ],
  },
  {
    category: "setting",
    labels: [
      { key: "assists", label: "Assists" },
      { key: "errors", label: "Setting Errors" },
      { key: "attempts", label: "Setting Attempts" },
    ],
  },
  {
    category: "serving",
    labels: [
      { key: "rating", label: "Serve Rating" },
      { key: "ratingTotal", label: "Serve Rating Total" },
      { key: "aces", label: "Aces" },
      { key: "errors", label: "Serve Errors" },
      { key: "attempts", label: "Serve Attempts" },
      { key: "percentage", label: "Serving %" },
    ],
  },
  {
    category: "receiving",
    labels: [
      { key: "rating", label: "Receive Rating" },
      { key: "ratingTotal", label: "Receive Rating Total" },
      { key: "errors", label: "Receive Errors" },
      { key: "attempts", label: "Receive Attempts" },
    ],
  },
  {
    category: "defense",
    labels: [
      { key: "digs", label: "Digs" },
      { key: "rating", label: "Passing Rating" },
      { key: "ratingTotal", label: "Passing Rating Total" },
      { key: "errors", label: "Passing Errors" },
      { key: "attempts", label: "Passing Attempts" },
    ],
  },
  {
    category: "blocking",
    labels: [
      { key: "total", label: "Total Blocks" },
      { key: "kills", label: "Block Kills" },
      { key: "solos", label: "Solo Blocks" },
      { key: "goodTouches", label: "Good Block Touches" },
      { key: "attempts", label: "Block Attempts" },
      { key: "errors", label: "Block Errors (+ tools)" },
    ],
  },
];

export const STAT_LABEL_INDEX: Record<StatCategory, StatLabel[]> = {
  attack: [
    { key: "kills", label: "Kills" },
    { key: "errors", label: "Attack Errors" },
    { key: "total", label: "Total Attacks" },
    { key: "percentage", label: "Hitting %" },
  ],
  setting: [
    { key: "assists", label: "Assists" },
    { key: "errors", label: "Setting Errors" },
    { key: "attempts", label: "Setting Attempts" },
  ],
  serving: [
    { key: "rating", label: "Serve Rating" },
    { key: "ratingTotal", label: "Serve Rating Total" },
    { key: "aces", label: "Aces" },
    { key: "errors", label: "Serve Errors" },
    { key: "attempts", label: "Serve Attempts" },
    { key: "percentage", label: "Serving %" },
  ],
  receiving: [
    { key: "rating", label: "Receive Rating" },
    { key: "ratingTotal", label: "Receive Rating Total" },
    { key: "errors", label: "Receive Errors" },
    { key: "attempts", label: "Receive Attempts" },
  ],
  defense: [
    { key: "digs", label: "Digs" },
    { key: "rating", label: "Passing Rating" },
    { key: "ratingTotal", label: "Passing Rating Total" },
    { key: "errors", label: "Passing Errors" },
    { key: "attempts", label: "Passing Attempts" },
  ],
  blocking: [
    { key: "total", label: "Total Blocks" },
    { key: "kills", label: "Block Kills" },
    { key: "solos", label: "Solo Blocks" },
    { key: "goodTouches", label: "Good Block Touches" },
    { key: "attempts", label: "Block Attempts" },
    { key: "errors", label: "Block Errors (+ tools)" },
  ],
};

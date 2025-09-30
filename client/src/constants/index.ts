export const NAV_LINKS = [
    { href: '/', key: "Home", label: "Home"  },
    { href: '/about', key: "About", label: "About"  },
    { href: '/login', key: "Login", label: "Login"  },
    { href: '/profile', key: "Profile", label: "Profile"  },
    { href: '/athletes', key: "Athletes", label: "Athletes"  },

]

export const STAT_FIELDS = {
    attack: [
    { key: "kills", label: "Kills" },
    { key: "errors", label: "Errors" },
    { key: "total", label: "Total Attacks" },
    { key: "percentage", label: "Hitting %" },
  ],
  setting: [
    { key: "assists", label: "Assists" },
    { key: "errors", label: "Errors" },
  ],
  serving: [
    { key: "rating", label: "Rating" },
    { key: "aces", label: "Aces" },
    { key: "errors", label: "Errors" },
    { key: "attempts", label: "Attempts" },
  ],
  passing: [
    { key: "rating", label: "Rating" },
    { key: "errors", label: "Errors" },
    { key: "attempts", label: "Attempts" },
  ],
  defense : [
    { key: 'digs', label: "Digs"}
  ],
  blocking : [
    { key: "total", label: "Total Blocks" },
    { key: "kills", label: "Kills" },
    { key: "solos", label: "Solo Blocks" },
    { key: "goodTouches", label: "Good Touches" },
    { key: "attempts", label: "Attempts" },
    { key: "errors", label: "Errors" },
  ]
    
}


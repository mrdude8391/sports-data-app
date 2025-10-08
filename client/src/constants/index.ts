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
    { key: "errors", label: "Attack Errors" },
    { key: "total", label: "Total Attacks" },
    { key: "percentage", label: "Hitting %" },
  ],
  setting: [
    { key: "assists", label: "Assists" },
    { key: "errors", label: "Setting Errors" },
  ],
  serving: [
    { key: "rating", label: "Serve Rating" },
    { key: "aces", label: "Aces" },
    { key: "errors", label: "Serve Errors" },
    { key: "attempts", label: "Serve Attempts" },
  ],
  passing: [
    { key: "rating", label: "Passing Rating" },
    { key: "errors", label: "Passing Errors" },
    { key: "attempts", label: "Passing Attempts" },
  ],
  defense : [
    { key: 'digs', label: "Digs"}
  ],
  blocking : [
    { key: "total", label: "Total Blocks" },
    { key: "kills", label: "Block Kills" },
    { key: "solos", label: "Solo Blocks" },
    { key: "goodTouches", label: "Good Block Touches" },
    { key: "attempts", label: "Block Attempts" },
    { key: "errors", label: "Block Errors" },
  ]
    
}


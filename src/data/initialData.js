export const INITIAL_CLUB_CONFIG = {
  courtCount: 2,
  slotDurationMinutes: 60,
  horizonWeeks: 12, // 3 mois à l'avance
  bookingPortalUrl: "https://reservation.squashclub.fr",
  dailyHours: {
    0: { open: "10:00", close: "18:00", closed: false }, // Dimanche (10h à 18h, dernier créneau 17h-18h)
    1: { open: "10:00", close: "22:00", closed: false }, // Lundi
    2: { open: "10:00", close: "22:00", closed: false }, // Mardi
    3: { open: "10:00", close: "22:00", closed: false }, // Mercredi
    4: { open: "10:00", close: "22:00", closed: false }, // Jeudi
    5: { open: "10:00", close: "22:00", closed: false }, // Vendredi
    6: { open: "10:00", close: "20:00", closed: false }  // Samedi (10h à 20h)
  },
  closedDates: [
    { id: "h1", date: "2026-11-01", reason: "Toussaint" },
    { id: "h2", date: "2026-11-11", reason: "Armistice 1918" },
    { id: "h3", date: "2026-12-25", reason: "Noël" },
    { id: "h4", date: "2027-01-01", reason: "Jour de l'An" },
    { id: "h5", startDate: "2026-08-01", endDate: "2026-08-16", reason: "Fermeture estivale annuelle" }
  ]
};

export const INITIAL_USERS = [
  {
    id: "usr_alex",
    username: "alexandre",
    displayName: "Alexandre D.",
    role: "player",
    skillLevel: "intermediaire",
    phone: "+33612345678",
    avatarColor: "#10b981", // Emerald
    recurringRules: [
      {
        id: "r1",
        dayOfWeek: 2, // Mardi
        startTime: "18:00",
        frequency: "BIWEEKLY_EVEN", // Semaines paires
        description: "Mardi 18h-19h (Semaines paires)"
      },
      {
        id: "r2",
        dayOfWeek: 4, // Jeudi
        startTime: "19:00",
        frequency: "WEEKLY", // Toutes les semaines
        description: "Jeudi 19h-20h (Hebdomadaire)"
      }
    ]
  },
  {
    id: "usr_marc",
    username: "marc",
    displayName: "Marc V.",
    role: "player",
    skillLevel: "loisir",
    phone: "+33623456789",
    avatarColor: "#3b82f6", // Blue
    recurringRules: [
      {
        id: "r3",
        dayOfWeek: 2, // Mardi
        startTime: "18:00",
        frequency: "WEEKLY", // Tous les mardis
        description: "Mardi 18h-19h (Hebdomadaire)"
      },
      {
        id: "r4",
        dayOfWeek: 0, // Dimanche
        startTime: "15:00",
        frequency: "BIWEEKLY_ODD", // Semaines impaires
        description: "Dimanche 15h-16h (Semaines impaires)"
      }
    ]
  },
  {
    id: "usr_julien",
    username: "julien",
    displayName: "Julien T.",
    role: "player",
    skillLevel: "confirme",
    phone: "+33634567890",
    avatarColor: "#f59e0b", // Amber
    recurringRules: [
      {
        id: "r5",
        dayOfWeek: 4, // Jeudi
        startTime: "19:00",
        frequency: "WEEKLY",
        description: "Jeudi 19h-20h (Hebdomadaire)"
      },
      {
        id: "r6",
        dayOfWeek: 2, // Mardi
        startTime: "20:00",
        frequency: "WEEKLY",
        description: "Mardi 20h-21h (Hebdomadaire)"
      }
    ]
  },
  {
    id: "usr_sophie",
    username: "sophie",
    displayName: "Sophie M.",
    role: "player",
    skillLevel: "intermediaire",
    phone: "+33645678901",
    avatarColor: "#ec4899", // Pink
    recurringRules: [
      {
        id: "r7",
        dayOfWeek: 6, // Samedi
        startTime: "11:00",
        frequency: "WEEKLY",
        description: "Samedi 11h-12h (Hebdomadaire)"
      }
    ]
  },
  {
    id: "usr_admin",
    username: "admin",
    displayName: "Pierre L. (Responsable Club)",
    role: "admin",
    skillLevel: "confirme",
    phone: "+33698765432",
    avatarColor: "#8b5cf6", // Purple
    recurringRules: []
  }
];

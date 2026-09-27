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
    id: "usr_eric",
    username: "eric",
    displayName: "Éric Châtelain",
    email: "eric.chatelain@grandbesancon.fr",
    password: "SquashEric2026!",
    role: "admin",
    skillLevel: "confirme",
    phone: "+33617416309",
    avatarColor: "#10b981", // Green
    recurringRules: []
  },
  {
    id: "usr_stephanie",
    username: "stephanie",
    displayName: "Stéphanie Commot",
    email: "stephaco@hotmail.com",
    password: "SquashSteph2026!",
    role: "admin",
    skillLevel: "confirme",
    phone: "+33663163215",
    avatarColor: "#3b82f6", // Blue
    recurringRules: []
  },
  {
    id: "usr_marlene",
    username: "marlene",
    displayName: "Marlène Renaud",
    email: "renaudmarlene@yahoo.fr",
    password: "SquashMarlene2026!",
    role: "player",
    skillLevel: "confirme",
    phone: "+33681531329",
    avatarColor: "#f59e0b", // Amber
    recurringRules: []
  },
  {
    id: "usr_elodie",
    username: "elodie",
    displayName: "Élodie Bory",
    email: "elodie.bory@orange.fr",
    password: "SquashElodie2026!",
    role: "player",
    skillLevel: "confirme",
    phone: "+33687154050",
    avatarColor: "#ec4899", // Pink
    recurringRules: []
  },
  {
    id: "usr_nicholas",
    username: "nicholas",
    displayName: "Nicholas Goodwin",
    email: "nicholas.p.goodwin@gmail.com",
    password: "SquashNicholas2026!",
    role: "admin",
    skillLevel: "confirme",
    phone: "+33656665882",
    avatarColor: "#8b5cf6", // Purple
    recurringRules: []
  }
];

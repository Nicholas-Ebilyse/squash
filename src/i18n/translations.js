export const translations = {
  fr: {
    // Navigation & Header
    app_title: "Squash Club Matchmaker",
    tagline: "Trouvez vos partenaires de squash et synchronisez vos réservations",
    lang_toggle: "English",
    logged_in_as: "Connecté :",
    switch_player: "Changer de joueur",
    admin_space: "Administration Club",
    my_routine_btn: "Mes Créneaux Récurrents",
    
    // Filters & Tabs
    tab_calendar: "Planning des Créneaux",
    tab_matches: "Matchs Possibles",
    tab_my_slots: "Mes Disponibilités",
    filter_all: "Tous les créneaux",
    filter_matches_only: "Matchs prêts (≥ 2 joueurs)",
    filter_my_availability: "Mes créneaux",
    filter_booked: "Courts réservés",
    
    // View Modes & Search
    view_3days: "3 Jours",
    view_month: "Mois",
    view_week: "Semaine",
    view_day: "Jour",
    view_planning: "Planning",
    search_placeholder: "Rechercher joueur, horaire (ex: Eric, 18h)...",
    today_button_title: "Aujourd'hui - Revenir à ce jour",
    clear_search: "Effacer la recherche",
    search_results: "{count} créneau(x) trouvé(s)",
    no_search_results: "Aucun créneau ne correspond à votre recherche.",
    
    // Time & Horizon
    month_prev: "Mois précédent",
    month_next: "Mois suivant",
    horizon_notice: "Planning ouvert sur 3 mois à l'avance",
    week: "Semaine",
    week_even: "Semaine Paire",
    week_odd: "Semaine Impaire",
    today: "Aujourd'hui",
    days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    days_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    
    // Slot Statuses
    status_empty: "Aucun joueur disponible",
    status_single: "1 joueur en attente d'adversaire",
    status_match_ready: "MATCH POSSIBLE ! 🎾",
    status_partial_booked: "1 court réservé • 1 court encore libre !",
    status_fully_booked: "Complet (2/2 courts réservés au club)",
    status_club_closed: "Club fermé",
    courts_available: "Courts disponibles :",
    courts_count: "{free} / {total} courts libres",
    
    // Slot Actions
    btn_available: "Je suis dispo",
    btn_unavailable: "Retirer ma dispo",
    btn_mark_booked: "J'ai réservé au club",
    btn_cancel_booking: "Annuler réservation",
    btn_whatsapp_invite: "Inviter sur WhatsApp",
    whatsapp_msg: "Salut ! On est tous les deux dispos pour jouer au squash le {date} de {time}. Je réserve un court sur le portail du club ?",
    
    // Skill levels
    level_loisir: "Loisir",
    level_inter: "Intermédiaire",
    level_confirme: "Confirmé",
    
    // Routine Modal (Google Calendar style)
    routine_title: "Disponibilités Récurrentes (Style Google Agenda)",
    routine_subtitle: "Définissez vos habitudes de jeu. Elles s'appliquent automatiquement sur les 3 mois d'anticipation.",
    routine_freq_weekly: "Toutes les semaines",
    routine_freq_biweekly_even: "1 semaine sur 2 (Semaines Paires)",
    routine_freq_biweekly_odd: "1 semaine sur 2 (Semaines Impaires)",
    routine_day: "Jour de la semaine",
    routine_time: "Heure du créneau",
    routine_add_btn: "Ajouter cette règle de récurrence",
    routine_active_rules: "Vos règles récurrentes actives :",
    routine_no_rules: "Aucune règle récurrence enregistrée pour le moment.",
    routine_delete: "Supprimer",
    routine_tip: "💡 Astuce : Vous pouvez à tout moment cliquer sur un créneau précis dans le calendrier pour faire une exception ponctuelle.",
    routine_close: "Fermer",

    // Booking Modal
    booking_title: "Déclarer une Réservation faite au Club",
    booking_subtitle: "Informez le groupe que vous avez validé la réservation sur le portail officiel du club.",
    booking_court_choice: "Numéro de court réservé :",
    court_1: "Court n° 1",
    court_2: "Court n° 2",
    booking_partner: "Avec quel partenaire jouez-vous ?",
    booking_type: "Format de jeu :",
    type_singles: "Simple (1 vs 1)",
    type_doubles: "Double / Rotation 3-4 joueurs",
    booking_club_portal_hint: "N'oubliez pas d'effectuer le paiement et la réservation réelle sur le site du club :",
    booking_open_club_portal: "Ouvrir le portail du club",
    booking_confirm_btn: "Confirmer la réservation pour le groupe",
    booking_cancel_btn: "Annuler",
    booking_success: "Super ! La réservation est enregistrée et visible par tout le groupe.",
    
    // Admin Panel
    admin_title: "Panneau d'Administration du Club",
    admin_subtitle: "Toutes les variables de fonctionnement du club sont ajustables ici.",
    admin_tab_club: "1. Horaires & Courts",
    admin_tab_holidays: "2. Jours Fériés & Congés",
    admin_tab_players: "3. Joueurs & Mots de passe",
    
    // Admin Club Tab
    admin_courts_count: "Nombre total de courts de squash :",
    admin_slot_duration: "Durée d'un créneau (minutes) :",
    admin_horizon_months: "Horizon d'anticipation (semaines) :",
    admin_booking_url: "URL du portail de réservation du club :",
    admin_daily_hours: "Horaires quotidiens d'ouverture & fermeture :",
    admin_closed_day: "Fermé toute la journée",
    admin_from: "De",
    admin_to: "À",
    admin_sunday_notice: "Ex: Le dimanche, le dernier créneau commence à 17h00 (fin à 18h00).",

    // Admin Holidays Tab
    admin_holidays_title: "Dates de fermeture exceptionnelle (Fériés, Vacances d'été)",
    admin_holiday_name: "Motif de fermeture",
    admin_holiday_date: "Date exacte (ou début)",
    admin_holiday_end: "Date de fin (facultatif si 1 jour)",
    admin_add_holiday_btn: "Ajouter une fermeture",
    admin_holidays_list: "Fermetures programmées :",
    
    // Admin Players Tab
    admin_players_title: "Gestion des Joueurs du Groupe",
    admin_add_player_btn: "Ajouter un joueur",
    admin_col_name: "Nom complet",
    admin_col_username: "Identifiant",
    admin_col_email: "Adresse e-mail",
    admin_col_role: "Rôle",
    admin_col_level: "Niveau",
    admin_col_actions: "Actions",
    admin_reset_pwd: "Réinit. mot de passe",
    admin_pwd_reset_success: "Nouveau mot de passe temporaire pour {name} : squash2026",
    admin_edit_player: "Modifier",
    admin_editing_player: "Modifier les détails du joueur :",
    admin_save_player: "Enregistrer modifications",
    admin_player_updated: "Profil de {name} mis à jour avec succès !",
    admin_delete_player: "Supprimer",
    admin_save_all: "Enregistrer tous les paramètres",
    admin_saved_success: "Paramètres du club mis à jour avec succès !",

    // Add Player Modal
    modal_add_player_title: "Nouveau Joueur",
    form_fullname: "Nom complet :",
    form_username: "Identifiant (login) :",
    form_email: "Adresse e-mail :",
    form_password: "Mot de passe initial :",
    form_role: "Rôle :",
    form_role_player: "Joueur",
    form_role_admin: "Administrateur",
    form_level: "Niveau de squash :",
    form_phone: "Numéro de téléphone (pour WhatsApp) :",
    form_submit: "Créer le compte",

    // General
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    loading: "Chargement du planning...",
    stats_matches_ready: "matchs possibles trouvés",
    stats_courts_booked: "courts déjà réservés"
  },
  en: {
    // Navigation & Header
    app_title: "Squash Club Matchmaker",
    tagline: "Find squash partners and synchronize your club reservations",
    lang_toggle: "Français",
    logged_in_as: "Logged in as:",
    switch_player: "Switch player",
    admin_space: "Club Admin",
    my_routine_btn: "My Recurring Routine",
    
    // Filters & Tabs
    tab_calendar: "Court Schedule",
    tab_matches: "Match Opportunities",
    tab_my_slots: "My Availabilities",
    filter_all: "All slots",
    filter_matches_only: "Matches ready (≥ 2 players)",
    filter_my_availability: "My slots",
    filter_booked: "Reserved courts",
    
    // View Modes & Search
    view_3days: "3 Days",
    view_month: "Month",
    view_week: "Week",
    view_day: "Day",
    view_planning: "Schedule",
    search_placeholder: "Search player, time (e.g. Eric, 18:00)...",
    today_button_title: "Today - Return to current day",
    clear_search: "Clear search",
    search_results: "{count} slot(s) found",
    no_search_results: "No slots match your search.",
    
    // Time & Horizon
    month_prev: "Previous month",
    month_next: "Next month",
    horizon_notice: "Schedule open 3 months in advance",
    week: "Week",
    week_even: "Even Week",
    week_odd: "Odd Week",
    today: "Today",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    days_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    
    // Slot Statuses
    status_empty: "No players available",
    status_single: "1 player waiting for an opponent",
    status_match_ready: "MATCH READY! 🎾",
    status_partial_booked: "1 court reserved • 1 court still free!",
    status_fully_booked: "Full (2/2 courts reserved at club)",
    status_club_closed: "Club closed",
    courts_available: "Available courts:",
    courts_count: "{free} / {total} courts free",
    
    // Slot Actions
    btn_available: "I am free",
    btn_unavailable: "Remove availability",
    btn_mark_booked: "Mark as booked at club",
    btn_cancel_booking: "Cancel booking",
    btn_whatsapp_invite: "Invite on WhatsApp",
    whatsapp_msg: "Hi! We're both free to play squash on {date} from {time}. Shall I reserve a court on the club portal?",
    
    // Skill levels
    level_loisir: "Casual",
    level_inter: "Intermediate",
    level_confirme: "Advanced",
    
    // Routine Modal
    routine_title: "Recurring Availability (Google Calendar Style)",
    routine_subtitle: "Set your weekly play habits. They will automatically project over the 3-month horizon.",
    routine_freq_weekly: "Every week",
    routine_freq_biweekly_even: "Every 2 weeks (Even Weeks)",
    routine_freq_biweekly_odd: "Every 2 weeks (Odd Weeks)",
    routine_day: "Day of the week",
    routine_time: "Time slot",
    routine_add_btn: "Add this recurring rule",
    routine_active_rules: "Your active recurring rules:",
    routine_no_rules: "No recurring rule configured yet.",
    routine_delete: "Delete",
    routine_tip: "💡 Tip: You can always click on any individual slot in the calendar to make a one-off exception.",
    routine_close: "Close",

    // Booking Modal
    booking_title: "Declare Club Court Booking",
    booking_subtitle: "Notify the group that you completed the court reservation on the official club system.",
    booking_court_choice: "Reserved court number:",
    court_1: "Court #1",
    court_2: "Court #2",
    booking_partner: "Who are you playing with?",
    booking_type: "Match type:",
    type_singles: "Singles (1 vs 1)",
    type_doubles: "Doubles / 3-4 players rotation",
    booking_club_portal_hint: "Remember to complete booking & payment on the club portal:",
    booking_open_club_portal: "Open club portal",
    booking_confirm_btn: "Confirm booking for the group",
    booking_cancel_btn: "Cancel",
    booking_success: "Great! The court reservation has been recorded and is visible to the entire group.",
    
    // Admin Panel
    admin_title: "Club Administration Panel",
    admin_subtitle: "All club operational parameters can be adjusted here.",
    admin_tab_club: "1. Hours & Courts",
    admin_tab_holidays: "2. Holidays & Closures",
    admin_tab_players: "3. Players & Passwords",
    
    // Admin Club Tab
    admin_courts_count: "Total squash courts:",
    admin_slot_duration: "Slot duration (minutes):",
    admin_horizon_months: "Advance horizon (weeks):",
    admin_booking_url: "Club booking portal URL:",
    admin_daily_hours: "Daily opening & closing hours:",
    admin_closed_day: "Closed all day",
    admin_from: "From",
    admin_to: "To",
    admin_sunday_notice: "E.g.: On Sunday, the last slot starts at 17:00 (finishes at 18:00).",

    // Admin Holidays Tab
    admin_holidays_title: "Exceptional Closures (Holidays, Summer Vacation)",
    admin_holiday_name: "Closure reason",
    admin_holiday_date: "Exact date (or start)",
    admin_holiday_end: "End date (optional if 1 day)",
    admin_add_holiday_btn: "Add closure",
    admin_holidays_list: "Scheduled closures:",
    
    // Admin Players Tab
    admin_players_title: "Group Players Management",
    admin_add_player_btn: "Add player",
    admin_col_name: "Full name",
    admin_col_username: "Username",
    admin_col_email: "Email address",
    admin_col_role: "Role",
    admin_col_level: "Level",
    admin_col_actions: "Actions",
    admin_reset_pwd: "Reset password",
    admin_pwd_reset_success: "Temporary password for {name}: squash2026",
    admin_edit_player: "Edit",
    admin_editing_player: "Edit player details:",
    admin_save_player: "Save changes",
    admin_player_updated: "Profile of {name} successfully updated!",
    admin_delete_player: "Delete",
    admin_save_all: "Save all settings",
    admin_saved_success: "Club parameters successfully updated!",

    // Add Player Modal
    modal_add_player_title: "New Player",
    form_fullname: "Full name:",
    form_username: "Username (login):",
    form_email: "Email address:",
    form_password: "Initial password:",
    form_role: "Role:",
    form_role_player: "Player",
    form_role_admin: "Administrator",
    form_level: "Squash level:",
    form_phone: "Phone number (for WhatsApp):",
    form_submit: "Create account",

    // General
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    loading: "Loading schedule...",
    stats_matches_ready: "match opportunities found",
    stats_courts_booked: "courts already booked"
  }
};

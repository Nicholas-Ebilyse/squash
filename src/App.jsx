import React, { useState, useEffect, useMemo } from "react";
import { Header } from "./components/Header";
import { StatsBar } from "./components/StatsBar";
import { CalendarView } from "./components/CalendarView";
import { RoutineModal } from "./components/RoutineModal";
import { BookingModal } from "./components/BookingModal";
import { AdminModal } from "./components/AdminModal";
import { translations } from "./i18n/translations";
import { INITIAL_CLUB_CONFIG, INITIAL_USERS } from "./data/initialData";
import {
  generateDailySlots,
  getHorizonMonths,
  getDaysForMonth,
  checkRoutineMatch
} from "./utils/dateUtils";
import "./App.css";

export function App() {
  // 1. Language state (Français default)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("squash_lang") || "fr";
  });
  const t = translations[language] || translations.fr;

  const handleToggleLanguage = () => {
    const nextLang = language === "fr" ? "en" : "fr";
    setLanguage(nextLang);
    localStorage.setItem("squash_lang", nextLang);
  };

  // 2. Club Configuration state
  const [clubConfig, setClubConfig] = useState(() => {
    const saved = localStorage.getItem("squash_club_config");
    return saved ? JSON.parse(saved) : INITIAL_CLUB_CONFIG;
  });

  const handleUpdateClubConfig = (newConfig) => {
    setClubConfig(newConfig);
    localStorage.setItem("squash_club_config", JSON.stringify(newConfig));
  };

  // 3. Users state
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("squash_users");
    if (!saved) return INITIAL_USERS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((u) => {
        const initial = INITIAL_USERS.find((init) => init.id === u.id);
        return {
          ...u,
          email: u.email || initial?.email || `${u.username}@squashclub.fr`,
          password: u.password || initial?.password || "Squash2026!"
        };
      });
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  const handleUpdateUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem("squash_users", JSON.stringify(newUsers));
  };

  // 4. Current logged-in user
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem("squash_current_user_id") || "usr_alex";
  });

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0];
  }, [users, currentUserId]);

  const handleSwitchUser = (user) => {
    setCurrentUserId(user.id);
    localStorage.setItem("squash_current_user_id", user.id);
  };

  // 5. Slots State { [slotId]: { availablePlayerIds: [], bookings: [] } }
  const [slotsState, setSlotsState] = useState(() => {
    const saved = localStorage.getItem("squash_slots_state");
    return saved ? JSON.parse(saved) : {};
  });

  // Project users' recurring rules across the 3-month horizon
  const projectRoutines = (currentUsers, config, currentSlots) => {
    const updated = { ...currentSlots };
    const horizon = getHorizonMonths(new Date(), 3);

    for (const m of horizon) {
      const days = getDaysForMonth(m.year, m.monthIndex);
      for (const d of days) {
        const schedule = generateDailySlots(d, config);
        if (schedule.isClosed) continue;

        for (const slot of schedule.slots) {
          if (!updated[slot.id]) {
            updated[slot.id] = { availablePlayerIds: [], bookings: [] };
          }

          // Evaluate each player's routine
          for (const player of currentUsers) {
            const matchesRoutine = checkRoutineMatch(player, d, slot.startTime);
            if (matchesRoutine && !updated[slot.id].availablePlayerIds.includes(player.id)) {
              updated[slot.id].availablePlayerIds = [
                ...updated[slot.id].availablePlayerIds,
                player.id
              ];
            }
          }
        }
      }
    }

    return updated;
  };

  // Initial projection on load if slots state is empty
  useEffect(() => {
    if (Object.keys(slotsState).length === 0) {
      const projected = projectRoutines(users, clubConfig, {});
      setSlotsState(projected);
      localStorage.setItem("squash_slots_state", JSON.stringify(projected));
    }
  }, []);

  // Handler to toggle player's availability on a specific slot
  const handleToggleAvailability = (slotId) => {
    setSlotsState((prev) => {
      const currentSlot = prev[slotId] || { availablePlayerIds: [], bookings: [] };
      const isAvailable = currentSlot.availablePlayerIds.includes(currentUser.id);

      const nextPlayerIds = isAvailable
        ? currentSlot.availablePlayerIds.filter((id) => id !== currentUser.id)
        : [...currentSlot.availablePlayerIds, currentUser.id];

      const nextState = {
        ...prev,
        [slotId]: {
          ...currentSlot,
          availablePlayerIds: nextPlayerIds
        }
      };

      localStorage.setItem("squash_slots_state", JSON.stringify(nextState));
      return nextState;
    });
  };

  // Handler to confirm a court reservation at the club
  const handleConfirmBooking = (slotId, bookingData) => {
    setSlotsState((prev) => {
      const currentSlot = prev[slotId] || { availablePlayerIds: [], bookings: [] };
      const currentBookings = currentSlot.bookings || [];

      // Replace or add booking for specified court
      const nextBookings = [
        ...currentBookings.filter((b) => b.court !== bookingData.court),
        bookingData
      ];

      const nextState = {
        ...prev,
        [slotId]: {
          ...currentSlot,
          bookings: nextBookings
        }
      };

      localStorage.setItem("squash_slots_state", JSON.stringify(nextState));
      return nextState;
    });
  };

  // Handler to cancel a court reservation
  const handleCancelBooking = (slotId, courtNumber) => {
    setSlotsState((prev) => {
      const currentSlot = prev[slotId] || { availablePlayerIds: [], bookings: [] };
      const nextBookings = (currentSlot.bookings || []).filter((b) => b.court !== courtNumber);

      const nextState = {
        ...prev,
        [slotId]: {
          ...currentSlot,
          bookings: nextBookings
        }
      };

      localStorage.setItem("squash_slots_state", JSON.stringify(nextState));
      return nextState;
    });
  };

  // Handler to update user's recurring rules and re-project
  const handleUpdateUserRules = (userId, newRules) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, recurringRules: newRules } : u
    );
    handleUpdateUsers(updatedUsers);

    // Re-project routines across the 3 months
    const updatedSlots = projectRoutines(updatedUsers, clubConfig, slotsState);
    setSlotsState(updatedSlots);
    localStorage.setItem("squash_slots_state", JSON.stringify(updatedSlots));
  };

  // Modals state
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [bookingModalData, setBookingModalData] = useState(null); // { slot, dateObj, availablePlayers }

  const handleOpenBooking = (slot, dateObj, availablePlayers) => {
    setBookingModalData({ slot, dateObj, availablePlayers });
  };

  // Statistics calculation
  const stats = useMemo(() => {
    let matchesCount = 0;
    let bookedCount = 0;
    let userAvailableCount = 0;

    const totalCourts = clubConfig.courtCount || 2;
    const minPlayers = clubConfig.minPlayersForMatch || 2;

    for (const slotId in slotsState) {
      const s = slotsState[slotId];
      const bookingsCount = s.bookings?.length || 0;
      bookedCount += bookingsCount;

      const freeCourts = totalCourts - bookingsCount;
      if (s.availablePlayerIds?.length >= minPlayers && freeCourts > 0) {
        matchesCount++;
      }

      if (s.availablePlayerIds?.includes(currentUser.id)) {
        userAvailableCount++;
      }
    }

    return { matchesCount, bookedCount, userAvailableCount };
  }, [slotsState, currentUser.id, clubConfig]);

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        t={t}
        onOpenRoutine={() => setIsRoutineModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Container */}
      <main className="main-content">
        <StatsBar
          stats={stats}
          t={t}
          clubConfig={clubConfig}
        />

        <CalendarView
          clubConfig={clubConfig}
          users={users}
          currentUser={currentUser}
          slotsState={slotsState}
          onToggleAvailability={handleToggleAvailability}
          onOpenBooking={handleOpenBooking}
          onCancelBooking={handleCancelBooking}
          t={t}
        />
      </main>

      {/* Routine Modal (Google Calendar style) */}
      <RoutineModal
        isOpen={isRoutineModalOpen}
        onClose={() => setIsRoutineModalOpen(false)}
        currentUser={currentUser}
        onUpdateUserRules={handleUpdateUserRules}
        t={t}
        clubConfig={clubConfig}
      />

      {/* Booking Modal (Club reservation declaration) */}
      <BookingModal
        isOpen={!!bookingModalData}
        onClose={() => setBookingModalData(null)}
        slot={bookingModalData?.slot}
        dateObj={bookingModalData?.dateObj}
        availablePlayers={bookingModalData?.availablePlayers || []}
        allUsers={users}
        currentUser={currentUser}
        existingBookings={slotsState[bookingModalData?.slot?.id]?.bookings || []}
        onConfirmBooking={handleConfirmBooking}
        t={t}
        clubConfig={clubConfig}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        clubConfig={clubConfig}
        onUpdateClubConfig={handleUpdateClubConfig}
        users={users}
        onUpdateUsers={handleUpdateUsers}
        t={t}
      />
    </div>
  );
}

export default App;

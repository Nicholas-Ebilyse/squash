import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Calendar as CalendarIcon,
  Sparkles,
  Search,
  X,
  Clock,
  User,
  Check
} from "lucide-react";
import { SlotCard } from "./SlotCard";
import { SquashBallIcon } from "./SquashIcons";
import {
  generateDailySlots,
  getHorizonMonths,
  getDaysForMonth,
  toISODateString,
  getISOWeekNumber,
  isEvenWeek,
  addDays,
  isSameDay,
  getDaysForWeek
} from "../utils/dateUtils";

export function CalendarView({
  clubConfig,
  users,
  currentUser,
  slotsState, // { [slotId]: { availablePlayerIds: [], bookings: [] } }
  onToggleAvailability,
  onOpenBooking,
  onCancelBooking,
  t
}) {
  const today = useMemo(() => new Date(), []);
  const todayDayNumber = today.getDate();

  // 1. Current anchor date for navigation (defaults to today)
  const [anchorDate, setAnchorDate] = useState(() => new Date());

  // 2. View modes matching screenshot 2: "3days" | "month" | "week" | "day" | "planning"
  const [viewMode, setViewMode] = useState("week"); // Default: Semaine

  // 3. Search query
  const [searchQuery, setSearchQuery] = useState("");

  // 4. Status Filter: "all" | "matches_only" | "my_slots" | "booked"
  const [filterMode, setFilterMode] = useState("all");

  // Horizon months for month-based views
  const horizonMonths = useMemo(() => getHorizonMonths(new Date(), 3), []);

  // Jump to Today action (Screenshot 3 button)
  const handleGoToToday = () => {
    const now = new Date();
    setAnchorDate(now);
  };

  // Previous / Next Period Navigation
  const handlePrevPeriod = () => {
    if (viewMode === "day") {
      setAnchorDate((prev) => addDays(prev, -1));
    } else if (viewMode === "3days") {
      setAnchorDate((prev) => addDays(prev, -3));
    } else if (viewMode === "week") {
      setAnchorDate((prev) => addDays(prev, -7));
    } else if (viewMode === "month") {
      setAnchorDate((prev) => {
        const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
        return next;
      });
    } else if (viewMode === "planning") {
      setAnchorDate((prev) => addDays(prev, -7));
    }
  };

  const handleNextPeriod = () => {
    if (viewMode === "day") {
      setAnchorDate((prev) => addDays(prev, 1));
    } else if (viewMode === "3days") {
      setAnchorDate((prev) => addDays(prev, 3));
    } else if (viewMode === "week") {
      setAnchorDate((prev) => addDays(prev, 7));
    } else if (viewMode === "month") {
      setAnchorDate((prev) => {
        const next = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
        return next;
      });
    } else if (viewMode === "planning") {
      setAnchorDate((prev) => addDays(prev, 7));
    }
  };

  // Compute the list of days to display based on viewMode
  const visibleDays = useMemo(() => {
    if (viewMode === "day") {
      return [anchorDate];
    }
    if (viewMode === "3days") {
      return [anchorDate, addDays(anchorDate, 1), addDays(anchorDate, 2)];
    }
    if (viewMode === "week") {
      return getDaysForWeek(anchorDate);
    }
    if (viewMode === "month") {
      return getDaysForMonth(anchorDate.getFullYear(), anchorDate.getMonth());
    }
    if (viewMode === "planning") {
      // Show 14 days starting from anchorDate
      const days = [];
      for (let i = 0; i < 14; i++) {
        days.push(addDays(anchorDate, i));
      }
      return days;
    }
    return getDaysForWeek(anchorDate);
  }, [viewMode, anchorDate]);

  // Compute period title label
  const periodTitle = useMemo(() => {
    const monthNames = t.months;
    const year = anchorDate.getFullYear();
    const monthName = monthNames[anchorDate.getMonth()];

    if (viewMode === "day") {
      const dayName = t.days[anchorDate.getDay()];
      return `${dayName} ${anchorDate.getDate()} ${monthName} ${year}`;
    }
    if (viewMode === "3days") {
      const endDay = addDays(anchorDate, 2);
      const endMonth = monthNames[endDay.getMonth()];
      if (anchorDate.getMonth() === endDay.getMonth()) {
        return `${anchorDate.getDate()} - ${endDay.getDate()} ${monthName} ${year}`;
      }
      return `${anchorDate.getDate()} ${monthName} - ${endDay.getDate()} ${endMonth} ${year}`;
    }
    if (viewMode === "week") {
      const weekDays = getDaysForWeek(anchorDate);
      const start = weekDays[0];
      const end = weekDays[6];
      const weekNum = getISOWeekNumber(anchorDate);
      const even = isEvenWeek(anchorDate);
      return `Semaine ${weekNum} (${even ? t.week_even : t.week_odd}) • ${start.getDate()} ${monthNames[start.getMonth()].slice(0, 4)} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 4)} ${year}`;
    }
    if (viewMode === "month") {
      return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
    }
    if (viewMode === "planning") {
      return `Planning • 14 prochains jours (${monthName} ${year})`;
    }
    return `${monthName} ${year}`;
  }, [viewMode, anchorDate, t]);

  // Search filter helper: checks if a slot matches user search query
  const slotMatchesSearch = (slot, slotState, query) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();

    // 1. Time match (e.g. "18:00", "18h", "18", "12")
    if (
      slot.startTime.toLowerCase().includes(q) ||
      slot.endTime.toLowerCase().includes(q) ||
      slot.startTime.replace(":", "h").includes(q)
    ) {
      return true;
    }

    // 2. Available players match (by display name, username, or email)
    const availablePlayerIds = slotState?.availablePlayerIds || [];
    for (const pid of availablePlayerIds) {
      const user = users.find((u) => u.id === pid);
      if (user) {
        if (
          user.displayName.toLowerCase().includes(q) ||
          user.username.toLowerCase().includes(q) ||
          (user.email && user.email.toLowerCase().includes(q))
        ) {
          return true;
        }
      }
    }

    // 3. Bookings match
    const bookings = slotState?.bookings || [];
    for (const b of bookings) {
      if (b.bookedByName && b.bookedByName.toLowerCase().includes(q)) return true;
      if (b.partnerName && b.partnerName.toLowerCase().includes(q)) return true;
    }

    return false;
  };

  // Count total matching slots across active days
  const matchingSlotsCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    let count = 0;
    visibleDays.forEach((day) => {
      const sched = generateDailySlots(day, clubConfig);
      if (sched.isClosed) return;
      sched.slots.forEach((s) => {
        const state = slotsState[s.id] || { availablePlayerIds: [], bookings: [] };
        if (slotMatchesSearch(s, state, searchQuery)) {
          count++;
        }
      });
    });
    return count;
  }, [visibleDays, clubConfig, slotsState, searchQuery, users]);

  return (
    <div className="calendar-view">
      {/* ====================================================================
          Calendar Controls Bar: Today Button + Period Nav + Search + View Modes
          ==================================================================== */}
      <div className="calendar-controls-bar">
        {/* Left: Tear-off Today Calendar Button (Screenshot 3) + Period Nav */}
        <div className="controls-left-group">
          <button
            type="button"
            className="btn-today-calendar"
            onClick={handleGoToToday}
            title={t.today_button_title}
          >
            <div className="calendar-tear-top">
              <span className="calendar-ring-dash"></span>
              <span className="calendar-ring-dash"></span>
            </div>
            <div className="calendar-tear-body">
              <span className="calendar-day-num">{todayDayNumber}</span>
            </div>
          </button>

          <div className="period-navigation">
            <button
              className="btn-nav-arrow"
              onClick={handlePrevPeriod}
              title="Précédent"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="period-title-text">{periodTitle}</span>
            <button
              className="btn-nav-arrow"
              onClick={handleNextPeriod}
              title="Suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="calendar-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="calendar-search-input"
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery("")}
              title={t.clear_search}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Right: Segmented View Mode Pill (Screenshot 2) */}
        <div className="view-mode-selector">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "3days" ? "active" : ""}`}
            onClick={() => setViewMode("3days")}
          >
            {t.view_3days}
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "month" ? "active" : ""}`}
            onClick={() => setViewMode("month")}
          >
            {t.view_month}
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "week" ? "active" : ""}`}
            onClick={() => setViewMode("week")}
          >
            {t.view_week}
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "day" ? "active" : ""}`}
            onClick={() => setViewMode("day")}
          >
            {t.view_day}
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === "planning" ? "active" : ""}`}
            onClick={() => setViewMode("planning")}
          >
            {t.view_planning}
          </button>
        </div>
      </div>

      {/* ====================================================================
          Secondary Filter Bar: Status Filters (Tous, Matchs prêts, etc.)
          ==================================================================== */}
      <div className="filter-toolbar">
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filterMode === "all" ? "active" : ""}`}
            onClick={() => setFilterMode("all")}
          >
            {t.filter_all}
          </button>
          <button
            className={`filter-btn match-filter ${filterMode === "matches_only" ? "active" : ""}`}
            onClick={() => setFilterMode("matches_only")}
          >
            <Sparkles size={16} />
            <span>{t.filter_matches_only}</span>
          </button>
          <button
            className={`filter-btn ${filterMode === "my_slots" ? "active" : ""}`}
            onClick={() => setFilterMode("my_slots")}
          >
            {t.filter_my_availability}
          </button>
          <button
            className={`filter-btn ${filterMode === "booked" ? "active" : ""}`}
            onClick={() => setFilterMode("booked")}
          >
            {t.filter_booked}
          </button>
        </div>

        {/* Search Results Chip Indicator */}
        {searchQuery.trim() && (
          <div className="search-active-pill">
            <span>
              🔍 {matchingSlotsCount} créneau(x) trouvé(s) pour « <strong>{searchQuery}</strong> »
            </span>
            <button
              type="button"
              className="btn-clear-pill"
              onClick={() => setSearchQuery("")}
              title={t.clear_search}
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ====================================================================
          Month Overview Grid View (when viewMode === 'month')
          ==================================================================== */}
      {viewMode === "month" && (
        <div className="month-overview-card">
          <div className="month-grid-header">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((wd, i) => (
              <div key={i} className="month-grid-head-cell">
                {wd}
              </div>
            ))}
          </div>

          <div className="month-grid-body">
            {/* Blank cells for offset before the 1st of month */}
            {(() => {
              const firstDayOfMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
              const dayIndex = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon...
              const offset = dayIndex === 0 ? 6 : dayIndex - 1;
              return Array.from({ length: offset }).map((_, idx) => (
                <div key={`offset_${idx}`} className="month-cell month-cell-empty"></div>
              ));
            })()}

            {visibleDays.map((dayDate) => {
              const dailySchedule = generateDailySlots(dayDate, clubConfig);
              const isToday = isSameDay(dayDate, today);
              const isSelected = isSameDay(dayDate, anchorDate);
              const weekNum = getISOWeekNumber(dayDate);

              let matchReadySlotsCount = 0;
              let bookedSlotsCount = 0;
              let mySlotsCount = 0;

              dailySchedule.slots.forEach((s) => {
                const sState = slotsState[s.id];
                if (sState) {
                  if (sState.availablePlayerIds?.length >= (clubConfig.minPlayersForMatch || 2)) {
                    matchReadySlotsCount++;
                  }
                  if (sState.bookings && sState.bookings.length > 0) {
                    bookedSlotsCount += sState.bookings.length;
                  }
                  if (currentUser && sState.availablePlayerIds?.includes(currentUser.id)) {
                    mySlotsCount++;
                  }
                }
              });

              return (
                <div
                  key={dailySchedule.dateStr}
                  className={`month-cell ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${
                    dailySchedule.isClosed ? "closed" : ""
                  }`}
                  onClick={() => {
                    setAnchorDate(dayDate);
                    setViewMode("day");
                  }}
                  title="Cliquer pour voir le détail de cette journée"
                >
                  <div className="month-cell-top">
                    <span className={`month-cell-day-num ${isToday ? "today-badge" : ""}`}>
                      {dayDate.getDate()}
                    </span>
                    <span className="month-cell-week-tag">S{weekNum}</span>
                  </div>

                  <div className="month-cell-content">
                    {dailySchedule.isClosed ? (
                      <span className="month-badge-closed">Fermé</span>
                    ) : (
                      <>
                        {matchReadySlotsCount > 0 && (
                          <span className="month-badge-match">
                            <SquashBallIcon size={12} style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }} />
                            {matchReadySlotsCount} match{matchReadySlotsCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {bookedSlotsCount > 0 && (
                          <span className="month-badge-booked">
                            ✓ {bookedSlotsCount} réservé{bookedSlotsCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {mySlotsCount > 0 && (
                          <span className="month-badge-mine">
                            👤 {mySlotsCount} dispo{mySlotsCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================
          Days & Slots Stream (Used for Day, 3 Days, Week, Planning, and Month details)
          ==================================================================== */}
      <div className={`calendar-stream layout-${viewMode}`}>
        {visibleDays.map((dayDate) => {
          const dailySchedule = generateDailySlots(dayDate, clubConfig);
          const isEven = isEvenWeek(dayDate);
          const isToday = isSameDay(dayDate, today);
          const weekNum = getISOWeekNumber(dayDate);
          const dayName = t.days[dayDate.getDay()];
          const formattedDate = dayDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long"
          });

          // Filter slots based on filterMode AND searchQuery
          const filteredSlots = dailySchedule.slots.filter((slot) => {
            const state = slotsState[slot.id] || { availablePlayerIds: [], bookings: [] };
            const isMySlot = currentUser ? state.availablePlayerIds.includes(currentUser.id) : false;
            const isMatchReady =
              state.availablePlayerIds.length >= (clubConfig.minPlayersForMatch || 2);
            const hasBookings = state.bookings && state.bookings.length > 0;

            // Apply filter tab
            if (filterMode === "matches_only" && !isMatchReady) return false;
            if (filterMode === "my_slots" && !isMySlot) return false;
            if (filterMode === "booked" && !hasBookings) return false;

            // Apply search query
            if (!slotMatchesSearch(slot, state, searchQuery)) return false;

            return true;
          });

          // In Planning view, hide days that have 0 matching slots
          if (viewMode === "planning" && filteredSlots.length === 0) {
            return null;
          }

          // If filtering and no slots match for this day, don't show the day card
          if (filterMode !== "all" && filteredSlots.length === 0) {
            return null;
          }

          return (
            <div
              key={dailySchedule.dateStr}
              className={`day-card ${isToday ? "day-card-today" : ""}`}
            >
              {/* Day Header */}
              <div className="day-card-header">
                <div className="day-card-title">
                  <span className="day-weekday">{dayName}</span>
                  <span className="day-number">{formattedDate}</span>
                  {isToday && <span className="today-pill-badge">{t.today}</span>}
                </div>
                <div className="day-card-badges">
                  <span className={`week-parity-badge ${isEven ? "even" : "odd"}`}>
                    S{weekNum} • {isEven ? t.week_even : t.week_odd}
                  </span>
                  {dayDate.getDay() === 0 && (
                    <span className="badge-sunday-notice">Dimanche (Fermeture 18h)</span>
                  )}
                </div>
              </div>

              {/* Closed Club Alert if closed */}
              {dailySchedule.isClosed ? (
                <div className="day-closed-alert">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>{t.status_club_closed}</strong> : {dailySchedule.closureReason}
                  </div>
                </div>
              ) : (
                <div className="day-slots-grid">
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        dateObj={dayDate}
                        users={users}
                        currentUser={currentUser}
                        slotState={slotsState[slot.id]}
                        onToggleAvailability={onToggleAvailability}
                        onOpenBooking={onOpenBooking}
                        onCancelBooking={onCancelBooking}
                        t={t}
                        clubConfig={clubConfig}
                      />
                    ))
                  ) : (
                    <div className="no-slots-matching">
                      {searchQuery
                        ? `Aucun créneau ne correspond à « ${searchQuery} » pour ce jour.`
                        : "Aucun créneau ne correspond à ce filtre pour ce jour."}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

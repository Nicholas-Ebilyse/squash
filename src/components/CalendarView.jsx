import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, AlertTriangle, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { SlotCard } from "./SlotCard";
import {
  generateDailySlots,
  getHorizonMonths,
  getDaysForMonth,
  toISODateString,
  getISOWeekNumber,
  isEvenWeek
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
  // 3-Month horizon
  const horizonMonths = getHorizonMonths(new Date(), 3);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0); // 0, 1, or 2
  const currentMonthData = horizonMonths[selectedMonthIndex] || horizonMonths[0];

  // Filters: "all" | "matches_only" | "my_slots" | "booked"
  const [filterMode, setFilterMode] = useState("all");

  // Selected date filter (optional: view all or a specific week/day)
  const [selectedWeekFilter, setSelectedWeekFilter] = useState("all");

  // Get all days for selected month
  const daysInMonth = getDaysForMonth(currentMonthData.year, currentMonthData.monthIndex);

  // Group days by week number for easy filtering
  const weeksInMonth = Array.from(
    new Set(daysInMonth.map((d) => getISOWeekNumber(d)))
  );

  return (
    <div className="calendar-view">
      {/* 3-Month Horizon Navigation */}
      <div className="horizon-tabs-bar">
        <div className="horizon-nav-buttons">
          <button
            className="btn-month-nav"
            disabled={selectedMonthIndex === 0}
            onClick={() => setSelectedMonthIndex((prev) => Math.max(0, prev - 1))}
            title={t.month_prev}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="month-tabs">
            {horizonMonths.map((m, idx) => (
              <button
                key={idx}
                className={`month-tab-btn ${selectedMonthIndex === idx ? "active" : ""}`}
                onClick={() => {
                  setSelectedMonthIndex(idx);
                  setSelectedWeekFilter("all");
                }}
              >
                <CalendarIcon size={16} />
                <span>{m.label.charAt(0).toUpperCase() + m.label.slice(1)}</span>
                {idx === 0 && <span className="tab-current-badge">{t.today}</span>}
              </button>
            ))}
          </div>

          <button
            className="btn-month-nav"
            disabled={selectedMonthIndex === horizonMonths.length - 1}
            onClick={() =>
              setSelectedMonthIndex((prev) => Math.min(horizonMonths.length - 1, prev + 1))
            }
            title={t.month_next}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
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

        {/* Week selector */}
        <div className="week-selector">
          <span className="week-filter-label">{t.week} :</span>
          <select
            value={selectedWeekFilter}
            onChange={(e) => setSelectedWeekFilter(e.target.value)}
          >
            <option value="all">Toutes les semaines du mois</option>
            {weeksInMonth.map((w) => {
              const sampleDay = daysInMonth.find((d) => getISOWeekNumber(d) === w);
              const even = sampleDay ? isEvenWeek(sampleDay) : false;
              return (
                <option key={w} value={w}>
                  Semaine {w} ({even ? t.week_even : t.week_odd})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Days & Slots Stream */}
      <div className="calendar-stream">
        {daysInMonth.map((dayDate) => {
          const weekNum = getISOWeekNumber(dayDate);

          // Apply week filter
          if (selectedWeekFilter !== "all" && Number(selectedWeekFilter) !== weekNum) {
            return null;
          }

          const dailySchedule = generateDailySlots(dayDate, clubConfig);
          const isEven = isEvenWeek(dayDate);
          const dayName = t.days[dayDate.getDay()];
          const formattedDate = dayDate.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long"
          });

          // Filter slots based on filterMode
          const filteredSlots = dailySchedule.slots.filter((slot) => {
            const state = slotsState[slot.id] || { availablePlayerIds: [], bookings: [] };
            const isMySlot = state.availablePlayerIds.includes(currentUser.id);
            const isMatchReady =
              state.availablePlayerIds.length >= (clubConfig.minPlayersForMatch || 2);
            const hasBookings = state.bookings && state.bookings.length > 0;

            if (filterMode === "matches_only") return isMatchReady;
            if (filterMode === "my_slots") return isMySlot;
            if (filterMode === "booked") return hasBookings;
            return true;
          });

          // If filtering and no slots match for this day, don't show the day
          if (filterMode !== "all" && filteredSlots.length === 0) {
            return null;
          }

          return (
            <div key={dailySchedule.dateStr} className="day-card">
              {/* Day Header */}
              <div className="day-card-header">
                <div className="day-card-title">
                  <span className="day-weekday">{dayName}</span>
                  <span className="day-number">{formattedDate}</span>
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
                      Aucun créneau ne correspond à ce filtre pour ce jour.
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

/**
 * Date utility functions for calendar generation, ISO week calculation,
 * alternating weekly routine evaluation, and holiday blackout checks.
 */

// Calculate ISO week number (1 to 53)
export function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Check if week is even (Semaine Paire) or odd (Semaine Impaire)
export function isEvenWeek(date) {
  return getISOWeekNumber(date) % 2 === 0;
}

// Format Date to YYYY-MM-DD
export function toISODateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format time from minutes (e.g., 600 -> "10:00")
export function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// Parse time string to minutes (e.g., "18:00" -> 1080)
export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

// Check if a date falls within club closures or holidays
export function getClosureReason(dateStr, closedDates = []) {
  for (const item of closedDates) {
    if (item.date && item.date === dateStr) {
      return item.reason;
    }
    if (item.startDate && item.endDate) {
      if (dateStr >= item.startDate && dateStr <= item.endDate) {
        return item.reason;
      }
    }
  }
  return null;
}

// Generate all daily slots for a given date based on clubConfig
export function generateDailySlots(date, clubConfig) {
  const dateStr = toISODateString(date);
  const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi...
  const weekNum = getISOWeekNumber(date);
  const isEven = isEvenWeek(date);

  // Check holiday or annual vacation
  const closureReason = getClosureReason(dateStr, clubConfig.closedDates);
  if (closureReason) {
    return {
      dateStr,
      date,
      dayOfWeek,
      weekNum,
      isEven,
      isClosed: true,
      closureReason,
      slots: []
    };
  }

  const daySchedule = clubConfig.dailyHours[dayOfWeek];
  if (!daySchedule || daySchedule.closed) {
    return {
      dateStr,
      date,
      dayOfWeek,
      weekNum,
      isEven,
      isClosed: true,
      closureReason: "Fermé ce jour",
      slots: []
    };
  }

  const openMinutes = timeStringToMinutes(daySchedule.open);
  const closeMinutes = timeStringToMinutes(daySchedule.close);
  const duration = clubConfig.slotDurationMinutes || 60;

  const slots = [];
  let currentStart = openMinutes;

  while (currentStart + duration <= closeMinutes) {
    const startTime = minutesToTimeString(currentStart);
    const endTime = minutesToTimeString(currentStart + duration);
    const slotId = `${dateStr}_${startTime.replace(":", "-")}`;

    slots.push({
      id: slotId,
      dateStr,
      startTime,
      endTime,
      isLastSundaySlot: dayOfWeek === 0 && currentStart + duration === closeMinutes
    });

    currentStart += duration;
  }

  return {
    dateStr,
    date,
    dayOfWeek,
    weekNum,
    isEven,
    isClosed: false,
    closureReason: null,
    slots
  };
}

// Check if a player's recurring routine matches a given slot
export function checkRoutineMatch(player, date, startTime) {
  if (!player.recurringRules || player.recurringRules.length === 0) {
    return false;
  }

  const dayOfWeek = date.getDay();
  const even = isEvenWeek(date);

  for (const rule of player.recurringRules) {
    if (rule.dayOfWeek === dayOfWeek && rule.startTime === startTime) {
      if (rule.frequency === "WEEKLY") return true;
      if (rule.frequency === "BIWEEKLY_EVEN" && even) return true;
      if (rule.frequency === "BIWEEKLY_ODD" && !even) return true;
    }
  }

  return false;
}

// Get dates for 3 months horizon (12 weeks)
export function getHorizonMonths(baseDate = new Date(), monthsCount = 3) {
  const months = [];
  const current = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);

  for (let i = 0; i < monthsCount; i++) {
    const monthDate = new Date(current.getFullYear(), current.getMonth() + i, 1);
    months.push({
      year: monthDate.getFullYear(),
      monthIndex: monthDate.getMonth(), // 0 to 11
      label: monthDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
      firstDay: monthDate,
      daysInMonth: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    });
  }

  return months;
}

// Generate array of Date objects for a specific month
export function getDaysForMonth(year, monthIndex) {
  const days = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, monthIndex, d));
  }

  return days;
}

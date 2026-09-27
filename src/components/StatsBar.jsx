import React from "react";
import { Sparkles, CheckCircle2, Clock, CalendarDays } from "lucide-react";

export function StatsBar({ stats, t, currentMonthInfo, clubConfig }) {
  return (
    <div className="stats-bar">
      <div className="stats-container">
        {/* Match Ready Count */}
        <div className="stat-card stat-matches">
          <div className="stat-icon-wrapper match-icon">
            <Sparkles size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.matchesCount}</span>
            <span className="stat-label">{t.stats_matches_ready}</span>
          </div>
        </div>

        {/* Booked Courts Count */}
        <div className="stat-card stat-booked">
          <div className="stat-icon-wrapper booked-icon">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.bookedCount}</span>
            <span className="stat-label">{t.stats_courts_booked}</span>
          </div>
        </div>

        {/* My Slots Count */}
        <div className="stat-card stat-user">
          <div className="stat-icon-wrapper user-icon">
            <Clock size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-value">{stats.userAvailableCount}</span>
            <span className="stat-label">{t.filter_my_availability}</span>
          </div>
        </div>

        {/* Horizon Info */}
        <div className="stat-card stat-horizon">
          <div className="stat-icon-wrapper horizon-icon">
            <CalendarDays size={20} />
          </div>
          <div className="stat-details">
            <span className="stat-badge">{clubConfig.horizonWeeks || 12} semaines</span>
            <span className="stat-label">{t.horizon_notice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

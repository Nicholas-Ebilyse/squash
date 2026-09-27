import React, { useState } from "react";
import { X, Calendar, Plus, Trash2, Clock, Repeat } from "lucide-react";

export function RoutineModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUserRules,
  t,
  clubConfig
}) {
  const [dayOfWeek, setDayOfWeek] = useState(2); // Mardi par défaut
  const [startTime, setStartTime] = useState("18:00");
  const [frequency, setFrequency] = useState("WEEKLY");

  if (!isOpen) return null;

  // Available times based on club hours (e.g. 10:00 to 21:00)
  const availableHours = [
    "10:00", "11:00", "12:00", "13:00", "14:00",
    "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  const handleAddRule = (e) => {
    e.preventDefault();
    const newRule = {
      id: `rule_${Date.now()}`,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      frequency,
      description: `${t.days[dayOfWeek]} ${startTime} - ${Number(startTime.split(":")[0]) + 1}:00 (${
        frequency === "WEEKLY"
          ? t.routine_freq_weekly
          : frequency === "BIWEEKLY_EVEN"
          ? t.routine_freq_biweekly_even
          : t.routine_freq_biweekly_odd
      })`
    };

    const updatedRules = [...(currentUser.recurringRules || []), newRule];
    onUpdateUserRules(currentUser.id, updatedRules);
  };

  const handleDeleteRule = (ruleId) => {
    const updatedRules = (currentUser.recurringRules || []).filter((r) => r.id !== ruleId);
    onUpdateUserRules(currentUser.id, updatedRules);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container routine-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Repeat className="modal-icon text-emerald" size={24} />
            <div>
              <h2 className="modal-title">{t.routine_title}</h2>
              <p className="modal-subtitle">{t.routine_subtitle}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title={t.close}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Active Rules List */}
          <div className="rules-section">
            <h3 className="section-title">{t.routine_active_rules}</h3>
            {currentUser.recurringRules && currentUser.recurringRules.length > 0 ? (
              <div className="rules-list">
                {currentUser.recurringRules.map((rule) => (
                  <div key={rule.id} className="rule-item">
                    <div className="rule-info">
                      <span className="rule-day-time">
                        🗓️ {t.days[rule.dayOfWeek]} • ⏰ {rule.startTime}
                      </span>
                      <span className="rule-freq-badge">
                        {rule.frequency === "WEEKLY" && `🔄 ${t.routine_freq_weekly}`}
                        {rule.frequency === "BIWEEKLY_EVEN" && `⚖️ ${t.routine_freq_biweekly_even}`}
                        {rule.frequency === "BIWEEKLY_ODD" && `⚡ ${t.routine_freq_biweekly_odd}`}
                      </span>
                    </div>
                    <button
                      className="btn-delete-rule"
                      onClick={() => handleDeleteRule(rule.id)}
                      title={t.routine_delete}
                    >
                      <Trash2 size={16} />
                      <span>{t.routine_delete}</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-rules-message">{t.routine_no_rules}</p>
            )}
          </div>

          {/* Add Rule Form */}
          <form className="add-rule-form" onSubmit={handleAddRule}>
            <h3 className="section-title">➕ Définir une nouvelle habitude :</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>{t.routine_day}</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(Number(e.target.value))}
                >
                  <option value={1}>{t.days[1]} (Lundi)</option>
                  <option value={2}>{t.days[2]} (Mardi)</option>
                  <option value={3}>{t.days[3]} (Mercredi)</option>
                  <option value={4}>{t.days[4]} (Jeudi)</option>
                  <option value={5}>{t.days[5]} (Vendredi)</option>
                  <option value={6}>{t.days[6]} (Samedi)</option>
                  <option value={0}>{t.days[0]} (Dimanche)</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t.routine_time}</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {availableHours.map((h) => (
                    <option key={h} value={h}>
                      {h} - {Number(h.split(":")[0]) + 1}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Google Calendar style Recurrence Frequency */}
            <div className="form-group recurrence-options">
              <label>Fréquence de répétition :</label>
              <div className="radio-cards">
                <label
                  className={`radio-card ${frequency === "WEEKLY" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="WEEKLY"
                    checked={frequency === "WEEKLY"}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  <div>
                    <strong>{t.routine_freq_weekly}</strong>
                    <span className="radio-hint">Chaque semaine sans interruption</span>
                  </div>
                </label>

                <label
                  className={`radio-card ${frequency === "BIWEEKLY_EVEN" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="BIWEEKLY_EVEN"
                    checked={frequency === "BIWEEKLY_EVEN"}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  <div>
                    <strong>{t.routine_freq_biweekly_even}</strong>
                    <span className="radio-hint">Ex: Semaines 40, 42, 44...</span>
                  </div>
                </label>

                <label
                  className={`radio-card ${frequency === "BIWEEKLY_ODD" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value="BIWEEKLY_ODD"
                    checked={frequency === "BIWEEKLY_ODD"}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                  <div>
                    <strong>{t.routine_freq_biweekly_odd}</strong>
                    <span className="radio-hint">Ex: Semaines 41, 43, 45...</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-submit-rule">
              <Plus size={18} />
              <span>{t.routine_add_btn}</span>
            </button>
          </form>

          {/* Helpful Tip */}
          <div className="tip-box">
            <p>{t.routine_tip}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t.routine_close}
          </button>
        </div>
      </div>
    </div>
  );
}

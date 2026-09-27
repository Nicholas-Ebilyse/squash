import React, { useState } from "react";
import { X, Trophy, ExternalLink, Check, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export function BookingModal({
  isOpen,
  onClose,
  slot,
  dateObj,
  availablePlayers,
  allUsers,
  currentUser,
  existingBookings = [],
  onConfirmBooking,
  t,
  clubConfig
}) {
  if (!isOpen || !slot) return null;

  const totalCourts = clubConfig.courtCount || 2;
  const bookedCourts = existingBookings.map((b) => b.court);

  // Default to first free court
  const firstFreeCourt = [1, 2].find((c) => !bookedCourts.includes(c)) || 1;
  const [selectedCourt, setSelectedCourt] = useState(firstFreeCourt);

  // Default partner: first available player who isn't the current user
  const partnerCandidates = availablePlayers.filter((p) => p.id !== currentUser.id);
  const [selectedPartnerId, setSelectedPartnerId] = useState(
    partnerCandidates[0]?.id || allUsers.find((u) => u.id !== currentUser.id)?.id || ""
  );
  const [matchType, setMatchType] = useState("singles");

  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : slot.dateStr;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }

    onConfirmBooking(slot.id, {
      court: Number(selectedCourt),
      bookedBy: currentUser.id,
      partnerId: selectedPartnerId,
      matchType,
      bookedAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container booking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Trophy className="modal-icon text-amber" size={24} />
            <div>
              <h2 className="modal-title">{t.booking_title}</h2>
              <p className="modal-subtitle">{t.booking_subtitle}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title={t.close}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Slot Summary Banner */}
          <div className="slot-summary-banner">
            <span className="summary-date">📅 {formattedDate}</span>
            <span className="summary-time">⏰ {slot.startTime} - {slot.endTime} (1 heure)</span>
          </div>

          {/* Court Choice (2 Courts) */}
          <div className="form-group">
            <label className="form-label">{t.booking_court_choice}</label>
            <div className="court-choice-grid">
              {[1, 2].map((courtNum) => {
                const isBooked = bookedCourts.includes(courtNum);
                const booking = existingBookings.find((b) => b.court === courtNum);
                const booker = allUsers.find((u) => u.id === booking?.bookedBy);

                return (
                  <label
                    key={courtNum}
                    className={`court-choice-card ${selectedCourt === courtNum ? "selected" : ""} ${
                      isBooked ? "disabled" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="court"
                      value={courtNum}
                      disabled={isBooked}
                      checked={selectedCourt === courtNum}
                      onChange={() => setSelectedCourt(courtNum)}
                    />
                    <div className="court-card-content">
                      <strong>Court n° {courtNum}</strong>
                      {isBooked ? (
                        <span className="text-danger">Déjà réservé ({booker?.displayName || "Joueur"})</span>
                      ) : (
                        <span className="text-success">Disponible</span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Partner Selector */}
          <div className="form-group">
            <label className="form-label">{t.booking_partner}</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="partner-select"
              required
            >
              <optgroup label="Joueurs disponibles sur ce créneau :">
                {partnerCandidates.map((p) => (
                  <option key={p.id} value={p.id}>
                    🎾 {p.displayName} ({t[`level_${p.skillLevel}`] || p.skillLevel})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Autres joueurs du club :">
                {allUsers
                  .filter((u) => u.id !== currentUser.id && !partnerCandidates.some((p) => p.id === u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.displayName} ({t[`level_${u.skillLevel}`] || u.skillLevel})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Match Format */}
          <div className="form-group">
            <label className="form-label">{t.booking_type}</label>
            <div className="format-options">
              <label className={`radio-pill ${matchType === "singles" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="matchType"
                  value="singles"
                  checked={matchType === "singles"}
                  onChange={() => setMatchType("singles")}
                />
                <span>{t.type_singles}</span>
              </label>
              <label className={`radio-pill ${matchType === "doubles" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="matchType"
                  value="doubles"
                  checked={matchType === "doubles"}
                  onChange={() => setMatchType("doubles")}
                />
                <span>{t.type_doubles}</span>
              </label>
            </div>
          </div>

          {/* External Club Portal Reminder */}
          <div className="club-portal-reminder">
            <div className="reminder-text">
              <p>{t.booking_club_portal_hint}</p>
              <a
                href={clubConfig.bookingPortalUrl || "https://reservation.squashclub.fr"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-portal-link"
              >
                <span>{t.booking_open_club_portal}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t.booking_cancel_btn}
            </button>
            <button type="submit" className="btn-primary btn-confirm-booking">
              <Check size={18} />
              <span>{t.booking_confirm_btn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

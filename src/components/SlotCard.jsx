import React from "react";
import { UserCheck, UserPlus, CheckCircle2, MessageCircle, AlertCircle } from "lucide-react";

export function SlotCard({
  slot,
  dateObj,
  users,
  currentUser,
  slotState, // { availablePlayerIds: [], bookings: [{ court: 1, bookedBy: 'usr_alex', partnerId: 'usr_marc' }] }
  onToggleAvailability,
  onOpenBooking,
  onCancelBooking,
  t,
  clubConfig
}) {
  const availablePlayerIds = slotState?.availablePlayerIds || [];
  const bookings = slotState?.bookings || [];
  const totalCourts = clubConfig.courtCount || 2;
  const bookedCourtsCount = bookings.length;
  const freeCourtsCount = Math.max(0, totalCourts - bookedCourtsCount);

  const isUserAvailable = availablePlayerIds.includes(currentUser.id);
  const availablePlayers = users.filter((u) => availablePlayerIds.includes(u.id));

  // Determine match state
  const isFullyBooked = bookedCourtsCount >= totalCourts;
  const isMatchReady = availablePlayerIds.length >= (clubConfig.minPlayersForMatch || 2) && freeCourtsCount > 0;
  const isSingleWaiting = availablePlayerIds.length === 1 && freeCourtsCount > 0;
  const isPartialBooked = bookedCourtsCount > 0 && freeCourtsCount > 0;

  // WhatsApp helper
  const getWhatsAppLink = () => {
    const formattedDate = dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
    const message = t.whatsapp_msg
      .replace("{date}", formattedDate)
      .replace("{time}", `${slot.startTime} - ${slot.endTime}`);
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      className={`slot-card ${
        isFullyBooked
          ? "slot-fully-booked"
          : isMatchReady
          ? "slot-match-ready"
          : isPartialBooked
          ? "slot-partial-booked"
          : isSingleWaiting
          ? "slot-single-waiting"
          : "slot-empty"
      }`}
    >
      {/* Time & Courts info header */}
      <div className="slot-header">
        <div className="slot-time-group">
          <span className="slot-time">{slot.startTime} - {slot.endTime}</span>
          {slot.isLastSundaySlot && (
            <span className="badge-last-sunday">Dernier créneau dominical</span>
          )}
        </div>

        <div className="court-availability-badge">
          {isFullyBooked ? (
            <span className="court-tag tag-full">{t.status_fully_booked}</span>
          ) : (
            <span className="court-tag tag-free">
              {freeCourtsCount} / {totalCourts} courts libres
            </span>
          )}
        </div>
      </div>

      {/* Booked Courts Section if any */}
      {bookings.length > 0 && (
        <div className="slot-bookings-list">
          {bookings.map((booking, idx) => {
            const bookedByPlayer = users.find((u) => u.id === booking.bookedBy);
            const partnerPlayer = users.find((u) => u.id === booking.partnerId);
            const isMyBooking = booking.bookedBy === currentUser.id || currentUser.role === "admin";

            return (
              <div key={idx} className="booking-pill">
                <span className="court-num">Court {booking.court || idx + 1}</span>
                <span className="booking-names">
                  🔒 Réservé par <strong>{bookedByPlayer?.displayName || "Joueur"}</strong> avec{" "}
                  <strong>{partnerPlayer?.displayName || "Partenaire"}</strong>
                </span>
                {isMyBooking && (
                  <button
                    className="btn-cancel-reservation"
                    onClick={() => onCancelBooking(slot.id, booking.court)}
                    title={t.btn_cancel_booking}
                  >
                    × Annuler
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Players available section */}
      {!isFullyBooked && (
        <div className="slot-players-container">
          {availablePlayers.length > 0 ? (
            <div className="players-list">
              <span className="players-label">
                {isMatchReady ? (
                  <strong className="text-match-ready">{t.status_match_ready}</strong>
                ) : (
                  <span>{t.status_single} :</span>
                )}
              </span>
              <div className="players-badges">
                {availablePlayers.map((player) => (
                  <span
                    key={player.id}
                    className={`player-badge ${player.id === currentUser.id ? "player-is-me" : ""}`}
                    style={{ borderLeftColor: player.avatarColor || "#10b981" }}
                  >
                    👤 {player.displayName}
                    <span className="player-skill-tag">
                      {t[`level_${player.skillLevel}`] || player.skillLevel}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span className="text-empty-slot">{t.status_empty}</span>
          )}
        </div>
      )}

      {/* Actions footer */}
      <div className="slot-actions">
        {/* Toggle Availability Button */}
        {!isFullyBooked && (
          <button
            className={`btn-slot ${isUserAvailable ? "btn-slot-active" : "btn-slot-idle"}`}
            onClick={() => onToggleAvailability(slot.id)}
          >
            {isUserAvailable ? (
              <>
                <UserCheck size={16} />
                <span>{t.btn_unavailable}</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>{t.btn_available}</span>
              </>
            )}
          </button>
        )}

        {/* Action: Declare Club Booking (when match is ready) */}
        {isMatchReady && (
          <button
            className="btn-slot btn-book-club"
            onClick={() => onOpenBooking(slot, dateObj, availablePlayers)}
          >
            <CheckCircle2 size={16} />
            <span>{t.btn_mark_booked}</span>
          </button>
        )}

        {/* Action: WhatsApp Quick Invite */}
        {availablePlayers.length > 0 && !isFullyBooked && (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-slot btn-whatsapp"
            title={t.btn_whatsapp_invite}
          >
            <MessageCircle size={16} />
            <span className="hide-on-mobile">{t.btn_whatsapp_invite}</span>
          </a>
        )}
      </div>
    </div>
  );
}

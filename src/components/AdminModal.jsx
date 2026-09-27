import React, { useState } from "react";
import { X, Shield, Clock, Calendar, Users, Save, Plus, Trash2, KeyRound, Check, Pencil } from "lucide-react";

export function AdminModal({
  isOpen,
  onClose,
  clubConfig,
  onUpdateClubConfig,
  users,
  onUpdateUsers,
  t
}) {
  const [activeTab, setActiveTab] = useState("club"); // "club" | "holidays" | "players"

  // Local config form state
  const [config, setConfig] = useState({ ...clubConfig });
  const [userList, setUserList] = useState([...users]);
  const [notification, setNotification] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);

  // New holiday form state
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayEndDate, setHolidayEndDate] = useState("");

  // New player form state
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerUsername, setNewPlayerUsername] = useState("");
  const [newPlayerEmail, setNewPlayerEmail] = useState("");
  const [newPlayerRole, setNewPlayerRole] = useState("player");
  const [newPlayerLevel, setNewPlayerLevel] = useState("intermediaire");
  const [newPlayerPhone, setNewPlayerPhone] = useState("");

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    onUpdateClubConfig(config);
    onUpdateUsers(userList);
    showNotification(t.admin_saved_success);
  };

  const handleDailyHourChange = (dayIndex, field, value) => {
    setConfig((prev) => ({
      ...prev,
      dailyHours: {
        ...prev.dailyHours,
        [dayIndex]: {
          ...prev.dailyHours[dayIndex],
          [field]: value
        }
      }
    }));
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    if (!holidayName || !holidayDate) return;

    const newHoliday = {
      id: `h_${Date.now()}`,
      reason: holidayName,
      date: holidayEndDate ? undefined : holidayDate,
      startDate: holidayEndDate ? holidayDate : undefined,
      endDate: holidayEndDate ? holidayEndDate : undefined
    };

    setConfig((prev) => ({
      ...prev,
      closedDates: [...(prev.closedDates || []), newHoliday]
    }));

    setHolidayName("");
    setHolidayDate("");
    setHolidayEndDate("");
    showNotification("Période de fermeture ajoutée");
  };

  const handleDeleteHoliday = (holidayId) => {
    setConfig((prev) => ({
      ...prev,
      closedDates: prev.closedDates.filter((h) => h.id !== holidayId)
    }));
  };

  const handleResetPassword = (player) => {
    showNotification(t.admin_pwd_reset_success.replace("{name}", player.displayName));
  };

  const handleAddPlayer = (e) => {
    e.preventDefault();
    if (!newPlayerName || !newPlayerUsername) return;

    const newPlayer = {
      id: `usr_${Date.now()}`,
      username: newPlayerUsername.toLowerCase(),
      displayName: newPlayerName,
      email: newPlayerEmail || `${newPlayerUsername.toLowerCase()}@squashclub.fr`,
      password: "Squash2026!",
      role: newPlayerRole,
      skillLevel: newPlayerLevel,
      phone: newPlayerPhone,
      avatarColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      recurringRules: []
    };

    const updated = [...userList, newPlayer];
    setUserList(updated);
    onUpdateUsers(updated);

    setNewPlayerName("");
    setNewPlayerUsername("");
    setNewPlayerEmail("");
    setNewPlayerPhone("");
    showNotification(`Joueur ${newPlayerName} créé avec succès !`);
  };

  const handleDeletePlayer = (playerId) => {
    if (confirm("Supprimer ce joueur du groupe ?")) {
      const updated = userList.filter((u) => u.id !== playerId);
      setUserList(updated);
      onUpdateUsers(updated);
      showNotification("Joueur supprimé.");
    }
  };

  const handleStartEditPlayer = (player) => {
    setEditingPlayer({ ...player });
  };

  const handleCancelEditPlayer = () => {
    setEditingPlayer(null);
  };

  const handleSaveEditedPlayer = (e) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.displayName || !editingPlayer.username) return;

    const updated = userList.map((u) => (u.id === editingPlayer.id ? editingPlayer : u));
    setUserList(updated);
    onUpdateUsers(updated);
    showNotification(t.admin_player_updated.replace("{name}", editingPlayer.displayName));
    setEditingPlayer(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container admin-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Shield className="modal-icon text-purple" size={24} />
            <div>
              <h2 className="modal-title">{t.admin_title}</h2>
              <p className="modal-subtitle">{t.admin_subtitle}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} title={t.close}>
            <X size={20} />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="admin-notification-toast">
            <Check size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "club" ? "active" : ""}`}
            onClick={() => setActiveTab("club")}
          >
            <Clock size={16} />
            <span>{t.admin_tab_club}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "holidays" ? "active" : ""}`}
            onClick={() => setActiveTab("holidays")}
          >
            <Calendar size={16} />
            <span>{t.admin_tab_holidays}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "players" ? "active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            <Users size={16} />
            <span>{t.admin_tab_players}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body admin-body">
          {/* TAB 1: CLUB SETTINGS & HOURS */}
          {activeTab === "club" && (
            <div className="admin-tab-pane">
              <div className="config-grid">
                <div className="form-group">
                  <label>{t.admin_courts_count}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.courtCount}
                    onChange={(e) =>
                      setConfig({ ...config, courtCount: Number(e.target.value) })
                    }
                  />
                  <span className="field-hint">Courts physiques de squash</span>
                </div>

                <div className="form-group">
                  <label>{t.admin_slot_duration}</label>
                  <select
                    value={config.slotDurationMinutes}
                    onChange={(e) =>
                      setConfig({ ...config, slotDurationMinutes: Number(e.target.value) })
                    }
                  >
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes (Standard)</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t.admin_horizon_months}</label>
                  <select
                    value={config.horizonWeeks}
                    onChange={(e) =>
                      setConfig({ ...config, horizonWeeks: Number(e.target.value) })
                    }
                  >
                    <option value={4}>4 semaines (1 mois)</option>
                    <option value={8}>8 semaines (2 mois)</option>
                    <option value={12}>12 semaines (3 mois - Recommandé)</option>
                    <option value={16}>16 semaines (4 mois)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>{t.admin_booking_url}</label>
                  <input
                    type="url"
                    value={config.bookingPortalUrl}
                    onChange={(e) =>
                      setConfig({ ...config, bookingPortalUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Day-by-Day Hours */}
              <div className="hours-config-section">
                <h4 className="sub-heading">{t.admin_daily_hours}</h4>
                <div className="daily-hours-list">
                  {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                    const dayHours = config.dailyHours[dayIdx] || {
                      open: "10:00",
                      close: "22:00",
                      closed: false
                    };

                    return (
                      <div key={dayIdx} className="day-hour-row">
                        <span className="day-name">{t.days[dayIdx]}</span>
                        <div className="hour-inputs">
                          <label className="checkbox-closed">
                            <input
                              type="checkbox"
                              checked={dayHours.closed}
                              onChange={(e) =>
                                handleDailyHourChange(dayIdx, "closed", e.target.checked)
                              }
                            />
                            <span>{t.admin_closed_day}</span>
                          </label>

                          {!dayHours.closed && (
                            <>
                              <span>{t.admin_from}</span>
                              <input
                                type="time"
                                value={dayHours.open}
                                onChange={(e) =>
                                  handleDailyHourChange(dayIdx, "open", e.target.value)
                                }
                              />
                              <span>{t.admin_to}</span>
                              <input
                                type="time"
                                value={dayHours.close}
                                onChange={(e) =>
                                  handleDailyHourChange(dayIdx, "close", e.target.value)
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="notice-sunday">{t.admin_sunday_notice}</p>
              </div>
            </div>
          )}

          {/* TAB 2: HOLIDAYS & CLOSURES */}
          {activeTab === "holidays" && (
            <div className="admin-tab-pane">
              <h4 className="sub-heading">{t.admin_holidays_title}</h4>

              {/* Add Holiday Form */}
              <form className="add-holiday-box" onSubmit={handleAddHoliday}>
                <div className="holiday-form-row">
                  <div className="form-group flex-2">
                    <label>{t.admin_holiday_name}</label>
                    <input
                      type="text"
                      placeholder="Ex: Toussaint, Fermeture estivale..."
                      value={holidayName}
                      onChange={(e) => setHolidayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.admin_holiday_date}</label>
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.admin_holiday_end}</label>
                    <input
                      type="date"
                      value={holidayEndDate}
                      onChange={(e) => setHolidayEndDate(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-add-holiday">
                    <Plus size={16} />
                    <span>Ajouter</span>
                  </button>
                </div>
              </form>

              {/* Holidays Table */}
              <div className="holidays-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Motif</th>
                      <th>Dates</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(config.closedDates || []).map((h) => (
                      <tr key={h.id}>
                        <td>
                          <strong>{h.reason}</strong>
                        </td>
                        <td>
                          {h.startDate && h.endDate
                            ? `Du ${h.startDate} au ${h.endDate}`
                            : h.date}
                        </td>
                        <td>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDeleteHoliday(h.id)}
                            title="Supprimer cette fermeture"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PLAYERS MANAGEMENT */}
          {activeTab === "players" && (
            <div className="admin-tab-pane">
              <h4 className="sub-heading">{t.admin_players_title}</h4>

              {/* Edit Player Box (shown when editingPlayer is set) */}
              {editingPlayer && (
                <form className="edit-player-box" onSubmit={handleSaveEditedPlayer}>
                  <div className="edit-box-header">
                    <h5>✏️ {t.admin_editing_player} <strong>{editingPlayer.displayName}</strong></h5>
                    <button
                      type="button"
                      className="btn-close-edit"
                      onClick={handleCancelEditPlayer}
                      title={t.cancel}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="player-form-grid">
                    <div className="form-group">
                      <label>{t.form_fullname}</label>
                      <input
                        type="text"
                        value={editingPlayer.displayName}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, displayName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.form_username}</label>
                      <input
                        type="text"
                        value={editingPlayer.username}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, username: e.target.value.toLowerCase() })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.form_email}</label>
                      <input
                        type="email"
                        value={editingPlayer.email || ""}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, email: e.target.value })
                        }
                        placeholder="joueur@squashclub.fr"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.form_role}</label>
                      <select
                        value={editingPlayer.role}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, role: e.target.value })
                        }
                      >
                        <option value="player">{t.form_role_player}</option>
                        <option value="admin">{t.form_role_admin}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t.form_level}</label>
                      <select
                        value={editingPlayer.skillLevel}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, skillLevel: e.target.value })
                        }
                      >
                        <option value="loisir">{t.level_loisir}</option>
                        <option value="intermediaire">{t.level_inter}</option>
                        <option value="confirme">{t.level_confirme}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t.form_phone}</label>
                      <input
                        type="tel"
                        value={editingPlayer.phone || ""}
                        onChange={(e) =>
                          setEditingPlayer({ ...editingPlayer, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group btn-col edit-buttons-col">
                      <button type="submit" className="btn-save-edited-player">
                        <Check size={16} />
                        <span>{t.admin_save_player}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-cancel-edit-player"
                        onClick={handleCancelEditPlayer}
                      >
                        <span>{t.cancel}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Add Player Box */}
              <form className="add-player-box" onSubmit={handleAddPlayer}>
                <h5>➕ {t.modal_add_player_title}</h5>
                <div className="player-form-grid">
                  <div className="form-group">
                    <label>{t.form_fullname}</label>
                    <input
                      type="text"
                      placeholder="Ex: Thomas B."
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.form_username}</label>
                    <input
                      type="text"
                      placeholder="Ex: thomas"
                      value={newPlayerUsername}
                      onChange={(e) => setNewPlayerUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.form_email}</label>
                    <input
                      type="email"
                      placeholder="ex: thomas@squashclub.fr"
                      value={newPlayerEmail}
                      onChange={(e) => setNewPlayerEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t.form_role}</label>
                    <select
                      value={newPlayerRole}
                      onChange={(e) => setNewPlayerRole(e.target.value)}
                    >
                      <option value="player">{t.form_role_player}</option>
                      <option value="admin">{t.form_role_admin}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.form_level}</label>
                    <select
                      value={newPlayerLevel}
                      onChange={(e) => setNewPlayerLevel(e.target.value)}
                    >
                      <option value="loisir">{t.level_loisir}</option>
                      <option value="intermediaire">{t.level_inter}</option>
                      <option value="confirme">{t.level_confirme}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.form_phone}</label>
                    <input
                      type="tel"
                      placeholder="+33 6 ..."
                      value={newPlayerPhone}
                      onChange={(e) => setNewPlayerPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group btn-col">
                    <button type="submit" className="btn-create-player">
                      <Plus size={16} />
                      <span>{t.form_submit}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Players Table */}
              <div className="players-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t.admin_col_name}</th>
                      <th>{t.admin_col_username}</th>
                      <th>{t.admin_col_email}</th>
                      <th>{t.admin_col_role}</th>
                      <th>{t.admin_col_level}</th>
                      <th>{t.admin_col_actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((player) => (
                      <tr
                        key={player.id}
                        className={editingPlayer?.id === player.id ? "row-is-editing" : ""}
                      >
                        <td>
                          <div className="player-table-name">
                            <span
                              className="user-dot"
                              style={{ backgroundColor: player.avatarColor || "#10b981" }}
                            ></span>
                            <div>
                              <strong>{player.displayName}</strong>
                              {player.phone && (
                                <span className="player-phone-sub"> • 📞 {player.phone}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td><code>{player.username}</code></td>
                        <td>
                          <span className="player-email-cell">
                            ✉️ {player.email || `${player.username}@squashclub.fr`}
                          </span>
                        </td>
                        <td>
                          <span className={`role-badge ${player.role}`}>
                            {player.role === "admin" ? "Admin" : "Joueur"}
                          </span>
                        </td>
                        <td>{t[`level_${player.skillLevel}`] || player.skillLevel}</td>
                        <td>
                          <div className="action-buttons-group">
                            <button
                              className="btn-pwd-reset btn-edit-player"
                              onClick={() => handleStartEditPlayer(player)}
                              title={t.admin_edit_player}
                            >
                              <Pencil size={14} />
                              <span>{t.admin_edit_player}</span>
                            </button>
                            <button
                              className="btn-pwd-reset"
                              onClick={() => handleResetPassword(player)}
                              title={t.admin_reset_pwd}
                            >
                              <KeyRound size={14} />
                              <span>{t.admin_reset_pwd}</span>
                            </button>
                            {player.role !== "admin" && (
                              <button
                                className="btn-table-delete"
                                onClick={() => handleDeletePlayer(player.id)}
                                title={t.admin_delete_player}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t.close}
          </button>
          <button className="btn-primary" onClick={handleSaveConfig}>
            <Save size={18} />
            <span>{t.admin_save_all}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

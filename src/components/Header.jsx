import React from "react";
import { Users, Globe, Settings, Calendar, Shield, Sparkles, LogOut, LogIn } from "lucide-react";
import { SquashBallIcon } from "./SquashIcons";

export function Header({
  currentUser,
  users,
  onSwitchUser,
  onLogout,
  onOpenLogin,
  language,
  onToggleLanguage,
  t,
  onOpenRoutine,
  onOpenAdmin
}) {
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand */}
        <div className="brand-group">
          <div className="brand-logo">
            <span className="squash-ball-pulse"></span>
            <SquashBallIcon size={28} />
          </div>
          <div>
            <h1 className="brand-title">
              {t.app_title}
              <span className="badge-courts">2 Courts • 1h</span>
            </h1>
            <p className="brand-tagline">{t.tagline}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {currentUser ? (
            <>
              {/* User selector & Profile badge */}
              <div className="user-profile-badge">
                <div
                  className="user-avatar"
                  style={{ backgroundColor: currentUser.avatarColor || "#10b981" }}
                >
                  {currentUser.displayName.charAt(0)}
                </div>
                <div className="user-info">
                  <span className="user-label">{t.logged_in_as}</span>
                  <select
                    className="user-select"
                    value={currentUser.id}
                    onChange={(e) => {
                      const selected = users.find((u) => u.id === e.target.value);
                      if (selected) onSwitchUser(selected);
                    }}
                    title={t.switch_player}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.displayName} ({user.role === "admin" ? "Admin" : t[`level_${user.skillLevel}`] || user.skillLevel})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Disconnect Button */}
              <button
                className="btn-action btn-logout"
                onClick={onLogout}
                title="Se déconnecter de ce compte"
              >
                <LogOut size={16} />
                <span className="hide-on-mobile">Déconnexion</span>
              </button>

              {/* Routine Button */}
              <button
                className="btn-action btn-routine"
                onClick={onOpenRoutine}
                title={t.routine_title}
              >
                <Calendar size={18} />
                <span className="hide-on-mobile">{t.my_routine_btn}</span>
              </button>

              {/* Admin Space */}
              {currentUser.role === "admin" && (
                <button
                  className="btn-action btn-admin"
                  onClick={onOpenAdmin}
                  title={t.admin_space}
                >
                  <Shield size={18} />
                  <span className="hide-on-mobile">{t.admin_space}</span>
                </button>
              )}
            </>
          ) : (
            /* Log in button if disconnected */
            <button
              className="btn-action btn-login-primary"
              onClick={onOpenLogin}
              title="Se connecter"
            >
              <LogIn size={18} />
              <span>Se connecter</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            className="btn-action btn-lang"
            onClick={onToggleLanguage}
            title="Changer de langue / Switch language"
          >
            <Globe size={18} />
            <span className="lang-code">{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from "react";
import { LogIn, KeyRound, User, Lock, AlertCircle, Sparkles, Check } from "lucide-react";

export function LoginModal({
  isOpen,
  onClose,
  users,
  onLogin,
  t
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const trimmedId = identifier.trim().toLowerCase();
    const matchedUser = users.find(
      (u) =>
        u.username?.toLowerCase() === trimmedId ||
        u.email?.toLowerCase() === trimmedId ||
        u.displayName?.toLowerCase() === trimmedId
    );

    if (!matchedUser) {
      setError(
        "Identifiant ou e-mail introuvable. Veuillez vérifier ou sélectionner votre profil ci-dessous."
      );
      return;
    }

    // Check password if set
    if (matchedUser.password && matchedUser.password !== password) {
      setError("Mot de passe incorrect. Contactez l'administrateur pour le réinitialiser si besoin.");
      return;
    }

    onLogin(matchedUser);
    setPassword("");
    setIdentifier("");
    setError(null);
  };

  const handleSelectQuickPlayer = (user) => {
    setIdentifier(user.username || user.email);
    setPassword(user.password || "Squash2026!");
    setError(null);
  };

  return (
    <div className="modal-overlay login-overlay">
      <div className="modal-container login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header login-header">
          <div className="modal-title-group">
            <div className="login-logo-badge">
              <span className="squash-ball-pulse"></span>
              <span className="racquet-icon">🎾</span>
            </div>
            <div>
              <h2 className="modal-title">Espace Squash Club</h2>
              <p className="modal-subtitle">
                Identifiez-vous pour indiquer vos disponibilités et voir vos matchs
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body login-body">
          {error && (
            <div className="login-error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Select for convenience */}
          <div className="quick-player-picker">
            <span className="quick-label">⚡ Accès rapide / Choisissez votre profil :</span>
            <div className="quick-players-list">
              {users.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  className={`quick-player-chip ${
                    identifier === u.username || identifier === u.email ? "selected" : ""
                  }`}
                  onClick={() => handleSelectQuickPlayer(u)}
                >
                  <span
                    className="chip-dot"
                    style={{ backgroundColor: u.avatarColor || "#10b981" }}
                  ></span>
                  <span>{u.displayName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="login-divider">
            <span>ou saisissez vos coordonnées</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={15} />
              <span>Identifiant ou E-mail</span>
            </label>
            <input
              type="text"
              placeholder="ex: alexandre ou alexandre.durand@squashclub.fr"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} />
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-submit-login">
            <LogIn size={18} />
            <span>Se connecter à mon compte</span>
          </button>

          <div className="login-footer-hint">
            <KeyRound size={15} />
            <span>
              Première connexion ou mot de passe oublié ? Votre responsable de club peut le
              réinitialiser instantanément.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

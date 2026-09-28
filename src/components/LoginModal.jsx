import React, { useState } from "react";
import { LogIn, KeyRound, User, Lock, AlertCircle } from "lucide-react";
import { SquashBallIcon } from "./SquashIcons";

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
        "Identifiant ou adresse e-mail introuvable. Veuillez vérifier vos informations ou contacter l'administrateur du club."
      );
      return;
    }

    // Check password if set
    if (matchedUser.password && matchedUser.password !== password) {
      setError("Mot de passe incorrect. Contactez un administrateur du club pour le réinitialiser si besoin.");
      return;
    }

    onLogin(matchedUser);
    setPassword("");
    setIdentifier("");
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
              <SquashBallIcon size={26} />
            </div>
            <div>
              <h2 className="modal-title">Espace Squash Club</h2>
              <p className="modal-subtitle">
                Identifiez-vous pour accéder au planning et indiquer vos disponibilités
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

          <div className="form-group">
            <label className="form-label">
              <User size={15} />
              <span>Identifiant ou Adresse E-mail</span>
            </label>
            <input
              type="text"
              placeholder="ex: eric, nicholas ou votre@email.fr"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} />
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
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
              Première connexion ou mot de passe oublié ? Un administrateur peut réinitialiser votre mot de passe depuis l'Espace Admin.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}


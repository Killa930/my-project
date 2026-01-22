import React, { useEffect, useState } from "react";

export default function AuthModal({ open, initialTab = "login", onClose }) {
  const [tab, setTab] = useState(initialTab);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const resetError = () => setError("");

  const handleLogin = async (e) => {
    e.preventDefault();
    resetError();
    setLoading(true);

    try {
      console.log("LOGIN SUBMIT:", { loginEmail, loginPassword });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Radās kļūda");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetError();

    if (regPassword !== regPassword2) {
      setError("Paroles nesakrīt");
      return;
    }

    setLoading(true);
    try {
      // TODO: vēlāk pieslēgsim Laravel Sanctum / reģistrāciju
      console.log("REGISTER SUBMIT:", { regName, regEmail, regPassword });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Reģistrācijas kļūda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__top">
          <div className="modal__tabs">
            <button
              className={`tabBtn ${tab === "login" ? "isActive" : ""}`}
              onClick={() => setTab("login")}
              type="button"
            >
              Pieteikties
            </button>
            <button
              className={`tabBtn ${tab === "register" ? "isActive" : ""}`}
              onClick={() => setTab("register")}
              type="button"
            >
              Reģistrācija
            </button>
          </div>

          <button
            className="iconBtn"
            onClick={onClose}
            type="button"
            aria-label="Aizvērt"
          >
            ✕
          </button>
        </div>

        {error && <div className="modal__error">{error}</div>}

        {tab === "login" ? (
          <form className="form" onSubmit={handleLogin}>
            <label className="field">
              <span className="field__label">E-pasts</span>
              <input
                className="input"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="mail@example.com"
              />
            </label>

            <label className="field">
              <span className="field__label">Parole</span>
              <input
                className="input"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>

            <button className="btn" disabled={loading} type="submit">
              {loading ? "Pieslēdzas..." : "Ieiet"}
            </button>

            <p className="muted small">
              Nav konta?{" "}
              <button
                className="linkBtn"
                type="button"
                onClick={() => setTab("register")}
              >
                Reģistrēties
              </button>
            </p>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegister}>
            <label className="field">
              <span className="field__label">Vārds</span>
              <input
                className="input"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                placeholder="Jānis"
              />
            </label>

            <label className="field">
              <span className="field__label">E-pasts</span>
              <input
                className="input"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="mail@example.com"
              />
            </label>

            <label className="field">
              <span className="field__label">Parole</span>
              <input
                className="input"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                placeholder="Vismaz 8 rakstzīmes"
              />
            </label>

            <label className="field">
              <span className="field__label">Paroles atkārtojums</span>
              <input
                className="input"
                type="password"
                value={regPassword2}
                onChange={(e) => setRegPassword2(e.target.value)}
                required
                placeholder="••••••••"
              />
            </label>

            <button className="btn" disabled={loading} type="submit">
              {loading ? "Izveido..." : "Izveidot kontu"}
            </button>

            <p className="muted small">
              Jau ir konts?{" "}
              <button
                className="linkBtn"
                type="button"
                onClick={() => setTab("login")}
              >
                Ieiet
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

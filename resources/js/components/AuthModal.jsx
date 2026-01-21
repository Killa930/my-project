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
      setError(err?.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetError();

    if (regPassword !== regPassword2) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      // TODO: подключим позже к Laravel Sanctum/регистрации
      console.log("REGISTER SUBMIT:", { regName, regEmail, regPassword });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Ошибка регистрации");
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
              Вход
            </button>
            <button
              className={`tabBtn ${tab === "register" ? "isActive" : ""}`}
              onClick={() => setTab("register")}
              type="button"
            >
              Регистрация
            </button>
          </div>

          <button className="iconBtn" onClick={onClose} type="button" aria-label="Закрыть">
            ✕
          </button>
        </div>

        {error && (
          <div className="modal__error">
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form className="form" onSubmit={handleLogin}>
            <label className="field">
              <span className="field__label">Email</span>
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
              <span className="field__label">Пароль</span>
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
              {loading ? "Входим..." : "Войти"}
            </button>

            <p className="muted small">
              Нет аккаунта?{" "}
              <button className="linkBtn" type="button" onClick={() => setTab("register")}>
                Зарегистрироваться
              </button>
            </p>
          </form>
        ) : (
          <form className="form" onSubmit={handleRegister}>
            <label className="field">
              <span className="field__label">Имя</span>
              <input
                className="input"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                placeholder="Иван"
              />
            </label>

            <label className="field">
              <span className="field__label">Email</span>
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
              <span className="field__label">Пароль</span>
              <input
                className="input"
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                placeholder="Минимум 8 символов"
              />
            </label>

            <label className="field">
              <span className="field__label">Повтор пароля</span>
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
              {loading ? "Создаём..." : "Создать аккаунт"}
            </button>

            <p className="muted small">
              Уже есть аккаунт?{" "}
              <button className="linkBtn" type="button" onClick={() => setTab("login")}>
                Войти
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

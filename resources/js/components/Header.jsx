export default function Header({ user, onLogout, onOpenLogin, onOpenRegister }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="logo">AutoSalon • BU</div>

        <nav className="nav">
          <a href="#catalog">Katalogs</a>
          <a href="#about">Par mums</a>
          <a href="#contacts">Kontakti</a>
        </nav>

        <div className="header__actions">
          {user ? (
            <>
              <div className="muted">Sveiki, {user.name}</div>

              <button
                className="btn btn--ghost"
                type="button"
                onClick={onLogout}
              >
                Iziet
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn--ghost"
                type="button"
                onClick={onOpenLogin}
              >
                Ieiet
              </button>

              <button
                className="btn"
                type="button"
                onClick={onOpenRegister}
              >
                Reģistrācija
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

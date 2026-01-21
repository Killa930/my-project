export default function Header({ onOpenLogin, onOpenRegister }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="logo">AutoSalon • BU</div>

        <nav className="nav">
          <a href="#catalog">Каталог</a>
          <a href="#about">О нас</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="header__actions">
          <button className="btn btn--ghost" type="button" onClick={onOpenLogin}>
            Вход
          </button>
          <button className="btn" type="button" onClick={onOpenRegister}>
            Регистрация
          </button>
        </div>
      </div>
    </header>
  );
}

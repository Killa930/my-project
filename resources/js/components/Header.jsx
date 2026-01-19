export default function Header() {
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
          <button className="btn btn--ghost" type="button">
            Вход
          </button>
          <button className="btn" type="button">
            Регистрация
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>Автосалон бу авто</h1>
          <p className="muted">
            Добро пожаловать! Подберём автомобиль под ваш бюджет — честные цены,
            прозрачная история и помощь с оформлением.
          </p>

          <div className="hero__buttons">
            <a className="btn" href="#catalog">Смотреть каталог</a>
            <a className="btn btn--ghost" href="#contacts">Связаться</a>
          </div>
        </div>

        <div className="hero__card">
          <div className="hero__badge">⭐ Популярное</div>
          <div className="hero__cardTitle">Проверенные авто</div>
          <div className="muted">
            Диагностика перед продажей • Документы • Тест-драйв
          </div>
        </div>
      </div>
    </section>
  );
}

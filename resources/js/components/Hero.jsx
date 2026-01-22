export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <h1>Lietotu automašīnu autosalons</h1>
          <p className="muted">
            Laipni lūdzam! Palīdzēsim atrast automašīnu atbilstoši Jūsu budžetam —
            godīgas cenas, pārskatāma vēsture un palīdzība noformēšanā.
          </p>

          <div className="hero__buttons">
            <a className="btn" href="#catalog">Skatīt katalogu</a>
            <a className="btn btn--ghost" href="#contacts">Sazināties</a>
          </div>
        </div>

        <div className="hero__card">
          <div className="hero__badge">⭐ Populārs</div>
          <div className="hero__cardTitle">Pārbaudītas automašīnas</div>
          <div className="muted">
            Diagnostika pirms pārdošanas • Dokumenti • Testa brauciens
          </div>
        </div>
      </div>
    </section>
  );
}


import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CarCard from "../components/CarCard";


import { fetchCars } from "../api/cars";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    fetchCars()
      .then((data) => {
        if (!alive) return;
        // если API вернул не массив — подстрахуемся
        setCars(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Ошибка загрузки каталога");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="section" id="catalog">
          <div className="container">
            <div className="section__head">
              <h2>Каталог авто</h2>
              <p className="muted">
                Данные загружаются из базы данных (Laravel API).
              </p>
            </div>

            {loading && <p className="muted">Загрузка...</p>}

            {error && (
              <div className="alert">
                <div className="alert__title">Не удалось загрузить каталог</div>
                <div className="alert__text muted">{error}</div>
                <div className="alert__hint muted">
                  Проверь: Laravel запущен, /api/cars работает, CORS настроен.
                </div>
              </div>
            )}

            {!loading && !error && cars.length === 0 && (
              <p className="muted">Пока нет автомобилей в каталоге.</p>
            )}

            {!loading && !error && cars.length > 0 && (
              <div className="grid">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section" id="about">
          <div className="container">
            <h2>О нас</h2>
            <p className="muted">
              Здесь позже добавим текст о салоне, гарантиях, проверках и т.д.
            </p>
          </div>
        </section>

        <section className="section" id="contacts">
          <div className="container">
            <h2>Контакты</h2>
            <p className="muted">
              Телефон / мессенджеры / адрес — добавим позже.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

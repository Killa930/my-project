const fmt = (n) => new Intl.NumberFormat("ru-RU").format(Number(n ?? 0));

export default function CarCard({ car }) {
  // Поддержка частых вариантов названий полей (если вдруг у тебя не 1:1)
  const brand = car.brand ?? car.make ?? car.car_brand ?? "";
  const model = car.model ?? car.car_model ?? "";
  const year = car.year ?? car.release_year ?? "";
  const price = car.price ?? car.cost ?? 0;
  const mileage = car.mileage ?? car.odometer ?? 0;
  const fuel = car.fuel ?? car.fuel_type ?? null;
  const transmission = car.transmission ?? car.gearbox ?? null;
  const description = car.description ?? car.desc ?? "";

  return (
    <article className="carCard">
      <div className="carCard__top">
        <div className="carCard__title">
          {brand} {model}{year ? ` • ${year}` : ""}
        </div>
        <div className="carCard__price">{fmt(price)} €</div>
      </div>

      <div className="carCard__meta">
        {fuel && <span>{fuel}</span>}
        {fuel && transmission && <span>•</span>}
        {transmission && <span>{transmission}</span>}
        {(fuel || transmission) && <span>•</span>}
        <span>{fmt(mileage)} км</span>
      </div>

      {description ? <p className="carCard__desc">{description}</p> : null}

      <button className="btn btn--ghost" type="button">
        Подробнее
      </button>
    </article>
  );
}

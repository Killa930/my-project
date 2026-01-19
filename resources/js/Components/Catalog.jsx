import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/cars?status=available")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Каталог</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
        {data.data.map((car) => (
          <div key={car.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>
              {car.brand?.name} {car.model}
            </div>
            <div>{car.year ?? "—"} год</div>
            <div>{car.price ? `${car.price} €` : "Цена по запросу"}</div>
            <Link to={`/cars/${car.id}`}>Подробнее →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CarPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [lead, setLead] = useState({ name: "", phone: "", email: "", message: "" });
  const [ok, setOk] = useState("");

  useEffect(() => {
    fetch(`/api/cars/${id}`)
      .then((r) => r.json())
      .then(setCar);
  }, [id]);

  async function sendLead(type) {
    setOk("");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, car_id: Number(id), type }),
    });

    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert("Ошибка: " + (e?.message ?? "не удалось отправить"));
      return;
    }

    setOk("Заявка отправлена ✅ Мы свяжемся с вами.");
    setLead({ name: "", phone: "", email: "", message: "" });
  }

  if (!car) return <div>Загрузка...</div>;

  return (
    <div>
      <Link to="/cars">← Назад в каталог</Link>

      <h1 style={{ marginTop: 12 }}>
        {car.brand?.name} {car.model}
      </h1>

      <p>
        {car.year ?? "—"} год • {car.mileage ? `${car.mileage} км` : "пробег —"} • {car.fuel ?? "топливо —"} •{" "}
        {car.transmission ?? "КПП —"} • {car.power_hp ? `${car.power_hp} hp` : "мощность —"}
      </p>

      <p style={{ fontSize: 18, fontWeight: 700 }}>
        {car.price ? `${car.price} €` : "Цена по запросу"}
      </p>

      {car.description && <p>{car.description}</p>}

      <h2>Оставить заявку</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input placeholder="Имя" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} />
        <input placeholder="Телефон" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} />
        <input placeholder="Email (необязательно)" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} />
        <textarea placeholder="Комментарий" value={lead.message} onChange={(e) => setLead({ ...lead, message: e.target.value })} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => sendLead("buy")}>Хочу купить</button>
          <button onClick={() => sendLead("price")}>Узнать цену</button>
          <button onClick={() => sendLead("question")}>Задать вопрос</button>
        </div>
        {ok && <div>{ok}</div>}
      </div>
    </div>
  );
}

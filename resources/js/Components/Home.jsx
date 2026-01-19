import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Автосалон</h1>
      <p>Новые и б/у авто. Тест-драйв и заявки онлайн.</p>
      <Link to="/cars">Перейти в каталог →</Link>
    </div>
  );
}

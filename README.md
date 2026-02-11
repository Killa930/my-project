# 🚗 Lietotu automašīnu salons (SPA)

Mācību fullstack projekts lietotu automašīnu salonam.  
Projekts ir izstrādāts kā **SPA (Single Page Application)**, izmantojot **React** un **Laravel**.

---

## 🛠️ Tehnoloģijas

### Frontend
- React.js
- Vite
- JavaScript (ES6)
- CSS

### Backend
- Laravel
- REST API
- MySQL (Laragon)
- Eloquent ORM

---

## 📦 Projekta arhitektūra

Projekts ir veidots kā SPA:

- Laravel piegādā **vienu HTML lapu**
- React pārvalda visu lietotāja interfeisu
- Automašīnu dati tiek ielādēti caur API
- Navigācija un modālie logi darbojas bez lapas pārlādes

Browser
↓
Laravel (HTML + API)
↓
React (UI)

yaml
Copy code

---

## 📁 Projekta struktūra

resources/
└── js/
├── api/
│ └── cars.js
├── components/
│ ├── Header.jsx
│ ├── Hero.jsx
│ ├── CarCard.jsx
│ └── AuthModal.jsx
├── pages/
│ └── Home.jsx
└── app.jsx

markdown
Copy code

---

## 🖥️ Funkcionalitāte

### ✅ Galvenā lapa
- Galvene ar navigāciju
- Hero sadaļa ar sveicienu
- Mini automašīnu katalogs

### ✅ Automašīnu katalogs
- Dati tiek ielādēti no datubāzes
- Izmanto API `/api/cars`
- Attēlotā informācija:
  - marka
  - modelis
  - izlaiduma gads
  - cena
  - nobraukums
  - apraksts

### ✅ Autorizācijas modālais logs (UI)
- Pogas **Ienākt / Reģistrēties**
- Modālais logs bez lapas pārlādes
- Cilņu pārslēgšana
- Aizvēršana ar:
  - klikšķi ārpus loga
  - pogu ✕
  - taustiņu Esc

⚠️ Šajā posmā autorizācijas un reģistrācijas dati **netiek nosūtīti uz serveri**  
(modālais logs ir tikai lietotāja interfeiss)

---

## 🔌 API

### Automašīnu saraksta iegūšana
GET /api/cars

css
Copy code

Atbilde:
```json
[
  {
    "id": 1,
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2017,
    "price": 10900,
    "mileage": 120000,
    "description": "Uzticams automobilis"
  }
]
🚀 Projekta palaišana
Backend
bash
Copy code
php artisan serve
Frontend
bash
Copy code
npm run dev
Atvērt pārlūkā:

cpp
Copy code
http://127.0.0.1:8000
📌 Pašreizējais stāvoklis
✔️ React + Laravel savienojums darbojas
✔️ Automašīnu katalogs no datubāzes
✔️ SPA arhitektūra
✔️ Autorizācijas modālais logs (UI)

❌ Autentifikācija vēl nav pieslēgta datubāzei

🔮 Nākotnes uzlabojumi
Reāla lietotāju autorizācija un reģistrācija

Lietotāja sesijas saglabāšana

Automašīnas detalizētā lapa

Meklēšana un filtrēšana

Administratora panelis

👨‍💻 Autors
Mācību projekts
React + Laravel

yaml
Copy code

---

Ja vēlāk vajadzēs **otru README versiju** (ar īstu autorizāciju vai skolas prasībām) — vienkārši pasaki.urce.org/licenses/MIT).

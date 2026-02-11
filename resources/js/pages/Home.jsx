import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import CarCard from "../components/CarCard";
import AuthModal from "../components/AuthModal";
import { authApi, token } from "../api/auth";

import { fetchCars } from "../api/cars";

export default function Home() {
    const [user, setUser] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [authOpen, setAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState("login");

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    const openLogin = () => {
        setAuthTab("login");
        setAuthOpen(true);
    };
    const openRegister = () => {
        setAuthTab("register");
        setAuthOpen(true);
    };
    const closeAuth = () => setAuthOpen(false);

    useEffect(() => {
        let alive = true;

        fetchCars()
            .then((data) => {
                if (!alive) return;
                // Ja API atgrieza nevis masīvu — drošības pēc pielāgojam
                setCars(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (!alive) return;
                setError(e?.message || "Kataloga ielādes kļūda");
            })
            .finally(() => {
                if (!alive) return;
                setLoading(false);
            });

        return () => {
            alive = false;

            const [user, setUser] = useState(null);

            useEffect(() => {
                // если токена нет — просто гость
                if (!token.get()) return;

                authApi
                    .me()
                    .then(setUser)
                    .catch(() => {
                        token.clear();
                        setUser(null);
                    });
            }, []);

            const handleLogout = async () => {
                try {
                    await authApi.logout();
                } catch {}
                token.clear();
                setUser(null);
            };
        };
    }, []);

    return (
        <>
            <Header
                user={user}
                onLogout={handleLogout}
                onOpenLogin={openLogin}
                onOpenRegister={openRegister}
            />

            <main>
                <Hero />

                <section className="section" id="catalog">
                    <div className="container">
                        <div className="section__head">
                            <h2>Auto katalogs</h2>
                            <p className="muted">
                                Dati tiek ielādēti no datubāzes (Laravel API).
                            </p>
                        </div>

                        {loading && <p className="muted">Ielādē...</p>}

                        {error && (
                            <div className="alert">
                                <div className="alert__title">
                                    Neizdevās ielādēt katalogu
                                </div>
                                <div className="alert__text muted">{error}</div>
                                <div className="alert__hint muted">
                                    Pārbaudi: vai Laravel ir palaists, vai
                                    darbojas /api/cars, vai CORS ir
                                    nokonfigurēts.
                                </div>
                            </div>
                        )}

                        {!loading && !error && cars.length === 0 && (
                            <p className="muted">
                                Šobrīd katalogā nav automašīnu.
                            </p>
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
                        <h2>Par mums</h2>
                        <p className="muted">
                            Šeit vēlāk pievienosim tekstu par autosalonu,
                            garantijām, pārbaudēm u.c.
                        </p>
                    </div>
                </section>

                <section className="section" id="contacts">
                    <div className="container">
                        <h2>Kontakti</h2>
                        <p className="muted">
                            Tālrunis / ziņapmaiņas lietotnes / adrese —
                            pievienosim vēlāk.
                        </p>
                    </div>
                </section>
            </main>

            <AuthModal
                open={authOpen}
                initialTab={authTab}
                onClose={closeAuth}
                onAuthSuccess={(u) => setUser(u)}
            />
        </>
    );
}

import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="text-3xl font-bold text-content-primary mb-8 text-center">
                Kontakti
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Контактная информация */}
                <div className="space-y-6">
                    <div className="bg-surface-secondary border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                                <MapPinIcon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-content-primary font-semibold mb-1">Adrese</h3>
                                <p className="text-content-secondary text-sm">Dārzciema iela 58</p>
                                <p className="text-content-secondary text-sm">Rīga, LV-1073, Latvija</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-secondary border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                                <PhoneIcon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-content-primary font-semibold mb-1">Tālrunis</h3>
                                <a href="tel:+37120000000" className="text-accent hover:text-accent-hover text-sm transition-colors">
                                    +371 20 000 000
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-secondary border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                                <EnvelopeIcon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-content-primary font-semibold mb-1">E-pasts</h3>
                                <a href="mailto:info@carbuy.lv" className="text-accent hover:text-accent-hover text-sm transition-colors">
                                    info@carbuy.lv
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-secondary border border-border rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">
                                <ClockIcon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-content-primary font-semibold mb-1">Darba laiks</h3>
                                <p className="text-content-secondary text-sm">P.–Pk.: 9:00–18:00</p>
                                <p className="text-content-secondary text-sm">S.–Sv.: slēgts</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Контактная форма */}
                <div className="bg-surface-secondary border border-border rounded-xl p-6">
                    <h2 className="text-content-primary font-semibold text-lg mb-4">
                        Sazinies ar mums
                    </h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Ziņa nosūtīta! (demo)"); }}>
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">Vārds</label>
                            <input type="text" required
                                className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="Jūsu vārds" />
                        </div>
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">E-pasts</label>
                            <input type="email" required
                                className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="jusu@epasts.lv" />
                        </div>
                        <div>
                            <label className="block text-content-secondary text-sm mb-1.5">Ziņa</label>
                            <textarea required rows="4"
                                className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                placeholder="Jūsu jautājums vai ziņa..." />
                        </div>
                        <button type="submit"
                            className="w-full bg-accent hover:bg-accent-hover text-content-inverted py-3 rounded-lg font-semibold transition-colors">
                            Nosūtīt
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

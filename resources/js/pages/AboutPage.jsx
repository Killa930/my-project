import AnimateIn from "../components/AnimateIn";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <AnimateIn animation="fade"><h1 className="text-3xl font-bold text-content-primary mb-8 text-center">Par mums</h1></AnimateIn>
            <AnimateIn delay={150}>
                <div className="bg-surface-secondary border border-border rounded-xl p-8 mb-8">
                    <h2 className="text-xl font-semibold text-content-primary mb-4">CarBuy — uzticama lietotu auto platforma</h2>
                    <p className="text-content-secondary leading-relaxed mb-4">CarBuy ir moderna tiešsaistes platforma lietotu automašīnu pirkšanai un pārdošanai Latvijā. Mūsu mērķis ir padarīt lietotu transportlīdzekļu tirgu drošāku, pārskatāmāku un ērtāku gan pircējiem, gan pārdevējiem.</p>
                    <p className="text-content-secondary leading-relaxed mb-4">Platforma nodrošina drošu lietotāju autentifikāciju, centralizētu datu glabāšanu ar automātisku validāciju, kā arī iespēju filtrēt un salīdzināt transportlīdzekļus pēc dažādiem kritērijiem.</p>
                    <p className="text-content-secondary leading-relaxed">Mēs ticam, ka katram cilvēkam ir jābūt iespējai atrast uzticamu automobili par godīgu cenu.</p>
                </div>
            </AnimateIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[{ num: "500+", label: "Sludinājumi platformā" }, { num: "200+", label: "Apmierināti klienti" }, { num: "24/7", label: "Pieejamība tiešsaistē" }].map((s, i) => (
                    <AnimateIn key={i} delay={300 + i * 100} animation="scale">
                        <div className="bg-surface-secondary border border-border rounded-xl p-6 text-center">
                            <p className="text-3xl font-bold text-accent mb-2">{s.num}</p>
                            <p className="text-content-secondary text-sm">{s.label}</p>
                        </div>
                    </AnimateIn>
                ))}
            </div>
        </div>
    );
}

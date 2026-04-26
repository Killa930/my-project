import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { useToast } from "../context/ToastContext";
import AnimateIn from "../components/AnimateIn";

export default function ContactPage() {
    const toast = useToast();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <AnimateIn animation="fade"><h1 className="text-3xl font-bold text-content-primary mb-8 text-center">Kontakti</h1></AnimateIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {[
                        { icon: <MapPinIcon className="w-5 h-5 text-accent" />, title: "Adrese", lines: ["Dārzciema iela 58", "Rīga, LV-1073, Latvija"] },
                        { icon: <PhoneIcon className="w-5 h-5 text-accent" />, title: "Tālrunis", link: { href: "tel:+37120000000", text: "+371 20 000 000" } },
                        { icon: <EnvelopeIcon className="w-5 h-5 text-accent" />, title: "E-pasts", link: { href: "mailto:info@abuy.lv", text: "info@abuy.lv" } },
                        { icon: <ClockIcon className="w-5 h-5 text-accent" />, title: "Darba laiks", lines: ["P.–Pk.: 9:00–18:00", "S.–Sv.: slēgts"] },
                    ].map((item, i) => (
                        <AnimateIn key={i} delay={i * 100}>
                            <div className="bg-surface-secondary border border-border rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-accent-subtle rounded-lg flex items-center justify-center shrink-0">{item.icon}</div>
                                    <div>
                                        <h3 className="text-content-primary font-semibold mb-1">{item.title}</h3>
                                        {item.lines?.map((l, j) => <p key={j} className="text-content-secondary text-sm">{l}</p>)}
                                        {item.link && <a href={item.link.href} className="text-accent hover:text-accent-hover text-sm transition-colors">{item.link.text}</a>}
                                    </div>
                                </div>
                            </div>
                        </AnimateIn>
                    ))}
                </div>
                <AnimateIn delay={200} animation="slide-left">
                    <div className="bg-surface-secondary border border-border rounded-xl p-6">
                        <h2 className="text-content-primary font-semibold text-lg mb-4">Sazinies ar mums</h2>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Ziņa nosūtīta!"); e.target.reset(); }}>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Vārds</label><input type="text" required className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Jūsu vārds" /></div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">E-pasts</label><input type="email" required className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="jusu@epasts.lv" /></div>
                            <div><label className="block text-content-secondary text-sm mb-1.5">Ziņa</label><textarea required rows="4" className="w-full bg-surface-tertiary border border-border text-content-primary rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Jūsu jautājums..." /></div>
                            <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-content-inverted py-3 rounded-lg font-semibold transition-colors">Nosūtīt</button>
                        </form>
                    </div>
                </AnimateIn>
            </div>
        </div>
    );
}

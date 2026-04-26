import { useEffect, useState } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function ImageGalleryModal({ images, initialIndex = 0, onClose }) {
    const [current, setCurrent] = useState(initialIndex);

    // Перелистывание
    const next = () => setCurrent((c) => (c + 1) % images.length);
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    // Обработка клавиатуры
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", handleKey);
        // Запретить скролл фона пока модалка открыта
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [images.length]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Кнопка закрытия */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>

            {/* Счётчик */}
            <div className="absolute top-4 left-4 text-white/70 font-medium">
                {current + 1} / {images.length}
            </div>

            {/* Главное фото */}
            <img
                src={`/storage/${images[current].image_path}`}
                alt={`Foto ${current + 1}`}
                className="max-w-[90vw] max-h-[85vh] object-contain"
                onClick={(e) => e.stopPropagation()} // чтобы клик по фото не закрывал модалку
                onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }}
            />

            {/* Кнопка назад */}
            {images.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeftIcon className="w-10 h-10" />
                </button>
            )}

            {/* Кнопка вперёд */}
            {images.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronRightIcon className="w-10 h-10" />
                </button>
            )}

            {/* Миниатюры внизу */}
            {images.length > 1 && (
                <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/5 hover:scrollbar-thumb-white/50"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-16 h-12 rounded shrink-0 border-2 overflow-hidden transition ${
                                i === current ? "border-white" : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                            }`}
                        >
                            <img
                                src={`/storage/${img.image_path}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "/images/car-placeholder.svg"; }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
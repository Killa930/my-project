/*
 * AnimateIn — компонент для анимации появления элементов
 *
 * Оборачиваешь любой элемент — он появляется с анимацией при загрузке или при скролле.
 * 
 * Использование:
 *   <AnimateIn>текст появится снизу</AnimateIn>
 *   <AnimateIn delay={200}>с задержкой 200мс</AnimateIn>
 *   <AnimateIn animation="fade">просто fade без движения</AnimateIn>
 */

import { useEffect, useRef, useState } from "react";

export default function AnimateIn({ children, delay = 0, animation = "slide-up", className = "" }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    const animations = {
        "slide-up": {
            initial: "opacity-0 translate-y-6",
            visible: "opacity-100 translate-y-0",
        },
        "slide-left": {
            initial: "opacity-0 translate-x-6",
            visible: "opacity-100 translate-x-0",
        },
        "slide-right": {
            initial: "opacity-0 -translate-x-6",
            visible: "opacity-100 translate-x-0",
        },
        fade: {
            initial: "opacity-0",
            visible: "opacity-100",
        },
        scale: {
            initial: "opacity-0 scale-95",
            visible: "opacity-100 scale-100",
        },
    };

    const anim = animations[animation] || animations["slide-up"];

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible ? anim.visible : anim.initial} ${className}`}
        >
            {children}
        </div>
    );
}

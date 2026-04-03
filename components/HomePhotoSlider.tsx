"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/reunion-1.png",
    alt: "Reunion memory slide 1",
    title: "Reunion Memories",
    quote: "आठवणी, मैत्री आणि पुन्हा एकदा एकत्र येण्याचा सुंदर क्षण",
  },
  {
    src: "/reunion-2.png",
    alt: "Reunion memory slide 2",
    title: "School Days",
    quote: "शाळेच्या दिवसांची गोडी पुन्हा नव्याने अनुभवण्याची ही वेळ",
  },
  {
    src: "/reunion-3.png",
    alt: "Reunion memory slide 3",
    title: "Friends Forever",
    quote: "जुन्या मित्रांसोबत पुन्हा एकदा मनमोकळे हसण्याचा हा उत्सव",
  },
];

export default function HomePhotoSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  function goToPreviousSlide() {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? slides.length - 1 : previousSlide - 1,
    );
  }

  function goToNextSlide() {
    setCurrentSlide((previousSlide) => (previousSlide + 1) % slides.length);
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.src} className="min-w-full">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 80vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 pr-20 text-left text-white sm:p-7 sm:pb-16 sm:pr-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-200 sm:text-xs sm:tracking-[0.3em]">
                    {slide.title}
                  </p>
                  <p className="mt-2 max-w-full text-sm font-semibold leading-5 sm:max-w-xl sm:text-2xl sm:leading-tight">
                    {slide.quote}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={goToPreviousSlide}
          className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-semibold text-slate-700 shadow-md transition hover:bg-white sm:left-4 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl font-semibold text-slate-700 shadow-md transition hover:bg-white sm:right-4 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-slate-900/65 px-3 py-1.5 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:px-4 sm:py-2">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition sm:h-2.5 sm:w-2.5 ${
                currentSlide === index ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

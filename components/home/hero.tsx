"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoginMenu } from "./login-menu";

const slides = [
  {
    src: "/hero/hero-housing-estate.jpg",
    alt: "Local government housing estate at sunset",
  },
  {
    src: "/hero/hero-city-housing.jpg",
    alt: "Residential neighbourhood across a local government area",
  },
  {
    src: "/hero/hero-apartments.jpg",
    alt: "Public housing apartment blocks",
  },
  {
    src: "/hero/hero-new-homes.jpg",
    alt: "Newly built homes in a local housing scheme",
  },
];

export function HomeHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-forest-deep text-white">
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={slideIndex !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className={`object-cover ${
              slideIndex === index ? "animate-hero-pan" : "scale-100"
            }`}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/50 to-black/75" />

      <section className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-8">
        <p className="font-mono text-[10px] tracking-[0.28em] text-copper-soft uppercase sm:text-[11px]">
          Expert LGA
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-[1.85rem] leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Transforming Housing Through Digital Innovation
        </h1>
        <p className="mt-4 max-w-3xl text-base font-medium text-white/90 sm:mt-5 sm:text-xl">
          Bringing Local Government Housing Services Into the Digital Age
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-white/80 sm:mt-5 sm:text-base sm:leading-7">
          Discover a smarter, faster, and more transparent way to manage housing
          across local government areas. Our digital platform streamlines
          property registration, housing records, land and property information,
          and housing service delivery making information more accessible to
          citizens while empowering local governments with reliable data for
          better planning and decision-making.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row">
          <Link
            href="/application"
            className="inline-flex h-12 min-w-[11.5rem] items-center justify-center bg-copper px-6 text-sm font-medium text-white transition-colors hover:bg-[#a84c1e]"
          >
            Start Application
          </Link>
          <LoginMenu />
        </div>
        <div className="absolute bottom-6 flex gap-2" aria-label="Slide indicators">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show image ${slideIndex + 1}`}
              aria-current={slideIndex === index ? true : undefined}
              onClick={() => setIndex(slideIndex)}
              className={`h-1.5 rounded-full transition-all ${
                slideIndex === index
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

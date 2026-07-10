"use client";

import React from 'react';

export default function About() {
  const storyImage = "/images/group_1.jpg";
  const dishaImage = "/images/blue_dress_model.jpg";
  const minjalImage = "/images/minjal.jpg";

  return (
    <div className="bg-[#FAF8F5] pb-24 text-neutral-800">
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">Our Story</p>
        <h1 className="font-editorial text-4xl sm:text-5xl font-light leading-snug tracking-wide">
          A quiet studio, three sisters, and a bolt of naturally-dyed silk.
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <img 
          src={storyImage} 
          alt="Siankan collective work" 
          className="aspect-[16/9] w-full object-cover rounded-sm shadow-md" 
        />
      </section>

      <section className="mx-auto grid max-w-3xl gap-8 px-6 py-16 text-sm font-light leading-relaxed text-neutral-500">
        <p>
          <span className="font-editorial text-2xl text-neutral-900 font-light">Siankan</span> was born in 2023 in a small studio in Gujarat, from a simple question — why can't traditional Indian wear feel as easy and personal as our favourite everyday clothes?
        </p>
        <p>
          We work almost entirely by hand. Our fabrics are naturally dyed in small batches. Our mirror-work is stitched by a family of artisans we have known for years. Every silhouette is cut for movement — for the friend twirling on a Sangeet dance floor, for the aunt greeting guests, for the bride's sister who wants to feel special too.
        </p>
        <p>
          Nothing about the process is fast. Each piece takes ten to fourteen days from your order to the moment it leaves the studio. What you receive is one of only a few in the world, and no two are ever exactly alike.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { n: "01", t: "Hand-dyed", d: "Natural pigments, dip-dyed in small batches — every panel is a little different." },
            { n: "02", t: "Mirror-worked", d: "Traditional Kutch mirror embroidery, applied by hand, one piece at a time." },
            { n: "03", t: "Made to order", d: "We don't hold stock. Each piece is cut for you the moment you order it." },
          ].map((v) => (
            <div key={v.n} className="border-t border-neutral-200 pt-6 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-maroon-600">{v.n}</p>
              <h3 className="font-editorial text-2xl font-light text-neutral-800">{v.t}</h3>
              <p className="text-xs font-light text-neutral-500 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 md:grid-cols-2">
        <img src={dishaImage} alt="Premium Lehenga Design" className="aspect-[4/5] w-full object-cover rounded-sm shadow-sm" />
        <img src={minjalImage} alt="Bespoke embroidery detail" className="aspect-[4/5] w-full object-cover rounded-sm shadow-sm" />
      </section>
    </div>
  );
}

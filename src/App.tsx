/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { generateCampaignImage } from "./lib/gemini";
import { Sparkles, Loader2, Camera } from "lucide-react";

const CAMPAIGN_PROMPT = `Create an ultra-realistic high-fashion editorial campaign photograph set in a fertile agricultural oasis landscape in North Africa, inspired by Egyptian countryside scenery. The composition is wide cinematic horizontal format (16:9), photographed from a medium-long distance so the entire figure and trailing garment are visible.

MAIN SUBJECT:
A tall slender female fashion model standing upright in the left-center of the frame, body facing slightly right, head turned directly toward camera. Her posture is elegant, still, controlled, statuesque, refined, almost sculptural. Her facial expression is serious, intense, calm, mysterious, emotionally restrained. Natural beauty, symmetrical features, subtle cheekbones, neutral lips, no smile. Hair is long, medium brown, naturally textured, loose waves, slightly wind-touched, parted casually, realistic strands.

WARDROBE:
She wears an avant-garde couture gown with dramatic architectural proportions. The garment is sleeveless and elongated, made of heavy luxurious fabric with bold black and ivory-white vertical stripes. The stripes are wide, clean, graphic, high contrast, running vertically along the dress. The silhouette is column-like and elongated, almost monastic but sensual through proportion and movement.

The most important feature is an extremely long train extending from the dress behind the model across the ground for several meters. The train spreads organically over the green vegetation, twisting softly in perspective, with visible folds, ripples, fabric tension, weight and texture. The train must remain striped black and white, following the same pattern as the dress. It creates a strong graphic line through the image.

The location should feel like an oasis where cultivated land meets arid climate. Contrast between lush agriculture and dry distant environment.

LIGHTING:
Natural daylight under overcast sky. Soft diffused light, no harsh shadows, no direct sunlight. Gentle muted highlights on skin and fabric. Atmospheric haze in distance. Calm elegant weather. Slight humidity in air.

COLOR PALETTE:
Deep natural greens, muted sandy beige, cool grey pale sky. Strong black and ivory stripes.

CAMERA STYLE:
Shot on high-end medium format camera. 85mm lens look. Sharp focus on model and front fabric. Extremely detailed textile texture, skin texture, leaves, soil, fabric folds.

MOOD:
Sophisticated, serene, expensive, editorial, timeless, modern, conceptual, poetic, powerful femininity, quiet confidence.`;

const IMAGES = {
  section1: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
  ],
  section2: [
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1554412930-c74f639c8a14?auto=format&fit=crop&q=80&w=800",
  ],
  moodboard: [
    "https://lh3.googleusercontent.com/u/0/d/1yo0kajEd9kawqs1aWVTLkRAGPRnz2kS6",
    "https://lh3.googleusercontent.com/u/0/d/1iU3s6hFzpQysRDZyLmBQtA0nq197pkgO",
    "https://lh3.googleusercontent.com/u/0/d/1nKrxjjI9m9MIvDTZvP1dSMUwq9slYCEL",
    "https://lh3.googleusercontent.com/u/0/d/13sFSXyTTA-UQnmQxn9YBPkSFkTm43fdx",
    "https://lh3.googleusercontent.com/u/0/d/1Af4Zjcxzh1YWR1DG6REUNb5i9OHtxsH6",
    "https://lh3.googleusercontent.com/u/0/d/1-v1PVQMMbTYTtSr3m33HQ_lhcLwMMBbN",
    "https://lh3.googleusercontent.com/u/0/d/1S_W93Kloo9p_GKJ8y-uCSncm0zTZECQJ",
    "https://lh3.googleusercontent.com/u/0/d/1neSLFZcaByhu6MHCUohXh05tWKHPl1Ei",
    "https://lh3.googleusercontent.com/u/0/d/1IRfuzkzhIIDI9TLli1NYB71MvoK6BneK",
    "https://lh3.googleusercontent.com/u/0/d/1N4xo7qzbcdiHydtl9cGssARcK81w4-Mb",
    "https://lh3.googleusercontent.com/u/0/d/1ivkQLkbujSY-Vw0ytz9UMOe7U_ZbEYFr",
    "https://lh3.googleusercontent.com/u/0/d/1AZVSPqdLlhfWuDwI0ElM_h7kMSVJJ_h6",
    "",
    "https://lh3.googleusercontent.com/u/0/d/1A-Nj3BnNoPkiY80vG6O6Up5DmQo8vKuG",
    "",
    "",
  ],
  laPlage: [],
  lePalmierGallery: [
    "https://lh3.googleusercontent.com/u/0/d/1Y1xvxhjFPArCzHPP9S2U6kWO2fH45th8",
    "https://lh3.googleusercontent.com/u/0/d/1_2_spNXCYrqCgKftTi0GvOfivC8qi5Ky",
    "https://lh3.googleusercontent.com/u/0/d/1n6rSNhGGYNLN8zEBaTDkdnY-bBZsR8Mh",
    "https://lh3.googleusercontent.com/u/0/d/1k1yIjPugJPfEZrXq5Nhktq2dTFE0aI6b",
    "https://lh3.googleusercontent.com/u/0/d/1s26xOVQrh8MKFMl0YJxrplDTlWxTi79a",
    "https://lh3.googleusercontent.com/u/0/d/1GvxmGY8pbEnXz59W0cIQvhFSk6EHwSqO",
    "https://lh3.googleusercontent.com/u/0/d/1V0IQGgs4pffC8nIgWcvfnD7BCknoPxTx"
  ],
  leDefileGallery: [
    "https://lh3.googleusercontent.com/u/0/d/1EKu9Yq_CaHjn656uD_gNs1g9AZUUJo3M",
    "https://lh3.googleusercontent.com/u/0/d/1yxienk7gd248fzAK2NNhBH8-5zA72-8b",
    "https://lh3.googleusercontent.com/u/0/d/1l0G-IxDU6rfbxCMRN3O8IxIryKacK--b",
    "https://lh3.googleusercontent.com/u/0/d/1qnTK8Vapm668GySVsusGibfwR29iClcu",
    "https://lh3.googleusercontent.com/u/0/d/12qrZzZ2B5B5rlpQR_dOVQurP2zQBmyCr",
    "https://lh3.googleusercontent.com/u/0/d/1mcrmAxfVDl_5G89TYK_m1GljhUcou7vP",
    "https://lh3.googleusercontent.com/u/0/d/1po827Os4frCaGJdtjFkRT-pa0nSx7FLO",
    "https://lh3.googleusercontent.com/u/0/d/1EGF-3qyoeIUXgOM9CjW2L8qApUpP09_X",
    "https://lh3.googleusercontent.com/u/0/d/1Y3JACCOrnOpVtfw4QlWDrasYZurTcUnW",
    "https://lh3.googleusercontent.com/u/0/d/1humwLXAPP4sSYDHVrRL2wXONGPS-kMg8",
    "https://lh3.googleusercontent.com/u/0/d/1C9JfbYlagtsGkKz5-pkqRL16vGzTxCNN"
  ]
};

const PRODUCTS = [
  { name: "MANTEAU ARCHIVE 01", price: "1200 EUR", img: IMAGES.section1[0] },
  { name: "PANTALON STUDIO", price: "450 EUR", img: IMAGES.section1[1] },
  { name: "BLAZER ÉDITORIAL", price: "890 EUR", img: IMAGES.section1[2] },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("HOME");
  const [generatedHero, setGeneratedHero] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    const result = await generateCampaignImage(CAMPAIGN_PROMPT);
    if (result) {
      setGeneratedHero(result);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white pb-32 relative">
      <AnimatePresence>
        {activeSection === "NEWSLETTER" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0 pointer-events-none mix-blend-multiply"
          >
            <img 
              src="https://lh3.googleusercontent.com/u/0/d/1IcOG8MbIP_q0rSzr-SZy03gcjXZ91-mo" 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm px-8 py-6 flex items-center gap-16 border-b border-black/5">
        <h1 
          className="text-2xl font-segoe font-bold tracking-tight cursor-pointer leading-none" 
          onClick={() => setActiveSection("HOME")}
        >
          JQ STUDIO
        </h1>
        <nav className="flex gap-8 text-[10px] font-helvetica tracking-[0.2em] leading-none">
          {["ACCUEIL", "LA GALERIE", "LE PALMIER", "NEWSLETTER"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveSection(item === "ACCUEIL" ? "HOME" : item)}
              className={`hover:opacity-50 transition-opacity ${activeSection === (item === "ACCUEIL" ? "HOME" : item) ? "border-b border-black pb-1" : ""}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main className="pt-24">
        {activeSection === "HOME" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-32"
          >
            {/* SECTION 1: HERO IMAGE */}
            <section className="w-full bg-neutral-50 overflow-hidden min-h-[60vh] flex items-center justify-center relative group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={generatedHero || "default"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  src={generatedHero || "https://lh3.googleusercontent.com/u/0/d/1Vv5nup3-fJyZhhxrSPNvp91qZjsR7AcR"} 
                  alt="JQ STUDIO HERO - EDITORIAL CAMPAIGN" 
                  className="w-full aspect-video object-cover block relative z-10 scale-110"
                  loading="eager"
                  onError={(e) => {
                    console.error("Hero image failed to load, switching to fallback");
                    e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000";
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
            </section>

            <div className="pb-32 flex flex-col items-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-xl font-helvetica font-light italic tracking-tight text-black text-center max-w-xl px-8"
              >
                “Un petit souvenir du sud : Jacquemus”
              </motion.p>
            </div>
          </motion.div>
        )}

        {activeSection === "LA GALERIE" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-24 px-8"
          >
            <h2 className="text-sm font-didot tracking-[0.5em] text-center mb-24 uppercase">
              LA GALERIE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
              {[0, 1, 2].map((colIndex) => {
                const columnImages = IMAGES.moodboard.map((img, i) => ({ img, originalIndex: i }))
                  .filter((item) => item.img !== "" && item.originalIndex % 3 === colIndex);
                
                return (
                  <div key={colIndex} className="flex flex-col gap-4">
                    {columnImages.map((item, i) => {
                      const isLast = i === columnImages.length - 1;
                      return (
                        <motion.div
                          key={item.img}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className={`overflow-hidden ${isLast ? "flex-grow" : ""}`}
                        >
                          <img
                            src={item.img}
                            alt={`Galerie ${item.img}`}
                            className={`w-full h-auto transition-opacity duration-700 hover:opacity-80 ${
                              isLast ? "h-full object-cover" : ""
                            } ${
                              item.img === "https://lh3.googleusercontent.com/u/0/d/1A-Nj3BnNoPkiY80vG6O6Up5DmQo8vKuG" 
                                ? "aspect-[3/4.5] object-cover object-top" 
                                : ""
                            }`}
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeSection === "LE PALMIER" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-24"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-auto overflow-hidden"
            >
              <img 
                src="https://lh3.googleusercontent.com/u/0/d/16QCBskahw5fjZfs2Wgt_dBeAimOYYmne" 
                alt="LE PALMIER" 
                className="w-full h-auto object-cover block"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <div className="px-8 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full text-justify space-y-6 max-w-2xl self-start"
              >
                <p className="text-xs font-helvetica font-medium tracking-wide leading-relaxed text-black">
                  ”Le Palmier” célèbre les références Jacquemus, façonnées dès les premières années parisiennes de Simon par une nonchalance ingénue. L’attitude de la saison est inspirée de sa fille coiffée d’un palmier.
                </p>
                <p className="text-xs font-helvetica font-medium tracking-wide leading-relaxed text-black">
                  Cette mise en beauté spontanée et sculpturale rencontre les formes couture des années 1950 et la sensualité des années 1990 avec l’humour satyrique des années 1980, animées par un cinéma français caustique et une télévision technicolore. ”Le Palmier” met à l’honneur une femme parée à voler la vedette avec l’audace des icônes effrontées qui ont marqué l’enfance de Simon.
                </p>
              </motion.div>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex flex-nowrap">
                {IMAGES.lePalmierGallery.map((img, i) => (
                  <div key={i} className="flex-none w-[300px] aspect-[3/4]">
                    <img 
                      src={img} 
                      alt={`Gallery ${i}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="px-8 !mt-12">
              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sm font-helvetica font-bold tracking-[0.2em] uppercase text-left"
              >
                le défilé
              </motion.h3>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar pb-24">
              <div className="flex flex-nowrap">
                {IMAGES.leDefileGallery.map((img, i) => (
                  <div key={i} className="flex-none w-[350px] aspect-[3/4]">
                    <img 
                      src={img} 
                      alt={`Defile ${i}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === "NEWSLETTER" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-xl mx-auto text-center space-y-16 pt-24 px-8"
          >
            <div className="space-y-6">
              <h2 className="text-sm font-didot tracking-[0.5em] uppercase">REJOINDRE L'ARCHIVE</h2>
              <p className="text-[10px] font-helvetica leading-relaxed tracking-wider uppercase text-black/60">
                RECEVEZ DES MISES À JOUR EXCLUSIVES, DES SÉLECTIONS NUMÉRIQUES ET UN ACCÈS PRIVÉ AU STUDIO.
              </p>
            </div>

            <form 
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                // Handled by Klaviyo onsite script automatically if forms are set up in Klaviyo dashboard
                // But we provide a clean UI fallback
                const email = (e.target as any).email.value;
                console.log("Newsletter signup:", email);
                alert("MERCI DE REJOINDRE JQ STUDIO.");
              }}
            >
              <div className="border-b border-black pb-4">
                <input 
                  type="email" 
                  name="email"
                  placeholder="ADRESSE EMAIL" 
                  required
                  className="w-full bg-transparent text-[10px] font-helvetica tracking-[0.2em] uppercase focus:outline-none placeholder:text-black/20"
                />
              </div>
              <button 
                type="submit"
                className="text-[10px] font-helvetica tracking-[0.4em] uppercase border border-black px-12 py-4 hover:bg-black hover:text-white transition-all duration-500 w-full"
              >
                S'ABONNER
              </button>
            </form>

            <p className="text-[8px] font-helvetica tracking-[0.2em] text-black/30 uppercase">
              PROPULSÉ PAR KLAVIYO / ID SYSTÈME : QSW6ez
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full px-8 py-12 flex justify-end items-end text-[9px] font-helvetica tracking-[0.2em] uppercase pointer-events-none z-50">
        <div className="flex gap-8 pointer-events-auto bg-white/50 backdrop-blur-sm p-4 rounded-full">
          <a href="https://www.instagram.com/jacquemus/" target="_blank" rel="noopener noreferrer" className="hover:opacity-50">INSTAGRAM</a>
          <a href="https://www.jacquemus.com/fr_fr" target="_blank" rel="noopener noreferrer" className="hover:opacity-50">SITE INTERNET</a>
        </div>
      </footer>
    </div>
  );
}

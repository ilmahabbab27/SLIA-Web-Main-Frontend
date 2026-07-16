import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

const styles = [
  {
    id: "draw",
    title: "Draw-In Outline",
    note: "Clean architectural tracing with a simple line reveal.",
    className: "line-draw",
  },
  {
    id: "pulse",
    title: "Pulse Detail",
    note: "Soft glowing lines with subtle movement for a refined feel.",
    className: "line-pulse",
  },
  {
    id: "scan",
    title: "Blueprint Scan",
    note: "Technical drafting look with a scan highlight.",
    className: "line-scan",
  },
  {
    id: "layer",
    title: "Layer Build",
    note: "Line layers arrive in sequence for a composed reveal.",
    className: "line-layer",
  },
];

const LineArt = ({ className }: { className: string }) => (
  <svg viewBox="0 0 420 260" className={`h-full w-full ${className}`} fill="none" aria-hidden="true">
    <path className="primary-line layer-1" d="M40 214H384" />
    <path className="primary-line layer-1" d="M72 214V106L210 42L348 106V214" />
    <path className="primary-line layer-2" d="M112 214V124H174V214" />
    <path className="primary-line layer-2" d="M228 214V124H308V214" />
    <path className="primary-line layer-3" d="M210 42V214" />
    <path className="primary-line layer-3" d="M86 113H334" />
    <path className="primary-line layer-3" d="M114 100V78H154V100" />
    <path className="primary-line layer-3" d="M266 100V78H306V100" />
    <path className="fine-line layer-4" d="M128 140H158M128 158H158M242 142H294M242 160H294M242 178H294" />
    <path className="fine-line layer-4" d="M94 214L94 132M326 214L326 132" />
    <path className="accent-line layer-5" d="M58 232H362" />
    <path className="accent-line layer-5" d="M190 64L210 54L230 64" />
  </svg>
);

const LineArtReview = () => {
  const [selected, setSelected] = useState(styles[0].id);
  const selectedStyle = styles.find((style) => style.id === selected) || styles[0];

  return (
    <div className="min-h-screen bg-background pt-28">
      <SiteHeader />
      <main className="container pb-14">
        <section className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Client Review</p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Animated Line Art Styles
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Review the animation directions below and select one preferred style.
          </p>
        </section>

        <section className="mb-8 border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Selected Style</p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">{selectedStyle.title}</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-green-700">
              <Check className="h-4 w-4" />
              Selected for review
            </div>
          </div>
          <div className="relative aspect-[16/7] overflow-hidden bg-[#f7f7f2]">
            <LineArt className={selectedStyle.className} />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {styles.map((style) => {
            const isSelected = selected === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelected(style.id)}
                className={`group border p-4 text-left transition ${
                  isSelected ? "border-green-600 bg-green-50" : "border-border bg-card hover:border-green-600"
                }`}
              >
                <div className="mb-4 aspect-[4/3] overflow-hidden bg-[#f7f7f2]">
                  <LineArt className={style.className} />
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{style.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{style.note}</p>
                  </div>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center border ${isSelected ? "border-green-600 bg-green-600 text-white" : "border-border text-muted-foreground"}`}>
                    {isSelected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </span>
                </div>
              </button>
            );
          })}
        </section>
      </main>

      <style>{`
        .primary-line,
        .fine-line,
        .accent-line {
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        .primary-line {
          stroke: #14532d;
          stroke-width: 3;
        }

        .fine-line {
          stroke: #3f6212;
          stroke-width: 1.8;
        }

        .accent-line {
          stroke: #b88a2b;
          stroke-width: 2.4;
        }

        .line-draw path {
          stroke-dasharray: 520;
          stroke-dashoffset: 520;
          animation: lineDraw 3.4s ease-in-out infinite;
        }

        .line-pulse path {
          animation: linePulse 2.8s ease-in-out infinite;
          filter: drop-shadow(0 0 2px rgba(20, 83, 45, 0.35));
        }

        .line-scan path {
          stroke-dasharray: 12 10;
          animation: lineMarch 2.4s linear infinite;
        }

        .line-scan {
          background: linear-gradient(90deg, transparent 0%, rgba(20, 83, 45, 0.08) 48%, transparent 64%);
          background-size: 220% 100%;
          animation: scanSweep 3.2s ease-in-out infinite;
        }

        .line-layer .layer-1 { animation: layerFade 3.2s ease-in-out infinite 0s; }
        .line-layer .layer-2 { animation: layerFade 3.2s ease-in-out infinite 0.2s; }
        .line-layer .layer-3 { animation: layerFade 3.2s ease-in-out infinite 0.4s; }
        .line-layer .layer-4 { animation: layerFade 3.2s ease-in-out infinite 0.6s; }
        .line-layer .layer-5 { animation: layerFade 3.2s ease-in-out infinite 0.8s; }

        @keyframes lineDraw {
          0% { stroke-dashoffset: 520; opacity: 0.35; }
          42%, 70% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -520; opacity: 0.35; }
        }

        @keyframes linePulse {
          0%, 100% { opacity: 0.48; stroke-width: 1.8; }
          50% { opacity: 1; stroke-width: 3.2; }
        }

        @keyframes lineMarch {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -44; }
        }

        @keyframes scanSweep {
          0%, 100% { background-position: 120% 0; }
          50% { background-position: -80% 0; }
        }

        @keyframes layerFade {
          0%, 15% { opacity: 0; transform: translateY(5px); }
          35%, 82% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};

export default LineArtReview;

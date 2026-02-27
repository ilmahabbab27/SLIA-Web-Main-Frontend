import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const newsItems = [
  {
    title: "Online Revit Course for Architects",
    subtitle: "Eng. Sampath Ekanayake",
    description:
      "The Sri Lanka Institute of Architects has scheduled the 9th intake of the online Certificate Course in Revit. Contact: Board of Management | Tel. 072 71 64 900",
    link: "#",
  },
  {
    title: "Trainer Practices Registration for 2024",
    subtitle: "Register Trainer Practices Annually",
    description:
      "SLIA Council ratified a BAE recommendation to register Trainer Practices annually. Members interested in registering their Practices as a Trainer Practice are requested to submit applications.",
    link: "#",
  },
  {
    title: "Call for Entries for Annual Awards 2023/24",
    subtitle: "Awards Categories",
    description:
      "Design Award | Colour Award | Young Architect of the Year Award | Research Award | Publication Award | Architectural Conservation Award | Green and Sustainable Architecture Award",
    link: "#",
  },
  {
    title: "BAE Notice — Periodical Assessment",
    subtitle: "Exemption Applications",
    description:
      "Applications for exemption from the Parts I & II Examinations are assessed by the Board of Architectural Education (BAE). The BAE will hold 3 interviews annually.",
    link: "#",
  },
  {
    title: "SLIA Product Awards",
    subtitle: "Product Awards",
    description:
      "SLIA Product Awards Contact: PAB | Tel. +94767784696 | Email: sliapab@architects.lk",
    link: "#",
  },
  {
    title: "The First Quarterly General Meeting",
    subtitle: "Session 2025/2026",
    description:
      "The first quarterly general meeting for the session 2025/2026 will be held on Friday, 30th May 2025 at 5:30pm at the SLIA Auditorium.",
    link: "#",
  },
  {
    title: "ARCHIve i — Volume 2, Issue 1",
    subtitle: "December 2024",
    description:
      "ARCHIve is subject to copyright in its entirety and the contents may not be reproduced in any form without written permission of the publisher.",
    link: "#",
  },
  {
    title: "Specification Writing for Architects",
    subtitle: "By Ar. Ranjith Wedikkara",
    description:
      "The Sri Lanka Institute of Architects in collaboration with Sri Lanka Association of Project Managers has been conducting a certificate course.",
    link: "#",
  },
];

const NewsSection = () => {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(newsItems[0]);

  const openModal = (item: typeof newsItems[0]) => {
    setSelectedNews(item);
    setModalOpen(true);
  };

  return (
    <section className="py-16 section-muted">
      <div className="container">
        <p className="text-primary font-semibold uppercase tracking-wider text-sm mb-2">
          News & Events
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">
          Sri Lanka Institute of Architects
        </h2>

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.slice(current, current + 3).map((item, i) => (
              <div
                key={i}
                className="bg-background border border-border p-6 rounded-sm hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => openModal(item)}
              >
                <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-primary text-sm font-medium mb-3">{item.subtitle}</p>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
                <a
                  href={item.link}
                  className="inline-block mt-4 text-primary text-sm font-semibold hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrent(Math.max(0, current - 3))}
              disabled={current === 0}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-muted-foreground">
              {Math.floor(current / 3) + 1} / {Math.ceil(newsItems.length / 3)}
            </span>
            <button
              onClick={() =>
                setCurrent(Math.min(newsItems.length - 3, current + 3))
              }
              disabled={current >= newsItems.length - 3}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
            <div className="bg-background rounded-sm max-w-lg w-full p-8 relative shadow-2xl">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                {selectedNews.title}
              </h3>
              <p className="text-primary font-medium mb-4">{selectedNews.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {selectedNews.description}
              </p>
              <a
                href={selectedNews.link}
                className="inline-block bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;

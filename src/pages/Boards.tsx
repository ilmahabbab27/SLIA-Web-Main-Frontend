import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { boardApi, type BoardItem } from "@/lib/api";

const fallbackBoards: BoardItem[] = [
  {
    id: 1,
    name: "Board of Management",
    description: "Governs and oversees the strategic direction, events, and programs of the Institute.",
    path: "/management",
    icon: "/images/board-bom.svg",
    is_active: true,
    sort_order: 1,
  },
  {
    id: 2,
    name: "Board of Architectural Education",
    description: "Supports education, examinations, and member development across architecture schools.",
    path: "/bae",
    icon: "/images/board-bae.svg",
    is_active: true,
    sort_order: 2,
  },
  {
    id: 3,
    name: "Professional Affairs Board",
    description: "Oversees practice registrations, CPD events, and professional conduct standards.",
    path: "/pab",
    icon: "/images/board-pab.svg",
    is_active: true,
    sort_order: 3,
  },
  {
    id: 4,
    name: "Board of Architectural Publications",
    description: "Manages SLIA publications, journals, and archive materials for the profession.",
    path: "/bap",
    icon: "/images/board-bap.svg",
    is_active: true,
    sort_order: 4,
  },
];

const Boards = () => {
  const [boards, setBoards] = useState<BoardItem[]>(fallbackBoards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    boardApi
      .list()
      .then((items) => {
        const activeBoards = items.filter((board) => board.is_active).sort((a, b) => a.sort_order - b.sort_order);
        setBoards(activeBoards.length ? activeBoards : fallbackBoards);
      })
      .catch(() => setBoards(fallbackBoards))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Boards" subtitle="Boards and committees" breadcrumb="Boards / Overview">
      <section className="py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm md:p-10">
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">Institute boards</h2>
              <div className="mt-4 h-px w-16 bg-border" />
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">
                Browse the Institute's boards and explore their roles, documents, and member listings.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {boards.map((board) => (
                <a
                  key={board.id}
                  href={board.path}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:border-primary/50 hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background">
                      {board.icon ? (
                        <img src={board.icon} alt={`${board.name} logo`} className="h-10 w-10" />
                      ) : (
                        <ShieldCheck className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{board.name}</h3>
                    <p className="mt-3 leading-relaxed text-foreground/70">{board.description}</p>
                    <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary">View page</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Boards;

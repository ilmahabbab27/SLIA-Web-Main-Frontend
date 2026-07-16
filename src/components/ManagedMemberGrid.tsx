import { useEffect, useState } from "react";
import { boardMemberApi, type BoardMemberItem, type BoardMemberKey } from "@/lib/api";

const getInitial = (name: string) => name.replace(/^Ar\.\s*/i, "").trim().charAt(0) || "S";

const ManagedMemberGrid = ({ boardKey }: { boardKey: BoardMemberKey }) => {
  const [members, setMembers] = useState<BoardMemberItem[]>([]);

  useEffect(() => {
    boardMemberApi
      .list(boardKey)
      .then((items) => {
        setMembers(
          items
            .filter((item) => item.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
        );
      })
      .catch(() => setMembers([]));
  }, [boardKey]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <div key={member.id} className="border border-border p-7 text-center">
          <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-muted md:h-52 md:w-52">
            {member.image ? (
              <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <span className="font-heading text-2xl font-bold text-muted-foreground">{getInitial(member.name)}</span>
            )}
          </div>
          <h3 className="font-heading text-base font-bold text-foreground">{member.name}</h3>
          <p className="mt-1 text-sm font-medium text-primary">{member.designation}</p>
        </div>
      ))}

      {members.length === 0 && (
        <div className="col-span-full border border-dashed border-border p-10 text-center text-sm text-foreground/60">
          Members will be displayed here once they are added from the admin panel.
        </div>
      )}
    </div>
  );
};

export default ManagedMemberGrid;

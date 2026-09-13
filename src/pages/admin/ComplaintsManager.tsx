import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Inbox, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { complaintApi, type ComplaintItem } from "@/lib/api";

const categoryLabels: Record<string, string> = {
  complaint: "Complaint",
  general_inquiry: "General Inquiry",
  member_issue: "Member Issue",
  board_of_trustees: "Board of Trustees",
  board_of_management: "Board of Management",
  board_of_architectural_education: "Board of Architectural Education",
  professional_affairs_board: "Professional Affairs Board",
  board_of_architectural_publications: "Board of Architectural Publications",
};

const statusLabels: Record<ComplaintItem["status"], string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const ComplaintsManager = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setComplaints(await complaintApi.list());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load complaints";
      if (message === "Admin session expired. Please sign in again.") {
        navigate("/admin/login", { replace: true, state: { from: "/admin/complaints" } });
        return;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComplaints();
  }, []);

  const updateStatus = async (complaint: ComplaintItem, status: ComplaintItem["status"]) => {
    try {
      const updated = await complaintApi.updateStatus(complaint.id, status);
      setComplaints((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      toast.success("Complaint status updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update complaint");
    }
  };

  const downloadAttachment = async (complaint: ComplaintItem) => {
    try {
      const blob = await complaintApi.downloadAttachment(complaint.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = complaint.attachment_name || "complaint-attachment";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to download attachment");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Complaints & Inquiries</h1>
          <p className="mt-2 text-slate-400">Review submissions received from the public website.</p>
        </div>
        <Button onClick={() => void loadComplaints()} variant="outline" className="border-white/10 text-white hover:bg-white/10">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading submissions...
        </div>
      ) : complaints.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.03] p-12 text-center text-slate-400">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-600" />
          No complaints or inquiries have been submitted.
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="border-white/10 bg-white/[0.03] p-6 text-slate-200">
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider">
                    <span className="rounded-full bg-primary/20 px-3 py-1 text-primary">
                      {categoryLabels[complaint.category] || complaint.category}
                    </span>
                    <span className="text-slate-500">{complaint.created_at ? new Date(complaint.created_at).toLocaleString() : ""}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{complaint.subject}</h2>
                  <p className="mt-1 text-sm text-slate-400">{complaint.name}{complaint.email ? ` | ${complaint.email}` : ""}</p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{complaint.message}</p>
                  {complaint.attachment_name && (
                    <Button onClick={() => void downloadAttachment(complaint)} variant="link" className="mt-3 h-auto p-0 text-primary">
                      <Download className="mr-2 h-4 w-4" /> {complaint.attachment_name}
                    </Button>
                  )}
                </div>
                <div className="w-full shrink-0 lg:w-44">
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Status</p>
                  <Select value={complaint.status} onValueChange={(value) => void updateStatus(complaint, value as ComplaintItem["status"])}>
                    <SelectTrigger className="border-white/10 bg-black/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintsManager;

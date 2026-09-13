import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/api";

const complaintCategories = [
  { value: "complaint", label: "Complaint" },
  { value: "general_inquiry", label: "General Inquiry" },
  { value: "member_issue", label: "Member Issue" },
  { value: "board_of_trustees", label: "Board of Trustees" },
  { value: "board_of_management", label: "Board of Management" },
  { value: "board_of_architectural_education", label: "Board of Architectural Education" },
  { value: "professional_affairs_board", label: "Professional Affairs Board" },
  { value: "board_of_architectural_publications", label: "Board of Architectural Publications" },
];

const Complaints = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("complaint");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedCategoryLabel = useMemo(
    () => complaintCategories.find((item) => item.value === category)?.label || "Complaint",
    [category]
  );

  const submitComplaint = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("category", category);
      formData.append("subject", `${selectedCategoryLabel}: ${subject}`);
      formData.append("message", message);
      if (attachment) formData.append("attachment", attachment);

      const response = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to submit complaint");
      }

      toast.success("Complaint submitted. We will review it shortly.");
      setName("");
      setEmail("");
      setCategory("complaint");
      setSubject("");
      setMessage("");
      setAttachment(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Complaints"
      subtitle="Submit a complaint or inquiry by selecting the appropriate category."
      breadcrumb="Complaints"
    >
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        <Card className="border-border bg-background/95 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Complaint Form</h2>
              <p className="text-sm text-muted-foreground">
                Use this page to submit complaints and inquiries under the appropriate category.
              </p>
            </div>
          </div>

          <form onSubmit={submitComplaint} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {complaintCategories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Complaint subject" required />
            </div>

            <div className="space-y-2">
              <Label>Complaint Details *</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the complaint, dates, people involved, and any supporting details."
                className="min-h-40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint-attachment">Attachment</Label>
              <Input
                id="complaint-attachment"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(event) => setAttachment(event.target.files?.[0] || null)}
                className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
              />
              <p className="text-xs text-muted-foreground">Optional: PDF, Word document, JPG, or PNG.</p>
            </div>

            <Button type="submit" disabled={submitting} className="h-12 w-full">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Complaint
            </Button>
          </form>
        </Card>

        <Card className="border-border bg-muted/30 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">What to include</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>- Date and time of the issue.</li>
            <li>- The correct category.</li>
            <li>- Board or member details in the subject or message when relevant.</li>
            <li>- Any documents, screenshots, or references.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
            General inquiries, board issues, and member complaints are routed through the selected category.
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Complaints;

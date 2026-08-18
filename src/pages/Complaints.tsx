import { useState } from "react";
import { AlertTriangle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE } from "@/lib/api";

const Complaints = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitComplaint = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to submit complaint");
      }

      toast.success("Complaint submitted. We will review it shortly.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Complaints"
      subtitle="Submit a complaint or concern to SLIA through a dedicated channel."
      breadcrumb="Complaints"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border bg-background/95 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Complaint Form</h2>
              <p className="text-sm text-muted-foreground">Use this page to submit issues, feedback, or complaints separately from the contact form.</p>
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

            <Button type="submit" disabled={submitting} className="h-12 w-full">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Submit Complaint
            </Button>
          </form>
        </Card>

        <Card className="border-border bg-muted/30 p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">What to include</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>• Date and time of the issue.</li>
            <li>• Names of people or departments involved.</li>
            <li>• Clear description of what happened.</li>
            <li>• Any documents, screenshots, or references.</li>
          </ul>
          <div className="mt-6 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
            Complaints are handled separately from general contact messages.
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Complaints;

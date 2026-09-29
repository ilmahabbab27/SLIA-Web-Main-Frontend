import PageLayout from "@/components/PageLayout";
import ComplaintForm from "@/components/ComplaintForm";
import { Card } from "@/components/ui/card";

const Complaints = () => {
  return (
    <PageLayout
      title="Complaints"
      subtitle="Submit a complaint or inquiry by selecting the appropriate category."
      breadcrumb="Complaints"
    >
      <div className="mx-auto grid w-full max-w-3xl gap-8">
        <ComplaintForm />

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

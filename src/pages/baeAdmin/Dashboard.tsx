import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { baeAdminStorage } from "./storage";

const Dashboard = () => (
  <PageLayout title="BAE Admin" subtitle="BAE Admin" breadcrumb="BAE Admin / Dashboard">
    <section className="py-16">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BAE Admin</h1>
            <p className="mt-2 text-foreground/70">
              Manage the public member lists shown on the Board of Architectural Education page.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              baeAdminStorage.auth.clear();
              window.location.assign("/bae-admin/login");
            }}
          >
            Logout
          </Button>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <a
            href="/bae-admin/graduates"
            className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-foreground">Graduate members</h2>
            <p className="mt-2 text-foreground/70">Create, edit, and remove graduate member records.</p>
          </a>
          <a
            href="/bae-admin/students"
            className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-foreground">Student members</h2>
            <p className="mt-2 text-foreground/70">Create, edit, and remove student member records.</p>
          </a>
          <a
            href="/bae-admin/documents"
            className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition md:col-span-2"
          >
            <h2 className="text-xl font-semibold text-foreground">Manage Documents</h2>
            <p className="mt-2 text-foreground/70">Manage applications, notices, and references shown on the BAE page.</p>
          </a>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Dashboard;


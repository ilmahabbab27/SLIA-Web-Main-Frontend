import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { bapAdminStorage } from "./storage";

const Dashboard = () => (
  <PageLayout title="BAP Admin" subtitle="BAP Admin" breadcrumb="BAP Admin / Dashboard">
    <section className="py-16">
      <div className="container max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">BAP Admin</h1>
            <p className="mt-2 text-foreground/70">Manage publications and cover images for the board page.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              bapAdminStorage.auth.clear();
              window.location.assign("/bap-admin/login");
            }}
          >
            Logout
          </Button>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <a
            href="/bap-admin/publications"
            className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-foreground">Publications</h2>
            <p className="mt-2 text-foreground/70">Create, edit, and remove publication items across all tabs.</p>
          </a>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Dashboard;


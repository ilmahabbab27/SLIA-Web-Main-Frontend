import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock, Mail, Pencil, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { contactApi, type ContactEntryItem, type ContactIconType } from "@/lib/api";

type ContactFieldKey =
  | "secretariat_address"
  | "secretariat_phone"
  | "secretariat_email"
  | "secretariat_website"
  | "secretariat_map"
  | "honorary_secretary_email"
  | "information_officer_name"
  | "information_officer_designation"
  | "information_officer_phone"
  | "information_officer_email"
  | "designated_officer_name"
  | "designated_officer_designation"
  | "designated_officer_phone"
  | "designated_officer_email"
  | "bae_phone"
  | "bae_email"
  | "bom_phone"
  | "bom_email"
  | "pab_phone"
  | "pab_email"
  | "bap_phone"
  | "bap_email";

type ContactField = {
  key: ContactFieldKey;
  title: string;
  category: string;
  label: string;
  icon: ContactIconType;
  sort_order: number;
  placeholder: string;
  defaultValue?: string;
  textFromValue?: (value: string) => string;
  hrefFromValue?: (value: string) => string;
};

const mapUrl = "https://share.google/3jp8xNyP6lLlnfv0i";

const contactFields: ContactField[] = [
  {
    key: "secretariat_address",
    title: "Secretariat Address",
    category: "General Inquiries",
    label: "Secretariat",
    icon: "address",
    sort_order: 1,
    placeholder: "Sri Lanka Institute of Architects, 120/7, Vidya Mawatha, Colombo 07",
  },
  {
    key: "secretariat_phone",
    title: "Secretariat Phone",
    category: "General Inquiries",
    label: "Secretariat",
    icon: "phone",
    sort_order: 2,
    placeholder: "Tel. 011 268 9900 Ext. 208",
  },
  {
    key: "secretariat_email",
    title: "Secretariat Email",
    category: "General Inquiries",
    label: "Secretariat",
    icon: "email",
    sort_order: 3,
    placeholder: "secretariat@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "secretariat_website",
    title: "Website",
    category: "General Inquiries",
    label: "Secretariat",
    icon: "web",
    sort_order: 4,
    placeholder: "https://www.slia.lk",
    textFromValue: (value) => value.replace(/^https?:\/\//, ""),
    hrefFromValue: (value) => value,
  },
  {
    key: "secretariat_map",
    title: "Google Map Link",
    category: "General Inquiries",
    label: "Location Map",
    icon: "address",
    sort_order: 5,
    placeholder: mapUrl,
    textFromValue: () => "View on Google Maps",
    hrefFromValue: (value) => value,
  },
  {
    key: "honorary_secretary_email",
    title: "Honorary Secretary Email",
    category: "General Inquiries",
    label: "Honorary Secretary",
    icon: "email",
    sort_order: 6,
    placeholder: "honysecretary@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "information_officer_name",
    title: "Information Officer Name",
    category: "Officers",
    label: "Information Officer",
    icon: "person",
    sort_order: 7,
    placeholder: "H.M.L.H Hulangamuwa",
    defaultValue: "H.M.L.H Hulangamuwa",
  },
  {
    key: "information_officer_designation",
    title: "Information Officer Designation",
    category: "Officers",
    label: "Information Officer",
    icon: "role",
    sort_order: 8,
    placeholder: "General Manager",
    defaultValue: "General Manager",
  },
  {
    key: "information_officer_phone",
    title: "Information Officer Phone",
    category: "Officers",
    label: "Information Officer",
    icon: "phone",
    sort_order: 9,
    placeholder: "077-28205202",
    defaultValue: "077-28205202",
  },
  {
    key: "information_officer_email",
    title: "Information Officer Email",
    category: "Officers",
    label: "Information Officer",
    icon: "email",
    sort_order: 10,
    placeholder: "secretariat@architects.lk",
    defaultValue: "secretariat@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "designated_officer_name",
    title: "Designated Officer Name",
    category: "Officers",
    label: "Designated Officer",
    icon: "person",
    sort_order: 11,
    placeholder: "Archt. Prasanna Silva",
    defaultValue: "Archt. Prasanna Silva",
  },
  {
    key: "designated_officer_designation",
    title: "Designated Officer Designation",
    category: "Officers",
    label: "Designated Officer",
    icon: "role",
    sort_order: 12,
    placeholder: "Senior Vice President",
    defaultValue: "Senior Vice President",
  },
  {
    key: "designated_officer_phone",
    title: "Designated Officer Phone",
    category: "Officers",
    label: "Designated Officer",
    icon: "phone",
    sort_order: 13,
    placeholder: "077-3470200",
    defaultValue: "077-3470200",
  },
  {
    key: "designated_officer_email",
    title: "Designated Officer Email",
    category: "Officers",
    label: "Designated Officer",
    icon: "email",
    sort_order: 14,
    placeholder: "prasannasilva52@gmail.com",
    defaultValue: "prasannasilva52@gmail.com",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "bae_phone",
    title: "BAE Phone",
    category: "Board Contacts",
    label: "Board of Architectural Education (BAE)",
    icon: "phone",
    sort_order: 15,
    placeholder: "Tel. 011 268 9900 Ext. 208",
    defaultValue: "Tel. 011 268 9900 Ext. 208",
  },
  {
    key: "bae_email",
    title: "BAE Email",
    category: "Board Contacts",
    label: "Board of Architectural Education (BAE)",
    icon: "email",
    sort_order: 16,
    placeholder: "bae@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "bom_phone",
    title: "BOM Phone",
    category: "Board Contacts",
    label: "Board of Management (BOM)",
    icon: "phone",
    sort_order: 17,
    placeholder: "Tel. 072 71 64 900",
  },
  {
    key: "bom_email",
    title: "BOM Email",
    category: "Board Contacts",
    label: "Board of Management (BOM)",
    icon: "email",
    sort_order: 18,
    placeholder: "bom@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "pab_phone",
    title: "PAB Phone",
    category: "Board Contacts",
    label: "Professional Affairs Board (PAB)",
    icon: "phone",
    sort_order: 19,
    placeholder: "Tel. +94 767 784 696",
  },
  {
    key: "pab_email",
    title: "PAB Email",
    category: "Board Contacts",
    label: "Professional Affairs Board (PAB)",
    icon: "email",
    sort_order: 20,
    placeholder: "sliapab@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
  {
    key: "bap_phone",
    title: "BAP Phone",
    category: "Board Contacts",
    label: "Board of Architectural Publications (BAP)",
    icon: "phone",
    sort_order: 21,
    placeholder: "Tel. 011 268 9900 Ext. 208",
    defaultValue: "Tel. 011 268 9900 Ext. 208",
  },
  {
    key: "bap_email",
    title: "BAP Email",
    category: "Board Contacts",
    label: "Board of Architectural Publications (BAP)",
    icon: "email",
    sort_order: 22,
    placeholder: "bap@architects.lk",
    hrefFromValue: (value) => `mailto:${value}`,
  },
];

const defaultValues = contactFields.reduce(
  (values, field) => ({ ...values, [field.key]: field.defaultValue || (field.key === "secretariat_map" ? mapUrl : "") }),
  {} as Record<ContactFieldKey, string>
);

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const hasDuplicateIdentity = (field: ContactField) =>
  contactFields.some(
    (other) =>
      other.key !== field.key &&
      other.category === field.category &&
      other.label === field.label &&
      other.icon === field.icon
  );

const findEntry = (entries: ContactEntryItem[], field: ContactField) => {
  const matches = entries.filter(
    (entry) => entry.category === field.category && entry.label === field.label && entry.icon === field.icon
  );

  return matches.find((entry) => entry.sort_order === field.sort_order) || (!hasDuplicateIdentity(field) ? matches[0] : undefined);
};

const isFieldLocked = (entries: ContactEntryItem[], field: ContactField) => {
  const entry = findEntry(entries, field);
  return Boolean(entry?.is_locked || entry?.locked);
};

const valueFromEntry = (entry: ContactEntryItem | undefined, field: ContactField) => {
  if (!entry) return defaultValues[field.key];
  if (field.key === "secretariat_map") return entry.href || defaultValues.secretariat_map;
  if (field.key === "secretariat_website") return entry.href || entry.text;
  return field.icon === "email" ? entry.text.replace(/^mailto:/, "") : entry.text;
};

const ContactManager = () => {
  const [entries, setEntries] = useState<ContactEntryItem[]>([]);
  const [form, setForm] = useState<Record<ContactFieldKey, string>>(defaultValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contactApi.list();
      setEntries(data);
      setForm(
        contactFields.reduce(
          (values, field) => ({
            ...values,
            [field.key]: valueFromEntry(findEntry(data, field), field),
          }),
          {} as Record<ContactFieldKey, string>
        )
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load contact details."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const saveField = async (field: ContactField) => {
    if (isFieldLocked(entries, field)) return;

    const value = form[field.key].trim();
    const existing = findEntry(entries, field);
    const payload = {
      category: field.category,
      label: field.label,
      icon: field.icon,
      text: value ? field.textFromValue?.(value) || value : "",
      href: value ? field.hrefFromValue?.(value) || "" : "",
      is_active: Boolean(value),
      sort_order: field.sort_order,
    };

    if (existing) {
      await contactApi.update(existing.id, payload);
      return;
    }

    if (value) {
      await contactApi.create(payload);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const field of contactFields) {
        await saveField(field);
      }

      await fetchEntries();
      setIsEditing(false);
      toast.success("Contact page updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-w-0 space-y-8 pb-20">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Contact Page</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Contact <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage the full contact page from one form. Empty fields are hidden from the public page.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={fetchEntries} disabled={loading} className="h-10 gap-2 rounded-xl border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h3 className="mb-5 text-lg font-bold text-white">General Inquiries</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {contactFields
                .filter((field) => field.category === "General Inquiries")
                .map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {field.title}
                      {isFieldLocked(entries, field) && <Lock className="h-3.5 w-3.5 text-primary" />}
                    </Label>
                    <Input
                      value={form[field.key]}
                      onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                      disabled={!isEditing || isFieldLocked(entries, field)}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
            </div>
          </section>

          <section>
            <h3 className="mb-5 text-lg font-bold text-white">Officers</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {contactFields
                .filter((field) => field.category === "Officers")
                .map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {field.title}
                      {isFieldLocked(entries, field) && <Lock className="h-3.5 w-3.5 text-primary" />}
                    </Label>
                    <Input
                      value={form[field.key]}
                      onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                      disabled={!isEditing || isFieldLocked(entries, field)}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
            </div>
          </section>

          <section>
            <h3 className="mb-5 text-lg font-bold text-white">Board Contacts</h3>
            <div className="grid gap-5 md:grid-cols-2">
              {contactFields
                .filter((field) => field.category === "Board Contacts")
                .map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                      {field.title}
                      {isFieldLocked(entries, field) && <Lock className="h-3.5 w-3.5 text-primary" />}
                    </Label>
                    <Input
                      value={form[field.key]}
                      onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                      disabled={!isEditing || isFieldLocked(entries, field)}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row">
            {!isEditing && (
              <Button type="button" disabled={loading} onClick={() => setIsEditing(true)} className="h-14 w-full rounded-2xl bg-primary font-bold text-white md:w-auto md:px-10">
                <Pencil className="h-5 w-5" />
                Edit Contact Page
              </Button>
            )}
            {isEditing && (
              <Button type="submit" disabled={saving || loading} className="h-14 w-full rounded-2xl bg-primary font-bold text-white md:w-auto md:px-10">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Save Contact Page
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ContactManager;

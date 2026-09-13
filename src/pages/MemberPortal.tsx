
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, LogIn, Save, Shield, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

type Member = {
  id: number;
  full_name?: string;
  name_with_initials?: string;
  yearbook_name?: string;
  nic_number?: string;
  gender?: string;
  date_of_birth?: string;
  photo?: string;
  membership_type?: string;
  membership_number?: string;
  membership_year?: string;
  arb_number?: string;
  academic_qualifications?: string;
  professional_qualifications?: string;
  practice_type?: string;
  office_district?: string;
  office_province?: string;
  office_fax?: string;
  office_website?: string;
  username?: string;
  password?: string;
  office_email?: string;
  office_phone?: string;
  home_email?: string;
  slia_contact_email?: string;
  home_phone?: string;
  office_address?: string;
  home_district?: string;
  home_province?: string;
  home_fax?: string;
  home_address?: string;
  practice_name?: string;
  practice_description?: string;
  location_district?: string;
  location_province?: string;
  personal_website?: string;
  contact_info_1_address?: string;
  contact_info_1_phone?: string;
  contact_info_1_email?: string;
  contact_info_2_address?: string;
  contact_info_2_phone?: string;
  contact_info_2_email?: string;
  positions_held?: string;
  slia_awards?: string;
  other_awards?: string;
};

type FieldViewProps = {
  label: string;
  value?: string | null;
  span?: boolean;
  multiline?: boolean;
};

const MEMBER_SESSION_KEY = "slia_member_session";
const normalizeMembershipNumber = (value: string) => value.toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9/-]/g, "");
const normalizeLoginIdentifier = (value: string) => value.trim();
const isValidEmail = (value?: string | null) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidDateInput = (value?: string | null) => !value || !Number.isNaN(Date.parse(value));
const isValidMembershipNumber = (value: string) => /^[A-Z0-9/-]+$/.test(value) && value.length >= 3;
const isValidLoginIdentifier = (value: string) => value.length >= 3 && !/[\u0000-\u001F\u007F]/.test(value);
const isStrongPassword = (value: string) => value.length >= 8;
const getResponseMessage = (text: string, fallback: string) => {
  try {
    const parsed = JSON.parse(text) as { message?: string; errors?: Record<string, string[]> };
    if (parsed.message) return parsed.message;
    const firstValidationError = Object.values(parsed.errors || {}).flat()[0];
    return firstValidationError || fallback;
  } catch {
    return text || fallback;
  }
};
const formatDisplayDate = (value?: string | null) => {
  if (!value || !value.trim()) {
    return "";
  }

  const normalized = value.includes("T") ? value.split("T")[0] : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const normalizeDateInput = (value?: string | null) => {
  if (!value || !value.trim()) {
    return "";
  }

  const normalized = value.includes("T") ? value.split("T")[0] : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return parsed.toISOString().slice(0, 10);
};

const FieldView = ({ label, value, span, multiline }: FieldViewProps) => (
  <div className={`space-y-2 ${span ? "md:col-span-2" : ""}`}>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{label}</p>
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-900 break-words sm:px-4 ${multiline ? "min-h-24 whitespace-pre-wrap" : ""}`}>
      {label === "Date of Birth" ? formatDisplayDate(value) : value && value.trim() ? value : ""}
    </div>
  </div>
);

const MemberPortal = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [saving, setSaving] = useState(false);
  const [membershipNumber, setMembershipNumber] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [recoveryMode, setRecoveryMode] = useState<"reset" | "forgot" | null>(null);
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [form, setForm] = useState<Member>({});
  const [editMode, setEditMode] = useState(false);
  const [profileTab, setProfileTab] = useState<"profile" | "practice" | "contacts" | "other-contact" | "awards">("profile");
  const editFormRef = useRef<HTMLDivElement | null>(null);
  const resetPasswordRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(MEMBER_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Member;
      setActiveMember(parsed);
      setForm(parsed);
    }
    void fetchMembers();
  }, []);

  useEffect(() => {
    if (editMode) {
      window.requestAnimationFrame(() => {
        editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [editMode]);

  useEffect(() => {
    if (!editMode) {
      setProfileTab("profile");
    }
  }, [editMode]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/slia-members?per_page=1000`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to load member records");
      const data = await response.json();
      const nextMembers = data.data || [];
      setMembers(nextMembers);
      return nextMembers as Member[];
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load member records");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const identifier = normalizeLoginIdentifier(membershipNumber);
      if (!isValidLoginIdentifier(identifier)) {
        throw new Error("Username or membership number is invalid.");
      }
      const response = await fetch(`${API_BASE}/member/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: identifier,
          password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Sign in failed"));
      }

      const result = await response.json();
      const member = result.data || result;
      const normalizedMember = {
        ...member,
        membership_number: member.membership_number || "",
        username: member.username || member.membership_number || identifier,
      };

      setActiveMember(normalizedMember);
      setForm(normalizedMember);
      setEditMode(false);
      setShowPassword(false);
      window.localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(normalizedMember));
      toast.success("Signed in");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      setAuthError(message);
      toast.error(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const sendSignupOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const memberNo = normalizeMembershipNumber(membershipNumber);
    const signupEmail = email.trim();

    if (!memberNo) {
      toast.error("Membership number is required.");
      return;
    }
    if (!isValidMembershipNumber(memberNo)) {
      toast.error("Membership number is invalid.");
      return;
    }
    if (!signupEmail) {
      toast.error("Email is required.");
      return;
    }
    if (!isValidEmail(signupEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/member/registration-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          membership_number: memberNo,
          email: signupEmail,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to send registration code"));
      }
      setSignupOtpSent(true);
      toast.success("Registration code sent to your email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send registration code");
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (event: React.FormEvent) => {
    event.preventDefault();
    const memberNo = normalizeMembershipNumber(membershipNumber);
    const signupEmail = email.trim();
    const nextPassword = password.trim();

    if (!otp || otp.length !== 6) {
      toast.error("Enter the 6-digit registration code.");
      return;
    }
    if (!nextPassword) {
      toast.error("Password is required.");
      return;
    }
    if (!isStrongPassword(nextPassword)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/member/registration-otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          membership_number: memberNo,
          email: signupEmail,
          otp,
          password: nextPassword,
          password_confirmation: confirmPassword,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to create member account"));
      }
      const created = await response.json();
      const nextMember = created.data || created;
      setActiveMember(nextMember);
      setForm(nextMember);
      setEditMode(false);
      setShowPassword(false);
      window.localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(nextMember));
      await fetchMembers();
      toast.success("Account created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const memberNo = normalizeMembershipNumber(membershipNumber);
    const current = currentPassword.trim();
    const nextPassword = password.trim();

    if (!memberNo) {
      toast.error("Membership number is required.");
      return;
    }
    if (!isValidMembershipNumber(memberNo)) {
      toast.error("Membership number is invalid.");
      return;
    }
    if (!current) {
      toast.error("Current password is required.");
      return;
    }
    if (!nextPassword) {
      toast.error("New password is required.");
      return;
    }
    if (!isStrongPassword(nextPassword)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/member/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          membership_number: memberNo,
          current_password: current,
          password: nextPassword,
          password_confirmation: confirmPassword,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to reset password"));
      }

      setPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      toast.success("Password updated");
      setMode("login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setAuthLoading(false);
    }
  };

  const sendForgotPasswordOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const memberNo = normalizeMembershipNumber(membershipNumber);
    const targetEmail = email.trim();

    if (!memberNo) {
      toast.error("Membership number is required.");
      return;
    }
    if (!isValidMembershipNumber(memberNo)) {
      toast.error("Membership number is invalid.");
      return;
    }
    if (!targetEmail) {
      toast.error("Email is required.");
      return;
    }
    if (!isValidEmail(targetEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/member/password-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          membership_number: memberNo,
          email: targetEmail,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to send OTP"));
      }

      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setAuthLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    const memberNo = normalizeMembershipNumber(membershipNumber);
    const targetEmail = email.trim();
    const nextPassword = password.trim();

    if (!otpSent) {
      toast.error("Send the OTP first.");
      return;
    }
    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit OTP sent to your email.");
      return;
    }
    if (!nextPassword) {
      toast.error("New password is required.");
      return;
    }
    if (!isStrongPassword(nextPassword)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (nextPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch(`${API_BASE}/member/password-otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          membership_number: memberNo,
          email: targetEmail,
          otp,
          password: nextPassword,
          password_confirmation: confirmPassword,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to reset password"));
      }

      setOtp("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtpSent(false);
      toast.success("Password updated");
      setMode("login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setAuthLoading(false);
    }
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeMember) return;

    if (!form.full_name?.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (form.membership_number && !isValidMembershipNumber(form.membership_number)) {
      toast.error("Membership Number is invalid.");
      return;
    }
    if (!isValidDateInput(form.date_of_birth)) {
      toast.error("Date of Birth must be a valid date.");
      return;
    }
    const profileEmails = [form.slia_contact_email, form.office_email, form.home_email, form.contact_info_1_email, form.contact_info_2_email].filter(Boolean);
    if (profileEmails.some((email) => !isValidEmail(email))) {
      toast.error("One or more email addresses are invalid.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/slia-members/${activeMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          membership_number: activeMember.membership_number || activeMember.username,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(getResponseMessage(text, "Failed to update profile"));
      }
      const updated = await response.json();
      const nextMember = updated.data || updated;
      const normalizedMember = {
        ...nextMember,
        membership_number: normalizeMembershipNumber(nextMember.membership_number || nextMember.username || ""),
        username: normalizeMembershipNumber(nextMember.membership_number || nextMember.username || ""),
      };
      setActiveMember(normalizedMember);
      setForm(normalizedMember);
      setEditMode(false);
      setShowPassword(false);
      window.localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(normalizedMember));
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    setActiveMember(null);
    setForm({});
    setEditMode(false);
    setShowPassword(false);
    window.localStorage.removeItem(MEMBER_SESSION_KEY);
    setMembershipNumber("");
    setEmail("");
    setCurrentPassword("");
    setPassword("");
    setOtp("");
    setOtpSent(false);
  };

  const displayName = useMemo(() => activeMember?.full_name || "Member", [activeMember]);
  const portalUsername = activeMember?.username || activeMember?.membership_number || "";
  const identityBadge = activeMember?.membership_type || "SLIA Member";
  const profileFields = useMemo(
    () =>
      Object.entries(activeMember || {})
        .filter(([key, value]) => key !== "password" && key !== "id" && value !== null && value !== undefined && value !== "")
        .map(([key, value]) => ({
          key,
          label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          value: Array.isArray(value) ? value.join(", ") : String(value),
        })),
    [activeMember],
  );
  const blankValue = "";
  const authTitle = mode === "login" ? "Member Sign In" : "Create Member Account";
  const authButton = mode === "login" ? "Sign In" : "Create Account";

  return (
    <PageLayout
      title={activeMember ? "My Profile" : "Member Portal"}
      subtitle="Log in with your membership number to update your own details."
      breadcrumb={activeMember ? "Home / My Profile" : "Home / Member Portal"}
    >
      <section className="py-12">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 lg:px-6">
          {!activeMember ? (
            <div className="flex flex-col-reverse gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="overflow-hidden border-border bg-card shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)]">
                <div className="relative min-h-[320px] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.28),transparent_32%),linear-gradient(135deg,#07120f_0%,#10231c_50%,#0f172a_100%)] p-5 text-white sm:min-h-[520px] sm:p-8 lg:p-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_30%)]" />
                  <div className="relative flex h-full min-h-[320px] flex-col justify-between space-y-6 sm:min-h-[520px] sm:space-y-8">
                    <div className="space-y-5 sm:space-y-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-emerald-300/20 bg-white/10 shadow-lg backdrop-blur sm:h-16 sm:w-16">
                        <Shield className="h-7 w-7 sm:h-8 sm:w-8" />
                      </div>
                      <div className="space-y-3">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-emerald-300/90 sm:text-xs sm:tracking-[0.32em]">SLIA Members</p>
                        <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">Member Portal</h1>
                        <p className="max-w-xl text-sm leading-6 text-emerald-200/90 sm:text-base">
                          Do not you have an account? Please signup. If this is your first time, please register.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-emerald-100/90 backdrop-blur sm:p-5">
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/80">Portal Rules</p>
                        <p>Sign in with your username or membership number.</p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/80">Security</p>
                        <p>Use a password you can remember, then keep it private.</p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/80">Profile</p>
                        <p>After sign in, you can update your contact details and practice information.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-border bg-card p-4 shadow-sm sm:p-8">
                <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{authTitle}</h2>
                    <p className="mt-1 text-sm text-emerald-700">Use your username or membership number to access the portal.</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 shadow-sm">
                    <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <div className="mb-5 inline-flex w-full rounded-full border border-border bg-muted p-1">
                  <Button type="button" variant={mode === "login" ? "default" : "ghost"} className="h-10 flex-1 rounded-full px-3 text-sm sm:px-4" onClick={() => setMode("login")}>
                    Sign In
                  </Button>
                  <Button type="button" variant={mode === "signup" ? "default" : "ghost"} className="h-10 flex-1 rounded-full px-3 text-sm sm:px-4" onClick={() => setMode("signup")}>
                    Sign Up
                  </Button>
                </div>

                <div className="mb-5 rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                  {mode === "login" ? "Sign in with your username or membership number and password." : "Already have an account? Sign in below."}
                  <p className="mt-2 font-medium">Only Associate members and above can use the portal.</p>
                </div>

                <form onSubmit={mode === "login" ? login : (signupOtpSent ? signup : sendSignupOtp)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{mode === "login" ? "Username or Membership No" : "Membership No"}</Label>
                    <Input
                      value={membershipNumber}
                      onChange={(e) => setMembershipNumber(mode === "login" ? e.target.value : normalizeMembershipNumber(e.target.value))}
                      placeholder={mode === "login" ? "Username or SLIA/1234" : "e.g. SLIA/1234 or A00SOMETHING"}
                      required
                      autoCapitalize={mode === "login" ? "none" : "characters"}
                      spellCheck={false}
                    />
                    <p className="text-xs text-foreground/50">{mode === "login" ? "Enter the username or membership number used for your account." : "No spaces allowed."}</p>
                  </div>
                  {mode !== "login" && (
                    <div className="space-y-2">
                      <Label>SLIA Contact Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your correspondence email"
                        required
                      />
                    </div>
                  )}
                  {mode === "signup" && signupOtpSent && (
                    <div className="space-y-2">
                      <Label>Email Verification Code</Label>
                      <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="6-digit code"
                        required
                      />
                      <p className="text-xs text-foreground/50">Check your correspondence email and enter the code to set your portal password.</p>
                    </div>
                  )}
                  {mode === "login" || signupOtpSent ? (
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                  ) : null}
                  {mode === "login" && (
                    <div className="text-sm">
                      <button
                        type="button"
                        className="font-semibold text-emerald-800 hover:underline"
                        onClick={() => setRecoveryMode((current) => (current === "forgot" ? null : "forgot"))}
                      >
                        Forgot Password
                      </button>
                    </div>
                  )}
                  {mode !== "login" && signupOtpSent && (
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                  )}
                  <Button type="submit" disabled={authLoading || loading} className="h-11 w-full sm:h-12">
                    {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                    {mode === "signup" && !signupOtpSent ? "Send Registration Code" : authButton}
                  </Button>
                </form>
                {mode === "login" && authError && (
                  <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {authError}
                  </div>
                )}

                {mode === "login" && recoveryMode === "forgot" && (
                  <form onSubmit={otpSent ? verifyForgotPasswordOtp : sendForgotPasswordOtp} className="mt-4 space-y-4 rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <div className="space-y-2">
                      <Label>SLIA Contact Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Registered SLIA contact email" required />
                    </div>
                    {otpSent && (
                      <>
                        <div className="space-y-2">
                          <Label>OTP</Label>
                          <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="6-digit code" required />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                      </>
                    )}
                    <Button type="submit" disabled={authLoading || loading} className="h-11 w-full sm:h-12">
                      {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      {otpSent ? "Verify OTP" : "Send OTP"}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          ) : (
            <Card className="overflow-hidden border-border bg-card shadow-sm">
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 px-4 py-4 text-white sm:px-8 sm:py-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg sm:h-16 sm:w-16">
                      <UserRound className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold tracking-tight sm:text-3xl">My Profile</h1>
                      <p className="text-sm text-emerald-100/90">{displayName ? `Arch. ${displayName}` : "User has already signed up."}</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-10 w-full px-3 text-sm sm:w-auto sm:px-4"
                        onClick={() => setEditMode((current) => !current)}
                      >
                        {editMode ? "Stop Editing" : "Edit Profile"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 w-full border-white/20 bg-white/5 px-3 text-sm text-white hover:bg-white/10 hover:text-white sm:w-auto sm:px-4"
                        onClick={() => {
                          setMode("reset");
                          setMembershipNumber(portalUsername);
                          setCurrentPassword("");
                          setPassword("");
                          setConfirmPassword("");
                          window.requestAnimationFrame(() => {
                            resetPasswordRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          });
                        }}
                      >
                        Update Password
                      </Button>
                    <Button type="button" variant="outline" className="h-10 w-full border-white/20 bg-white/5 px-3 text-sm text-white hover:bg-white/10 hover:text-white sm:w-auto sm:px-4" onClick={logout}>
                      Logout
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
                  <div className="space-y-5">
                    <div className="rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-3 shadow-sm sm:p-5">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] border border-emerald-200 bg-emerald-100 text-emerald-700 shadow-sm sm:h-24 sm:w-24 sm:rounded-[1.5rem]">
                          <UserRound className="h-8 w-8 sm:h-12 sm:w-12" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-700 sm:text-xs sm:tracking-[0.24em]">Profile Status</p>
                          <h3 className="mt-1 text-lg font-semibold tracking-tight sm:text-2xl">{identityBadge}</h3>
                          <p className="mt-1 break-words text-sm text-foreground/60">{portalUsername || blankValue}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-sm sm:mt-5 sm:p-4">
                        <div className="grid gap-2 text-sm sm:gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-slate-500">Mode</span>
                            <span className="font-medium text-slate-900">{editMode ? "Editing" : "Locked"}</span>
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-slate-500">Membership No</span>
                            <span className="font-medium text-slate-900 break-words text-right">{portalUsername || blankValue}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800 break-words">
                      {editMode ? "Editing is enabled. Save when you finish." : "Profile is locked. Click Edit Profile to open the form."}
                      <p className="mt-2">
                        A few fields are not editable. If you need to update them, please contact SLIA PAB at{" "}
                        <span className="font-semibold">managerpab@architects.lk</span> along with the necessary documents.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 h-10 w-full border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
                        onClick={() => {
                          setMode("reset");
                          setMembershipNumber(portalUsername);
                          setCurrentPassword("");
                          setPassword("");
                          setConfirmPassword("");
                          window.requestAnimationFrame(() => {
                            resetPasswordRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          });
                        }}
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:gap-6">
                  {mode === "reset" && (
                    <div ref={resetPasswordRef} className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Change Password</p>
                          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Update your login password</h2>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setMode("login")}
                          className="self-start text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                        >
                          Close
                        </Button>
                      </div>
                      <form onSubmit={resetPassword} className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Membership No</Label>
                          <Input value={membershipNumber} onChange={(e) => setMembershipNumber(normalizeMembershipNumber(e.target.value))} required />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Current Password</Label>
                          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="sm:col-span-2">
                          <Button type="submit" disabled={authLoading} className="h-12">
                            {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Update Password
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {!editMode && (
                    <div className="space-y-4 md:hidden">
                      <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Profile Summary</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700 break-words">Use Edit Profile to update your details. Sections below are grouped for easier reading on mobile.</p>
                      </div>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Personal Details</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Full Name *" value={form.full_name} />
                          <FieldView label="Name With Initials" value={form.name_with_initials} />
                          <FieldView label="Yearbook Name" value={form.yearbook_name} />
                          <FieldView label="NIC Number" value={form.nic_number} />
                          <FieldView label="Gender" value={form.gender} />
                          <FieldView label="Date of Birth" value={form.date_of_birth} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Membership &amp; Professional</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Membership Type" value={form.membership_type || "Student"} />
                          <FieldView label="Membership Number" value={form.membership_number} />
                          <FieldView label="Membership Year" value={form.membership_year} />
                          <FieldView label="ARB Number" value={form.arb_number} />
                          <FieldView label="Username" value={form.username} />
                          <FieldView label="Password" value={form.password || ""} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Practice</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Practice Name" value={form.practice_name} />
                          <FieldView label="Practice Description" value={form.practice_description} multiline />
                          <FieldView label="Practice Type" value={form.practice_type || "Select practice type"} />
                          <FieldView label="Personal Website" value={form.personal_website} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Password</summary>
                        <div className="mt-4 space-y-3">
                          <p className="text-sm leading-6 text-slate-700">
                            Password updates are handled from the dedicated Update Password action to keep the profile view secure.
                          </p>
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Office &amp; Contacts</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Office Address" value={form.office_address} multiline />
                          <FieldView label="Office District" value={form.office_district} />
                          <FieldView label="Office Province" value={form.office_province} />
                          <FieldView label="Office Phone" value={form.office_phone} />
                          <FieldView label="Office Fax" value={form.office_fax} />
                          <FieldView label="Office Website" value={form.office_website} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Other Contact</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Contact Info 1 Address" value={form.contact_info_1_address} multiline />
                          <FieldView label="Contact Info 1 Phone" value={form.contact_info_1_phone} />
                          <FieldView label="Contact Info 1 Email" value={form.contact_info_1_email} />
                          <FieldView label="Contact Info 2 Address" value={form.contact_info_2_address} multiline />
                          <FieldView label="Contact Info 2 Phone" value={form.contact_info_2_phone} />
                          <FieldView label="Contact Info 2 Email" value={form.contact_info_2_email} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">More Details</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Positions Held" value={form.positions_held} multiline />
                          <FieldView label="Personal Website" value={form.personal_website} />
                        </div>
                      </details>

                      <details className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Qualifications &amp; Awards</summary>
                        <div className="mt-4 space-y-3">
                          <FieldView label="Academic Qualifications" value={form.academic_qualifications} multiline />
                          <FieldView label="Professional Qualifications" value={form.professional_qualifications} multiline />
                          <FieldView label="SLIA Awards" value={form.slia_awards} multiline />
                          <FieldView label="Other Awards" value={form.other_awards} multiline />
                        </div>
                      </details>
                    </div>
                  )}

                  {!editMode ? (
                    <div className="hidden space-y-5 md:block">
                      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Profile Summary</p>
                        <p className="mt-2 text-sm text-slate-700">Click <span className="font-semibold">Edit Profile</span> to open the form and change your details.</p>
                      </div>

                      <div className="grid gap-5">
                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Personal Details</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <FieldView label="Full Name *" value={form.full_name} span />
                            <FieldView label="Name With Initials" value={form.name_with_initials} />
                            <FieldView label="Yearbook Name" value={form.yearbook_name} />
                            <FieldView label="NIC Number" value={form.nic_number} />
                            <FieldView label="Gender" value={form.gender} />
                            <FieldView label="Date of Birth" value={form.date_of_birth} span />
                          </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Home Contact</p>
                          <p className="mt-2 text-base font-semibold text-red-600">These details will be used for SLIA communication purposes, including emails, calls, and postals.</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <FieldView label="Home Address" value={form.home_address} multiline span />
                          <FieldView label="Home District" value={form.home_district} />
                          <FieldView label="Home Province" value={form.home_province} />
                          <FieldView label="Location District" value={form.location_district} />
                          <FieldView label="Location Province" value={form.location_province} />
                          <FieldView label="Home Phone" value={form.home_phone} />
                          <FieldView label="Home Fax" value={form.home_fax} />
                          <FieldView label="Home Email" value={form.home_email} />
                          <FieldView label="SLIA Contact Email" value={form.slia_contact_email} />
                        </div>
                      </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Membership &amp; Professional</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <FieldView label="Membership Type" value={form.membership_type || "Student"} />
                            <FieldView label="Membership Number" value={form.membership_number} />
                            <FieldView label="Membership Year" value={form.membership_year} />
                            <FieldView label="ARB Number" value={form.arb_number} />
                            <FieldView label="Username" value={form.username} span />
                            <FieldView label="Password" value={form.password || ""} span />
                          </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Practice</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <FieldView label="Practice Name" value={form.practice_name} span />
                            <FieldView label="Practice Description" value={form.practice_description} multiline span />
                            <FieldView label="Practice Type" value={form.practice_type || "Select practice type"} />
                            <FieldView label="Personal Website" value={form.personal_website} />
                          </div>
                        </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Qualifications</p>
                            <div className="mt-4 grid gap-3">
                              <FieldView label="Academic Qualifications" value={form.academic_qualifications} multiline />
                              <FieldView label="Professional Qualifications" value={form.professional_qualifications} multiline />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Office Contact</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <FieldView label="Office Address" value={form.office_address} multiline span />
                              <FieldView label="Office District" value={form.office_district} />
                              <FieldView label="Office Province" value={form.office_province} />
                              <FieldView label="Office Phone" value={form.office_phone} />
                              <FieldView label="Office Email" value={form.office_email} />
                              <FieldView label="Office Fax" value={form.office_fax} />
                              <FieldView label="Office Website" value={form.office_website} span />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Contact Info 1</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <FieldView label="Address" value={form.contact_info_1_address} multiline span />
                              <FieldView label="Phone" value={form.contact_info_1_phone} />
                              <FieldView label="Email" value={form.contact_info_1_email} />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Contact Info 2</p>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <FieldView label="Address" value={form.contact_info_2_address} multiline span />
                              <FieldView label="Phone" value={form.contact_info_2_phone} />
                              <FieldView label="Email" value={form.contact_info_2_email} />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Positions Held</p>
                            <div className="mt-4 grid gap-3">
                              <FieldView label="Positions Held" value={form.positions_held} multiline />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">SLIA Awards</p>
                            <div className="mt-4 grid gap-3">
                              <FieldView label="SLIA Awards" value={form.slia_awards} multiline />
                            </div>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Other Awards</p>
                            <div className="mt-4 grid gap-3">
                              <FieldView label="Other Awards" value={form.other_awards} multiline />
                            </div>
                          </div>

                      </div>
                    </div>
                  ) : (
                      <form onSubmit={saveProfile} className="space-y-6" ref={editFormRef}>
                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Personal Details</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            Only Yearbook Name and Date of Birth can be updated here. All other personal fields are kept locked.
                          </p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2"><Label>Full Name *</Label><Input readOnly value={form.full_name || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Name With Initials</Label><Input readOnly value={form.name_with_initials || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Yearbook Name</Label><Input readOnly={!editMode} value={form.yearbook_name || ""} onChange={(e) => setForm((c) => ({ ...c, yearbook_name: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>NIC Number</Label><Input readOnly value={form.nic_number || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Gender</Label><Input readOnly value={form.gender || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Date of Birth</Label><Input type="date" readOnly={!editMode} value={normalizeDateInput(form.date_of_birth)} onChange={(e) => setForm((c) => ({ ...c, date_of_birth: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Home Contact</p>
                          <p className="mt-2 text-base font-semibold text-red-600">These details will be used for SLIA communication purposes, including emails, calls, and postals.</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2"><Label>Home Address</Label><Textarea readOnly={!editMode} value={form.home_address || ""} onChange={(e) => setForm((c) => ({ ...c, home_address: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Home District</Label><Input readOnly={!editMode} value={form.home_district || ""} onChange={(e) => setForm((c) => ({ ...c, home_district: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Home Province</Label><Input readOnly={!editMode} value={form.home_province || ""} onChange={(e) => setForm((c) => ({ ...c, home_province: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Location District</Label><Input readOnly={!editMode} value={form.location_district || ""} onChange={(e) => setForm((c) => ({ ...c, location_district: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Location Province</Label><Input readOnly={!editMode} value={form.location_province || ""} onChange={(e) => setForm((c) => ({ ...c, location_province: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Home Phone</Label><Input readOnly={!editMode} value={form.home_phone || ""} onChange={(e) => setForm((c) => ({ ...c, home_phone: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Home Fax</Label><Input readOnly={!editMode} value={form.home_fax || ""} onChange={(e) => setForm((c) => ({ ...c, home_fax: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Home Email</Label><Input readOnly={!editMode} value={form.home_email || ""} onChange={(e) => setForm((c) => ({ ...c, home_email: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>SLIA Contact Email</Label><Input type="email" readOnly={!editMode} value={form.slia_contact_email || ""} onChange={(e) => setForm((c) => ({ ...c, slia_contact_email: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Membership &amp; Professional</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2"><Label>Membership Type</Label><Input readOnly value={form.membership_type || "Student"} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Membership Number</Label><Input readOnly value={form.membership_number || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Membership Year</Label><Input readOnly value={form.membership_year || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>ARB Number</Label><Input readOnly value={form.arb_number || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Username</Label><Input readOnly value={form.username || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Password</Label><Input readOnly type={showPassword ? "text" : "password"} value={form.password || ""} className="bg-muted/60" /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Qualifications</p>
                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2"><Label>Academic Qualifications</Label><Textarea readOnly value={form.academic_qualifications || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Professional Qualifications</Label><Textarea readOnly value={form.professional_qualifications || ""} className="bg-muted/60" /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Practice</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2"><Label>Practice Name</Label><Input readOnly value={form.practice_name || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Practice Description</Label><Textarea readOnly value={form.practice_description || ""} className="bg-muted/60" /></div>
                            <div className="space-y-2"><Label>Practice Type</Label><Input readOnly value={form.practice_type || ""} className="bg-muted/60" placeholder="Select practice type" /></div>
                            <div className="space-y-2"><Label>Personal Website</Label><Input readOnly value={form.personal_website || ""} className="bg-muted/60" /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Office Contact</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2"><Label>Office Address</Label><Textarea readOnly={!editMode} value={form.office_address || ""} onChange={(e) => setForm((c) => ({ ...c, office_address: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Office District</Label><Input readOnly={!editMode} value={form.office_district || ""} onChange={(e) => setForm((c) => ({ ...c, office_district: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Office Province</Label><Input readOnly={!editMode} value={form.office_province || ""} onChange={(e) => setForm((c) => ({ ...c, office_province: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Office Phone</Label><Input readOnly={!editMode} value={form.office_phone || ""} onChange={(e) => setForm((c) => ({ ...c, office_phone: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Office Email</Label><Input readOnly={!editMode} value={form.office_email || ""} onChange={(e) => setForm((c) => ({ ...c, office_email: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Office Fax</Label><Input readOnly={!editMode} value={form.office_fax || ""} onChange={(e) => setForm((c) => ({ ...c, office_fax: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Office Website</Label><Input readOnly={!editMode} value={form.office_website || ""} onChange={(e) => setForm((c) => ({ ...c, office_website: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Other Contact</p>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2"><Label>Contact Info 1 Address</Label><Textarea readOnly={!editMode} value={form.contact_info_1_address || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_1_address: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Contact Info 1 Phone</Label><Input readOnly={!editMode} value={form.contact_info_1_phone || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_1_phone: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Contact Info 1 Email</Label><Input readOnly={!editMode} value={form.contact_info_1_email || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_1_email: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2 sm:col-span-2"><Label>Contact Info 2 Address</Label><Textarea readOnly={!editMode} value={form.contact_info_2_address || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_2_address: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Contact Info 2 Phone</Label><Input readOnly={!editMode} value={form.contact_info_2_phone || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_2_phone: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                            <div className="space-y-2"><Label>Contact Info 2 Email</Label><Input readOnly={!editMode} value={form.contact_info_2_email || ""} onChange={(e) => setForm((c) => ({ ...c, contact_info_2_email: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Positions Held</p>
                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2"><Label>Positions Held</Label><Textarea readOnly={!editMode} value={form.positions_held || ""} onChange={(e) => setForm((c) => ({ ...c, positions_held: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">SLIA Awards</p>
                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2"><Label>SLIA Awards</Label><Textarea readOnly={!editMode} value={form.slia_awards || ""} onChange={(e) => setForm((c) => ({ ...c, slia_awards: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Other Awards</p>
                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2"><Label>Other Awards</Label><Textarea readOnly={!editMode} value={form.other_awards || ""} onChange={(e) => setForm((c) => ({ ...c, other_awards: e.target.value }))} className={!editMode ? "bg-muted/60" : ""} /></div>
                          </div>
                        </section>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                          <Button type="submit" className="w-full sm:w-auto" disabled={saving || !editMode}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                          </Button>
                          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setEditMode((current) => !current)}>
                            {editMode ? "Stop Editing" : "Edit Profile"}
                          </Button>
                        </div>
                      </form>
                  )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default MemberPortal;

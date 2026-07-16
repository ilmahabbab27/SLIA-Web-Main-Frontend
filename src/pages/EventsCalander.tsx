import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { publicCalendarEventApi, type PublicCalendarEventItem } from "@/lib/api";

type PublicCalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  created_at: string;
};

type EventForm = {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayIso = () => toDateInputValue(new Date());

const dateFromInputValue = (value: string) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const emptyEventForm = (): EventForm => ({
  title: "",
  date: todayIso(),
  time: "09:00",
  venue: "",
  description: "",
});

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);

const formatEventDate = (value: string) =>
  value
    ? new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(
        new Date(`${value}T00:00:00`)
      )
    : "";

const formatTime = (value: string) =>
  value
    ? new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(`2026-01-01T${value}`))
    : "";

const normalizeCalendarEvent = (item: PublicCalendarEventItem): PublicCalendarEvent => ({
  id: item.id,
  title: item.title || "",
  date: item.event_date || "",
  time: (item.event_time || "").slice(0, 5),
  venue: item.venue || "",
  description: item.description || "",
  created_at: item.created_at || "",
});

const buildCalendarPayload = (form: EventForm): Omit<PublicCalendarEventItem, "id" | "created_at" | "updated_at"> => ({
  title: form.title.trim(),
  event_date: form.date,
  event_time: form.time,
  venue: form.venue.trim(),
  description: form.description.trim(),
});

const EventsCalander = () => {
  const [events, setEvents] = useState<PublicCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm());
  const [editForm, setEditForm] = useState<EventForm>(emptyEventForm());
  const [editingEvent, setEditingEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    publicCalendarEventApi
      .list()
      .then((items) => setEvents(items.map(normalizeCalendarEvent)))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load calendar events."))
      .finally(() => setLoading(false));
  }, []);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || null,
    [events, selectedEventId]
  );

  const monthDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const start = new Date(year, month, 1 - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const iso = toDateInputValue(date);
      return {
        date,
        iso,
        inMonth: date.getMonth() === month,
        events: events
          .filter((event) => event.date === iso)
          .sort((a, b) => a.time.localeCompare(b.time)),
      };
    });
  }, [events, visibleMonth]);

  const pickDate = (date: string) => {
    if (!date) return;
    setSelectedDate(date);
    setEventForm((current) => ({ ...current, date }));
    setVisibleMonth(new Date(`${date}T00:00:00`));
  };

  const pickCalendarDate = (date?: Date) => {
    if (!date) return;
    pickDate(toDateInputValue(date));
    setDatePickerOpen(false);
  };

  const startAddingOnDate = (date: string) => {
    pickDate(date);
    setAddDialogOpen(true);
    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);
  };

  const addEvent = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!eventForm.title.trim()) {
      toast.error("Event title is required.");
      return;
    }
    if (!eventForm.date || !eventForm.time) {
      toast.error("Date and time are required.");
      return;
    }
    if (!eventForm.venue.trim()) {
      toast.error("Venue is required.");
      return;
    }

    setSaving(true);
    try {
      const created = await publicCalendarEventApi.create(buildCalendarPayload(eventForm));
      const newEvent = normalizeCalendarEvent(created);
      setEvents((current) => [...current, newEvent]);
      setVisibleMonth(new Date(`${newEvent.date}T00:00:00`));
      setSelectedDate(newEvent.date);
      setEventForm(emptyEventForm());
      setAddDialogOpen(false);
      toast.success("Event added to the calendar.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add event.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = () => {
    if (!selectedEvent) return;
    setEditForm({
      title: selectedEvent.title,
      date: selectedEvent.date,
      time: selectedEvent.time,
      venue: selectedEvent.venue,
      description: selectedEvent.description,
    });
    setEditingEvent(true);
  };

  const updateEvent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedEvent) return;

    if (!editForm.title.trim()) {
      toast.error("Event title is required.");
      return;
    }
    if (!editForm.date || !editForm.time) {
      toast.error("Date and time are required.");
      return;
    }
    if (!editForm.venue.trim()) {
      toast.error("Venue is required.");
      return;
    }

    setSaving(true);
    try {
      const updated = normalizeCalendarEvent(
        await publicCalendarEventApi.update(selectedEvent.id, buildCalendarPayload(editForm))
      );
      setEvents((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setVisibleMonth(new Date(`${updated.date}T00:00:00`));
      setSelectedDate(updated.date);
      setEditingEvent(false);
      toast.success("Event updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update event.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async () => {
    if (!selectedEvent || !confirm(`Delete ${selectedEvent.title}?`)) return;
    setDeleting(true);
    try {
      await publicCalendarEventApi.delete(selectedEvent.id);
      setEvents((current) => current.filter((item) => item.id !== selectedEvent.id));
      setSelectedEventId(null);
      setEditingEvent(false);
      toast.success("Event deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete event.");
    } finally {
      setDeleting(false);
    }
  };

  const changeMonth = (amount: number) => {
    setVisibleMonth((current) => {
      const nextMonth = new Date(current.getFullYear(), current.getMonth() + amount, 1);
      const nextDate = toDateInputValue(nextMonth);
      setSelectedDate(nextDate);
      setEventForm((form) => ({ ...form, date: nextDate }));
      return nextMonth;
    });
  };

  return (
    <div className="min-h-screen bg-background pt-28">
      <SiteHeader />
      <main className="pb-12">
        <div className="container">
          <div className="min-w-0 space-y-6">
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                SLIA Event Calendar
              </h1>
            </div>

            <div className="flex flex-col gap-4 border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center bg-green-600 text-white">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Calendar View</p>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">{formatMonth(visibleMonth)}</h2>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="space-y-1">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pick Date</Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="h-10 min-w-[190px] justify-start gap-2">
                        <CalendarDays className="h-4 w-4 text-green-700" />
                        {formatEventDate(selectedDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFromInputValue(selectedDate)}
                        onSelect={pickCalendarDate}
                        defaultMonth={dateFromInputValue(selectedDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => startAddingOnDate(selectedDate)}
                  className="gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Public Event
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => changeMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={() => pickDate(todayIso())}>
                  Today
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => changeMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-border bg-card shadow-sm">
              <div className="grid grid-cols-7 border-b border-border bg-muted/40">
                {weekdays.map((day) => (
                  <div key={day} className="px-2 py-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {loading ? (
                  <div className="col-span-7 py-20 text-center text-sm text-muted-foreground">
                    Loading calendar events...
                  </div>
                ) : monthDays.map((day) => (
                  <div
                    key={day.iso}
                    role="button"
                    tabIndex={0}
                    onClick={() => startAddingOnDate(day.iso)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") startAddingOnDate(day.iso);
                    }}
                    className={`min-h-[190px] border-b border-r border-border p-2 ${
                      day.inMonth ? "bg-background" : "bg-muted/20 text-muted-foreground"
                    } ${selectedDate === day.iso ? "ring-2 ring-inset ring-green-600" : ""} cursor-pointer`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`text-sm font-semibold ${day.iso === todayIso() ? "text-green-700" : ""}`}>
                        {day.date.getDate()}
                      </span>
                      {day.events.length > 0 ? (
                        <span className="text-[10px] font-bold text-green-700">{day.events.length}</span>
                      ) : null}
                    </div>
                    <div className="space-y-1">
                      {day.events.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventId(item.id);
                          }}
                          className="block w-full bg-green-600 px-2 py-1.5 text-left text-white transition hover:bg-green-700"
                        >
                          <span className="block text-[10px] font-bold uppercase tracking-wide text-white/80">
                            {formatTime(item.time)}
                          </span>
                          <span className="block whitespace-normal break-words text-[11px] font-semibold leading-snug">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block whitespace-normal break-words text-[10px] leading-snug text-white/85">
                            {item.venue}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Public Event</DialogTitle>
            <DialogDescription>{formatEventDate(eventForm.date)}</DialogDescription>
          </DialogHeader>

          <form onSubmit={addEvent} className="space-y-4">
            <div className="space-y-2">
              <Label>Event Title *</Label>
              <Input ref={titleInputRef} value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => {
                    setEventForm({ ...eventForm, date: e.target.value });
                    pickDate(e.target.value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Venue *</Label>
              <Input value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-green-600 text-white hover:bg-green-700">
              {saving ? "Saving..." : "Add Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedEvent)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEventId(null);
            setEditingEvent(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>{formatEventDate(selectedEvent.date)} at {formatTime(selectedEvent.time)}</DialogDescription>
              </DialogHeader>

              {editingEvent ? (
                <form onSubmit={updateEvent} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Title *</Label>
                    <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Time *</Label>
                      <Input type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Venue *</Label>
                    <Input value={editForm.venue} onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="submit" disabled={saving} className="bg-green-600 text-white hover:bg-green-700">
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingEvent(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-2 border border-border p-3 text-sm">
                      <Clock className="h-4 w-4 text-green-700" />
                      {formatTime(selectedEvent.time)}
                    </div>
                    <div className="flex items-center gap-2 border border-border p-3 text-sm sm:col-span-2">
                      <MapPin className="h-4 w-4 text-green-700" />
                      {selectedEvent.venue}
                    </div>
                  </div>

                  {selectedEvent.description ? (
                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedEvent.description}</p>
                  ) : null}

                  <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
                    <Button type="button" onClick={startEditing} className="gap-2 bg-green-600 text-white hover:bg-green-700">
                      <Pencil className="h-4 w-4" />
                      Edit Event
                    </Button>
                    <Button type="button" variant="outline" onClick={deleteEvent} disabled={deleting} className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      {deleting ? "Deleting..." : "Delete Event"}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsCalander;

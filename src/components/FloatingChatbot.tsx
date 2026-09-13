import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
  link?: { label: string; href: string };
};

const quickQuestions = [
  "How do I submit a complaint?",
  "How can I find an architect?",
  "Tell me about the boards",
];

const getBotReply = (input: string): Pick<ChatMessage, "text" | "link"> => {
  const question = input.toLowerCase();

  if (question.includes("complaint") || question.includes("inquiry") || question.includes("issue")) {
    return { text: "You can submit a complaint or inquiry at the Complaints page. Select a category, add your details, and attach supporting documents if needed.", link: { label: "Open Complaints page", href: "/complaints" } };
  }
  if (question.includes("find") && question.includes("architect")) {
    return { text: "Use Find an Architect to search registered SLIA members by name, location, or practice details.", link: { label: "Find an Architect", href: "/find-an-architect" } };
  }
  if (question.includes("member") || question.includes("membership") || question.includes("register")) {
    return { text: "For membership information, visit the Member Portal. The portal includes registration, login, and membership services.", link: { label: "Open Member Portal", href: "/member-portal" } };
  }
  if (question.includes("board") || question.includes("trustee") || question.includes("management") || question.includes("bae") || question.includes("pab") || question.includes("bap")) {
    return { text: "SLIA has the Board of Trustees, Board of Management, Board of Architectural Education, Professional Affairs Board, and Board of Architectural Publications. Visit Boards to explore them.", link: { label: "Explore SLIA Boards", href: "/boards" } };
  }
  if (question.includes("event") || question.includes("course") || question.includes("exam")) {
    return { text: "Visit News & Events for upcoming events, courses, examinations, and other SLIA announcements.", link: { label: "View News & Events", href: "/events" } };
  }
  if (question.includes("contact") || question.includes("phone") || question.includes("email")) {
    return { text: "Visit the Contact page for SLIA Secretariat contact details and board contact information.", link: { label: "Open Contact page", href: "/contact" } };
  }

  return { text: "I can help with SLIA boards, membership, finding an architect, complaints, events, examinations, and contact details. What would you like to know?", link: { label: "View all services", href: "/" } };
};

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "bot",
      text: "Hello. I am the SLIA assistant. How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event?: FormEvent, messageText = input) => {
    event?.preventDefault();
    const text = messageText.trim();
    if (!text) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", text },
      { id: Date.now() + 1, role: "bot", ...getBotReply(text) },
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-7 sm:right-7">
      {open && (
        <div className="mb-4 flex h-[min(620px,calc(100vh-110px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">SLIA Assistant</p>
                <p className="text-xs text-primary-foreground/70">Ask about SLIA services</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-muted/20 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-5 ${message.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border border-border bg-background text-foreground"}`}>
                  {message.text}
                  {message.link && (
                    <a href={message.link.href} className="mt-2 block font-semibold text-primary underline-offset-4 hover:underline">
                      {message.link.label} &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border bg-background p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(undefined, question)}
                  className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {question}
                </button>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                aria-label="Chat message"
                className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-muted/30 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button type="submit" aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:scale-105">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close SLIA assistant" : "Open SLIA assistant"}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/40"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default FloatingChatbot;

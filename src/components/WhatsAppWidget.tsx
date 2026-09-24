"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const WHATSAPP_NUMBER = "923164466335";
const WHATSAPP_GREEN = "#20b358";
const WHATSAPP_GREEN_BRIGHT = "#29cc5f";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const send = () => {
    const text = encodeURIComponent(
      message.trim().length > 0
        ? message
        : "Hi Audvertax! I'd like to know more about setting up a U.S. LLC.",
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-[22px] right-[22px] z-[9000] flex flex-col items-end gap-3.5">
      <div
        className="origin-bottom-right overflow-hidden rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] shadow-[var(--fm-shadow-overlay)] backdrop-blur-xl transition-all duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
        style={{
          width: "min(340px, calc(100vw - 32px))",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex items-center gap-3 border-b border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-4 pb-3.5 pt-4 text-[var(--fm-text-primary)]">
          <div className="relative grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
            <MessageCircle className="h-[22px] w-[22px]" />
            <span
              className="absolute -bottom-px -right-px h-[11px] w-[11px] rounded-full border-2 border-[var(--fm-surface-raised)]"
              style={{ background: WHATSAPP_GREEN_BRIGHT }}
            />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="font-display text-[15px] font-bold">Audvertax Support</p>
            <p className="mt-0.5 text-xs text-[var(--fm-text-tertiary)]">
              Typically replies in minutes
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setOpen(false)}
            className="grid h-[30px] w-[30px] flex-shrink-0 place-items-center rounded-full text-[var(--fm-text-tertiary)] transition-colors duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-high)] hover:text-[var(--fm-text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pb-1.5 pt-[18px] bg-[radial-gradient(circle_at_0_0,var(--fm-lime-soft),transparent_60%)]">
          <div className="relative rounded-tl-[4px] rounded-tr-[var(--fm-radius-md)] rounded-bl-[var(--fm-radius-md)] rounded-br-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3.5 py-3 text-sm leading-relaxed text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)]">
            <span className="mb-1 block font-display font-bold text-[var(--fm-lime-bright)]">
              Hi there! 👋
            </span>
            Got a question about U.S. LLC formation, EIN, or payments? Send us a message.
          </div>
        </div>
        <div className="flex items-end gap-2 px-3 pb-3 pt-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message…"
            rows={1}
            className="max-h-24 flex-1 resize-none rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-3 py-2.5 font-display text-sm text-[var(--fm-text-primary)] outline-none transition focus:border-[var(--fm-lime)] focus:shadow-[0_0_0_3px_var(--fm-lime-soft)]"
          />
          <button
            type="button"
            aria-label="Send message"
            onClick={send}
            className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-transparent text-[var(--fm-graphite-deep)] shadow-[var(--fm-shadow-subtle)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:scale-105"
            style={{
              background: `linear-gradient(150deg, ${WHATSAPP_GREEN_BRIGHT} 0%, ${WHATSAPP_GREEN} 100%)`,
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-[60px] w-[60px] place-items-center rounded-full border-none text-white shadow-[var(--fm-shadow-overlay)] transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] hover:scale-105 active:scale-95"
        style={{
          background: `linear-gradient(150deg, ${WHATSAPP_GREEN_BRIGHT} 0%, ${WHATSAPP_GREEN} 100%)`,
        }}
      >
        {!open && (
          <span
            className="absolute inset-0 -z-10 rounded-full"
            style={{
              background: "rgba(30,179,88,.55)",
              animation: "fabPulse 2.6s ease-out infinite",
            }}
          />
        )}
        <span className="relative grid h-7 w-7 place-items-center">
          <MessageCircle
            className="col-start-1 row-start-1 h-7 w-7 transition-all duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]"
            style={{
              opacity: open ? 0 : 1,
              transform: open ? "rotate(90deg) scale(0.6)" : "rotate(0) scale(1)",
            }}
          />
          <X
            className="col-start-1 row-start-1 h-7 w-7 transition-all duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "rotate(0) scale(1)" : "rotate(-90deg) scale(0.6)",
            }}
          />
        </span>
      </button>
    </div>
  );
}

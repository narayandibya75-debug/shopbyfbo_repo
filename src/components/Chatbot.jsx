import React, { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, ExternalLink, Leaf, MessageCircle, Send, ShoppingBag, Sparkles, X } from "lucide-react";
import { api, INR, productImage } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const QUICK_QUESTIONS = [
  "What products do you have?",
  "What is the price of Aloe Vera Gel?",
  "How much is delivery?",
  "How do I place an order?",
];

const initialMessage = {
  role: "assistant",
  content:
    "Hi! 👋 I'm the ShopVerse wellness assistant. I can help with products, prices, availability, ordering, payment and delivery. What can I help you with?",
};

export default function Chatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages, loading]);

  const sendMessage = async (text = message) => {
    const value = text.trim();
    if (!value || loading) return;

    const nextMessages = [...messages, { role: "user", content: value }];
    setMessages(nextMessages);
    setMessage("");
    setLoading(true);

    try {
      const history = nextMessages
        .slice(-12)
        .map((item) => ({ role: item.role, content: item.content }));

      const response = await api.post("/chat", {
        message: value,
        history,
      });

      const data = response?.data ?? response;
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "Sorry, I couldn't answer that right now.",
          products: data.products || [],
          order: data.order || null,
        },
      ]);
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            detail ||
            "I'm having trouble connecting right now. Please try again, or contact our support team for help.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[70] bg-black/20 sm:bg-transparent" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
        {open && (
          <div
            className="mb-3 flex h-[min(680px,calc(100vh-100px))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl sm:h-[650px]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-heading font-semibold">ShopVerse Assistant</div>
                <div className="text-xs opacity-80">Product & order help</div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-muted/20 p-3 sm:p-4">
              <div className="space-y-3">
                {messages.map((item, index) => (
                  <div key={`${index}-${item.role}`} className={item.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        item.role === "user"
                          ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground"
                          : "max-w-[90%] rounded-2xl rounded-bl-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm"
                      }
                    >
                      <div className="whitespace-pre-wrap leading-relaxed">{item.content}</div>

                      {item.order && (
                        <div className="mt-3 rounded-xl border border-border bg-muted/40 p-3 text-xs">
                          <div className="font-semibold">Order {item.order.order_id}</div>
                          <div className="mt-1 capitalize">Status: {String(item.order.status || "").replaceAll("_", " ")}</div>
                          {item.order.total != null && <div>Total: {INR(item.order.total)}</div>}
                        </div>
                      )}

                      {item.products?.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {item.products.map((product) => (
                            <a
                              key={product.product_id}
                              href={`/product/${product.product_id}`}
                              className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 transition hover:bg-muted"
                            >
                              <img
                                src={productImage(product.images)}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="line-clamp-2 text-xs font-medium">{product.name}</div>
                                <div className="mt-0.5 text-xs font-semibold text-primary">{INR(product.price)}</div>
                              </div>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md border border-border bg-background px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            {messages.length === 1 && (
              <div className="border-t border-border bg-background px-3 pt-3">
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      className="shrink-0 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs hover:bg-muted"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="border-t border-border bg-background p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/30 p-2 focus-within:ring-2 focus-within:ring-primary/20">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 2000))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      onSubmit(event);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about products, orders..."
                  className="max-h-24 min-h-9 flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                  disabled={loading}
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 text-center text-[10px] text-muted-foreground">
                AI assistant • Product information only, not medical advice
              </div>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:scale-105 hover:opacity-95 sm:h-16 sm:w-16"
          aria-label={open ? "Close ShopVerse chat" : "Open ShopVerse chat"}
        >
          {open ? <ChevronDown className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}

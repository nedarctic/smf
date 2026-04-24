"use client";

import React, { useTransition, useState, useEffect, useRef } from "react";
import { sendMessageAction } from "@/actions/message.actions";
import { useRouter } from "next/navigation";
import { Message } from "@/lib/generated/prisma/client";

export default function IncidentChat({
  incidentId,
  incidentName,
  senderId,
  initialMessages,
  senderType,
}: {
  incidentId: string;
  incidentName: string;
  senderId: string;
  initialMessages: Message[];
  senderType: "Handler" | "Reporter";
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{
    success?: boolean;
    error?: string;
  }>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [message, setMessage] = useState<string>("");

  const [chatMessages, setChatMessages] = useState(initialMessages);

  useEffect(() => {
    setChatMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) return;
    startTransition(async () => {

      try {
        await sendMessageAction(
          incidentId,
          senderId,
          message,
          senderType
        )

        setState({ success: true });
        setMessage("");
        router.refresh();
      } catch (error) {
        setState({
          error:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    });
  };

  return (
    <section className="flex flex-col gap-18 border border-gray-200 
    dark:border-zinc-800 rounded-2xl p-8 w-full">
      <header className="flex flex-col gap-4 w-full">
        <h2 className="text-black dark:text-white text-2xl font-light">
          Secure communication
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
          Use this space to provide additional information or respond to questions from investigators.
        </p>
      </header>

      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col w-full min-h-125 space-y-3">
          <h1 className="text-2xl">
            {incidentName} Chat Room
          </h1>

          <div
            ref={scrollRef}
            className="overflow-y-auto h-80 border-2 dark:border-white border-black rounded-lg p-3">

            <ul className="text-sm space-y-3 mt-2">
              {chatMessages.length === 0 && (
                <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground px-4">
                  No messages yet. Investigators may contact you here if more information is needed.
                </div>
              )}

              {chatMessages.map((msg) => {
                const isMine = msg.senderType === senderType;
                const messageDate = new Date(msg.createdAt);

                const hours = messageDate.getHours().toString().padStart(2, "0");
                const minutes = messageDate.getMinutes().toString().padStart(2, "0");

                const time = `${hours}:${minutes}`;

                return (
                  <li
                    key={msg.id}
                    className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-3 py-2 rounded-lg text-sm ${isMine
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-gray-200 text-black dark:bg-zinc-800 dark:text-white"
                        }`}
                    >
                      <div className="text-[10px] opacity-70 mb-1">
                        {msg.senderType}
                      </div>
                      <div>{msg.content}</div>
                      <div className="text-[10px] opacity-50 mt-1 text-right">
                        {time}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-2 w-full"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Enter message"
              className="px-4 py-2 rounded-md border-2 border-black dark:border-white w-full"
            />

            {state.error && (
              <p className="text-red-600 text-sm">{state.error}</p>
            )}

            <button
              type="submit"
              className="rounded-full px-4 py-2 font-semibold text-white bg-black dark:bg-white dark:text-black"
            >
              {isPending ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
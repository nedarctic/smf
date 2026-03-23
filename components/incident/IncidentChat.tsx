"use client";

import React, { useTransition, useState, useEffect } from "react";
import { sendMessageAction } from "@/actions/message.actions";
import { useRouter } from "next/navigation";
import { Message } from "@/lib/generated/prisma/client";

export default function IncidentChat({
  incidentId,
  incidentName,
  senderId,
  initialMessages,
}: {
  incidentId: string;
  incidentName: string;
  senderId: string;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const senderType = "Reporter";

  console.log("Incident ID at the chat component:", incidentId);
  console.log("Sender ID at the chat component:", senderId)
  console.log("Incident name at the chat component:", incidentName)
  
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{
    success?: boolean;
    error?: string;
  }>({});

  const [message, setMessage] = useState<string>("");

  const [chatMessages, setChatMessages] = useState(initialMessages);

  console.log("Initial messages:", initialMessages);

  useEffect(() => {
    setChatMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) return;

    console.log("Message inside submit handler", message)

    startTransition(async () => {
      try {
        await sendMessageAction(
          incidentId,
          senderId,
          message,
          senderType
        ).then(() => console.log("Message sent successfully"));

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
    <section className="flex flex-col gap-12 border border-gray-200 
    dark:border-zinc-800 rounded-2xl p-8 w-full">
      <header className="flex flex-col gap-4 w-full">
        <h2 className="text-black dark:text-white text-2xl font-light">
          Secure communication
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
          This space enables confidential communication between you and
          authorized handlers assigned to this incident.
        </p>
      </header>

      <div className="flex flex-col items-center w-full p-6">
        <div className="border-2 border-black dark:border-white rounded-xl 
        flex flex-col w-full min-h-125 p-8 space-y-3">
          <h1 className="text-2xl">
            {incidentName} Chat Room
          </h1>

          <div className="overflow-y-auto h-80 w-full">
            <ul className="text-sm space-y-2 mt-2">
              {chatMessages.map((msg) => (
                <li key={msg.id}>
                  <span className="bg-black text-white dark:bg-white dark:text-black 
                  text-xs px-2 py-1 rounded-sm mr-2">
                    {msg.senderType}
                  </span>
                  {msg.content}
                </li>
              ))}
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
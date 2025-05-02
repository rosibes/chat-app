"use client";

import { useEffect, useState, useRef } from "react";
import { Particles } from "./Particles";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string }[],
    id: string
}) {
    const [chats, setChats] = useState(messages);
    const [currentMessage, setCurrentMessage] = useState("");
    const { socket, loading } = useSocket();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (socket && !loading) {
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id,
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    setChats(c => [...c, { message: parsedData.message }]);
                }
            };
        }
        return () => {
            socket?.close();
        };
    }, [socket, loading, id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);


    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (currentMessage.trim() === "") return;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            setError("Connection lost. Please refresh and reconnect.");
            return;
        }

        socket.send(JSON.stringify({
            type: "chat",
            roomId: id,
            message: currentMessage
        }));

        setCurrentMessage("");
    };

    return (
        <div className="bg-black min-h-screen w-full h-full flex items-start justify-center pt-20 relative overflow-hidden">
            <Particles className="absolute inset-0 z-0" quantity={300} staticity={40} color="#ffffff" />

            <div className="relative z-10 flex flex-col h-[80vh] max-w-2xl w-full mx-auto p-4 border rounded-2xl shadow-md bg-white">
                {/* Afiseaza eroarea daca exista */}
                {error && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-xl mb-4 text-center">
                        {error}
                    </div>
                )}
                <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {chats.map((m, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-100 text-blue-800 p-3 rounded-xl max-w-[80%] shadow-sm animate-fadeIn"
                        >
                            {m.message}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-100"
                    />
                    <Button
                        type="submit"
                        text={socket?.readyState === WebSocket.CONNECTING ? <Spinner color="white" /> : "Send"}
                        color="purple"
                        size="lg"
                        className="px-6 py-2"
                    />
                </form>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";
import { useRouter } from "next/navigation";

function isTokenExpired(token: string): boolean {
    try {
        const payloadPart = token.split('.')[1];
        if (!payloadPart) {
            throw new Error("Invalid token format");
        }
        const payload = JSON.parse(atob(payloadPart));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
        return true;
    }
}

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
            localStorage.removeItem("token");
            router.push("/signin");
            setLoading(false);
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
            ws.close();
            setLoading(false);
        };

        ws.onclose = () => {
            console.log("WebSocket closed.");
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, [router]);

    return {
        socket,
        loading
    };
}

import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/token";

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

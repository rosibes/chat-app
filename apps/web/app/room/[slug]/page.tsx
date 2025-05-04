import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { notFound } from 'next/navigation';

interface RoomResponse {
    room: {
        id: string;
    };
}

async function getRoomId(slug: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/room/${slug}`);

        if (!response.ok) {
            if (response.status === 404) {
                return { id: null, error: "Room not found" };
            }
            throw new Error('Failed to fetch room');
        }

        const data: RoomResponse = await response.json();
        return { id: data.room.id, error: null };
    } catch (error) {
        return { id: null, error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}

// Utilizăm parametrul generic pentru a evita problemele de tip
export default async function Page({ params }: { params: Record<string, string> }) {
    const slug = params.slug;

    if (!slug) {
        notFound();
    }

    const { id, error } = await getRoomId(slug);

    if (error || !id) {
        notFound();
    }

    return <ChatRoom id={id} />;
}
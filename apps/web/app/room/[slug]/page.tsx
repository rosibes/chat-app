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
        const response = await fetch(`${BACKEND_URL}/room/${slug}`, {
            // cache: 'no-store' // Adaugă asta dacă vrei să eviti caching
        });

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

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function ChatRoomPage({ params }: PageProps) {
    const { id, error } = await getRoomId(params.slug);

    if (error || !id) {
        notFound();
    }

    return <ChatRoom id={id} />;
}
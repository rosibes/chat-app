import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

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

// Updated PageProps to match Next.js 15 expectations for async components
type PageProps = {
    params: { slug: string };
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function Page({ params }: PageProps) {
    const { slug } = params;

    if (!slug) {
        notFound();
    }

    const { id, error } = await getRoomId(slug);

    if (error || !id) {
        notFound();
    }

    return <ChatRoom id={id} />;
}
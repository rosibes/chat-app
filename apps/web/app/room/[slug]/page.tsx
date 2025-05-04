// app/room/[slug]/page.tsx
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { notFound } from 'next/navigation';

async function getRoomId(slug: string) {
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
        return { id: response.data.room.id, error: null };
    } catch (error: any) {
        if (error.response?.status === 404) {
            return { id: null, error: "Room not found" };
        }
        return { id: null, error: error.response?.data?.error || "Unknown error occurred" };
    }
}

type PageProps = {
    params: {
        slug: string;
    };
};

export default async function ChatRoom1({ params }: PageProps) {
    const slug = params.slug;
    const { id, error } = await getRoomId(slug);

    if (error || !id) {
        notFound();
    }

    return <ChatRoom id={id} />
}
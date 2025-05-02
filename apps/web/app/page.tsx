"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "./config";
import { Spinner } from "../components/Spinner";
import toast from "react-hot-toast"
import { Particles } from "../components/Particles";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Input } from "../components/Input";
import { join } from "path";

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter()

  const checkAuthAndProceed = (action: () => void) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("You need to be logged in to perform this action!")
      setTimeout(() => router.push('/signin'), 1500)
    } else {
      action()
    }
  }


  const createRoom = async () => {
    checkAuthAndProceed(async () => {
      if (!roomName.trim()) {
        toast.error("Please enter a Room Name!")
        return
      }

      if (roomName.length < 3) {
        toast.error("Password should be at least 3 characters.");
        return;
      }

      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await axios.post(`${BACKEND_URL}/room`,
          { name: roomName.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success(`Room "${response.data.slug}" created successfully!`)
        router.push(`/room/${response.data.slug}`)
      } catch (err) {
        console.error("Failed to create room:", err)
        toast.error('Failed to create room. Please try again.')
      } finally {
        setLoading(false)
      }
    })
  }


  const joinRoom = () => {
    checkAuthAndProceed(() => {
      if (!roomId.trim()) {
        toast.error("Please enter a Room Name!")
        return
      }
      router.push(`/room/${roomId}`)
    })
  }


  return (
    <div className="min-h-screen w-full h-full flex flex-col justify-center items-center bg-slate-950 relative overflow-hidden">
      {/* Particulele - fundal */}
      <div className="absolute inset-0 z-0">
        <Particles quantity={300} />
      </div>

      {/* Form-ul - deasupra particulelor */}
      <div className="z-10 flex flex-col items-center w-full max-w-md">
        {/* Titlu */}
        <Heading label="Chat App" align="center" className="text-white mb-8" style="bold" />

        <div className="mb-4 flex w-full  justify-center items-center">
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            type="text"
            placeholder="Room Name"
          />
          <Button
            onClick={createRoom}
            text={loading ? <Spinner color="white" /> : "Create Room"}
            color="purple"
            size="sm"
            className="ml-2 h-10"
          />

        </div>

        {/* Join a Room Text */}
        {!showJoinRoom && (
          <button
            onClick={() => setShowJoinRoom(true)}
            className="text-white underline z-10 mb-4 mr-70"
          >
            Join a Room
          </button>
        )}

        {showJoinRoom && (
          <div className="mb-4 flex w-full justify-center items-center">
            <Input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              type="text"
              placeholder="Room Name"
            />

            <Button
              onClick={joinRoom}
              text="Join a Room"
              size="sm"
              color="purple"
              className="ml-2 h-10"
            />

          </div>
        )}
      </div>

    </div>
  );
}  
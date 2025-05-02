"use client"
import { useRef, useState } from "react";
import { Button } from "../../components/Button";
import { Heading } from "../../components/Heading";
import { Input } from "../../components/Input";
import { Particles } from "../../components/Particles";
import { Spinner } from "../../components/Spinner";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BottomWarning } from "../../components/BottomWarning";

export default function Signin() {
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter()

    async function signin() {
        const username = usernameRef.current?.value?.trim() || "";
        const password = passwordRef.current?.value || "";

        if (!username || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!username.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${BACKEND_URL}/signin`, {
                username,
                password
            })

            const jwt = response.data.token
            if (typeof window !== "undefined") {
                localStorage.setItem("token", jwt);
            }

            toast.success("Signed in successfully!");
            router.push("/");
        } catch (err: any) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-slate-800 min-h-screen flex items-center justify-center relative overflow-hidden">
            <Particles className="absolute inset-0 z-0" quantity={150} staticity={40} color="#ffffff" />
            <div className="w-100 p-8 flex flex-col gap-4 bg-slate-200 rounded-lg shadow-lg relative z-10">
                <Heading style="bold" size="5xl" label="Sign In" align="center" className="text-purple-800" />
                <Input reference={usernameRef} type="text" placeholder="petterdoth@example.com" label="Email" />
                <Input reference={passwordRef} type="password" placeholder="********" label="Password" />
                <Button
                    onClick={signin}
                    text={loading ? <Spinner color="white" /> : "Sign In"}
                    color="green"
                    size="lg"
                    align="center"
                    className="mt-2"
                />
                <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
            </div>
        </div>
    );
}
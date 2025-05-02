"use client";

import { useRef, useState } from "react";
import { Heading } from "../../components/Heading";
import { Input } from "../../components/Input";
import { Particles } from "../../components/Particles";
import { Button } from "../../components/Button";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner } from "../../components/Spinner";
import toast from "react-hot-toast";
import { BottomWarning } from "../../components/BottomWarning";

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const fullNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const repeatPasswordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    async function signup() {
        const username = usernameRef.current?.value?.trim() || "";
        const fullName = fullNameRef.current?.value?.trim() || "";
        const password = passwordRef.current?.value || "";
        const repeatPassword = repeatPasswordRef.current?.value || "";

        // Validare client-side
        if (!username || !fullName || !password || !repeatPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!username.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (password !== repeatPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password should be at least 6 characters.");
            return;
        }

        if (username.length < 6 || username.length > 20) {
            toast.error("Username should be at least 3 characters.");
            return;
        }

        if (fullName.length < 6) {
            toast.error("Full Name should be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${BACKEND_URL}/signup`, {
                username,
                password,
                name: fullName,
            });

            toast.success("Account created successfully!");
            router.push("/signin");
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
                <Heading style="bold" size="5xl" label="Sign Up" align="center" className="text-purple-800" />
                <Input reference={fullNameRef} type="text" placeholder="Petter Doth" label="Full Name" />
                <Input reference={usernameRef} type="text" placeholder="petterdoth@example.com" label="Email" />
                <Input reference={passwordRef} type="password" placeholder="********" label="Password" />
                <Input reference={repeatPasswordRef} type="password" placeholder="********" label="Repeat Password" />
                <Button
                    onClick={signup}
                    text={loading ? <Spinner color="white" /> : "Sign Up"}
                    color="green"
                    size="lg"
                    align="center"
                    className="mt-2"
                />
                <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />

            </div>
        </div>
    );
}

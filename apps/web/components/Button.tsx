"use client";

import { ReactNode } from "react";

type ButtonProps = {
    text: ReactNode;

    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    color?: "white" | "black" | "red" | "green" | "purple";
    size?: "sm" | "md" | "lg" | "full";
    align?: "left" | "center" | "right"
};

const colorStyles: Record<string, string> = {
    white: "bg-neutral-100 text-black border-[#393994] shadow-[3px_3px_#393994]",
    black: "bg-black text-white border-black shadow-[3px_3px_#000]",
    red: "bg-red-600 text-white border-red-800 shadow-[3px_3px_#7f1d1d]",
    green: "bg-green-600 text-white border-green-800 shadow-[3px_3px_#14532d]",
    purple: "bg-purple-600 text-white border-purple-800 shadow-[3px_3px_#4c1d95]", // 🔥 adăugat
};

const sizeStyles: Record<string, string> = {
    sm: "text-sm px-8 py-1 w-fit",
    md: "text-base px-12 py-2 w-fit",
    lg: "text-lg px-16 py-2 w-fit",
    full: "w-full text-base px-17 py-2",
};

const alignStyles: Record<string, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
};
export const Button = ({ text, onClick, type = "button", className = "", color = "white", size = "md", align = "center" }: ButtonProps) => {
    return (
        <div className={`flex ${alignStyles[align]}`}>
            <button
                type={type}
                onClick={onClick}
                className={`rounded-md border-2 outline-none focus:border-[3px] focus:shadow-none 
                    ${colorStyles[color]} ${sizeStyles[size]} ${className}`}
            >
                {text}
            </button>
        </div>
    );
};

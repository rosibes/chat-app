"use client";

import React, { useEffect, useRef, useState } from "react";

interface ParticlesProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    size?: number;
    refresh?: boolean;
    color?: string;
    vx?: number;
    vy?: number;
}

interface MousePosition {
    x: number;
    y: number;
}

const useMousePosition = (): MousePosition => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return mousePosition;
};

const hexToRgb = (hex: string): number[] => {
    hex = hex.replace("#", "");
    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
};

export const Particles: React.FC<ParticlesProps> = ({
    className = "",
    quantity = 100,
    staticity = 50,
    ease = 50,
    size = 0.4,
    refresh = false,
    color,
    vx = 0,
    vy = 0,
}) => {
    const [particleColor, setParticleColor] = useState<string>("#ffffff");
    const mousePosition = useMousePosition();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<any[]>([]);
    const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const theme = localStorage.getItem("theme");
            const initialColor = color ? color : theme === "light" ? "#000000" : "#ffffff";
            setParticleColor(initialColor);
        }
    }, [color]);

    useEffect(() => {
        resizeCanvas();
        drawParticles();
        animate();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [refresh, particleColor]);

    useEffect(() => {
        if (canvasRef.current) {
            context.current = canvasRef.current.getContext("2d");
        }
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            onMouseMove();
        }
    }, [mousePosition]);

    const resizeCanvas = () => {
        if (canvasContainerRef.current && canvasRef.current && context.current) {
            circles.current.length = 0;
            canvasSize.current.w = canvasContainerRef.current.offsetWidth;
            canvasSize.current.h = canvasContainerRef.current.offsetHeight;
            canvasRef.current.width = canvasSize.current.w * dpr;
            canvasRef.current.height = canvasSize.current.h * dpr;
            canvasRef.current.style.width = `${canvasSize.current.w}px`;
            canvasRef.current.style.height = `${canvasSize.current.h}px`;

            context.current.setTransform(1, 0, 0, 1, 0, 0); // reset
            context.current.scale(dpr, dpr);
        }
    };

    const onMouseMove = () => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = mousePosition.x - rect.left - w / 2;
            const y = mousePosition.y - rect.top - h / 2;
            const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
            if (inside) {
                mouse.current.x = x;
                mouse.current.y = y;
            }
        }
    };

    type Circle = {
        x: number;
        y: number;
        translateX: number;
        translateY: number;
        size: number;
        alpha: number;
        targetAlpha: number;
        dx: number;
        dy: number;
        magnetism: number;
    };

    const circleParams = (): Circle => {
        const x = Math.random() * canvasSize.current.w;
        const y = Math.random() * canvasSize.current.h;
        const pSize = Math.random() * 2 + size;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.1;
        const dy = (Math.random() - 0.5) * 0.1;
        const magnetism = 0.1 + Math.random() * 4;

        return {
            x,
            y,
            translateX: 0,
            translateY: 0,
            size: pSize,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    };

    const clearContext = () => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        }
    };

    const drawCircle = (circle: Circle, update = false) => {
        if (context.current) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            const rgbColor = hexToRgb(particleColor);

            context.current.translate(translateX, translateY);
            context.current.beginPath();
            context.current.arc(x, y, size, 0, 2 * Math.PI);
            context.current.fillStyle = `rgba(${rgbColor.join(",")},${alpha})`;
            context.current.fill();
            context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!update) {
                circles.current.push(circle);
            }
        }
    };

    const drawParticles = () => {
        clearContext();
        for (let i = 0; i < quantity; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    };

    const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number,
    ): number => {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    const animate = () => {
        clearContext();
        circles.current.forEach((circle: Circle, index: number) => {
            const edge = [
                circle.x + circle.translateX - circle.size,
                canvasSize.current.w - circle.x - circle.translateX - circle.size,
                circle.y + circle.translateY - circle.size,
                canvasSize.current.h - circle.y - circle.translateY - circle.size,
            ];
            const closestEdge = Math.min(...edge);
            const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }

            circle.x += circle.dx + vx;
            circle.y += circle.dy + vy;

            circle.translateX += (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
            circle.translateY += (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

            drawCircle(circle, true);

            if (
                circle.x < -circle.size ||
                circle.x > canvasSize.current.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > canvasSize.current.h + circle.size
            ) {
                circles.current.splice(index, 1);
                const newCircle = circleParams();
                drawCircle(newCircle);
            }
        });

        window.requestAnimationFrame(animate);
    };

    return (
        <div className={className} ref={canvasContainerRef} aria-hidden="true">
            <canvas ref={canvasRef} className="h-full w-full" />
        </div>
    );
};

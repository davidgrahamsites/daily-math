import { useEffect, useRef } from 'react';

interface ConfettiProps {
    active: boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: 'rect' | 'circle';
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export const Confetti = ({ active }: ConfettiProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const particles = useRef<Particle[]>([]);

    useEffect(() => {
        if (!active) {
            cancelAnimationFrame(animRef.current);
            particles.current = [];
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Spawn particles
        particles.current = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: -10 - Math.random() * 100,
            vx: (Math.random() - 0.5) * 4,
            vy: 2 + Math.random() * 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 6 + Math.random() * 8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        }));

        const ctx = canvas.getContext('2d')!;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current = particles.current.filter(p => p.opacity > 0.05);

            for (const p of particles.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.12; // gravity
                p.rotation += p.rotationSpeed;
                // Fade out as they approach bottom
                if (p.y > canvas.height * 0.7) {
                    p.opacity -= 0.03;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            if (particles.current.length > 0) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [active]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[200]"
            style={{ display: active ? 'block' : 'none' }}
        />
    );
};

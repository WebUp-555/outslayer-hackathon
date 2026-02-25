import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
	const canvasRef = useRef(null);
	const elementsRef = useRef([]);
	const mouseRef = useRef({ x: 0, y: 0 });
	const animationFrameRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		const setCanvasSize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		setCanvasSize();
		window.addEventListener('resize', setCanvasSize);

		// Educational elements setup
		const types = ['atom', 'robot', 'rocket', 'gear', 'book', 'planet', 'satellite', 'lightbulb', 'code', 'dna'];
		const colors = ['#FF6B9D', '#64B5F6', '#81C784', '#FFD54F', '#FFB74D', '#BA68C8', '#4FC3F7', '#A1887F'];

		// Initialize elements
		elementsRef.current = Array.from({ length: 15 }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			vx: (Math.random() - 0.5) * 1.5,
			vy: (Math.random() - 0.5) * 1.5,
			radius: Math.random() * 20 + 15,
			type: types[Math.floor(Math.random() * types.length)],
			color: colors[Math.floor(Math.random() * colors.length)],
			rotation: Math.random() * Math.PI * 2,
			rotationSpeed: (Math.random() - 0.5) * 0.05,
			glowIntensity: 0,
			targetGlowIntensity: 0,
		}));

		const drawElement = (element) => {
			ctx.save();
			ctx.translate(element.x, element.y);
			ctx.rotate(element.rotation);

			if (element.glowIntensity > 0) {
				ctx.shadowBlur = element.glowIntensity * 20;
				ctx.shadowColor = element.color;
			}

			ctx.fillStyle = element.color;
			ctx.strokeStyle = element.color;
			ctx.lineWidth = 2;

			switch (element.type) {
				case 'atom':
					ctx.beginPath();
					ctx.arc(0, 0, element.radius * 0.4, 0, Math.PI * 2);
					ctx.fill();
					for (let i = 0; i < 3; i++) {
						ctx.beginPath();
						ctx.ellipse(0, 0, element.radius * 0.8, element.radius * 0.2, (Math.PI / 3) * i, 0, Math.PI * 2);
						ctx.stroke();
					}
					break;
				case 'robot':
					ctx.fillRect(-element.radius * 0.5, -element.radius * 0.6, element.radius, element.radius * 1.2);
					ctx.fillStyle = '#FFF';
					ctx.fillRect(-element.radius * 0.3, -element.radius * 0.4, element.radius * 0.25, element.radius * 0.25);
					ctx.fillRect(element.radius * 0.05, -element.radius * 0.4, element.radius * 0.25, element.radius * 0.25);
					break;
				case 'rocket':
					ctx.beginPath();
					ctx.moveTo(0, -element.radius * 0.7);
					ctx.lineTo(element.radius * 0.4, element.radius * 0.5);
					ctx.lineTo(0, element.radius * 0.3);
					ctx.lineTo(-element.radius * 0.4, element.radius * 0.5);
					ctx.closePath();
					ctx.fill();
					break;
				case 'gear':
					ctx.beginPath();
					ctx.arc(0, 0, element.radius * 0.6, 0, Math.PI * 2);
					ctx.stroke();
					for (let i = 0; i < 8; i++) {
						const angle = (Math.PI / 4) * i;
						ctx.save();
						ctx.rotate(angle);
						ctx.fillRect(-element.radius * 0.15, element.radius * 0.5, element.radius * 0.3, element.radius * 0.25);
						ctx.restore();
					}
					break;
				case 'book':
					ctx.fillRect(-element.radius * 0.3, -element.radius * 0.4, element.radius * 0.6, element.radius * 0.8);
					ctx.strokeStyle = '#FFF';
					ctx.lineWidth = 1;
					for (let i = 0; i < 3; i++) {
						ctx.beginPath();
						ctx.moveTo(-element.radius * 0.25, -element.radius * 0.2 + i * element.radius * 0.2);
						ctx.lineTo(element.radius * 0.25, -element.radius * 0.2 + i * element.radius * 0.2);
						ctx.stroke();
					}
					break;
				case 'planet':
					ctx.beginPath();
					ctx.arc(0, 0, element.radius * 0.6, 0, Math.PI * 2);
					ctx.fill();
					ctx.strokeStyle = element.color;
					ctx.beginPath();
					ctx.ellipse(0, 0, element.radius * 0.8, element.radius * 0.3, 0, 0, Math.PI * 2);
					ctx.stroke();
					break;
				case 'lightbulb':
					ctx.beginPath();
					ctx.arc(0, -element.radius * 0.3, element.radius * 0.3, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillRect(-element.radius * 0.2, 0, element.radius * 0.4, element.radius * 0.4);
					ctx.fillRect(-element.radius * 0.25, element.radius * 0.3, element.radius * 0.5, element.radius * 0.15);
					break;
				case 'dna':
					for (let i = 0; i < 2; i++) {
						ctx.beginPath();
						for (let t = -Math.PI; t < Math.PI; t += 0.1) {
							const px = Math.cos(t) * element.radius * 0.3;
							const py = t * element.radius * 0.2;
							if (t === -Math.PI) ctx.moveTo(px + (i % 2) * element.radius * 0.6, py);
							else ctx.lineTo(px + (i % 2) * element.radius * 0.6, py);
						}
						ctx.stroke();
					}
					break;
				case 'code':
					ctx.font = `${element.radius}px monospace`;
					ctx.fillText('<>', -element.radius * 0.3, element.radius * 0.3);
					break;
				default:
					ctx.beginPath();
					ctx.arc(0, 0, element.radius * 0.5, 0, Math.PI * 2);
					ctx.fill();
			}

			ctx.restore();
		};

		const handleMouseMove = (e) => {
			const rect = canvas.getBoundingClientRect();
			mouseRef.current = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			};
		};

		const animate = () => {
			// Clear with fade effect
			ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update and draw elements
			const elements = elementsRef.current;
			elements.forEach((el) => {
				// Mouse interaction
				const dx = mouseRef.current.x - el.x;
				const dy = mouseRef.current.y - el.y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				const interactionRadius = 150;

				if (distance < interactionRadius && distance > 0) {
					el.targetGlowIntensity = 1;
					const force = (interactionRadius - distance) / interactionRadius;
					el.vx -= (dx / distance) * force * 0.5;
					el.vy -= (dy / distance) * force * 0.5;
				} else {
					el.targetGlowIntensity = 0;
				}

				// Smooth glow transition
				el.glowIntensity += (el.targetGlowIntensity - el.glowIntensity) * 0.1;

				// Physics
				el.x += el.vx;
				el.y += el.vy;
				el.vx *= 0.99;
				el.vy *= 0.99;
				el.rotation += el.rotationSpeed;

				// Drift motion
				el.vy += Math.sin(Date.now() * 0.001 + el.y) * 0.1;

				// Wrap around edges
				if (el.x < -el.radius) el.x = canvas.width + el.radius;
				if (el.x > canvas.width + el.radius) el.x = -el.radius;
				if (el.y < -el.radius) el.y = canvas.height + el.radius;
				if (el.y > canvas.height + el.radius) el.y = -el.radius;

				drawElement(el);
			});

			animationFrameRef.current = requestAnimationFrame(animate);
		};

		canvas.addEventListener('mousemove', handleMouseMove);
		animationFrameRef.current = requestAnimationFrame(animate);

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('resize', setCanvasSize);
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			width={typeof window !== 'undefined' ? window.innerWidth : 1200}
			height={typeof window !== 'undefined' ? window.innerHeight : 800}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
				zIndex: 0,
				pointerEvents: 'none',
			}}
		/>
	);
};

export default InteractiveBackground;

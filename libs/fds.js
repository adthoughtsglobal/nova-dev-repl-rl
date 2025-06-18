export default class AudioVisualizer {
    constructor(canvas, analyser, getAudioData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.getAudioData = getAudioData;
        this.particles = [];
        this.maxParticles = 200;
        this.spawnCooldown = 0;
    this.flows = [];
    this.flowTimer = 0;
        this.resize();
    }

    resize() {
        this.width = this.canvas.width = this.canvas.clientWidth;
        this.height = this.canvas.height = this.canvas.clientHeight;
    }

    spawnBurst(strength) {
        const count = Math.floor(3 + (strength / 255) * 7);
        for (let i = 0; i < count; i++) {
            const hue = Math.floor((strength / 255) * 200 + 100);
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: 6,
                life: 1,
                color: `hsl(${hue}, 100%, 60%)`
            });
        }
    }

    spawnFlow(totalEnergy) {
        const angle = Math.random() * Math.PI * 2;
        const strength = (totalEnergy / 255) * 0.2;
        this.flows.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            radius: 120 + Math.random() * 100,
            direction: { x: Math.cos(angle), y: Math.sin(angle) },
            strength: strength,
            life: 400 + Math.floor(Math.random() * 200)
        });
    }

    update() {
        const { bassEnergy, totalEnergy } = this.getAudioData();
        const beatThreshold = 160;
        const beat = bassEnergy > beatThreshold;

        if (beat && this.spawnCooldown <= 0) {
            this.spawnBurst(bassEnergy);
            this.spawnCooldown = 5;
        } else {
            this.spawnCooldown--;
        }
        this.flowTimer--;
        if (this.flowTimer <= 0) {
            this.spawnFlow(totalEnergy);
            this.flowTimer = 120 + Math.floor(Math.random() * 200);
        }

        for (let flow of this.flows) flow.life--;
        this.flows = this.flows.filter(f => f.life > 0);

        for (let i = 0; i < this.particles.length; i++) {
            const a = this.particles[i];

            for (const flow of this.flows) {
                const dx = a.x - flow.x;
                const dy = a.y - flow.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < flow.radius) {
                    const influence = 1 - dist / flow.radius;
                    a.vx += flow.direction.x * flow.strength * influence;
                    a.vy += flow.direction.y * flow.strength * influence;
                }
            }

            for (let j = 0; j < this.particles.length; j++) {
                if (i === j) continue;
                const b = this.particles[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distSq = dx * dx + dy * dy || 0.001;
                const dist = Math.sqrt(distSq);
                const desiredDist = a.radius + b.radius + 10;
                const force = dist < desiredDist ? 1 / distSq : 0.002 / distSq;

                const fx = dx * force;
                const fy = dy * force;

                a.vx -= fx;
                a.vy -= fy;
            }

            a.vx *= 0.96;
            a.vy *= 0.96;
            a.x += a.vx;
            a.y += a.vy;

            if (a.x - a.radius < 0) {
                a.x = a.radius;
                a.vx *= -1;
            }
            if (a.x + a.radius > this.width) {
                a.x = this.width - a.radius;
                a.vx *= -1;
            }
            if (a.y - a.radius < 0) {
                a.y = a.radius;
                a.vy *= -1;
            }
            if (a.y + a.radius > this.height) {
                a.y = this.height - a.radius;
                a.vy *= -1;
            }

            const maxSpeed = 2;
            const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
            if (speed > maxSpeed) {
                const scale = maxSpeed / speed;
                a.vx *= scale;
                a.vy *= scale;
            }


            a.life -= 0.003;
        }

        this.particles = this.particles.filter(p => p.life > 0);
        if (this.particles.length > this.maxParticles) {
            this.particles.splice(0, this.particles.length - this.maxParticles);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        for (const p of this.particles) {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
        this.ctx.globalAlpha = 1;
    }
}

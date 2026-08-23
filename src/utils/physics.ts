// Lightweight, fluid 2D physics & particle simulation for kid-friendly bouncy objects

export interface PhysicsEntity {
  id: string;
  type: 'letter' | 'number' | 'bubble' | 'star' | 'gift' | 'special';
  symbol: string; // Big Letter or Number
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  scale: number;
  targetScale: number;
  bounceCount: number;
  createdAt: number;
  lifespan: number; // in ms
  isDraggable: boolean;
  isBeingDragged?: boolean;
}

export interface SparkleParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  emoji?: string;
  life: number;
  maxLife: number;
}

export class PhysicsWorld {
  public entities: PhysicsEntity[] = [];
  public particles: SparkleParticle[] = [];
  public width: number = typeof window !== 'undefined' ? window.innerWidth : 800;
  public height: number = typeof window !== 'undefined' ? window.innerHeight : 600;
  public gravity: number = 0.45;
  public bounceDamping: number = 0.72;
  public isZeroGravity: boolean = false;

  constructor(
    width: number = typeof window !== 'undefined' ? window.innerWidth : 800,
    height: number = typeof window !== 'undefined' ? window.innerHeight : 600
  ) {
    this.updateDimensions(width, height);
  }

  public updateDimensions(width?: number, height?: number) {
    this.width = width ?? (typeof window !== 'undefined' ? window.innerWidth : 800);
    this.height = height ?? (typeof window !== 'undefined' ? window.innerHeight : 600);
  }

  public addEntity(
    entity: Omit<PhysicsEntity, 'id' | 'createdAt' | 'bounceCount' | 'isDraggable' | 'vRot'> & {
      id?: string;
    }
  ): PhysicsEntity {
    // Limit total entities to 14 to keep canvas 100% fluid 60FPS
    if (this.entities.length >= 14) {
      this.entities.shift();
    }

    const fullEntity: PhysicsEntity = {
      id: entity.id || `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
      bounceCount: 0,
      isDraggable: true,
      vRot: (Math.random() - 0.5) * 4,
      ...entity
    };

    this.entities.push(fullEntity);
    this.createSpawnExplosion(fullEntity.x, fullEntity.y, fullEntity.color, fullEntity.emoji);
    return fullEntity;
  }

  public createSpawnExplosion(x: number, y: number, color: string, emoji?: string) {
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        id: `p-${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color,
        size: Math.random() * 6 + 5,
        opacity: 1,
        emoji: Math.random() > 0.6 ? emoji || '✨' : undefined,
        life: 0,
        maxLife: Math.random() * 25 + 25
      });
    }
  }

  public triggerSuperConfettiParty() {
    const x = this.width / 2;
    const y = this.height * 0.7;
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'];
    const emojis = ['✨', '⭐', '🎈', '🍭', '💖', '🎉', '🌟'];

    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 5;
      this.particles.push({
        id: `sp-${Date.now()}-${i}`,
        x: x + (Math.random() - 0.5) * 200,
        y: y + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        color: colors[i % colors.length],
        size: Math.random() * 10 + 6,
        opacity: 1,
        emoji: emojis[i % emojis.length],
        life: 0,
        maxLife: Math.random() * 40 + 40
      });
    }

    // Launch all active entities upward
    this.entities.forEach((ent) => {
      ent.vy = -(Math.random() * 12 + 8);
      ent.vx = (Math.random() - 0.5) * 12;
      ent.vRot = (Math.random() - 0.5) * 8;
    });
  }

  public clearEntities() {
    this.entities = [];
  }

  public update() {
    const effectiveGravity = this.isZeroGravity ? -0.1 : this.gravity;
    const groundY = this.height - 180; // Above virtual keyboard area

    // Update Entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];

      if (e.isBeingDragged) {
        continue;
      }

      // Scale transition
      if (e.scale < e.targetScale) {
        e.scale += (e.targetScale - e.scale) * 0.2;
      }

      // Check if entity is already resting on ground
      const onFloor = e.y + e.radius >= groundY - 0.5;

      if (onFloor && Math.abs(e.vy) < 0.6) {
        // Firmly rested: zero out forces to stop any micro-jitter
        e.y = groundY - e.radius;
        e.vy = 0;
        e.vx *= 0.75;
        if (Math.abs(e.vx) < 0.05) e.vx = 0;
        e.vRot = 0;
        e.rotation = 0;
      } else {
        // Airborne physics integration
        e.vy += effectiveGravity;
        e.x += e.vx;
        e.y += e.vy;

        // Auto-righting upright rotation
        e.rotation += e.vRot;
        e.vRot *= 0.9;
        e.rotation += (0 - e.rotation) * 0.12;
        e.vx *= 0.98; // Air resistance

        // Floor collision
        if (e.y + e.radius >= groundY) {
          e.y = groundY - e.radius;
          e.vy = -e.vy * this.bounceDamping;
          e.vx *= 0.8;
          e.bounceCount++;
          if (Math.abs(e.vy) < 0.8) {
            e.vy = 0;
            e.vRot = 0;
            e.rotation = 0;
          }
        }
      }

      // Ceiling collision
      if (e.y - e.radius < 60) {
        e.y = 60 + e.radius;
        e.vy = Math.abs(e.vy) * 0.7;
      }

      // Wall collision
      if (e.x - e.radius < 20) {
        e.x = 20 + e.radius;
        e.vx = Math.abs(e.vx) * this.bounceDamping;
      } else if (e.x + e.radius > this.width - 20) {
        e.x = this.width - 20 - e.radius;
        e.vx = -Math.abs(e.vx) * this.bounceDamping;
      }

      // Lifespan decay (callers pass 20000ms)
      if (Date.now() - e.createdAt > e.lifespan) {
        this.entities.splice(i, 1);
      }
    }

    // Update Sparkle Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // Slight gravity for sparkles
      p.vx *= 0.96;
      p.opacity = 1 - p.life / p.maxLife;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }
}

import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsWorld } from './physics';

describe('PhysicsWorld', () => {
  let world: PhysicsWorld;

  beforeEach(() => {
    world = new PhysicsWorld();
  });

  it('should initialize with default dimensions and empty entities', () => {
    expect(world.entities).toEqual([]);
    expect(world.particles).toEqual([]);
    expect(world.width).toBeGreaterThan(0);
    expect(world.height).toBeGreaterThan(0);
  });

  it('should update dimensions explicitly without needing window listener in constructor', () => {
    world.updateDimensions(1024, 768);
    expect(world.width).toBe(1024);
    expect(world.height).toBe(768);
  });

  it('should add entity and cap at max limit (14 entities)', () => {
    for (let i = 0; i < 20; i++) {
      world.addEntity({
        type: 'letter',
        symbol: String.fromCharCode(65 + (i % 26)),
        emoji: '🍎',
        title: 'Title',
        subtitle: 'Subtitle',
        color: '#EF4444',
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        radius: 40,
        rotation: 0,
        scale: 1,
        targetScale: 1,
        lifespan: 10000
      });
    }

    expect(world.entities.length).toBeLessThanOrEqual(14);
  });

  it('should clear entities when requested', () => {
    world.addEntity({
      type: 'letter',
      symbol: 'A',
      emoji: '🍎',
      title: 'Apple',
      subtitle: '苹果',
      color: '#EF4444',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 40,
      rotation: 0,
      scale: 1,
      targetScale: 1,
      lifespan: 10000
    });

    expect(world.entities.length).toBe(1);
    world.clearEntities();
    expect(world.entities.length).toBe(0);
  });

  it('should simulate physics update and apply gravity', () => {
    const ent = world.addEntity({
      type: 'letter',
      symbol: 'B',
      emoji: '🐻',
      title: 'Bear',
      subtitle: '小熊',
      color: '#F59E0B',
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      radius: 40,
      rotation: 0,
      scale: 1,
      targetScale: 1,
      lifespan: 10000
    });

    const initialY = ent.y;
    world.update();
    expect(ent.y).toBeGreaterThan(initialY);
  });
});

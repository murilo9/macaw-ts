export class Vector2D {
  x: number;
  y: number;

  // Overload signatures
  constructor(args: { x: number; y: number });
  constructor(args: { angle: number; module: number });

  // Implementation
  constructor(
    args: { x: number; y: number } | { angle: number; module: number }
  ) {
    if ("x" in args && "y" in args) {
      this.x = args.x;
      this.y = args.y;
    } else if ("angle" in args && "module" in args) {
      // angle is in degrees, convert to radians for Math.cos/Math.sin
      const angleRad = (args.angle * Math.PI) / 180;
      this.x = args.module * Math.cos(angleRad);
      this.y = args.module * Math.sin(angleRad);
    } else {
      throw new Error("Invalid arguments for Vector2D constructor");
    }
  }

  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  setAngle(angle: number) {
    // angle is in degrees, convert to radians for Math.cos/Math.sin
    const angleRad = (angle * Math.PI) / 180;
    const module = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = module * Math.cos(angleRad);
    this.y = module * Math.sin(angleRad);
  }

  setModule(module: number) {
    const angleRad = Math.atan2(this.y, this.x);
    this.x = module * Math.cos(angleRad);
    this.y = module * Math.sin(angleRad);
  }

  setVector(angle: number, module: number) {
    // angle is in degrees, convert to radians for Math.cos/Math.sin
    const angleRad = (angle * Math.PI) / 180;
    this.x = module * Math.cos(angleRad);
    this.y = module * Math.sin(angleRad);
  }

  getAngle(): number {
    // Math.atan2 returns radians, convert to degrees
    return (Math.atan2(this.y, this.x) * 180) / Math.PI;
  }

  getModule(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getVector(): { angle: number; module: number } {
    return {
      angle: this.getAngle(),
      module: this.getModule(),
    };
  }

  // Used for contributing forces (wind, gravity, friction)
  add(other: Vector2D): Vector2D {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  // Used for stopping a previously applied force (wind, gravity, friction)
  subtract(other: Vector2D): Vector2D {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  // Used to multiply speed by a factor (boost, slow, reverse)
  multiply(scalar: number): Vector2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
}

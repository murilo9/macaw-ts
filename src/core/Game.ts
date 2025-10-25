import type { GameConfig } from "./GameConfig";
import type { Room } from "./room/Room";

export class Game {
  // Holds all entities that'll be processes by the logic loop
  private currentRoom: Room;
  // Keeps the logic and render loops running while = true
  private isRunning = false;

  private readonly logicIntervalMs = 1000 / 60; // max 60 logic updates per second
  private lastLogicExecution = 0;

  constructor(config: GameConfig) {
    this.currentRoom = config.initialRoom;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.lastLogicExecution = performance.now();
    // Starts the render loop at browser screen refresh rate
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  public stop() {
    this.isRunning = false;
  }

  /** Main render loop (drives both render + conditional logic updates) */
  private renderLoop(now: number) {
    if (!this.isRunning) return;

    const delta = now - this.lastLogicExecution;

    // Update logic only if enough time has passed
    if (delta >= this.logicIntervalMs) {
      this.processEntities(delta / 1000);
      this.lastLogicExecution = now;
    }

    // Always render
    this.renderFrame();

    requestAnimationFrame(this.renderLoop.bind(this));
  }

  /**
   *
   * @param dt Amount of time (in seconds) since the last logic loop
   */
  private processEntities(dt: number) {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      // update entity logic with delta time (in seconds)
      this.currentRoom.entities[i].onRun(this, dt);
    }
  }

  private renderFrame() {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      if (this.currentRoom.entities[i]._is("Graphic")) {
        // draw entity sprite on canvas
      }
    }
  }

  public appendEntity() {}

  public removeEntity() {}

  /**
   * Gets the current room.
   * @returns Re
   */
  public getCurrentRoom(): Room {
    return this.currentRoom;
  }

  /**
   * Gets an entity in the current room.
   * @param id Entity _id to find.
   * @returns
   */
  public getEntity(id: string) {
    return this.currentRoom.entities.find((entity) => entity._id === id);
  }
}

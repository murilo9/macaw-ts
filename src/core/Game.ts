import type { GameConfig } from "./GameConfig";
import { Input } from "./input/Input";
import type { InputConfig } from "./input/InputConfig";
import type { Room } from "./room/Room";

export class Game {
  private config: GameConfig;
  private input: Input;
  // Holds all entities that'll be processes by the logic loop
  private currentRoom: Room;
  // Keeps the logic and render loops running while = true
  private isRunning = false;

  private readonly logicIntervalMs = 1000 / 60; // max 60 logic updates per second
  private lastLogicExecution = 0;

  constructor(gameConfig: GameConfig, inputConfig: InputConfig) {
    this.config = gameConfig;
    this.currentRoom = gameConfig.initialRoom;
    this.input = new Input(inputConfig);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.technicalSetup();

    this.lastLogicExecution = performance.now();
    // Starts the render loop at browser screen refresh rate
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  public stop() {
    this.isRunning = false;
    this.input._technicalCleanup();
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
   * Logic loop
   * @param dt Amount of time (in seconds) since the last logic loop
   */
  private processEntities(dt: number) {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      // update entity logic with delta time (in seconds)
      this.currentRoom.entities[i].onRun(this, dt);
    }
  }

  /**
   * Draws graphic entities on the canvas
   */
  private renderFrame() {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      if (this.currentRoom.entities[i]._is("Graphic")) {
        // draw entity sprite on canvas
      }
    }
  }

  /**
   * Gets the current room.
   */
  public getCurrentRoom(): Room {
    return this.currentRoom;
  }

  /**
   * Sets the current room
   */
  public setCurrentRoom(room: Room) {
    this.currentRoom.onEnd(this);
    this.currentRoom = room;
  }

  /**
   * Sets up listeners (mouse, keyboard, etc) to the browser's window object.
   */
  private technicalSetup() {
    // Setup game canvas
    const { background, height, width } = this.config.canvas;
    const canvasEl = document.createElement("canvas");
    canvasEl.width = width;
    canvasEl.height = height;
    canvasEl.style.background = background;
    const reactRootEl = document.getElementById("root");
    if (!reactRootEl) {
      throw new Error("Could not get React root");
    }
    reactRootEl.appendChild(canvasEl);
  }
}

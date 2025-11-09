import type { Entity } from "./entity/Entity";
import type { Graphic } from "./entity/interfaces/Graphic";
import type { GameConfig } from "./GameConfig";
import { Input } from "./input/Input";
import type { InputConfig } from "./input/InputConfig";
import type { Room } from "./room/Room";

export class Game {
  private config: GameConfig;
  private input: Input;
  private canvasEl: HTMLCanvasElement | undefined;
  // Holds the img elements of the loaded spriteSets for the current room
  private spritesetsEl: HTMLDivElement | undefined;
  // Holds all entities that'll be processes by the logic loop
  private currentRoom: Room;
  // Keeps the logic and render loops running while = true
  private isRunning = false;
  // Used to limit the amount of logic loop executions per second
  private readonly logicIntervalMs = 1000 / 60; // max 60 logic updates per second
  // Time (in millisecs) from last logic loop execution
  private lastLogicExecution = 0;
  // Whether the current room's sortedGraphicEntities array should be re-sorted
  private shouldResortGraphicEntities = false;

  constructor(gameConfig: GameConfig, inputConfig: InputConfig) {
    this.config = gameConfig;
    this.currentRoom = gameConfig.initialRoom;
    this.input = new Input(inputConfig);
  }

  /**
   * Starts the game. Called by the React app.
   * @returns
   */
  public start() {
    // Prevents re-execution is game is already running
    if (this.isRunning) return;
    // Prevents trying to append spritesetsEl if not defined yet
    if (!this.spritesetsEl) return;
    // Initializes the initial (current) room
    this.currentRoom.beforeInit(this, this.spritesetsEl);

    this.isRunning = true;
    this.technicalSetup();

    this.lastLogicExecution = performance.now();
    // Starts the render loop at browser screen refresh rate
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  /**
   * Stops the game. Called by anyone.
   */
  public stop() {
    this.isRunning = false;
    this.input._technicalCleanup();
  }

  /** Main loop (drives both render + conditional logic updates) */
  private renderLoop(now: number) {
    if (!this.isRunning) return;

    const delta = now - this.lastLogicExecution;

    // Update logic only if enough time has passed
    if (delta >= this.logicIntervalMs) {
      this.processEntities(delta / 1000);
      this.lastLogicExecution = now;
    }

    // Re-sorts current room's sortedGraphicEntities array, if needed
    if (this.shouldResortGraphicEntities) {
      this.currentRoom.sortedGraphicEntities.sort(
        (entityA, entityB) =>
          entityA.Graphic.renderIndex - entityB.Graphic.renderIndex
      );
      this.shouldResortGraphicEntities = false;
    }

    // Always render
    this.renderFrame(delta);

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
  private renderFrame(delta: number) {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      if (this.currentRoom.entities[i]._is("Graphic")) {
        // Calls entity's onRender method
        this.currentRoom.entities[i].onRender(this, delta);
        // TODO: draw entity sprite on canvas
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
    if (!this.spritesetsEl) {
      throw new Error(
        "Game's spritesetsEl could not be found on setCurrentRoom"
      );
    }
    // Clears the current (soon-to-be-previous) room
    this.currentRoom.beforeEnd(this, this.spritesetsEl);
    // Sets the new room
    this.currentRoom = room;
    // Initializes the initial (current) room
    this.currentRoom.beforeInit(this, this.spritesetsEl);
  }

  /**
   * Appends an entity in the current room
   * @param entity
   */
  public appendEntity(entity: Entity) {
    this.currentRoom.appendEntity(entity, this);
  }

  /**
   * Retrieves an entity from the current room
   * @param _id Entity's id
   * @returns
   */
  public getEntity(_id: string) {
    return this.currentRoom.getEntity(_id);
  }

  /**
   * Removes an entity from the current room
   * @param _id
   */
  public removeEntity(_id: string) {
    this.currentRoom.removeEntity(_id);
  }

  /**
   * Tells the game to re-sort current room's sortedGraphicEntities array on the next render loop execution
   */
  public onRenderIndexUpdated() {
    this.shouldResortGraphicEntities = true;
  }

  /**
   * Sets up listeners (mouse, keyboard, etc) to the browser's window object.
   */
  private technicalSetup() {
    // Setup game canvas
    const { background, height, width } = this.config.canvas;
    const canvasEl = document.createElement("canvas");
    canvasEl.id = "game-canvas";
    canvasEl.width = width;
    canvasEl.height = height;
    canvasEl.style.background = background;
    const reactRootEl = document.getElementById("root");
    if (!reactRootEl) {
      throw new Error("Could not get React root");
    }
    reactRootEl.appendChild(canvasEl);
    this.canvasEl = canvasEl;
    // Creates spritesets container
    const spritesetsEl = document.createElement("div");
    spritesetsEl.id = "game-spritesets";
    spritesetsEl.style.display = "none !important";
    document.body.appendChild(spritesetsEl);
    this.spritesetsEl = spritesetsEl;
  }
}

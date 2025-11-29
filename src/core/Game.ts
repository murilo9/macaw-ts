import type { Entity } from "./entity/Entity";
import type { Graphic } from "./entity/interfaces/Graphic";
import type { Spatial } from "./entity/interfaces/Spatial";
import type { GameConfig } from "./GameConfig";
import { Input } from "./input/Input";
import type { InputConfig } from "./input/InputConfig";
import type { Room } from "./room/Room";

export class Game {
  private config: GameConfig;
  private input: Input;
  private canvasEl: HTMLCanvasElement | undefined;
  // Canvas draw context
  private ctx: CanvasRenderingContext2D | undefined;
  // The graphic entity currently being drawn
  private entityToDraw: (Entity & Graphic) | null = null;
  // The graphic entity currently being executed (by onRun)
  private entityToExecute: (Entity & Spatial) | null = null;
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
  public async start() {
    // Prevents re-execution if game is already running
    if (this.isRunning) return;

    this.technicalSetup();

    await Promise.all(
      Array.from(document.images).map(
        (image) =>
          new Promise((resolve) => image.addEventListener("load", resolve))
      )
    );

    this.isRunning = true;

    // Initializes the initial (current) room
    this.currentRoom.beforeInit(this, this.spritesetsEl!);

    this.lastLogicExecution = performance.now();
    // Starts the render loop at browser screen refresh rate
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  /**
   * Stops the game. Called by anyone.
   */
  public stop() {
    this.isRunning = false;
    this.input.technicalCleanup();
  }

  /** Main loop (drives both render + conditional logic updates) */
  private renderLoop(now: number) {
    if (!this.isRunning) return;

    const delta = now - this.lastLogicExecution;

    // Update logic only if enough time has passed
    if (delta >= this.logicIntervalMs) {
      this.processEntities(delta);
      this.lastLogicExecution = now;
    }

    // Re-sorts current room's sortedGraphicEntities array, if needed
    if (this.shouldResortGraphicEntities) {
      this.currentRoom.sortedGraphicEntities.sort(
        (entityA, entityB) => entityA.Graphic.depth - entityB.Graphic.depth
      );
      this.shouldResortGraphicEntities = false;
    }

    // Always render
    this.renderFrame(delta);

    requestAnimationFrame(this.renderLoop.bind(this));
  }

  /**
   * Logic loop
   * @param dt Amount of time (in milisseconds) since the last logic loop
   */
  private processEntities(dt: number) {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      // Executes entity logic with delta time (in milisseconds)
      this.currentRoom.entities[i].onRun(this, dt);
      // If entity is Spatial, processates its x and y positions
      if (this.currentRoom.entities[i]._is("Spatial")) {
        // Updates current entityToExecute
        this.entityToExecute = this.currentRoom.entities[i] as Entity & Spatial;
        // Updates x and y speeds based on entity's rotation
        if (this.entityToExecute.Spatial.rotation !== 0) {
          // Increments (or decrements) velocity's angle
          // rotation is in degrees per second, so multiply by dt/1000 to convert to degrees per frame
          this.entityToExecute.Spatial.velocity.setAngle(
            this.entityToExecute.Spatial.velocity.getAngle() +
              this.entityToExecute.Spatial.rotation * (dt / 1000)
          );
        }
        // Updates x and y position (speed is in pixels per second, so multiply by dt)
        this.entityToExecute.Spatial.position.x +=
          (this.entityToExecute.Spatial.velocity.x * dt) / 1000;
        this.entityToExecute.Spatial.position.y +=
          (this.entityToExecute.Spatial.velocity.y * dt) / 1000;
        // TODO: handle collisions
      }
    }
  }

  /**
   * Draws graphic entities on the canvas
   */
  private renderFrame(delta: number) {
    this.ctx?.clearRect(
      0,
      0,
      this.config.canvas.width,
      this.config.canvas.height
    ); // clear canvas
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      if (this.currentRoom.entities[i]._is("Graphic")) {
        // Updates current entityToDraw
        this.entityToDraw = this.currentRoom.entities[i] as Entity & Graphic;
        // Short-circuits if entity.shouldRender is false
        if (!this.entityToDraw.Graphic.shouldRender) {
          break;
        }
        // Calls entity's onRender method
        this.entityToDraw.onRender(this, delta);
        // Draw entity sprite on canvas
        const ctx = this.ctx;
        if (!ctx) return;

        // Only use transformations if mirroring is needed (negative scale)
        if (
          this.entityToDraw.Graphic.xScale < 0 ||
          this.entityToDraw.Graphic.yScale < 0
        ) {
          // Save context state for transformations
          ctx.save();

          // Translate to sprite position
          ctx.translate(
            this.entityToDraw.Spatial.position.x,
            this.entityToDraw.Spatial.position.y
          );

          // Apply scaling (negative values will flip the sprite)
          ctx.scale(
            this.entityToDraw.Graphic.xScale,
            this.entityToDraw.Graphic.yScale
          );

          // Adjust position for negative scales (flip origin)
          if (this.entityToDraw.Graphic.xScale < 0) {
            ctx.translate(-this.entityToDraw.Graphic.tile.width, 0);
          }
          if (this.entityToDraw.Graphic.yScale < 0) {
            ctx.translate(0, -this.entityToDraw.Graphic.tile.height);
          }

          // Draw the image at (0, 0) relative to transformed context
          ctx.drawImage(
            this.entityToDraw.Graphic.spriteSet.img,
            this.entityToDraw.Graphic.tile.xOrigin,
            this.entityToDraw.Graphic.tile.yOrigin,
            this.entityToDraw.Graphic.tile.width,
            this.entityToDraw.Graphic.tile.height,
            0,
            0,
            this.entityToDraw.Graphic.tile.width,
            this.entityToDraw.Graphic.tile.height
          );

          // Restore context state
          ctx.restore();
        } else {
          // Direct drawImage for non-mirrored sprites (better performance)
          ctx.drawImage(
            this.entityToDraw.Graphic.spriteSet.img,
            this.entityToDraw.Graphic.tile.xOrigin,
            this.entityToDraw.Graphic.tile.yOrigin,
            this.entityToDraw.Graphic.tile.width,
            this.entityToDraw.Graphic.tile.height,
            this.entityToDraw.Spatial.position.x,
            this.entityToDraw.Spatial.position.y,
            this.entityToDraw.Graphic.tile.width *
              this.entityToDraw.Graphic.xScale,
            this.entityToDraw.Graphic.tile.height *
              this.entityToDraw.Graphic.yScale
          );
        }
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
  public onDepthUpdated() {
    this.shouldResortGraphicEntities = true;
  }

  /**
   * Sets up listeners (mouse, keyboard, etc) to the browser's window object and creates the spritesets element.
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
    this.ctx = canvasEl.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
    // Creates spritesets container
    const spritesetsEl = document.createElement("div");
    spritesetsEl.id = "game-spritesets";
    spritesetsEl.style.display = "none";
    document.body.appendChild(spritesetsEl);
    this.spritesetsEl = spritesetsEl;
  }
}

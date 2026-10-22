import {
  GameEvents,
  type GameEventListeners,
  type GameEventOn,
} from "../game/GameEvents";
import { GameValues } from "../game/GameValues";
import { createGameValues, type GameValuesStore } from "./createGameValues";
import type { Entity } from "./entity/Entity";
import type { Collider } from "./entity/interfaces/Collider";
import type { Graphic } from "./entity/interfaces/Graphic";
import type { Spatial } from "./entity/interfaces/Spatial";
import type { GameConfig } from "./GameConfig";
import { Input } from "./input/Input";
import type { InputConfig } from "./input/InputConfig";
import type { Room } from "./room/Room";
import { drawEntity } from "./utils/drawEntity";
import { processateEntityCollisions } from "./utils/processateEntityCollisions";
import { processateSpatialEntity } from "./utils/processateSpatialEntity";
import { wireEmit } from "./utils/wireEmit";
import { wireOn } from "./utils/wireOn";

function wireEvent<K extends keyof GameEvents>(
  emit: GameEvents,
  on: GameEventOn,
  listeners: GameEventListeners,
  eventName: K,
) {
  wireEmit(emit, eventName, listeners[eventName]);
  wireOn(on, eventName, listeners[eventName]);
}

/**
 * The game instance.
 * This class should never be entended.
 */
export class Game {
  private config: GameConfig;
  private input: Input;
  // Holds all entities that'll be processes by the logic loop
  private currentRoom: Room;
  // Canvas draw context
  private ctx: CanvasRenderingContext2D | undefined;
  // The graphic entity currently being drawn
  private entityToDraw: (Entity & Graphic) | null = null;
  // The graphic entity currently being executed (by onRun)
  private entityToExecute: (Entity & Spatial) | null = null;
  // The Collider entity currently having its collisions handled (by onRun)
  private entityToExecuteCollision: (Entity & Collider) | null = null;
  // Holds the img elements of the loaded spriteSets for the current room
  private spritesetsEl: HTMLDivElement | undefined;
  // Keeps the logic and render loops running while = true
  private isRunning = false;
  // Used to limit the amount of logic loop executions per second
  private readonly logicIntervalMs = 1000 / 60; // max 60 logic updates per second
  // Time (in millisecs) from last logic loop execution
  private lastLogicExecution = 0;
  // Whether the current room's sortedGraphicEntities array should be re-sorted
  private shouldResortGraphicEntities = false;

  public readonly emit: GameEvents;
  public readonly on: GameEventOn;
  public readonly values: GameValuesStore;

  constructor(
    gameConfig: GameConfig,
    inputConfig: InputConfig,
    eventListeners: GameEventListeners,
  ) {
    this.config = gameConfig;
    this.currentRoom = gameConfig.initialRoom;
    this.input = new Input(inputConfig);
    const gameEmit = new GameEvents();
    const gameOn = {} as GameEventOn;
    for (const eventName of Object.keys(gameEmit) as (keyof GameEvents)[]) {
      wireEvent(gameEmit, gameOn, eventListeners, eventName);
    }
    this.emit = gameEmit;
    this.on = gameOn;
    this.values = createGameValues(new GameValues());
  }

  //------------------------------ PRIVATE INTERFACE ------------------------------

  /** Main loop (drives both render + conditional logic updates) */
  private renderLoop(now: number) {
    if (!this.isRunning) return;

    const delta = now - this.lastLogicExecution;

    // Update logic only if enough time has passed
    if (delta >= this.logicIntervalMs) {
      this.processateEntities(delta);
      this.lastLogicExecution = now;
    }

    // Re-sorts current room's sortedGraphicEntities array, if needed
    if (this.shouldResortGraphicEntities) {
      this.currentRoom.sortedGraphicEntities.sort(
        (entityA, entityB) => entityA.Graphic.depth - entityB.Graphic.depth,
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
  private processateEntities(dt: number) {
    for (let i = this.currentRoom.entities.length - 1; i >= 0; i--) {
      // Executes entity logic with delta time (in milisseconds)
      this.currentRoom.entities[i].onRun(this, dt);
      // If entity is Spatial, processates its x and y positions
      if (this.currentRoom.entities[i]._is("Spatial")) {
        // Updates current entityToExecute
        this.entityToExecute = this.currentRoom.entities[i] as Entity & Spatial;
        processateSpatialEntity(this.entityToExecute, dt);
        // Handle collisions (if entity is Collider)
        if (this.entityToExecute._is("Collider")) {
          this.entityToExecuteCollision = this.entityToExecute as Entity &
            Collider;
          processateEntityCollisions(this.entityToExecuteCollision);
          // Resolves collision, if happened
          this.currentRoom._resolveCollision(this.entityToExecuteCollision);
        }
      }
    }
  }

  /**
   * Draws graphic entities on the canvas
   */
  private renderFrame(delta: number) {
    // Clears canvas
    this.ctx?.clearRect(
      0,
      0,
      this.config.canvas.width,
      this.config.canvas.height,
    );
    for (
      let i = this.currentRoom.sortedGraphicEntities.length - 1;
      i >= 0;
      i--
    ) {
      // Updates current entityToDraw
      this.entityToDraw = this.currentRoom.sortedGraphicEntities[i] as Entity &
        Graphic;
      // Short-circuits if entity.shouldRender is false
      if (!this.entityToDraw.Graphic.shouldRender) {
        continue;
      }
      // Calls entity's onRender method
      this.entityToDraw.onRender(this, delta);

      if (!this.ctx) return;

      // Draws entity sprite on canvas
      drawEntity(
        this.entityToDraw,
        this.ctx,
        this.config.debug.drawSpriteBoxes,
        this.config.debug.drawPivotCrosses,
      );
    }
    // Draws Collider entities' collision boxes
    if (this.config.debug.drawCollisionBoxes && this.ctx) {
      this.currentRoom._drawCollisionBoxes(this.ctx);
    }
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
    this.ctx = canvasEl.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
    // Creates spritesets container
    const spritesetsEl = document.createElement("div");
    spritesetsEl.id = "game-spritesets";
    spritesetsEl.style.display = "none";
    document.body.appendChild(spritesetsEl);
    this.spritesetsEl = spritesetsEl;
  }

  // ------------------------------ PUBLIC INTERFACE ------------------------------

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
          new Promise((resolve) => image.addEventListener("load", resolve)),
      ),
    );

    this.isRunning = true;

    // Initializes the initial (current) room
    this.currentRoom._beforeInit(this, this.spritesetsEl!);

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

  /**
   * Facade getter for the current room.
   */
  public Room(): Room {
    return this.currentRoom;
  }

  /**
   * Facade getter for the input instance.
   */
  public Input(): Input {
    return this.input;
  }

  /**
   * Sets the current room
   */
  public setCurrentRoom(room: Room) {
    if (!this.spritesetsEl) {
      throw new Error(
        "Game's spritesetsEl could not be found on setCurrentRoom",
      );
    }
    // Clears the current (soon-to-be-previous) room
    this.currentRoom._beforeEnd(this, this.spritesetsEl);
    // Sets the new room
    this.currentRoom = room;
    // Initializes the initial (current) room
    this.currentRoom._beforeInit(this, this.spritesetsEl);
  }

  /**
   * Tells the game to re-sort current room's sortedGraphicEntities array on the next render loop execution
   */
  public onDepthUpdated() {
    this.shouldResortGraphicEntities = true;
  }

  /**
   *
   */
  // public emit(
  //   eventName: keyof GameEvents,
  //   payload: GameEvents[keyof GameEvents],
  // ) {
  //   console.log("Game emit: ", eventName, payload);
  // }
}

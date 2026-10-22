import type { Entity } from "../entity/Entity";
import type { Graphic } from "../entity/interfaces/Graphic";
import type { InputAxis } from "./InputAxis";
import type { InputConfig } from "./InputConfig";

export type PointerPosition = {
  x: number;
  y: number;
};

export type PointerButton = {
  right: boolean;
  left: boolean;
  middle: boolean;
};

/**
 * The game inputs manager.
 * This class should never be entended.
 */
export class Input {
  private config: InputConfig;
  private axis1: InputAxis;
  private axis2: InputAxis;
  private pointer: {
    position: PointerPosition;
    button: PointerButton;
  };
  private keyDownListeners: { [entityId: string]: (key: string) => void };
  private keyUpListeners: { [entityId: string]: (key: string) => void };
  private keyListeners: {
    [entityId: string]: (key: string, type: "up" | "down") => void;
  };
  private axis1Listeners: { [entityId: string]: (axis: InputAxis) => void };
  private axis2Listeners: { [entityId: string]: (axis: InputAxis) => void };
  private pointerPressListeners: {
    [entityId: string]: (buttons: PointerButton) => void;
  };
  private pointerReleaseListeners: {
    [entityId: string]: (buttons: PointerButton) => void;
  };
  private pointerMoveListeners: {
    move: { [entityId: string]: (position: PointerPosition) => void };
    over: Array<{
      entity: Entity & Graphic;
      callback: (isOver: boolean) => void;
    }>;
  };
  private boundHandlePointerUp!: (event: PointerEvent) => void;
  private boundHandlePointerDown!: (event: PointerEvent) => void;
  private boundHandlePointerMove!: (event: PointerEvent) => void;
  private boundHandleKeyDownEvent!: (event: KeyboardEvent) => void;
  private boundHandleKeyUpEvent!: (event: KeyboardEvent) => void;

  private AXIS_DIRECTIONS: Array<"left" | "right" | "up" | "down"> = [
    "left",
    "right",
    "up",
    "down",
  ];

  public keyPressed: Record<string, boolean>;

  constructor(config: InputConfig) {
    this.technicalSetup();
    this.keyPressed = {};
    this.config = config;
    this.axis1 = {
      down: 0,
      left: 0,
      right: 0,
      up: 0,
    };
    this.axis2 = {
      down: 0,
      left: 0,
      right: 0,
      up: 0,
    };
    this.pointer = {
      button: {
        left: false,
        right: false,
        middle: false,
      },
      position: {
        x: 0,
        y: 0,
      },
    };
    this.keyDownListeners = {};
    this.keyUpListeners = {};
    this.keyListeners = {};
    this.axis1Listeners = {};
    this.axis2Listeners = {};
    this.pointerPressListeners = {};
    this.pointerReleaseListeners = {};
    this.pointerMoveListeners = { move: {}, over: [] };
  }

  // ------------------------------ PRIVATE INTERFACE ------------------------------

  private technicalSetup() {
    // Bind event handlers to preserve 'this' context
    this.boundHandlePointerUp = this.handlePointerUp.bind(this);
    this.boundHandlePointerDown = this.handlePointerDown.bind(this);
    this.boundHandlePointerMove = this.handlePointerMove.bind(this);
    this.boundHandleKeyDownEvent = this.handleKeyDownEvent.bind(this);
    this.boundHandleKeyUpEvent = this.handleKeyUpEvent.bind(this);

    // Prevents context menu from working, so "pointerup" events can work for right mouse button
    addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Setup event listeners
    window.addEventListener("pointerup", this.boundHandlePointerUp);
    window.addEventListener("pointerdown", this.boundHandlePointerDown);
    window.addEventListener("pointermove", this.boundHandlePointerMove);
    window.addEventListener("keydown", this.boundHandleKeyDownEvent);
    window.addEventListener("keyup", this.boundHandleKeyUpEvent);
  }

  /**
   * Hanles a pointerup event from window
   * @param event The event from window
   */
  private handlePointerUp(event: PointerEvent) {
    this.updatePointerPosition(event.x, event.y);
    switch (event.button) {
      case 0:
        this.pointer.button.left = false;
        break;
      case 1:
        this.pointer.button.middle = false;
        break;
      case 2:
        this.pointer.button.right = false;
        break;
    }
    this.pointer.position.x = event.x;
    this.pointer.position.y = event.y;
  }

  /**
   * Hanles a pointerdown event from window
   * @param event The event from window
   */
  private handlePointerDown(event: PointerEvent) {
    this.updatePointerPosition(event.x, event.y);
    switch (event.button) {
      case 0:
        this.pointer.button.left = true;
        break;
      case 1:
        this.pointer.button.middle = true;
        break;
      case 2:
        this.pointer.button.right = true;
        break;
    }
  }

  private updatePointerPosition(x: number, y: number) {
    this.pointer.position.x = x;
    this.pointer.position.y = y;
  }

  /**
   * Checks which entities the pointer is over
   */
  private checkOverEntities() {
    this.pointerMoveListeners.over.forEach(({ callback, entity }) => {
      // If cursor is over entity, calls callback
      const entityPosX = entity.Spatial.position.x;
      const entityPosY = entity.Spatial.position.y;
      const scaledXPivot = entity.Graphic.xScale * entity.Graphic.xPivot;
      const scaledYPivot = entity.Graphic.yScale * entity.Graphic.yPivot;
      const entityScaledTileWidth =
        entity.Graphic.tile.width * entity.Graphic.xScale;
      const entityScaledTileHeight =
        entity.Graphic.tile.height * entity.Graphic.yScale;

      const entityStartX = entityPosX - scaledXPivot;
      const entityEndX = entityStartX + entityScaledTileWidth;
      const entityStartY = entityPosY - scaledYPivot;
      const entityEndY = entityStartY + entityScaledTileHeight;

      const pointerIsOverX =
        this.pointer.position.x >= entityStartX &&
        this.pointer.position.x <= entityEndX;
      const pointerIsOverY =
        this.pointer.position.y >= entityStartY &&
        this.pointer.position.y <= entityEndY;
      callback(pointerIsOverX && pointerIsOverY);
    });
  }

  /**
   * Hanles a pointermove event from window
   * @param event The event from window
   */
  private handlePointerMove(event: PointerEvent) {
    // Updates pointer position
    this.updatePointerPosition(event.x, event.y);
    // Checks if pointer is over entities
    this.checkOverEntities();
  }

  /**
   * Handles a keydown event from window
   * @param event The event from window
   */
  private handleKeyDownEvent(event: KeyboardEvent) {
    // Updates keyPressed map
    this.keyPressed[event.code] = true;
    // Updates the axes
    this.updateAxes(event.code, "press");
    // Calls all key listeners
    for (const callback of Object.values(this.keyListeners)) {
      callback(event.code, "down");
    }
    // Calls all key down listeners
    for (const callback of Object.values(this.keyDownListeners)) {
      callback(event.code);
    }
  }

  /**
   * Handles a keyup event from window
   * @param event The event from window
   */
  private handleKeyUpEvent(event: KeyboardEvent) {
    // Updates keyPressed map
    this.keyPressed[event.code] = false;
    // Updates the axes
    this.updateAxes(event.code, "release");
    // Calls all key listeners
    for (const callback of Object.values(this.keyListeners)) {
      callback(event.code, "up");
    }
    // Calls all key up listeners
    for (const callback of Object.values(this.keyUpListeners)) {
      callback(event.code);
    }
  }

  /**
   * Updates the axes
   * @param key The key pressed/released
   * @param type The event type (up/down)
   */
  private updateAxes(key: string, type: "press" | "release") {
    // For each direction, updates each axis if the key is euqal to the axis config key. Otherwise, leaves the axis unchanged.
    for (const direction of this.AXIS_DIRECTIONS) {
      this.axis1[direction] =
        this.config.axis1[direction] === key
          ? type === "press"
            ? 1
            : 0
          : this.axis1[direction];
      this.axis2[direction] =
        this.config.axis1[direction] === key
          ? type === "press"
            ? 1
            : 0
          : this.axis2[direction];
    }
    // Calls axes' event listeners
    for (const callback of Object.values(this.axis1Listeners)) {
      callback(this.axis1);
    }
    for (const callback of Object.values(this.axis2Listeners)) {
      callback(this.axis2);
    }
  }

  // ------------------------------ PUBLIC INTERFACE ------------------------------

  /**
   * Cleans up listeners (pointer, keyboard) to the browser's window object.
   */
  technicalCleanup() {
    window.removeEventListener("pointerup", this.boundHandlePointerUp);
    window.removeEventListener("pointerdown", this.boundHandlePointerDown);
    window.removeEventListener("keydown", this.boundHandleKeyDownEvent);
    window.removeEventListener("keyup", this.boundHandleKeyUpEvent);
  }

  /**
   * Removes the listeners from an entity that has been removed from the room.
   * @param entity
   */
  public _cleanupListeners(entity: Entity) {
    delete this.keyListeners[entity._id];
    delete this.keyDownListeners[entity._id];
    delete this.keyUpListeners[entity._id];
    delete this.axis1Listeners[entity._id];
    delete this.axis2Listeners[entity._id];
    delete this.pointerPressListeners[entity._id];
    delete this.pointerReleaseListeners[entity._id];
    delete this.pointerMoveListeners.move[entity._id];
    const pointerOverListenerIndex = this.pointerMoveListeners.over.findIndex(
      ({ entity: e }) => e._id === entity._id,
    );
    if (pointerOverListenerIndex >= 0) {
      this.pointerMoveListeners.over.splice(pointerOverListenerIndex, 1);
    }
  }

  /**
   * Updates the input config
   * @param newConfig
   */
  public updateConfig(newConfig: InputConfig) {
    this.config = newConfig;
  }

  /**
   * Subscriber for key up events
   * @param callback The entity's function to be called
   */
  public onKeyUp(callback: (key: string) => void, entity: Entity) {
    this.keyUpListeners[entity._id] = callback;
  }

  /**
   * Subscriber for key down events
   * @param callback The entity's function to be called
   */
  public onKeyDown(callback: (key: string) => void, entity: Entity) {
    this.keyDownListeners[entity._id] = callback;
  }

  /**
   * Subscriber for any key events
   * @param callback The entity's function to be called
   */
  public onKey(callback: (key: string) => void, entity: Entity) {
    this.keyListeners[entity._id] = callback;
  }

  /**
   * Subscriber for axis1 events
   * @param callback
   */
  public onAxis1Change(callback: (axis: InputAxis) => void, entity: Entity) {
    this.axis1Listeners[entity._id] = callback;
  }

  /**
   * Subscriber for axis2 events
   * @param callback
   */
  public onAxis2Change(callback: (axis: InputAxis) => void, entity: Entity) {
    this.axis2Listeners[entity._id] = callback;
  }

  /**
   * Subscriber for pointer press events
   * @param callback
   * @param entity the entity to check the press on
   */
  public onPointerPress(
    callback: (buttons: PointerButton) => void,
    entity: Entity,
  ) {
    this.pointerPressListeners[entity._id] = callback;
  }

  /**
   * Subscriber for pointer release events
   * @param callback
   * @param entity the entity to check the press off
   */
  public onPointerRelease(
    callback: (buttons: PointerButton) => void,
    entity: Entity,
  ) {
    this.pointerReleaseListeners[entity._id] = callback;
  }

  /**
   * Subscriber for pointer move events
   * @param callback
   * @param entity
   */
  public onPointerMove(
    callback: (position: PointerPosition) => void,
    entity: Entity,
  ) {
    this.pointerMoveListeners.move[entity._id] = callback;
  }

  public onPointerOver(
    entity: Entity & Graphic,
    callback: (isOver: boolean) => void,
  ) {
    this.pointerMoveListeners.over.push({ entity, callback });
  }
}

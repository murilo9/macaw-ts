import type { InputAxis } from "./InputAxis";
import type { InputConfig } from "./InputConfig";

export class Input {
  private config: InputConfig;
  private axis1: InputAxis;
  private axis2: InputAxis;
  private keyDownListeners: Array<(key: string) => void>;
  private keyUpListeners: Array<(key: string) => void>;
  private keyListeners: Array<(key: string, type: "up" | "down") => void>;
  private axis1Listeners: Array<(axis: InputAxis) => void>;
  private axis2Listeners: Array<(axis: InputAxis) => void>;

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
    this.keyDownListeners = [];
    this.keyUpListeners = [];
    this.keyListeners = [];
    this.axis1Listeners = [];
    this.axis2Listeners = [];
  }

  private technicalSetup() {
    // Setup event listeners
    window.addEventListener("click", this.handleMouseClick);
    window.addEventListener("keydown", this.handleKeyDownEvent);
    window.addEventListener("keyup", this.handleKeyUpEvent);
  }

  /**
   * Cleans up listeners (mouse, keyboard) to the browser's window object.
   */
  _technicalCleanup() {
    window.removeEventListener("click", this.handleMouseClick);
    window.removeEventListener("keydown", this.handleKeyDownEvent);
    window.removeEventListener("keyup", this.handleKeyUpEvent);
  }

  private handleMouseClick(event: PointerEvent) {
    // TODO: update Input instance
  }

  /**
   * Handles a keydown event from window
   * @param event The event from window
   */
  private handleKeyDownEvent(event: KeyboardEvent) {
    // Updates keyPressed map
    this.keyPressed[event.key] = true;
    // Updates the axes
    this.updateAxes(event.key, "press");
    // Calls all key listeners
    for (const callback of this.keyListeners) {
      callback(event.key, "down");
    }
    // Calls all key down listeners
    for (const callback of this.keyDownListeners) {
      callback(event.key);
    }
  }

  /**
   * Handles a keyup event from window
   * @param event The event from window
   */
  private handleKeyUpEvent(event: KeyboardEvent) {
    // Updates keyPressed map
    this.keyPressed[event.key] = false;
    // Updates the axes
    this.updateAxes(event.key, "release");
    // Calls all key listeners
    for (const callback of this.keyListeners) {
      callback(event.key, "up");
    }
    // Calls all key up listeners
    for (const callback of this.keyUpListeners) {
      callback(event.key);
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
    for (const callback of this.axis1Listeners) {
      callback(this.axis1);
    }
    for (const callback of this.axis2Listeners) {
      callback(this.axis2);
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
  public onKeyUp(callback: (key: string) => void) {
    this.keyUpListeners.push(callback);
  }

  /**
   * Subscriber for key down events
   * @param callback The entity's function to be called
   */
  public onKeyDown(callback: (key: string) => void) {
    this.keyDownListeners.push(callback);
  }

  /**
   * Subscriber for any key events
   * @param callback The entity's function to be called
   */
  public onKey(callback: (key: string) => void) {
    this.keyListeners.push(callback);
  }

  /**
   * Subscriber for axis1 events
   * @param callback
   */
  public onAxis1Change(callback: (axis: InputAxis) => void) {
    this.axis1Listeners.push(callback);
  }

  /**
   * Subscriber for axis2 events
   * @param callback
   */
  public onAxis2Change(callback: (axis: InputAxis) => void) {
    this.axis2Listeners.push(callback);
  }
}

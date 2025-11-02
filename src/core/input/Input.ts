export class Input {
  private keyDownListeners: Array<(key: string) => void>;
  private keyUpListeners: Array<(key: string) => void>;
  private keyListeners: Array<(key: string, type: "up" | "down") => void>;

  public keyPressed: Record<string, boolean>;

  constructor() {
    this.technicalSetup();
    this.keyPressed = {};
    this.keyDownListeners = [];
    this.keyUpListeners = [];
    this.keyListeners = [];
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

  private handleKeyDownEvent(event: KeyboardEvent) {
    this.keyPressed[event.key] = true;
    // Calls all key listeners
    for (const callback of this.keyListeners) {
      callback(event.key, "down");
    }
    // Calls all key down listeners
    for (const callback of this.keyDownListeners) {
      callback(event.key);
    }
  }

  private handleKeyUpEvent(event: KeyboardEvent) {
    this.keyPressed[event.key] = false;
    // Calls all key listeners
    for (const callback of this.keyListeners) {
      callback(event.key, "up");
    }
    // Calls all key up listeners
    for (const callback of this.keyUpListeners) {
      callback(event.key);
    }
  }

  public onKeyUp(callback: (key: string) => void) {
    this.keyUpListeners.push(callback);
  }

  public onKeyDown(callback: (key: string) => void) {
    this.keyDownListeners.push(callback);
  }

  public onKey(callback: (key: string) => void) {
    this.keyListeners.push(callback);
  }
}

## Philosophy

The game consists of a room that contains entities.
The game executes logic loops and render loops.
A **logic loop** process all entities' logic.
A **render loop** renders all graphical entities's sprites on the screen (canvas).

### Game lifecycle

The React app creates an instance of the game with the game config and call its start method.

The start method will let the render and logic loops running.

Entities can interact with the game instance through the onRun or onInit method `game` parameter. Both onRun and method also provides `dt` as a second parameter.

Entities can access the current room through the game's getCurrentRoom method (as currentRoom is a private attribute of Game).

Entities in the current room can retrieve/add/remove entities by using the game's getEntity/appendEntity/removeEntity methods.

Entities may call game's stop method to close the game.

[TODO: add a more concrete example]

> "To interact" = send and receive data

### How are Graphic entities rendered

### How do entities interact with the UI layer

_this is a tough one_

### How do entities read data from the Input layer

_the game instance will likely have a Input instance, and will let a universal keypress (or similar) event listener update its attributes. Entities then can read data from it. The input instance will have a input map (received in the constructor?) that maps keyboard keys to the inputs (axis, etc). Each input will have a listener (array of callbacks) that entities can subscribe to in order to listen to it events._
_For the mouse, the game will listen to all move and click events, and provide a listener (array of callbacks) that entities can subscribe to. The game will also provide a more specific click listener that graphic entities can listen to in order to know whether the mouse clicked on them._

### How do entities interact with the Sound layer

_the game instance should have a list of audios (from JS Audio API) and provide method for the entities to interact with it?_

### How do entities interact with the File System layer

_ (.-.) _

### Q&As

**Why is it fine for an Entity's interface definition to have public attributes?**

Because the entity's interface object itself will be private, so only the entity has access to it.

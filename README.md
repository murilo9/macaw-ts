## Philosophy

The game consists of a room that contains entities.
The game executes logic loops and render loops.
A **logic loop** process all entities' logic.
A **render loop** renders all graphical entities's sprites on the screen (canvas).

### Game lifecycle

The React app creates an instance of the game with the game config and call its start method.

The start method will initialize the starting room and let the render and logic loops running.

Entities can interact with the game instance through the onRun or onInit method `game` parameter. Both onRun and method also provides `delta` as a second parameter.

Entities **cannot** access the current room (as currentRoom is a private attribute of Game).

Entities in the current room can retrieve/add/remove entities by using the game's getEntity/appendEntity/removeEntity methods.

Entities may call game's stop method to close the game.

[TODO: add a more concrete example]

> "To interact" = send and receive data

### How can entities communicate with each other

Entities can get other entities through the game's getEntity method, passing the target entity's id as parameter.

### How are Graphic entities rendered

During the render loop, the game will iterate the graphic entities list (which is sorted by renderIndex) and render each entity.
In order to render a graphic entity, the game access the entity's Graphic interface in order to get its spriteSet (so it ca get the img element and current title) and render the tile on the canvas.

An entity is rendered based on their renderIndex. Every time an entity's renderIndex changes, it should call the game's onRenderIndexUpdate method so the room's sortedGraphicEntities array can be re-sorted. Not doing this will cause the changed entity's renderIndex to have no effect on the rendering order.

### How does animations work

An entity may have an Animation instance, which provides a tile that can be used ro render the entity's sprite. In order for an animation to work, the entity's onRender method must call the animation's onUpdate method and assign the animation's currentTile (already returned by onUpdate) to the entity's tile (in Graphic.tile).

Example:

```javascript
onRender(game: Game, delta: number){
    this.Graphic.tile = this.animation.update(delta);
}
```

An animation consists of a spriteSet, a list of tiles names that consists the animation's frames, and the amount of tiles per second.

### How does rooms work

Rooms are consisted of a list of entities and a list of loaded spriteSets. Once a room is initialized (through the onInit method), its initial spriteSets will have their img elements loaded into the game's spriteSetsEl element, so they can actually be rendered in the game's render loop.

Lifecycle:

1. On the game's setCurrentRoom method, the room has its beforeInit method called, which loads the room's spriteSets to the game's spritesetsEl DOM element.
2. The room's beforeInit method then calls the room's onInit method, where the room instance can execute any other initialization logic, like settings its attributes.
3. Entities can call the game's getEntity/appendEntity/removeEntity in order to get/appendremove entities in the room. The game will then call the room's getEntity/appendEntity/removeEntity methods.
4. On the game's next setCurrentRoom method call, the current room has its beforeEnd method called, which clears the room's loaded spriteSets from the game's spritesetsEl DOM element, then finally calls the room's onEnd method, which can be used to execute any final logic.

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

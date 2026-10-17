## Philosophy

The game consists of a room that contains entities.
The game executes logic loops and render loops.
A **logic loop** process all entities' logic.
A **render loop** renders all graphical entities's sprites on the screen (HTML canvas).

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

### Types of Entities

Entities can implement interfaces to have specific behaviors:

- A **Spatial** entity has a position, velocity and rotation in the room, but is not rendered by itself.
- A **Graphic** entity is a **Spatial** entity that also has a _sprite_ that can be rendered in the room. It has no collision phisics by itself. An **Animation** instance can provide a list of tiles that can be used to render an animation for the Graphic entitiy's sprite over time.
- A **Collider** entity is a **Graphic** entity that also has a _collision body_ that allows it to interact physically with other Collider entities.

### How are Graphic entities rendered

During the render loop, the game will iterate the graphic entities list (which is sorted by depth) and render each entity.
In order to render a graphic entity, the game access the entity's Graphic interface in order to get its spriteSet (so it can get the img element and current title) and render the tile on the canvas.

An entity is rendered based on their depth. Every time an entity's depth changes, it should call the game's ondepthUpdate method so the room's sortedGraphicEntities array can be re-sorted. Not doing this will cause the changed entity's depth to have no effect on the rendering order.

### How does animations work

An entity may have an Animation instance, which provides a tile that can be used ro render the entity's sprite. In order for an animation to work, the entity's onRender method must call the animation's onUpdate method and assign the animation's currentTile (already returned by onUpdate) to the entity's tile (in Graphic.tile).

Example:

```javascript
onRender(game: Game, delta: number){
    this.Graphic.tile = this.animation.update(delta);
}
```

An animation consists of a spriteSet, a list of tiles names that consists the animation's frames, and the amount of tiles per second.
An animation can have a behavior, which tells what happens once it finishes (repeat, stop, reverse and stop, reverse repeat). In order to tell whether an animation has finished, an entit can check its `isFinished` value in the onRun method.

### How does rooms work

Rooms are consisted of a list of entities and a list of loaded spriteSets. Once a room is initialized (through the onInit method), its initial spriteSets will have their img elements loaded into the game's spriteSetsEl element, so they can actually be rendered in the game's render loop.

Lifecycle:

1. On the game's setCurrentRoom method, the room has its beforeInit method called, which loads the room's spriteSets to the game's spritesetsEl DOM element.
2. The room's beforeInit method then calls the room's onInit method, where the room instance can execute any other initialization logic, like settings its attributes.
3. Entities can call the game's getEntity/appendEntity/removeEntity in order to get/appendremove entities in the room. The game will then call the room's getEntity/appendEntity/removeEntity methods.
4. On the game's next setCurrentRoom method call, the current room has its beforeEnd method called, which clears the room's loaded spriteSets from the game's spritesetsEl DOM element, then finally calls the room's onEnd method, which can be used to execute any final logic.

## Game Events

Events have a name and an optional payload. Entities can emit events through the Game's `emit["event:name"]` attribute. Entities can listen to events through the Game's `on["event:name"]` attribute.
The _GameEvents.ts_ file is where all event names and their respective payloads have to be declared.

It is not recommended to emit events very frequently (like at the logic loop rate) so for sharing values that change very often, use **game values** instead.

### Game values

A game value is the latest snapshot of a named key. Declare each key and its initial value in _GameValues.ts_.

Entities read a value with `game.values.get("key")` and replace it with `game.values.set("key", value)`. Pass a new object or primitive on each update. The stored snapshot is frozen, so mutating the object returned by `get` does not publish a change.

UI components read a value with the `useGameValue` hook and cannot write. Call that hook from the component that renders the value, so a key that changes every logic tick does not re-render the rest of the tree.

### Game UI

UI components can emit events using the `emit` object returned from the `useGameEmit` hook. UI components can listen to events through the `useGameEvent` hook.

You can use tailwind classes to customize UI components.

### Inputs

The game instance has an **Input** instance, and will let a universal keypress event listener update its attributes. Entities then can read data from it. The input instance has an input config (a key map, defined in the constructor) that maps keyboard keys to the inputs (axis, etc). The input has a listener (array of callbacks) that entities can subscribe to (through Game's onKe/onKeuUp/onKeyDown methods) in order to listen to its events.
_For the mouse, the game will listen to all move and click events, and provide a listener (array of callbacks) that entities can subscribe to. The game will also provide a more specific click listener that graphic entities can listen to in order to know whether the mouse clicked on them._

### How does collisions work

An entity that has collision must implement the Collider interface, which includes the entity's collision body. Every time a room is initialized or an entity is inserted into a room, the room adds the entitiy(es)' collision body(ies) to its collision system.

### How do entities interact with the Sound layer

_the game instance should have a list of audios (from JS Audio API) and provide methods for the entities to interact with it?_

### How do entities interact with the File System layer

_i have no fucking idea yet_

### Graphic debugging

The Game config has a debug attribute containing a set of attributes that defines debuggind settings:

- `drawCollisionBoxes`: if true, will draw a green box for each Collider entity's collision box.
- `drawSpriteBoxes`: if true, will draw a cyan box for each Graphic entity's tile.
- `drawPivotCrosses`: if true, will draw a red cross centered on each Graphic entity' pivot.

### Spriteset Viewer

The Spriteset Viewer (enable in App.tsx MODE variable) allows you to see all the game's Spritesets and their respective tiles.

### Q&As

**Why is it fine for an Entity's interface definition to have public attributes?**

Because the entity's interface object itself will be private, so only the entity has access to it.

**Is it fine for an entity to have a reference to the Game instance?**

Yes, as long as you don't try to access it before the onInit method execution, which is where the initial Game reference can come from. Also make sure to type-assert the game instance with "!".

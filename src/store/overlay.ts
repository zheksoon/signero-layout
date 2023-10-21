import { action, observable } from "onek";

const [dragComponent, setDragComponent] = observable(null);
const [dragCoordinates, setDragCoordinates] = observable({ x: 0, y: 0 });

export const showDragOverlay = action((comment) => {
  setDragComponent(comment);
});

export const hideDragOverlay = action(() => {
  setDragComponent(null);
});

export { dragComponent, dragCoordinates, setDragCoordinates };

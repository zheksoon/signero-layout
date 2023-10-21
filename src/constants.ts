import { dragSourceType } from "snapdrag";

export const ADD_BLOCK = dragSourceType<{ color: string }>("add-block");

export const MOVE_BLOCK = dragSourceType<{ color: string; oldPath: string[] }>(
  "remove-block"
);

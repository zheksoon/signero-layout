import {
  hideDragOverlay,
  setDragCoordinates,
  showDragOverlay
} from "../../store/overlay";
import { setIsDragging } from "../../store/draggableBlock";
import { ADD_BLOCK } from "../../constants";
import { useDragSource } from "snapdrag/react";
import styled from "styled-components";
import { getRandomColor } from "../../utils";
import { useState } from "react";

const DraggableBlockWrapper = styled.div``;

const DraggableBlockDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 4px;
  width: 100px;
  height: 50px;
  background-color: ${(props) => props.$color};
`;

export const DraggableBlock = ({ draggable = true, initialColor }) => {
  const [color, setColor] = useState(initialColor ?? getRandomColor());

  const withDragSource = useDragSource({
    disabled: !draggable,
    type: ADD_BLOCK,
    data: { color },
    onDragStart() {
      showDragOverlay(
        <DraggableBlock draggable={false} initialColor={color} />
      );
      setIsDragging(true);
    },
    onDragMove({ event }) {
      setDragCoordinates({ x: event.x, y: event.y });
    },
    onDragEnd() {
      hideDragOverlay();
      setIsDragging(false);
      setColor(getRandomColor());
    }
  });

  return (
    <DraggableBlockWrapper>
      {withDragSource(
        <DraggableBlockDiv $color={color}>Drag me!</DraggableBlockDiv>
      )}
    </DraggableBlockWrapper>
  );
};

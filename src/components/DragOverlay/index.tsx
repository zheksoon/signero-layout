import { useObserver } from "onek/react";
import { dragComponent, dragCoordinates } from "../../store/overlay";
import styled from "styled-components";

const DragOverlayDiv = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  user-select: none;
  pointer-events: none;
`;

export const DragOverlay = () => {
  const observer = useObserver();

  return observer(() => {
    if (!dragComponent()) {
      return null;
    }

    const style = {
      transform: `
        translateX(${dragCoordinates().x}px)
        translateY(${dragCoordinates().y}px)`
    };

    return <DragOverlayDiv style={style}>{dragComponent()}</DragOverlayDiv>;
  });
};

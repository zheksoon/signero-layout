import React, {
  useState
} from "react";
import styled from "styled-components";
import { useObserver } from "onek/react";
import { useComputed } from "../../utils/hooks";
import { adjustColumnWidth, currentBlocks } from "../../store/blocks";
import { isDragging, isResizing, setIsResizing } from "../../store/draggableBlock";
import { useDragSource } from "snapdrag/react";
import { dragSourceType } from "snapdrag";
import { get } from "lodash";

import { CanvasDiv } from '../Canvas'
import { RowDiv } from '../Row'

const ColumnDiv = styled.div`
  position: relative;
  min-width: 30px;
`;

const ResizeStripDiv = styled.div`
  ${RowDiv}:hover & {
    display: ${({ hide }) => (hide ? "none" : "block" )};
    position: absolute;
    left: calc(100% - 2px);
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: lightgreen;
    cursor: move;
    user-select: none;
  }
`;

const ResizeStrip = React.forwardRef(({ forceShow }, ref) => {
  const obs = useObserver();

  return obs(() => {
    return <ResizeStripDiv hide={(isResizing() || isDragging()) && !forceShow} ref={ref} />;
  })
});

const RESIZE_STRIP = dragSourceType("resize-strip");

export const Column = ({ children, path, width }) => {
  const [isColumnResizing, setIsColumnResizing] = useState(false);

  const isLastColumn = useComputed(() => {
    const columns = get(currentBlocks(), path.slice(0, -1));
    
    if (!columns) return false;
    
    const currentColumnIndex = path[path.length - 1];
    
    return columns.length - 1 === currentColumnIndex;
}, true, [path]);

  const withResizeStripDrag = useDragSource({
    type: RESIZE_STRIP,
    data: ({ dragElement }) => {
      const canvas = dragElement.closest(`${CanvasDiv} > ${RowDiv}`)!;
      const { left, width } = canvas.getBoundingClientRect()!;
      return { left, width };
    },
    onDragStart() {
      setIsResizing(true);
      setIsColumnResizing(true);
    },
    onDragMove({ event, data }) {
      const rowStartDelta = (event.x - data.left) / data.width;

      adjustColumnWidth(path, rowStartDelta);
    },
    onDragEnd() {
      setIsColumnResizing(false);
      setIsResizing(false);
    }
  });

  const obs = useObserver();

  return (
    <ColumnDiv style={{ flex: `${width} 1 0` }}>
      {children}
      {!obs(isLastColumn) &&
        withResizeStripDrag(<ResizeStrip forceShow={isColumnResizing} />)}
    </ColumnDiv>
  );
};

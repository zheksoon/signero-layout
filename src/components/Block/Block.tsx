import { useCallback, useRef, useState } from "react";
import { insertBlock, removeBlock, moveBlock } from "../../store/blocks";
import { useDragSource, useDropTarget } from "snapdrag/react";
import { ADD_BLOCK, MOVE_BLOCK } from "../../constants";
import { closestEdge } from "../../utils";
import { useClickOutside } from "../../utils/hooks";
import {
  BlockDiv,
  BottomDropLine,
  BottomDropMargin,
  LeftDropLine,
  LeftDropMargin,
  RightDropLine,
  RightDropMargin,
  TopDropLine,
  TopDropMargin,
  RemoveButton,
  CloseIcon,
  DraggedBlockDiv
} from "./styled";
import {
  hideDragOverlay,
  showDragOverlay,
  setDragCoordinates
} from "../../store/overlay";
import { setIsDragging } from "../../store/draggableBlock";

type BlockProps = { color: string; path: Array<number | string> };

export const Block = ({ color, path }: BlockProps) => {
  const [selected, setSelected] = useState(false);

  const [blockElement, setBlockElement] = useState(null);
  const [blockDragging, setBlockDragging] = useState(false);

  const [activeDropLine, setActiveDropLine] = useState(null);
  const [showDropLines, setShowDropLines] = useState(false);

  const lineDraggedIn = useRef(false);
  const blockDraggedIn = useRef(false);

  const withDropMarginTarget = (position) =>
    useDropTarget({
      disabled: blockDragging,
      sourceTypes: [ADD_BLOCK, MOVE_BLOCK],
      onDragIn() {
        setActiveDropLine(position);
        setShowDropLines(true);
        lineDraggedIn.current = true;
      },
      onDragOut() {
        setActiveDropLine(null);
        setTimeout(() => {
          if (!blockDraggedIn.current) {
            setShowDropLines(false);
          }
        }, 0)
        lineDraggedIn.current = false;
      },
      onDrop({ sourceType, sourceData }) {
        setShowDropLines(false);

        if (sourceType === ADD_BLOCK) {
          insertBlock(path, activeDropLine, sourceData);
        } else if (sourceType === MOVE_BLOCK) {
          moveBlock(sourceData.oldPath, path, activeDropLine, sourceData);
        }
      }
    });

  const withBlockDropTarget = useDropTarget({
    disabled: blockDragging,
    sourceTypes: [ADD_BLOCK, MOVE_BLOCK],
    onDragIn() {
      setShowDropLines(true);
      blockDraggedIn.current = true;
    },
    onDragOut() {
        if (!lineDraggedIn.current) {
          setShowDropLines(false);
        }
      blockDraggedIn.current = false;
    },
    onDragMove({ event, dropElement }) {
      const { top, left, width, height } = dropElement.getBoundingClientRect()!;
      const edge = closestEdge(event.x - left, event.y - top, width, height);
      setActiveDropLine(edge);
    },
    onDrop({ sourceType, sourceData }) {
      setShowDropLines(false);

      if (sourceType === ADD_BLOCK) {
        insertBlock(path, activeDropLine, sourceData);
      } else if (sourceType === MOVE_BLOCK) {
        moveBlock(sourceData.oldPath, path, activeDropLine, sourceData);
      }
    }
  });

  const withBlockDragSource = useDragSource({
    type: MOVE_BLOCK,
    data: { color, oldPath: path },
    onDragStart() {
      showDragOverlay(<DraggedBlock color={color} />);
      setIsDragging(true);
      setBlockDragging(true);
    },
    onDragMove({ event }) {
      setDragCoordinates({ x: event.x, y: event.y });
    },
    onDragEnd() {
      hideDragOverlay();
      setIsDragging(false);
      setBlockDragging(false);
      setShowDropLines(false);
    }
  });

  const selectBlock = useCallback(() => {
    setSelected(true);
  }, []);

  const unselectBlock = useCallback(() => {
    setSelected(false);
  }, []);

  useClickOutside(blockElement!, unselectBlock, !selected);

  const onRemoveBlock = useCallback(() => {
    removeBlock(path);
  }, []);

  return withBlockDragSource(
    withBlockDropTarget(
      <BlockDiv
        $color={color}
        isSelected={selected}
        onMouseDown={selectBlock}
        ref={setBlockElement}
      >
        {selected && (
          <RemoveButton onClick={onRemoveBlock}>
            <CloseIcon>×</CloseIcon>
          </RemoveButton>
        )}
        {showDropLines && !blockDragging && (
          <>
            <TopDropLine $active={activeDropLine === "top"} />
            <BottomDropLine $active={activeDropLine === "bottom"} />
            <LeftDropLine $active={activeDropLine === "left"} />
            <RightDropLine $active={activeDropLine === "right"} />
            {withDropMarginTarget("top")(<TopDropMargin />)}
            {withDropMarginTarget("bottom")(<BottomDropMargin />)}
            {withDropMarginTarget("left")(<LeftDropMargin />)}
            {withDropMarginTarget("right")(<RightDropMargin />)}
          </>
        )}
      </BlockDiv>
    )
  );
};

const DraggedBlock = ({ color }) => {
  return <DraggedBlockDiv $color={color} />;
};

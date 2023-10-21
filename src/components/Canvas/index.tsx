import styled from "styled-components";
import { useObserver } from "onek/react";
import { map } from "../../utils/map";
import { currentBlocks } from "../../store/blocks";

export const CanvasDiv = styled.div`
  flex: 1 0 0;
  padding: 40px;
  border: 2px solid lightgray;
`;

export const Canvas = () => {
  const observer = useObserver();

  return observer(() => (
    <CanvasDiv>
      {map(currentBlocks().items, ["items"])}
    </CanvasDiv>
  ));
};

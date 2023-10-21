import styled from "styled-components";
import { DraggableBlock } from "../DraggableBlock";

const LeftPanelDiv = styled.div`
  width: 200px;
  padding: 15px;
  background-color: #eee;
`;

export const LeftPanel = () => {
  return (
    <LeftPanelDiv>
      <DraggableBlock />
    </LeftPanelDiv>
  );
};

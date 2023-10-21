import { styled } from "styled-components";

export const BlockDiv = styled.div`
  min-height: 40px;
  position: relative;
  background-color: ${(props) => props.$color};
  opacity: ${(props) => (props.isSelected ? 0.5 : 1.0)};
  border-radius: 4px;
  margin: 10px;
`;

export const TopDropMargin = styled.div`
  position: absolute;
  bottom: calc(100%);
  left: 0;
  right: 0;
  height: 12px;
`;

export const BottomDropMargin = styled.div`
  position: absolute;
  top: calc(100%);
  left: 0;
  right: 0;
  height: 12px;
`;

export const LeftDropMargin = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: calc(100%);
  width: 12px;
`;

export const RightDropMargin = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(100%);
  width: 12px;
`;

export const TopDropLine = styled.div`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: ${(props) => (props.$active ? "blue" : "lightgray")};
  height: 4px;
  border-radius: 2px;
  width: 100%;
`;

export const BottomDropLine = styled.div`
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  background-color: ${(props) => (props.$active ? "blue" : "lightgray")};
  height: 4px;
  border-radius: 2px;
`;

export const LeftDropLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -8px;
  right: calc(100% + 4px);
  background-color: ${(props) => (props.$active ? "blue" : "lightgray")};
  border-radius: 2px;
`;

export const RightDropLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(100% + 4px);
  right: -8px;
  background-color: ${(props) => (props.$active ? "blue" : "lightgray")};
  border-radius: 2px;
`;

export const RemoveButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: red;
  color: white;
  position: absolute;
  bottom: calc(100% - 12px);
  left: calc(100% - 12px);
  cursor: pointer;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  vertical-align: center;
  z-index: 100;
`;

export const CloseIcon = styled.span``;

export const DraggedBlockDiv = styled(BlockDiv)`
  width: 100px;
`;

import { styled } from "styled-components";
import { Canvas } from "./components/Canvas";
import { LeftPanel } from "./components/LeftPanel";
import { DragOverlay } from "./components/DragOverlay";

const WrapperDiv = styled.div`
  display: flex;
`;

const Wrapper = () => {
  return (
    <>
      <WrapperDiv>
        <Canvas />
        <LeftPanel />
      </WrapperDiv>
      <DragOverlay />
    </>
  );
};

export default function App() {
  return <Wrapper />;
}

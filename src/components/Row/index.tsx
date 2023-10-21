import styled from "styled-components";

export const RowDiv = styled.div`
  display: flex;
`;

export const Row = ({ children }) => {
  return (
      <RowDiv>{children}</RowDiv>
  );
};

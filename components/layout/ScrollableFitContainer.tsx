import { css, styled } from 'twin.macro';

export const ScrollableFitContainer = styled.div(() => [
  css`
    overflow-y: auto;
    height: 100%;
    width: 100%;
  `,
]);

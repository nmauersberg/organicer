import { css, styled } from 'twin.macro';

export const NoStyleButton = styled.button(() => [
  css`
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    cursor: pointer;
  `,
]);

import { css, styled } from 'twin.macro';

export const CustomLegend = styled.div(() => [
  css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
  `,
]);

export const LegendElement = styled.div(() => [
  css`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    justify-content: center;
  `,
]);

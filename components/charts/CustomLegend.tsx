import { css, styled } from 'twin.macro';

export const CustomLegend = styled.div(() => [
  css`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
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

export const LegendText = styled.span(() => [
  css`
    white-space: nowrap;
    font-size: 1rem;

    @media only screen and (max-width: 600px) {
      font-size: 0.75rem;
    }
  `,
]);

type LegendMarkerProps = {
  color: string;
};

export const LegendMarker = styled.span<LegendMarkerProps>(({ color }) => [
  css`
    background-color: ${color};
    width: 12px;
    height: 12px;
    border-radius: 12px;
  `,
]);

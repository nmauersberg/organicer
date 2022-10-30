// -----------------------------------------------------------------------------
// Margin
// -----------------------------------------------------------------------------

import { ReactElement } from 'react';
import { styled } from 'twin.macro';
import { css } from 'twin.macro';

type MarginProps = {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  children: ReactElement | ReactElement[] | string;
};

export const Margin = styled.div<MarginProps>(
  ({ top = 0, bottom = 0, right = 0, left = 0 }) => [
    css`
      margin-top: ${top}rem;
      margin-bottom: ${bottom}rem;
      margin-right: ${right}rem;
      margin-left: ${left}rem;
    `,
  ],
);

// -----------------------------------------------------------------------------
// Padding
// -----------------------------------------------------------------------------

type PaddingProps = {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  children: ReactElement | ReactElement[] | string;
};

export const Padding = styled.div<PaddingProps>(
  ({ top = 0, bottom = 0, right = 0, left = 0 }) => [
    css`
      padding-top: ${top}rem;
      padding-bottom: ${bottom}rem;
      padding-right: ${right}rem;
      padding-left: ${left}rem;
    `,
  ],
);

// -----------------------------------------------------------------------------
// Flex
// -----------------------------------------------------------------------------

export const Spacer = styled.div(() => [
  css`
    flex-grow: 1;
  `,
]);

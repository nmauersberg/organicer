import { css, styled } from 'twin.macro';

export const Title = styled.h2(() => [
  css`
    font-weight: 600;
    font-size: 2rem;
    margin-bottom: 1rem;
  `,
]);

export const SmallTitle = styled.h3(() => [
  css`
    font-weight: 400;
    font-size: 1.25rem;
    margin: 0.5rem 0;
  `,
]);

export const DateText = styled.p(() => [
  css`
    font-size: 0.75rem;
    color: lightgray;
  `,
]);

type TextDecoration =
  | 'overline'
  | 'line-through'
  | 'underline'
  | 'underline overline';

type JustTextProps = {
  size?: number;
  textDecoration?: TextDecoration[];
};

export const JustText = styled.p<JustTextProps>(
  ({ size = 1, textDecoration }) => {
    const textDecorations = textDecoration
      ? textDecoration.map(t => `text-decoration: ${t};`).join('ln')
      : '';

    return [
      css`
        font-size: ${size}rem;
        ${textDecorations}
      `,
    ];
  },
);

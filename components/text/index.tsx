import { css, styled } from 'twin.macro';

export const Title = styled.h2(() => [
  css`
    font-weight: 600;
    font-size: 2rem;
    margin-bottom: 1rem;
  `,
]);

type SmallTitleProps = {
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
};

export const SmallTitle = styled.h3<SmallTitleProps>(
  ({ mt = '0.5', mb = '0.5', ml = '0', mr = '0' }) => [
    css`
      font-weight: 400;
      font-size: 1.25rem;
      margin: ${mt}rem ${mr}rem ${mb}rem ${ml}rem;
    `,
  ],
);

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
  bottomMargin?: number;
};

export const JustText = styled.p<JustTextProps>(
  ({ size = 1, textDecoration, bottomMargin = 1 }) => {
    const textDecorations = textDecoration
      ? textDecoration.map(t => `text-decoration: ${t};`).join('ln')
      : '';

    return [
      css`
        font-size: ${size}rem;
        margin-bottom: ${bottomMargin}rem;
        ${textDecorations}
      `,
    ];
  },
);

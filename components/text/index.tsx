import { css, styled } from 'twin.macro'

export const Title = styled.h2(() => [
  css`
    font-weight: 600;
    font-size: 2rem;
  `,
])

export const SmallTitle = styled.h3(() => [
  css`
    font-weight: 400;
    font-size: 1.25rem;
    margin: 0.5rem 0;
  `,
])

export const DateText = styled.p(() => [
  css`
    font-size: 0.75rem;
    color: gray;
  `,
])

export const JustText = styled.p(() => [
  css`
    font-size: 1rem;
    color: black;
  `,
])

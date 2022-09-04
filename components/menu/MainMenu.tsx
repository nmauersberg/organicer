import { css, styled } from 'twin.macro'

export const MainMenu = styled.div(() => [
  css`
    position: fixed;
    bottom: 0;
    right: 0;
    height: 5rem;
    width: 5rem;
    background: firebrick;
    border-top-left-radius: 100%;
    &:hover {
      animation: shrink 0.5s ease forwards;
    }
    transform-origin: bottom right;
    @keyframes shrink {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(5);
      }
    }
  `,
])

import { ReactElement } from 'react';
import { css, styled } from 'twin.macro';
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js';

type SlideButtonProps = {
  children: ReactElement | ReactElement[] | string;
  onClick: () => void;
  disabled?: boolean;
};

export const SlideButton = (props: SlideButtonProps) => {
  return (
    <SlideButton_ {...props}>
      <div>{props.children}</div>
      <i>
        <Icon
          className={'icon'}
          path={mdiChevronRight}
          size={1}
          color="black"
        />
      </i>
    </SlideButton_>
  );
};

const SlideButton_ = styled.button(() => [
  css`
    font-size: 20px;
    font-weight: 200;
    letter-spacing: 1px;
    padding: 13px 30px 13px;
    outline: 0;
    border: 1px solid black;
    cursor: pointer;
    position: relative;
    background-color: rgba(0, 0, 0, 0);
    margin: 0.5rem 0 1rem;

    i {
      opacity: 0;
      font-size: 13px;
      transition: 0.2s;
      position: absolute;
      right: 5px;
      top: 17px;
      transition: transform 1;
    }

    div {
      transition: transform 0.8s;
    }

    &:hover div {
      transform: translateX(-6px);
    }

    &::after {
      content: '';
      background-color: #53a2be;
      opacity: 0.75;
      width: 100%;
      z-index: -1;
      position: absolute;
      height: 100%;
      top: 6px;
      left: 6px;
    }

    &:hover i {
      opacity: 1;
      transform: translateX(-6px);
    }
  `,
]);

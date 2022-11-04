import { ReactElement } from 'react';
import { css, styled } from 'twin.macro';

type ButtonCfg = {
  label: string | ReactElement;
  clickHandler: () => void;
};

type ButtonGroupProps = {
  buttons: ButtonCfg[];
};

export const ButtonGroup = ({ buttons }: ButtonGroupProps) => {
  return (
    <div>
      {buttons.map((button, index) => (
        <Btn onClick={button.clickHandler} key={index}>
          {button.label}
        </Btn>
      ))}
    </div>
  );
};

const Btn = styled.button(() => [
  css`
    cursor: pointer;
    padding: 0 0.25rem;
    height: 100%;
    border-top: 1px solid gray;
    border-bottom: 1px solid gray;
    border-right: 1px solid gray;

    &:first-child {
      border-left: 1px solid gray;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &:hover {
      color: gray;
    }
  `,
]);

import { FadeIn } from 'anima-react';
import { useState } from 'react';
import { css, styled } from 'twin.macro';

type PageLogoProps = {
  onClick: () => void;
};

export const PageLogo = ({ onClick }: PageLogoProps) => {
  const [glow, setGlow] = useState(false);

  return (
    <FadeIn orientation="up" duration={0.5} distance={10}>
      <Logo
        src="/on-logo.png"
        alt="OrgaNicer logo"
        onMouseEnter={() => setGlow(true)}
        onMouseLeave={() => setGlow(false)}
        glow={glow}
        onClick={() => onClick()}
      />
    </FadeIn>
  );
};

type LogoProps = {
  glow: boolean;
};

const Logo = styled.img<LogoProps>(({ glow }) => [
  css`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    ${glow && 'box-shadow: 0px 0px 10px 1px #db5461;'}
    cursor: pointer;
  `,
]);

import {
  mdiApps,
  mdiBookOpenVariant,
  mdiCog,
  mdiCookieCheckOutline,
  mdiHomeCircleOutline,
  mdiRunFast,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { css, styled } from 'twin.macro';

export type PageId = '/' | 'tagebuch' | 'sport' | 'aufgaben' | 'einstellungen';

export type Page = {
  id: PageId;
  icon: string;
  label: string;
  config: NavElConfig;
  description: string;
};

export const pages: Page[] = [
  {
    id: '/',
    icon: mdiHomeCircleOutline,
    label: 'OrgaNicer',
    config: { rotate: 0, bottom: 0.2, right: 0.2, fadeIn: 0.9 },
    description: '',
  },
  {
    id: 'einstellungen',
    icon: mdiCog,
    label: 'Einstellungen',
    config: { rotate: 0, bottom: 0.2, right: 0.2, fadeIn: 0.9 },
    description: '',
  },
  {
    id: 'sport',
    icon: mdiRunFast,
    label: 'Sport',
    config: { rotate: -80, bottom: 0.75, right: 3, fadeIn: 1 },
    description: '',
  },
  {
    id: 'tagebuch',
    icon: mdiBookOpenVariant,
    label: 'Tagebuch',
    config: { rotate: -45, bottom: 2.25, right: 2.25, fadeIn: 1.1 },
    description: '',
  },
  {
    id: 'aufgaben',
    icon: mdiCookieCheckOutline,
    label: 'Aufgaben',
    config: { rotate: -30, bottom: 3.25, right: 0.85, fadeIn: 1.2 },
    description: '',
  },
];

export const MainMenu = () => {
  const [menuActive, setMenuActive] = useState(false);
  const mainMenuItems: PageId[] = ['/', 'tagebuch', 'sport', 'aufgaben'];
  const pagesOfMainMenu = pages.filter(p => mainMenuItems.includes(p.id));
  const router = useRouter();

  return (
    <MainMenu_ active={menuActive} onClick={() => setMenuActive(!menuActive)}>
      {!menuActive ? (
        <IconContainer>
          <Icon path={mdiApps} size={2} color={'white'} />
        </IconContainer>
      ) : (
        <NavBarContainer>
          {pagesOfMainMenu.map(el => {
            return (
              <NavElement
                key={el.id}
                config={el.config}
                onClick={() => {
                  router.push(el.id);
                  setMenuActive(false);
                }}
              >
                <Icon path={el.icon} size={0.75} color={'white'} />
                {/* <LabelText size={0.2}>{el.label}</LabelText> */}
              </NavElement>
            );
          })}
        </NavBarContainer>
      )}
    </MainMenu_>
  );
};

type MainMenuInternalProps = {
  active: boolean;
};

export const MainMenu_ = styled.div<MainMenuInternalProps>(({ active }) => {
  const [isInitial, setIsInital] = useState(true);
  const [animation, setAnimation] = useState<string | null>(null);

  useEffect(() => {
    if (!isInitial) {
      const newAnimation = active
        ? 'animation: grow 0.5s ease forwards;'
        : 'animation: shrink 0.5s ease forwards;';
      setAnimation(newAnimation);
    }
    setIsInital(false);
  }, [active]);

  return [
    css`
      position: fixed;
      cursor: pointer;
      bottom: 0;
      right: 0;
      height: 5rem;
      width: 5rem;
      background: #db5461;
      border-top-left-radius: 100%;
      ${animation && animation}
      transform-origin: bottom right;
      @keyframes grow {
        from {
          transform: scale(1);
        }
        to {
          transform: scale(5);
        }
      }
      @keyframes shrink {
        from {
          transform: scale(5);
        }
        to {
          transform: scale(1);
        }
      }
    `,
  ];
});

const IconContainer = styled.div(() => [
  css`
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    animation: fadeIn 1s;
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `,
]);

const NavBarContainer = styled.div(() => [
  css`
    position: absolute;
    bottom: 0rem;
    right: 0rem;
  `,
]);

type NavElConfig = {
  rotate: number;
  bottom: number;
  right: number;
  fadeIn: number;
};

type NavElementProps = {
  config: NavElConfig;
};

const NavElement = styled.div<NavElementProps>(({ config }) => [
  css`
    position: absolute;
    bottom: ${config.bottom}rem;
    right: ${config.right}rem;
    transform: rotate(${config.rotate}deg);
    animation: fadeIn ${config.fadeIn}s;
    cursor: pointer;
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  `,
]);

type LabelTextProps = {
  size?: number;
};

const LabelText = styled.p<LabelTextProps>(({ size = 1 }) => [
  css`
    font-size: ${size}rem;
    color: white;
    text-align: center;
  `,
]);

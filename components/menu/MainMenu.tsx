import {
  mdiApps,
  mdiBookOpenVariant,
  mdiCookieCheckOutline,
  mdiHomeCircleOutline,
  mdiRunFast,
} from '@mdi/js'
import Icon from '@mdi/react'
import { SetStateAction, useEffect, useState } from 'react'
import { css, styled } from 'twin.macro'
import { Page } from '../../pages'

type NavEl = { id: Page; icon: string; label: string; config: NavElConfig }

const navElements: NavEl[] = [
  {
    id: 'dashboard',
    icon: mdiHomeCircleOutline,
    label: 'Dashboard',
    config: { rotate: 0, bottom: 0.2, right: 0.2, fadeIn: 0.9 },
  },
  {
    id: 'sport',
    icon: mdiRunFast,
    label: 'Sport',
    config: { rotate: -80, bottom: 0.75, right: 3, fadeIn: 1 },
  },
  {
    id: 'journal',
    icon: mdiBookOpenVariant,
    label: 'Tagebuch',
    config: { rotate: -45, bottom: 2.25, right: 2.25, fadeIn: 1.1 },
  },
  {
    id: 'duty',
    icon: mdiCookieCheckOutline,
    label: 'Aufgaben',
    config: { rotate: -30, bottom: 3.25, right: 0.85, fadeIn: 1.2 },
  },
]

type MainMenuProps = {
  setCurrentPage: React.Dispatch<SetStateAction<Page>>
}

export const MainMenu = ({ setCurrentPage }: MainMenuProps) => {
  const [menuActive, setMenuActive] = useState(false)
  return (
    <MainMenu_
      active={menuActive}
      onMouseEnter={() => setMenuActive(true)}
      onMouseLeave={() =>
        setTimeout(() => {
          setMenuActive(false)
        }, 500)
      }
    >
      {!menuActive ? (
        <IconContainer>
          <Icon path={mdiApps} size={2} color={'white'} />
        </IconContainer>
      ) : (
        <NavBarContainer>
          {navElements.map(el => {
            return (
              <NavElement
                key={el.id}
                config={el.config}
                onClick={() => setCurrentPage(el.id)}
              >
                <Icon path={el.icon} size={0.75} color={'white'} />
                {/* <LabelText size={0.2}>{el.label}</LabelText> */}
              </NavElement>
            )
          })}
        </NavBarContainer>
      )}
    </MainMenu_>
  )
}

type MainMenuInternalProps = {
  active?: boolean
}

export const MainMenu_ = styled.div<MainMenuInternalProps>(
  ({ active = false }) => {
    const [isInitial, setIsInital] = useState(true)
    const [animation, setAnimation] = useState<string | null>(null)
    useEffect(() => {
      if (!isInitial) {
        const newAnimation = active
          ? 'animation: grow 0.5s ease forwards;'
          : 'animation: shrink 0.5s ease forwards;'
        setAnimation(newAnimation)
      }
      setIsInital(false)
    }, [active])

    return [
      css`
        position: fixed;
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
    ]
  },
)

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
])

const NavBarContainer = styled.div(() => [
  css`
    position: absolute;
    bottom: 0rem;
    right: 0rem;
  `,
])

type NavElConfig = {
  rotate: number
  bottom: number
  right: number
  fadeIn: number
}

type NavElementProps = {
  config: NavElConfig
}

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
])

type LabelTextProps = {
  size?: number
}

const LabelText = styled.p<LabelTextProps>(({ size = 1 }) => [
  css`
    font-size: ${size}rem;
    color: white;
    text-align: center;
  `,
])

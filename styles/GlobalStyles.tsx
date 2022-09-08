import React from 'react';
import { Global } from '@emotion/react';
import tw, { css, theme, GlobalStyles as BaseStyles } from 'twin.macro';

const customStyles = css({
  '*': {
    boxSizing: 'border-box',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  },
  body: {
    WebkitTapHighlightColor: theme`colors.purple.500`,
    padding: 0,
    margin: 0,
    fontFamily: 'Quicksand',
    ...tw`antialiased`,
  },
  html: {
    padding: 0,
    margin: 0,
    fontFamily: 'Quicksand',
  },
  textarea: {
    minHeight: '4rem',
    width: '100%',
    border: '1px dashed gray',
    padding: '0.25rem',
  },
  input: {
    width: '100%',
    border: '1px dashed gray',
    padding: '0.25rem',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  p: {
    marginBottom: '1rem',
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
);

export default GlobalStyles;

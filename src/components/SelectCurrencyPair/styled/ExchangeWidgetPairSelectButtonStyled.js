// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const color = ({ theme }) => `
  color: ${theme.textColor};
`;

const ExchangeWidgetPairSelectButtonStyled = styled.button`
  height: 100%;
  cursor: pointer;
  margin: 0;
  position: relative;
  width: 50%;
  display: inline-flex;
  user-select: none;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: hsla(220, 45.7%, 36.8%, 0.5);
  border-width: 0;
  border-color: transparent;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0px 8px;
  transition-property: color, background-color, border, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-delay: 0ms;
  ${color}

  &:hover {
    background-color: hsl(220, 45.7%, 36.8%);
    color: #fff;
  }
`;

ExchangeWidgetPairSelectButtonStyled.displayName =
  'ExchangeWidgetPairSelectButtonStyled';

export default ExchangeWidgetPairSelectButtonStyled;

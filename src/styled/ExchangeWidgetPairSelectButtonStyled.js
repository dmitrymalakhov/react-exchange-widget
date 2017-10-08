// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const ExchangeWidgetPairSelectButtonStyled = styled.button`
  height: 100%;
  cursor: pointer;
  margin: 0;
  position: relative;
  width: 100%;
  display: -webkit-inline-box;
  display: -webkit-inline-flex;
  display: -ms-inline-flexbox;
  display: inline-flex;
  user-select: none;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-decoration: none;
  background-color: #3c5da1;
  color: #ffffff;
  border-width: 0;
  border-color: transparent;
  font-size: 14px;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0px 8px;
  border-radius: 2px;
  transition-property: color,background-color,border,box-shadow;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-delay: 0ms;
`;

ExchangeWidgetPairSelectButtonStyled.displayName =
  'ExchangeWidgetPairSelectButtonStyled';

export default ExchangeWidgetPairSelectButtonStyled;

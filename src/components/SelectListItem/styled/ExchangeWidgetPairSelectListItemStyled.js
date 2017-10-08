// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import styled from 'styled-components';

const active = ({ active }) => active
  ? `
    background-color: #ECEFF7;
  `
  : null;

const ExchangeWidgetPairSelectListItemStyled = styled.div`
  margin: 0;
  cursor: pointer;
  display: block;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  transition-property: background-color;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-delay: 0ms;
  ${active}

  &:hover,
  &:focus {
    background-color: #f5f5f5;
    outline: none;
    box-shadow: none;
  }
`;

ExchangeWidgetPairSelectListItemStyled.displayName =
  'ExchangeWidgetPairSelectListItemStyled';

export default ExchangeWidgetPairSelectListItemStyled;

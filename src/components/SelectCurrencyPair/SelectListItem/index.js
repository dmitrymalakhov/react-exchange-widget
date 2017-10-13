// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import React, { Component } from 'react';
import { ExchangeWidgetPairSelectListItemStyled } from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './../../../constants';

type Props = {
  active: boolean,
  label: string,
  value: string,
  indexInPair: CURRENCY_SOURCE_PAIR_INDEX | CURRENCY_TARGET_PAIR_INDEX,
  onClick: ({ indexInPair: number, value: string }) => void,
};

class SelectListItem extends Component<Props> {
  static defaultProps = {
    active: false,
    label: 'USD',
    value: 'USD',
    indexInPair: CURRENCY_SOURCE_PAIR_INDEX,
    onClick: () => {},
  }

  _handleClick = () => {
    const { indexInPair, value, onClick } = this.props;

    onClick({
      indexInPair,
      value,
    });
  }

  render() {
    const { active, label } = this.props;

    return (
      <ExchangeWidgetPairSelectListItemStyled
        innerRef={this._saveRef}
        active={active}
        onClick={this._handleClick}
      >
        {label}
      </ExchangeWidgetPairSelectListItemStyled>
    );
  }
}

SelectListItem.displayName = 'SelectListItem';

export default SelectListItem;

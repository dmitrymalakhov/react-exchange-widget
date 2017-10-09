// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import * as React from 'react';
import R from 'ramda';
import SelectListItem from './SelectListItem';

import {
  type Currencies,
  type CurrencyPair,
} from './../../types';

import {
  ExchangeWidgetPairSelectBoxStyled,
  ExchangeWidgetPairSelectStyled,
  ExchangeWidgetPairSelectListStyled,
  ExchangeWidgetPairSelectListBoxStyled,
  ExchangeWidgetPairSelectButtonBoxStyled,
  ExchangeWidgetPairSelectButtonStyled,
} from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './../../constants';

type Props = {
  defaultPair: CurrencyPair,
  currencies: Currencies,
  onChange: ({ value: CurrencyPair }) => CurrencyPair,
  onCancel: () => void,
};

type State = {
  pair: [string, string],
}

type IndexedCurrency = {
  index: number,
  value: string,
}

class SelectCurrencyPair extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'USD'],
    currencies: { USD: 'USD' },
    onChange: () => ['USD', 'USD'],
    onCancel: () => {},
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      pair: props.defaultPair,
    };
  }

  _handleClickCurrencyPair = (indexedCurrency: IndexedCurrency) => {
    const mapIndexed = R.addIndex(R.map),
      { index, value } = indexedCurrency;

    this.setState({
      pair: mapIndexed(
        (item, idx) => index === idx ? value : item,
        this.state.pair,
      ),
    });
  }

  _handleChange = () => {
    this.props.onChange({
      value: this.state.pair,
    });
  }

  _handleCancel = () => {
    this.props.onCancel();
  }

  render() {
    const { currencies } = this.props,
      { pair } = this.state;

    const mapToElement = (currencyNum: number) =>
      (currency: string): React.Element<any> => (
        <SelectListItem
          key={`${currencyNum}${currency}`}
          index={currencyNum}
          label={currency}
          value={currency}
          active={pair[currencyNum] === currency}
          onClick={this._handleClickCurrencyPair}
        />
      );

    const currenciesListSource = R.map(
      mapToElement(CURRENCY_SOURCE_PAIR_INDEX),
      currencies,
    );

    const currenciesListTarget = R.map(
      mapToElement(CURRENCY_TARGET_PAIR_INDEX),
      currencies,
    );

    return (
      <ExchangeWidgetPairSelectBoxStyled>
        <ExchangeWidgetPairSelectListBoxStyled>
          <ExchangeWidgetPairSelectStyled>
            <ExchangeWidgetPairSelectListStyled>
              { currenciesListSource }
            </ExchangeWidgetPairSelectListStyled>
          </ExchangeWidgetPairSelectStyled>
          <ExchangeWidgetPairSelectStyled>
            <ExchangeWidgetPairSelectListStyled>
              { currenciesListTarget }
            </ExchangeWidgetPairSelectListStyled>
          </ExchangeWidgetPairSelectStyled>
        </ExchangeWidgetPairSelectListBoxStyled>
        <ExchangeWidgetPairSelectButtonBoxStyled>
          <ExchangeWidgetPairSelectButtonStyled
            onClick={this._handleChange}
          >
            OK
          </ExchangeWidgetPairSelectButtonStyled>
          <ExchangeWidgetPairSelectButtonStyled
            onClick={this._handleCancel}
          >
            CANCEL
          </ExchangeWidgetPairSelectButtonStyled>
        </ExchangeWidgetPairSelectButtonBoxStyled>
      </ExchangeWidgetPairSelectBoxStyled>
    );
  }
}

SelectCurrencyPair.displayName = 'SelectCurrencyPair';

export default SelectCurrencyPair;

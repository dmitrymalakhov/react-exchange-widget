// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';


import * as React from 'react';
import exchangeApi, { type CRUD } from './services/exchangeApi';
import SelectCurrencyPair from './components/SelectCurrencyPair';
import TriangleDivided from './components/TriangleDivided';

import {
  type Currencies,
  type CurrencyPair,
} from './types';

import { isUndef } from './utils/misc';

import {
  ExchangeWidgetBoxStyled,
  ExchangeWidgetStyled,
  ExchangeWidgetPairStyled,
  ExchangeWidgetPairBoxStyled,
  ExchangeWidgetCurrencyConverterStyled,
  ExchangeWidgetCurrencyConverterInputBoxStyled,
  ExchangeWidgetCurrencyConverterInputStyled,
} from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './constants';

type Props = {
  defaultPair: CurrencyPair,
  pair: ?CurrencyPair,
  serviceApiConfig: {
    appID: string,
  },
};

type State = {
  currencies: Currencies,
  exchangeRate: number,
  choicePairVisible: boolean,
  pair: CurrencyPair,
};

class ExchangeWidget extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'USD'],
    pair: void 0,
    serviceApiConfig: {
      appID: '',
    },
  }

  constructor(props: Props) {
    super(props);

    this._connection = exchangeApi(props.serviceApiConfig.appID);
    this._currenciesConnection = this._connection('currencies');
    this._latestExchangeConnection = this._connection('latest');

    this._currenciesIndex = new Map();
    this._availableCurrencies = [];
  }

  state = {
    currencies: {},
    pair: isUndef(this.props.pair)
      ? this.props.defaultPair
      : this.props.pair,
    exchangeRate: 1,
    choicePairVisible: false,
  };

  componentDidMount() {
    this._currenciesConnection.read()
      .then((currencies: { data: Currencies}): void => {
        const currenciesShortLabels: Array<string>
          = Object.keys(currencies.data);

        this._availableCurrencies = currenciesShortLabels;

        currenciesShortLabels.forEach((item: string, idx: number) => {
          this._currenciesIndex.set(item, idx);
        });
      });
  }

  _availableCurrencies: Array<string>;
  _currenciesIndex: Map<string, number>;
  _connection: string => Function;
  _currenciesConnection: string => CRUD;
  _latestExchangeConnection: string => CRUD;

  _handleShowCurrencyPairModal = () => {
    this.setState({
      choicePairVisible: true,
    });
  }

  _handleChangeCurrencyPair = ({ value }: CurrencyPair) => {
    this._latestExchangeConnection.read({
      base: value[CURRENCY_SOURCE_PAIR_INDEX],
    }).then(data => {
      this.setState({
        pair: value,
        exchangeRate: data.data.rates[value[CURRENCY_TARGET_PAIR_INDEX]],
        choicePairVisible: false,
      });
    });
  }

  _handleCancelChoiceCurrencyPair = () => {
    this.setState({
      choicePairVisible: false,
    });
  }

  _renderCurrenciesPairSelect() {
    const { choicePairVisible, pair } = this.state;

    if (!this._availableCurrencies.length || !choicePairVisible)
      return null;

    return (
      <SelectCurrencyPair
        currencies={this._availableCurrencies}
        currenciesIndex={this._currenciesIndex}
        defaultPair={pair}
        onChange={this._handleChangeCurrencyPair}
        onCancel={this._handleCancelChoiceCurrencyPair}
      />
    );
  }

  _renderPair() {
    const { exchangeRate, pair } = this.state;

    if (!pair)
      return null;

    const pairExchange =
      `1 ${pair[CURRENCY_SOURCE_PAIR_INDEX]} =
        ${exchangeRate} ${pair[CURRENCY_TARGET_PAIR_INDEX]}`;

    return (
      <ExchangeWidgetPairBoxStyled>
        <ExchangeWidgetPairStyled onClick={this._handleShowCurrencyPairModal}>
          {pairExchange}
        </ExchangeWidgetPairStyled>
      </ExchangeWidgetPairBoxStyled>
    );
  }

  _renderExchangeCurrency() {
    return (
      <ExchangeWidgetCurrencyConverterStyled>
        <ExchangeWidgetCurrencyConverterInputBoxStyled>
          <ExchangeWidgetCurrencyConverterInputStyled>
            input0
          </ExchangeWidgetCurrencyConverterInputStyled>
        </ExchangeWidgetCurrencyConverterInputBoxStyled>
        <ExchangeWidgetCurrencyConverterInputBoxStyled>
          <TriangleDivided />
          <ExchangeWidgetCurrencyConverterInputStyled>
            input1
          </ExchangeWidgetCurrencyConverterInputStyled>
        </ExchangeWidgetCurrencyConverterInputBoxStyled>
      </ExchangeWidgetCurrencyConverterStyled>
    );
  }

  render() {
    const { choicePairVisible } = this.state;

    const currenciesPair = this._renderPair(),
      currenciesPairSelect = this._renderCurrenciesPairSelect(),
      exchangeCurrency = this._renderExchangeCurrency();

    return (
      <ExchangeWidgetBoxStyled>
        <ExchangeWidgetStyled blur={choicePairVisible}>
          {currenciesPair}
          {exchangeCurrency}
        </ExchangeWidgetStyled>
        {currenciesPairSelect}
      </ExchangeWidgetBoxStyled>
    );
  }
}

ExchangeWidget.displayName = 'ExchangeWidget';

export default ExchangeWidget;

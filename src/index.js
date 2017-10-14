// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import exchangeApi, { type CRUD } from './services/exchangeApi';
import SelectCurrencyPair from './components/SelectCurrencyPair';
import TriangleDivided from './components/TriangleDivided';
import defaultTheme from './theme/defaultTheme';

import {
  type Currencies,
  type CurrencyPair,
  type CurrencyValue,
  type Theme,
} from './types';

import {
  isUndef,
  parseFloatFix2,
  isNumeric,
} from './utils/misc';

import {
  ExchangeWidgetBoxStyled,
  ExchangeWidgetStyled,
  ExchangeWidgetPairStyled,
  ExchangeWidgetPairBoxStyled,
  ExchangeWidgetCurrencyConverterStyled,
  ExchangeWidgetCurrencyConverterInputBoxStyled,
  ExchangeWidgetCurrencyConverterContentStyled,
  ExchangeWidgetCurrencyConverterLabel,
  ExchangeWidgetCurrencyConverterInputStyled,
  ExchangeWidgetCurrencyConverterTargetStyled,
} from './styled';

import {
  CURRENCY_SOURCE_PAIR_INDEX,
  CURRENCY_TARGET_PAIR_INDEX,
} from './constants';

type Props = {
  defaultPair: CurrencyPair,
  defaultValue: CurrencyValue,
  pair: ?CurrencyPair,
  value: ?CurrencyValue,
  serviceApiConfig: {
    appID: string,
  },
  syncAuto: boolean,
  syncTimeout: number,
  theme: Theme,
};

type State = {
  currencies: Currencies,
  exchangeRate: number,
  choicePairVisible: boolean,
  pair: CurrencyPair,
  value: CurrencyValue,
};

class ExchangeWidget extends React.Component<Props, State> {
  static defaultProps = {
    defaultPair: ['USD', 'USD'],
    defaultValue: [0, 0],
    pair: void 0,
    value: void 0,
    serviceApiConfig: {
      appID: '',
    },
    syncAuto: false,
    syncTimeout: 5000,
    theme: defaultTheme,
  }

  constructor(props: Props) {
    super(props);

    this._connection = exchangeApi(props.serviceApiConfig.appID);
    this._currenciesConnection = this._connection('currencies');
    this._latestExchangeConnection = this._connection('latest');

    this._currenciesIndex = new Map();
    this._availableCurrencies = [];

    this._domNodeInput = null;
    this._syncAutoTimerId = null;
  }

  state = {
    currencies: {},
    pair: isUndef(this.props.pair)
      ? this.props.defaultPair
      : this.props.pair,
    value: isUndef(this.props.value)
      ? this.props.defaultValue
      : this.props.value,
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

    if (this.props.syncAuto) {
      this._syncAutoTimerId = setTimeout(
        this._syncExchangeRate,
        this.props.syncTimeout,
      );
    }

    this._domNodeInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.autoSync !== this.props.autoSync) {
      if (nextProps.autoSync)
        this._startSyncTimer();
      else
        this._stopSyncTimer();
    }
  }

  componentWillUnmount() {
    if (this.props.syncAuto)
      this._stopSyncTimer();
  }

  _availableCurrencies: Array<string>;
  _currenciesIndex: Map<string, number>;
  _connection: string => Function;
  _currenciesConnection: string => CRUD;
  _latestExchangeConnection: string => CRUD;

  _saveRefInput = ref => {
    this._domNodeInput = ref;
  }

  _getTheme() {
    const { theme } = this.props;

    return {
      ...defaultTheme,
      ...theme,
    };
  }

  _startSyncTimer() {
    this._syncAutoTimerId = setTimeout(
      this._syncExchangeRate,
      this.props.syncTimeout,
    );
  }

  _stopSyncTimer() {
    clearTimeout(this._syncAutoTimerId);
    this._syncAutoTimerId = null;
  }

  _syncExchangeRate = () => {
    const { pair } = this.state;

    this._latestExchangeConnection.read({
      base: pair[CURRENCY_SOURCE_PAIR_INDEX],
    }).then(data => {
      const exchangeRate = data.data.rates[pair[CURRENCY_TARGET_PAIR_INDEX]],
        sourceValue = this.state.value[CURRENCY_SOURCE_PAIR_INDEX];

      if (exchangeRate !== this.state.exchangeRate) {
        this.setState({
          value: [
            sourceValue,
            parseFloatFix2(sourceValue * exchangeRate),
          ],
          exchangeRate,
        });
      }
    });

    if (this.props.syncAuto)
      this._startSyncTimer();
  }

  _handleChangeSourceValue = ({ target }) => {
    const { exchangeRate } = this.state,
      { value } = target;

    if (isNumeric(value) || value === '') {
      if (isUndef(this.props.value)) {
        this.setState({
          value: [
            target.value,
            parseFloatFix2(value * exchangeRate),
          ],
        });
      }
    }
  }

  _handleShowCurrencyPairModal = () => {
    this.setState({
      choicePairVisible: true,
    });
  }

  _handleChangeCurrencyPair = ({ value }: CurrencyPair) => {
    this._latestExchangeConnection.read({
      base: value[CURRENCY_SOURCE_PAIR_INDEX],
    }).then(data => {
      const exchangeRate = data.data.rates[value[CURRENCY_TARGET_PAIR_INDEX]],
        sourceValue = this.state.value[CURRENCY_SOURCE_PAIR_INDEX];

      this.setState({
        pair: value,
        value: [
          sourceValue,
          parseFloatFix2(sourceValue * exchangeRate),
        ],
        exchangeRate,
        choicePairVisible: false,
      });

      this._domNodeInput.focus();
    });
  }

  _handleCancelChoiceCurrencyPair = () => {
    this.setState({
      choicePairVisible: false,
    });

    this._domNodeInput.focus();
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
    const { pair, value } = this.state;

    const sourceCurrency = pair ? pair[CURRENCY_SOURCE_PAIR_INDEX] : 'USD',
      sourceValue = value ? value[CURRENCY_SOURCE_PAIR_INDEX] : 0,
      targetCurrency = pair ? pair[CURRENCY_TARGET_PAIR_INDEX] : 'USD',
      targetValue = value ? value[CURRENCY_TARGET_PAIR_INDEX] : 0;

    return (
      <ExchangeWidgetCurrencyConverterStyled>
        <ExchangeWidgetCurrencyConverterInputBoxStyled>
          <ExchangeWidgetCurrencyConverterContentStyled>
            <ExchangeWidgetCurrencyConverterLabel>
              {sourceCurrency}
            </ExchangeWidgetCurrencyConverterLabel>
            <ExchangeWidgetCurrencyConverterInputStyled
              innerRef={this._saveRefInput}
              onChange={this._handleChangeSourceValue}
              value={sourceValue}
            />
          </ExchangeWidgetCurrencyConverterContentStyled>
        </ExchangeWidgetCurrencyConverterInputBoxStyled>
        <ExchangeWidgetCurrencyConverterInputBoxStyled>
          <TriangleDivided />
          <ExchangeWidgetCurrencyConverterContentStyled>
            <ExchangeWidgetCurrencyConverterLabel>
              {targetCurrency}
            </ExchangeWidgetCurrencyConverterLabel>
            <ExchangeWidgetCurrencyConverterTargetStyled
              value={targetValue}
            >
              {targetValue}
            </ExchangeWidgetCurrencyConverterTargetStyled>
          </ExchangeWidgetCurrencyConverterContentStyled>
        </ExchangeWidgetCurrencyConverterInputBoxStyled>
      </ExchangeWidgetCurrencyConverterStyled>
    );
  }

  render() {
    const { choicePairVisible } = this.state;

    const theme = this._getTheme();

    const currenciesPair = this._renderPair(),
      currenciesPairSelect = this._renderCurrenciesPairSelect(),
      exchangeCurrency = this._renderExchangeCurrency();

    return (
      <ThemeProvider theme={theme}>
        <ExchangeWidgetBoxStyled>
          <ExchangeWidgetStyled blur={choicePairVisible}>
            {currenciesPair}
            {exchangeCurrency}
          </ExchangeWidgetStyled>
          {currenciesPairSelect}
        </ExchangeWidgetBoxStyled>
      </ThemeProvider>
    );
  }
}

ExchangeWidget.displayName = 'ExchangeWidget';

export default ExchangeWidget;

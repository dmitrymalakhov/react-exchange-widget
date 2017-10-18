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
  noop,
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
  DEFAULT_CURRENCY,
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
  onChange: ({ value: CurrencyValue, pair: CurrencyPair }) => void,
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
    defaultPair: [DEFAULT_CURRENCY, DEFAULT_CURRENCY],
    defaultValue: [0, 0],
    pair: void 0,
    value: void 0,
    serviceApiConfig: {
      appID: '',
    },
    syncAuto: false,
    syncTimeout: 5000,
    theme: defaultTheme,
    onChange: noop,
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
    this._unmounted = true;
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
    this._unmounted = false;

    this._currenciesConnection.read()
      .then((currencies: { data: Currencies}): void => {
        const currenciesShortLabels: Array<string>
          = Object.keys(currencies.data);

        this._availableCurrencies = currenciesShortLabels;

        currenciesShortLabels.forEach((item: string, idx: number) => {
          this._currenciesIndex.set(item, idx);
        });
      });

    if (this.props.syncAuto)
      this._startSyncTimer();

    this.focusInput();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.syncAuto !== this.props.syncAuto) {
      if (nextProps.syncAuto)
        this._startSyncTimer();
      else
        this._stopSyncTimer();
    }
  }

  componentWillUnmount() {
    this._unmounted = true;

    if (this.props.syncAuto)
      this._stopSyncTimer();
  }

  _availableCurrencies: Array<string>;
  _currenciesIndex: Map<string, number>;
  _connection: string => Function;
  _currenciesConnection: string => CRUD;
  _latestExchangeConnection: string => CRUD;
  _domNodeInput: ?HTMLInputElement;
  _syncAutoTimerId: ?number;
  _unmounted: boolean;

  focusInput() {
    if (this._domNodeInput)
      this._domNodeInput.focus();
  }

  _saveRefInput = (ref: ?HTMLInputElement) => {
    this._domNodeInput = ref;
  }

  _getTheme() {
    const { theme } = this.props;

    return {
      ...defaultTheme,
      ...theme,
    };
  }

  _getPair() {
    return isUndef(this.props.pair)
      ? this.state.pair
      : this.props.pair;
  }

  _getValue() {
    return isUndef(this.props.value)
      ? this.state.value
      : this.props.value;
  }

  _startSyncTimer() {
    if (this._unmounted)
      return;

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

    const sourceCurrency = pair
      ? pair[CURRENCY_SOURCE_PAIR_INDEX]
      : DEFAULT_CURRENCY;

    this._latestExchangeConnection.read({
      base: sourceCurrency,
    }).then(data => {
      const targetCurrency = pair
        ? pair[CURRENCY_TARGET_PAIR_INDEX]
        : DEFAULT_CURRENCY;
      
      const exchangeRate = data.data.rates[targetCurrency];

      const sourceValue = this.state.value
        ? this.state.value[CURRENCY_SOURCE_PAIR_INDEX]
        : 0;

      if (exchangeRate !== this.state.exchangeRate) {
        const newValue = [
          sourceValue,
          parseFloatFix2(sourceValue * exchangeRate),
        ];

        if (!this._unmounted) {
          this.setState({
            value: newValue,
            exchangeRate,
          });

          this.props.onChange({
            value: newValue,
            pair,
          });
        }
      }
    });

    if (this.props.syncAuto)
      this._startSyncTimer();
  }

  _handleChangeSourceValue = ({ target }: SyntheticInputEvent<any>) => {
    const { exchangeRate, pair } = this.state,
      { value } = target;

    if (isNumeric(value) || value === '') {
      if (isUndef(this.props.value)) {
        const sourceValue = target.value;

        const targetValue = value !== ''
          ? parseFloatFix2(parseFloat(value) * exchangeRate)
          : 0;

        const newValue = [sourceValue, targetValue];

        this.setState({
          value: newValue,
        });

        this.props.onChange({
          value: newValue,
          pair,
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
      const exchangeRate = data.data.rates[value[CURRENCY_TARGET_PAIR_INDEX]];

      const sourceValue = this.state.value
        ? this.state.value[CURRENCY_SOURCE_PAIR_INDEX]
        : 0;

      const newPair = value;

      const newValue = [
        sourceValue,
        parseFloatFix2(sourceValue * exchangeRate),
      ];

      if (!this._unmounted) {
        this.setState({
          pair: newPair,
          value: newValue,
          exchangeRate,
          choicePairVisible: false,
        });

        this.props.onChange({
          pair: newPair,
          value: newValue,
        });

        this.focusInput();
      }
    });
  }

  _handleCancelChoiceCurrencyPair = () => {
    this.setState({
      choicePairVisible: false,
    });

    this.focusInput();
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
    const pair = this._getPair(),
      value = this._getValue();

    const sourceCurrency = pair ? pair[CURRENCY_SOURCE_PAIR_INDEX] : DEFAULT_CURRENCY,
      sourceValue = value ? value[CURRENCY_SOURCE_PAIR_INDEX] : 0,
      targetCurrency = pair ? pair[CURRENCY_TARGET_PAIR_INDEX] : DEFAULT_CURRENCY,
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

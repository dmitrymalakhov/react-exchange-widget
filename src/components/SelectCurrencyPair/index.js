// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import * as React from 'react';
import R from 'ramda';
import { List } from 'react-virtualized';
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
  currenciesIndex: Map<string, number>,
  onChange: ({ value: CurrencyPair }) => CurrencyPair,
  onCancel: () => void,
};

type State = {
  pair: [string, string],
}

type IndexedCurrency = {
  indexInPair: number,
  value: string,
}

type VirtualizedOptions = {
  key: number,
  style: {},
  index: number,
  parent: { [string]: any }
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
      { indexInPair, value } = indexedCurrency;

    this.setState({
      pair: mapIndexed(
        (item, idx) => indexInPair === idx ? value : item,
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

  _renderRow({ key, style, index, parent }: VirtualizedOptions, indexInPair: number): React.Element<any> {
    const currency = this.props.currencies[index],
      { pair } = parent.props;

    return (
      <div key={key} style={style}>
        <SelectListItem
          indexInPair={indexInPair}
          label={currency}
          value={currency}
          active={currency === pair[indexInPair]}
          onClick={this._handleClickCurrencyPair}
        />
      </div>
    );
  }

  _renderRowSource = (options: VirtualizedOptions): React.Element<any> =>
    this._renderRow(options, CURRENCY_SOURCE_PAIR_INDEX);

  _renderRowTarget = (options: VirtualizedOptions): React.Element<any> =>
    this._renderRow(options, CURRENCY_TARGET_PAIR_INDEX);


  render() {
    const { currencies, currenciesIndex } = this.props,
      { pair } = this.state;

    const listHeight = 320,
      rowHeight = 34,
      frameCount = (listHeight / rowHeight, 10) | 0;

    const scrollToSourceIndex = (frameCount / 2)
      + currenciesIndex.get(pair[CURRENCY_SOURCE_PAIR_INDEX]);
    
    const scrollToTargetIndex = (frameCount / 2)
      + currenciesIndex.get(pair[CURRENCY_TARGET_PAIR_INDEX]);
 
    const currenciesListSource = (
      <List
        rowCount={currencies.length}
        rowHeight={rowHeight}
        pair={pair}
        width={200}
        height={listHeight}
        rowRenderer={this._renderRowSource}
        scrollToIndex={scrollToSourceIndex}
      />
    );

    const currenciesListTarget = (
      <List
        rowCount={currencies.length}
        rowHeight={rowHeight}
        pair={pair}
        width={200}
        height={listHeight}
        rowRenderer={this._renderRowTarget}
        scrollToIndex={scrollToTargetIndex}
      />
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

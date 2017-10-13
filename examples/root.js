// @flow

/**
 * @author Dmitry Malakhov
 */

'use strict';

import React, { Component } from 'react';
import { HuePicker } from 'react-color';

import {
  RootStyled,
  RootExchangeContainerStyled,
  RootInputLabelStyled,
} from './styled';

import ExchangeWidget from '../src';

const serviceApiConfig = {
  appID: '830bd997de434b7d9b8f11a239ab8eca',
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      background: void 0,
      height: void 0,
      width: void 0,
    };
  }

  _getTheme() {
    const { background, height, width } = this.state;

    const theme = {};

    if (background)
      theme.background = background;

    if (height)
      theme.height = height;

    if (width)
      theme.width = width;

    return theme;
  }

  _handleChangeBackground = ({ hex }) => {
    this.setState({
      background: hex,
    });
  }

  _handleChangeHeight = ({ target }) => {
    this.setState({
      height: `${target.value}px`,
    });
  }

  _handleChangeWidth = ({ target }) => {
    this.setState({
      width: `${target.value}px`,
    });
  }

  render() {
    const theme = this._getTheme();

    return (
      <RootStyled>
        <RootExchangeContainerStyled>
          <ExchangeWidget serviceApiConfig={serviceApiConfig} theme={theme} />
        </RootExchangeContainerStyled>
        <HuePicker
          color={this.state.background}
          onChange={this._handleChangeBackground}
        />
        <RootInputLabelStyled>
          Height
          <input
            type="range"
            min="200"
            max="800"
            name="height"
            onChange={this._handleChangeHeight}
          />
        </RootInputLabelStyled>
        <RootInputLabelStyled>
          Width
          <input
            type="range"
            min="310"
            max="800"
            name="width"
            onChange={this._handleChangeWidth}
          />
        </RootInputLabelStyled>
        
      </RootStyled>
    );
  }
}

Root.displayName = 'Root';

export default Root;

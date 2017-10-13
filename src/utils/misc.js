/**
 * @author Dmitry Malakhov
 */

'use strict';

export const noop = () => {};
export const isUndef = maybeUndef => typeof maybeUndef === 'undefined';
export const parseFloatFix2 = number => Math.round(number * 100) / 100;

export const isNumeric = maybeNumeric =>
  !isNaN(parseFloat(maybeNumeric)) && isFinite(maybeNumeric);

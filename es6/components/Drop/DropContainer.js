var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

import FocusedContainer from '../FocusedContainer';
import { findScrollParents, findVisibleParent } from '../../utils';
import { Keyboard } from '../Keyboard';

import StyledDrop from './StyledDrop';

var DropContainer = function (_Component) {
  _inherits(DropContainer, _Component);

  function DropContainer() {
    var _temp, _this, _ret;

    _classCallCheck(this, DropContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.addScrollListener = function () {
      var target = _this.props.target;

      _this.scrollParents = findScrollParents(target);
      _this.scrollParents.forEach(function (scrollParent) {
        return scrollParent.addEventListener('scroll', _this.place);
      });
    }, _this.removeScrollListener = function () {
      _this.scrollParents.forEach(function (scrollParent) {
        return scrollParent.removeEventListener('scroll', _this.place);
      });
    }, _this.onClickDocument = function (event) {
      var onClickOutside = _this.props.onClickOutside;

      if (!findDOMNode(_this.dropRef).contains(event.target)) {
        if (onClickOutside) {
          onClickOutside();
        }
      }
    }, _this.onResize = function () {
      _this.removeScrollListener();
      _this.addScrollListener();
      _this.place();
    }, _this.place = function () {
      var _this$props = _this.props,
          align = _this$props.align,
          responsive = _this$props.responsive;

      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      var target = findDOMNode(_this.props.target);
      var container = findDOMNode(_this.dropRef);
      if (container && target) {
        // clear prior styling
        container.style.left = '';
        container.style.width = '';
        container.style.top = '';
        container.style.maxHeight = '';

        // get bounds
        var targetRect = findVisibleParent(target).getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();

        // determine width
        var width = Math.min(Math.max(targetRect.width, containerRect.width), windowWidth);

        // set left position
        var left = void 0;
        if (align.left) {
          if (align.left === 'left') {
            left = targetRect.left;
          } else if (align.left === 'right') {
            left = targetRect.left - width;
          }
        } else if (align.right) {
          if (align.right === 'left') {
            left = targetRect.left - width;
          } else if (align.right === 'right') {
            left = targetRect.left + targetRect.width - width;
          }
        }

        if (left + width > windowWidth) {
          left -= left + width - windowWidth;
        } else if (left < 0) {
          left = 0;
        }

        // set top position
        var top = void 0;
        var maxHeight = void 0;
        if (align.top) {
          if (align.top === 'top') {
            top = targetRect.top;
            maxHeight = Math.min(windowHeight - targetRect.top, windowHeight);
          } else {
            top = targetRect.bottom;
            maxHeight = Math.min(windowHeight - targetRect.bottom, windowHeight - targetRect.height);
          }
        } else if (align.bottom) {
          if (align.bottom === 'bottom') {
            top = targetRect.bottom - containerRect.height;
            maxHeight = Math.max(targetRect.bottom, 0);
          } else {
            top = targetRect.top - containerRect.height;
            maxHeight = Math.max(targetRect.top, 0);
          }
        }

        // if we can't fit it all, see if there's more room the other direction
        if (containerRect.height > maxHeight) {
          // We need more room than we have.
          if (align.top && top > windowHeight / 2) {
            // We put it below, but there's more room above, put it above
            if (align.top === 'bottom') {
              if (responsive) {
                top = Math.max(targetRect.top - containerRect.height, 0);
              }
              maxHeight = targetRect.top;
            } else {
              if (responsive) {
                top = Math.max(targetRect.bottom - containerRect.height, 0);
              }
              maxHeight = targetRect.bottom;
            }
          } else if (align.bottom && maxHeight < windowHeight / 2) {
            // We put it above but there's more room below, put it below
            if (align.bottom === 'bottom') {
              if (responsive) {
                top = targetRect.top;
              }
              maxHeight = Math.min(windowHeight - top, windowHeight);
            } else {
              if (responsive) {
                top = targetRect.bottom;
              }
              maxHeight = Math.min(windowHeight - top, windowHeight - targetRect.height);
            }
          }
        }

        container.style.left = left + 'px';
        // offset width by 0.1 to avoid a bug in ie11 that
        // unnecessarily wraps the text if width is the same
        container.style.width = width + 0.1 + 'px';
        // the (position:absolute + scrollTop)
        // is presenting issues with desktop scroll flickering
        container.style.top = top + 'px';
        container.style.maxHeight = windowHeight - (top || 0) + 'px';
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  DropContainer.prototype.componentDidMount = function componentDidMount() {
    var restrictFocus = this.props.restrictFocus;

    this.addScrollListener();
    window.addEventListener('resize', this.onResize);
    document.addEventListener('click', this.onClickDocument);

    this.place();

    if (restrictFocus) {
      findDOMNode(this.dropRef).focus();
    }
  };

  DropContainer.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeScrollListener();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('click', this.onClickDocument);
  };

  DropContainer.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        children = _props.children,
        onClickOutside = _props.onClickOutside,
        onEsc = _props.onEsc,
        onKeyDown = _props.onKeyDown,
        theme = _props.theme,
        rest = _objectWithoutProperties(_props, ['children', 'onClickOutside', 'onEsc', 'onKeyDown', 'theme']);

    var grommet = this.context.grommet;


    return React.createElement(
      FocusedContainer,
      null,
      React.createElement(
        Keyboard,
        { onEsc: onEsc, onKeyDown: onKeyDown },
        React.createElement(
          StyledDrop,
          _extends({
            tabIndex: '-1',
            ref: function ref(_ref) {
              _this2.dropRef = _ref;
            },
            theme: theme,
            grommet: grommet
          }, rest),
          children
        )
      )
    );
  };

  return DropContainer;
}(Component);

DropContainer.defaultProps = {
  centered: true
};
DropContainer.contextTypes = {
  grommet: PropTypes.object
};


export default DropContainer;
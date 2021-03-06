import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import './styles.scss';

export const baseClass = 'alert-input-component';

export default class AlertInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      isPopoverVisible: false,
    };
    this.getRef = this.getRef.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  getRef() {
    return this.root;
  }

  setRef(root) {
    this.root = root;
  }

  handleMouseEnter() {
    if (this.props.alertMessage) {
      this.setState({ isPopoverVisible: true });
    }
  }

  handleMouseLeave() {
    this.setState({ isPopoverVisible: false });
  }

  handleInputFocus(event) {
    event.target.select();
    this.setState({
      isFocused: true,
      isPopoverVisible: Boolean(this.props.alertMessage),
    });
  }

  handleInputBlur(event) {
    this.setState({
      isFocused: false,
      isPopoverVisible: false,
    });

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  render() {
    const {
      defaultValue,
      value,
      prefixAddon,
      suffixAddon,
      alertStatus = '',
      alertMessage,
      onValueChange,
    } = this.props;

    const className = classnames({
      [baseClass]: true,
      [alertStatus]: true,
      'is-focused': this.state.isFocused,
    });

    return (
      <div
        className={className}
        ref={this.setRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {prefixAddon ? <span className={`${baseClass}-addon`}>{prefixAddon}</span> : null}
        <input
          className={`${baseClass}-input`}
          type="text"
          defaultValue={defaultValue}
          value={value}
          onChange={onValueChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        />
        {suffixAddon ? <span className={`${baseClass}-addon`}>{suffixAddon}</span> : null}
        <Overlay
          show={this.state.isPopoverVisible}
          target={this.getRef}
          placement="bottom"
        >
          <Popover className={`${baseClass}-popover ${alertStatus}`} id="alert-input-popover">
            <strong>{alertMessage}</strong>
          </Popover>
        </Overlay>
      </div>
    );
  }
}

AlertInput.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  prefixAddon: PropTypes.node,
  suffixAddon: PropTypes.node,
  alertStatus: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  alertMessage: PropTypes.string,
  onValueChange: PropTypes.func,
  onBlur: PropTypes.func,
};

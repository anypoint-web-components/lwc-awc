import { api, track } from 'lwc';
/**
@license
Copyright 2017 Mulesoft.

All rights reserved.
*/

/**
 * Use `ControlStateMixin` to implement an element that can be pressed and active when toggles.
 *
 * @exports ControlStateMixin
 * @param {*} base - The class to mix onto.
 * @return {module:ControlStateMixin~mixin} The mixin class.
 */
export const ControlStateMixin = (base) =>
  /**
   * @mixin
   * @alias module:ControlStateMixin~mixin
   */
  class extends base {
    @track hasFocus;
    @track isDisabled;

    /**
     * @return {Boolean} True when the element is currently being pressed as
     * the user is holding down the button on the element.
     */
    @api
    get focused() {
      return this.hasFocus;
    }

    set focused(value) {
      const old = this.hasFocus;
      if (old === value) {
        return;
      }
      this.hasFocus = value;
      if (value) {
        this.setAttribute('focused', '');
      } else {
        this.removeAttribute('focused');
      }
      this.dispatchEvent(new CustomEvent('focusedchanged', {
        detail: {
          value
        }
      }));
      this._changedControlState();
    }

    @api
    get disabled() {
      return this.isDisabled;
    }

    set disabled(value) {
      const old = this.isDisabled;
      if (old === value) {
        return;
      }
      this.isDisabled = value;
      if (value) {
        this.setAttribute('disabled', '');
      } else {
        this.removeAttribute('disabled');
      }
      this.dispatchEvent(new CustomEvent('disabledchanged', {
        detail: {
          value
        }
      }));
      this._disabledChanged(value);
      this._changedControlState();
    }

    /**
     * @constructor
     */
    constructor() {
      super();
      this._focusBlurHandlerBinded = this._focusBlurHandler.bind(this);
    }
    /**
     * Registers hover listeners
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.addEventListener('focus', this._focusBlurHandlerBinded);
      this.addEventListener('blur', this._focusBlurHandlerBinded);
      this.isConencted = true;
    }
    /**
     * Removes hover listeners
     */
    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.removeEventListener('focus', this._focusBlurHandlerBinded);
      this.removeEventListener('blur', this._focusBlurHandlerBinded);
      this.isConencted = false;
    }

    _focusBlurHandler(e) {
      if (this.disabled) {
        if (this.focused) {
          this.focused = false;
          this.blur();
        }
        return;
      }
      this.focused = e.type === 'focus';
    }

    _disabledChanged(disabled) {
      this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      this.style.pointerEvents = disabled ? 'none' : '';
      if (disabled) {
        // Read the `tabindex` attribute instead of the `tabIndex` property.
        // The property returns `-1` if there is no `tabindex` attribute.
        // This distinction is important when restoring the value because
        // leaving `-1` hides shadow root children from the tab order.
        this._oldTabIndex = this.getAttribute('tabindex');
        this.focused = false;
        this.setAttribute('tabindex', '-1');
        this.blur();
      } else if (this._oldTabIndex !== undefined) {
        if (this._oldTabIndex === null) {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', this._oldTabIndex);
        }
      }
    }

    _changedControlState() {
      // _controlStateChanged is abstract, follow-on mixins may implement it
      if (this._controlStateChanged) {
        this._controlStateChanged();
      }
    }
  };

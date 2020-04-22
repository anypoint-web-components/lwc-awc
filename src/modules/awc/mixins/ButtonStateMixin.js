
import { api } from 'lwc';
/**
@license
Copyright 2017 Mulesoft.

All rights reserved.
*/

/**
 * Use `ButtonStateMixin` to implement an element that can be pressed and active when toggles.
 *
 * @exports ButtonStateMixin
 * @param {*} base - The class to mix onto.
 * @return {module:ButtonStateMixin~mixin} The mixin class.
 */
export const ButtonStateMixin = (base) =>
  /**
   * @mixin
   * @alias module:ButtonStateMixin~mixin
   */
  class extends base {
    _pointerDown;
    _receivedFocusFromKeyboard;

    /**
     * @return {Boolean} When true, the button toggles the active state with each
     * click or press of the spacebar.
     */
    @api
    get toggles() {
      return this._toggles || false;
    }

    set toggles(value) {
      const old = this._toggles;
      if (value === old) {
        return;
      }
      this._toggles = value;
      if (value) {
        this.setAttribute('toggles', '');
      } else {
        this.removeAttribute('toggles');
      }
    }

    /**
     * @return {Boolean} True when the element is currently being pressed as
     * the user is holding down the button on the element.
     */
    @api
    get pressed() {
      return this._pressed;
    }

    get _pressed() {
      return this.__pressed || false;
    }

    set _pressed(value) {
      const old = this.__pressed;
      if (value === old) {
        return;
      }
      this.__pressed = value;
      if (value) {
        this.setAttribute('pressed', '');
      } else {
        this.removeAttribute('pressed');
      }
      this.dispatchEvent(new CustomEvent('pressedchange', {
        composed: true,
        detail: {
          value
        }
      }));
      this._pressedChanged(value);
    }

    @api
    get active() {
      return this._active || false;
    }

    set active(value) {
      const old = this._active;
      if (value === old) {
        return;
      }
      this._active = value;
      if (value) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }
      this.dispatchEvent(new CustomEvent('activechange', {
        detail: {
          value
        }
      }));
      this._activeChanged();
    }

    @api
    get pointerDown() {
      return this._pointerDown;
    }

    @api
    get receivedFocusFromKeyboard() {
      return this._receivedFocusFromKeyboard || false;
    }

    @api
    get ariaActiveAttribute() {
      return this._ariaActiveAttribute;
    }

    set ariaActiveAttribute(value) {
      const old = this._ariaActiveAttribute;
      if (value === old) {
        return;
      }
      this._ariaActiveAttribute = value;
      if (old && this.hasAttribute(old)) {
        this.removeAttribute(old);
      }
      this._activeChanged();
    }

    /**
     * @constructor
     */
    constructor() {
      super();
      this._downHandlerBind = this._downHandler.bind(this);
      this._upHandlerBind = this._upHandler.bind(this);
      this._clickHandlerBind = this._clickHandler.bind(this);
      this._keyDownHandlerBind = this._keyDownHandler.bind(this);
      this._keyUpHandlerBind = this._keyUpHandler.bind(this);
      this._blurHandlerBind = this._blurHandler.bind(this);
      this._focusHandlerBind = this._focusHandler.bind(this);
    }
    /**
     * Registers hover listeners
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.ariaActiveAttribute = 'aria-pressed';
      this.addEventListener('mousedown', this._downHandlerBind);
      this.addEventListener('mouseup', this._upHandlerBind);
      this.addEventListener('click', this._clickHandlerBind);
      this.addEventListener('keydown', this._keyDownHandlerBind);
      this.addEventListener('keyup', this._keyUpHandlerBind);
      this.addEventListener('blur', this._blurHandlerBind);
      this.addEventListener('focus', this._focusHandlerBind);
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }
    }
    /**
     * Removes hover listeners
     */
    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.removeEventListener('mousedown', this._downHandlerBind);
      this.removeEventListener('mouseup', this._upHandlerBind);
      this.removeEventListener('click', this._clickHandlerBind);
      this.removeEventListener('keydown', this._keyDownHandlerBind);
      this.removeEventListener('keyup', this._keyUpHandlerBind);
      this.removeEventListener('blur', this._blurHandlerBind);
      this.removeEventListener('focus', this._focusHandlerBind);
    }

    /**
     * Handler for pointer down event
     * @param {MouseEvent} e
     */
    _downHandler() {
      this._pointerDown = true;
      this._pressed = true;
      this._receivedFocusFromKeyboard = false;
    }

    /**
     * Handler for pointer up event
     * @param {MouseEvent} e
     */
    _upHandler() {
      this._pointerDown = false;
      this._pressed = false;
    }
    /**
     * Handler for pointer click event
     * @param {MouseEvent} e
     */
    _clickHandler() {
      if (this.toggles) {
        // a click is needed to toggle the active state
        this.active = !this.active;
      } else {
        this.active = false;
      }
    }
    /**
     * Handler for keyboard down event
     * @param {KeyboardEvent} e
     */
    _keyDownHandler(e) {
      if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.keyCode === 13) {
        this._asyncClick(e);
      } else if (e.code === 'Space' || e.keyCode === 32) {
        this._spaceKeyDownHandler(e);
      }
    }
    /**
     * Handler for keyboard up event
     * @param {KeyboardEvent} e
     */
    _keyUpHandler(e) {
      if (e.code === 'Space' || e.keyCode === 32) {
        this._spaceKeyUpHandler(e);
      }
    }

    _blurHandler() {
      this._detectKeyboardFocus(false);
      this._pressed = false;
    }

    _focusHandler() {
      this._detectKeyboardFocus(true);
    }

    _detectKeyboardFocus(focused) {
      this._receivedFocusFromKeyboard = !this.pointerDown && focused;
    }

    _isLightDescendant(node) {
      return node !== this && this.contains(node);
    }

    _spaceKeyDownHandler(e) {
      const target = e.target;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(/** @type {Node} */ (target))) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      this._pressed = true;
    }

    _spaceKeyUpHandler(e) {
      const target = e.target;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(/** @type {Node} */ (target))) {
        return;
      }
      if (this.pressed) {
        this._asyncClick();
      }
      this._pressed = false;
    }

    _asyncClick() {
      setTimeout(() => this.click(), 1);
    }

    _pressedChanged() {
      this._changedButtonState();
    }

    _changedButtonState() {
      if (this._buttonStateChanged) {
        this._buttonStateChanged(); // abstract
      }
    }

    _activeChanged() {
      const { active, ariaActiveAttribute } = this;
      if (this.toggles) {
        this.setAttribute(ariaActiveAttribute, active ? 'true' : 'false');
      } else {
        this.removeAttribute(ariaActiveAttribute);
      }
      this._changedButtonState();
    }
    /**
     * This function is called when `ControlStateMixin` is also applied to the element.
     */
    _controlStateChanged() {
      if (this.disabled) {
        this._pressed = false;
      } else {
        this._changedButtonState();
      }
    }
  };

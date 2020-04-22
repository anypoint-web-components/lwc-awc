import { api } from 'lwc';
/**
@license
Copyright 2017 Mulesoft.

All rights reserved.
*/

/**
 * Use `HoverableMixin` to implement an element that can be hovered.
 * The control gets a `hovered` attribute when it's hovered by the pointing devide.
 *
 * Be aware that mobile devices will not support hovering as desktop devices and behavior
 * may vary depending on platform. You should use this as little as possible.
 *
 * @exports HoverableMixin
 * @param {*} base - The class to mix onto.
 * @return {module:HoverableMixin~mixin} The mixin class.
 */
export const HoverableMixin = (base) =>
  /**
   * @mixin
   * @alias module:HoverableMixin~mixin
   */
  class extends base {
    /**
     * @return {Boolean} True when the element is currently hovered by a pointing device.
     */
    @api
    get hovered() {
      return this._hovered || false;
    }

    set hovered(value) {
      const old = this._hovered;
      if (value === old) {
        return;
      }
      this._hovered = value;
      if (value) {
        this.setAttribute('hovered', '');
      } else {
        this.removeAttribute('hovered');
      }
      this.dispatchEvent(new CustomEvent('hoveredchange', {
        composed: true,
        detail: {
          value
        }
      }));
    }

    /**
     * @constructor
     */
    constructor() {
      super();
      this._hoverCallbackBind = this._hoverCallback.bind(this);
      this._leaveCallbackBind = this._leaveCallback.bind(this);
    }
    /**
     * Registers hover listeners
     */
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.addEventListener('mouseover', this._hoverCallbackBind);
      this.addEventListener('mouseleave', this._leaveCallbackBind);
    }
    /**
     * Removes hover listeners
     */
    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.removeEventListener('mouseover', this._hoverCallbackBind);
      this.removeEventListener('mouseleave', this._leaveCallbackBind);
    }
    /**
     * Set's the `hovered` attribute to true when handled.
     */
    _hoverCallback() {
      this.hovered = true;
    }
    /**
     * Updates `hovered` if the control is not hovered anymore.
     */
    _leaveCallback() {
      this.hovered = false;
    }
  };

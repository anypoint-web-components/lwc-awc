import { api, track } from 'lwc';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { booleanProperty } from '../Utils.js';

let nextLabelID = 0;
/**
 * Use `AnypointInputMixin` to implement accessible inputs
 *
 * @mixinFunction
 * @param {Class} base
 * @return {Class}
 */
export const InputMixin = (base) => class extends ControlStateMixin(base) {
  /**
   * For form-associated custom elements. Marks this custom element
   * as form enabled element.
   */
  static get formAssociated() {
    return true;
  }


  isCompatibility;
  isOutlined;

  /**
   * Private version of `value`
   */
  @track bindValue = '';

  /**
   * Set to true to prevent the user from entering invalid input.
   */
  @api preventinvalidinput = false;
  /**
   * Set this to specify the pattern allowed by `preventInvalidInput`.
   */
  @api allowedpattern;
  /**
   * The type of the input. The supported types are `text`, `number` and `password`.
   */
  @api type;
  /**
   * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
   */
  @api list;
  /**
   * A pattern to validate the `input` with.
   */
  @api pattern;

  /**
   * Sets the input as required.
   */
  @api required = false;
  /**
   * The error message to display when the input is invalid.
   */
  invalidmessage;
  /**
   * Assistive text value.
   * Rendered beflow the input.
   */
  @api infomessage;
  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  _hasValidationMessage;
  /**
   * Set to true to auto-validate the input value.
   */
  isAutoValidate = false;

  // HTMLInputElement attributes for binding if needed
  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   */
  @api autocomplete = 'off';

  autofocus = false;
  /**
   * Binds this to the `<input>`'s `inputMode` property.
   */
  @api inputmode;
  /**
   * The minimum length of the input value.
   * Binds this to the `<input>`'s `minLength` property.
   */
  @api minLength;
  /**
   * The maximum length of the input value.
   * Binds this to the `<input>`'s `maxLength` property.
   */
  @api maxLength;
  /**
   * The minimum (numeric or date-time) input value.
   * Binds this to the `<input>`'s `min` property.
   */
  @api min;
  /**
   * The maximum (numeric or date-time) input value.
   * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
   * Binds this to the `<input>`'s `max` property.
   */
  @api max;
  /**
   * Limits the numeric or date-time increments.
   *
   * Binds this to the `<input>`'s `step` property.
   */
  @api step;
  /**
   * Binds this to the `<input>`'s `name` property.
   */
  @api name;
  /**
   * A placeholder string in addition to the label. If this is set, the label will always float.
   * Please, use with careful.
   */
  @api placeholder;
  /**
   * Binds this to the `<input>`'s `readonly` property.
   * @default false
   */
  @api readonly = false;
  /**
   * Binds this to the `<input>`'s `size` property.
   */
  @api size;
  /**
   * Binds this to the `<input>`'s `spellcheck` property.
   */
  @api spellcheck = false;
  // Nonstandard attributes for binding if needed
  /**
   * Binds this to the `<input>`'s `autocapitalize` property.
   *
   * Possible values are:
   *
   * - `off` or `none`: No autocapitalization is applied (all letters default to lowercase)
   * - `on` or `sentences`: The first letter of each sentence defaults to a capital letter;
   *  all other letters default to lowercase
   * - `words`: The first letter of each word defaults to a capital letter; all other letters default to lowercase
   * - `characters`: All letters should default to uppercase
   *
   * @default none
   */
  @api autocapitalize = false;
  /**
   * Binds this to the `<input>`'s `autocorrect` property.
   * @default off
   */
  @api autocorrect = 'off';
  /**
   * Binds this to the `<input>`'s `results` property,
   * used with type=search.
   *
   * The maximum number of items that should be displayed in the
   * drop-down list of previous search queries. Safari only.
   */
  @api results;
  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   */
  @api accept;
  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   */
  @api multiple = false;

  @track _ariaLabelledBy;
  /**
   * Enables outlined theme.
   */
  @api outlined = false;
  /**
   * Enables compatibility with Anypoint components.
   */
  @api compatibility = false;
  /**
   * When set, it reduces height of the button and hides
   * the label when the value is provided.
   *
   * Use it carefully as user should be able to recognize the input
   * when the value is predefined.
   */
  @api nolabelfloat = false;
  /**
   * When form-associated custom elements are supported in the browser it
   * returns `<form>` element associated with this constol.
   */
  get form() {
    return this._internals && this._internals.form || null;
  }

  /**
   * @return {String} The value for this input
   */
  @api
  get value() {
    return this.bindValue;
  }

  set value(value) {
    const old = this.bindValue;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.bindValue = value;
    /* istanbul ignore else */
    if (this._internals) {
      this._internals.setFormValue(value);
    }
    this.dispatchEvent(new CustomEvent('changed', {
      detail: {
        value
      }
    }));
  }

  get compatibility() {
    return this.isCompatibility;
  }

  set compatibility(value) {
    value = booleanProperty(value);
    const old = this.isCompatibility;
    if (old === value) {
      return;
    }
    this.isCompatibility = value;
    if (value) {
      this.setAttribute('compatibility', '');
    } else {
      this.removeAttribute('compatibility');
    }
  }

  get outlined() {
    return this.isOutlined;
  }

  set outlined(value) {
    value = booleanProperty(value);
    const old = this.isOutlined;
    if (old === value) {
      return;
    }
    this.isOutlined = value;
    if (value) {
      this.setAttribute('outlined', '');
    } else {
      this.removeAttribute('outlined');
    }
  }

  @api
  get hasValidationMessage() {
    return this._hasValidationMessage;
  }

  get _hasValidationMessage() {
    return this.__hasValidationMessage;
  }

  set _hasValidationMessage(value) {
    const old = this.__hasValidationMessage;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__hasValidationMessage = value;
    this.__hasValidationMessage = value;
    this.dispatchEvent(new CustomEvent('hasvalidationmessage', {
      detail: {
        value
      }
    }));
  }

  @track isAutoFocus;
  /**
   * Binds this to the `<input>`'s `autofocus` property.
   */
  @api
  get autofocus() {
    return this.isAutoFocus;
  }

  set autofocus(value) {
    value = booleanProperty(value);
    const old = this.isAutoFocus;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.isAutoFocus = value;
    this._autofocusChanged(value);
  }

  @api
  get autovalidate() {
    return this.isAutoValidate;
  }

  set autovalidate(value) {
    value = booleanProperty(value);
    const old = this.isAutoValidate;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.isAutoValidate = value;
    this._autoValidateChanged(value);
  }

  @api
  get invalidMessage() {
    return this._invalidMessage;
  }

  set invalidMessage(value) {
    const old = this._invalidMessage;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._invalidMessage = value;
    this._hasValidationMessage = this.invalid && !!value;
  }

  get _patternRegExp() {
    let pattern;
    if (this.allowedPattern) {
      pattern = new RegExp(this.allowedPattern);
    } else {
      switch (this.type) {
        case 'number':
          pattern = /[0-9.,e-]/;
          break;
        default:
          pattern = undefined;
      }
    }
    return pattern;
  }

  /**
   * Returns a reference to the input element.
   */
  @api
  get inputElement() {
    return this.template.querySelector('input,textarea');
  }

  constructor() {
    super();
    // this.isAutoValidate = false;
    // this.autocomplete = 'off';
    // this.autocorrect = 'off';
    // this._ariaLabelledBy = '';
    this._previousValidInput = '';
    this._patternAlreadyChecked = false;
    this._onKeydownHandler = this._onKeydown.bind(this);

    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('keydown', this._onKeydownHandler);
    this.ensureAria();
    if (this.isAutoFocus) {
      this._autofocusChanged(this.isAutoFocus);
    }
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this._onKeydownHandler);
  }


  ensureAria() {
    if (this._ariaEnsured) {
      return;
    }
    this._ariaEnsured = true;
    if (!this.getAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param {Boolean} disabled Form disabled state
   */
  @api
  formDisabledCallback(disabled) {
    this.disabled = disabled;
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  @api
  formResetCallback() {
    this.value = '';
  }
  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param {String} state Restored value
   */
  @api
  formStateRestoreCallback(state) {
    this.value = state;
  }

  renderedCallback() {
    if (!this.__ariaLoaded) {
      this.__ariaLoaded = true;
      this._updateAriaLabelledBy();
    }
    if (!this.firstRendered) {
      this.firstRendered = true;
      if (this.isAutoFocus) {
        this._autofocusChanged(this.isAutoFocus);
      }
    }
  }

  @api
  checkValidity() {
    return this._getValidity() && ((this._internals && this._internals.checkValidity()) || true);
  }

  /**
   * From `ValidatableMixin`
   * @param {Boolean} value Current invalid sate
   */
  _invalidChanged(value) {
    super._invalidChanged(value);
    this._hasValidationMessage = value && !!this.invalidMessage;
    this._ensureInvalidAlertSate(value);
  }

  _ensureInvalidAlertSate(invalid) {
    if (!this.invalidMessage) {
      return;
    }
    const node = this.template.querySelector('p.invalid');
    if (!node) {
      return;
    }
    if (invalid) {
      node.setAttribute('role', 'alert');
    } else {
      node.removeAttribute('role');
    }
    setTimeout(() => {
      node.removeAttribute('role');
    }, 1000);
  }
  /**
   * Forward focus to inputElement. Overriden from ControlStateMixin.
   * @param {Event} event
   */
  _focusBlurHandler(event) {
    super._focusBlurHandler(event);
    // Forward the focus to the nested input.
    if (this.focused && !this._shiftTabPressed) {
      this.inputElement.focus();
      const type = this.type;
      const input = this.inputElement;
      const value = input.value;
      if (value && (type === 'text' || type === undefined)) {
        const index = value.length;
        input.selectionStart = index;
        input.selectionEnd = index;
      }
    }
    if (event.type === 'blur' && this.isAutoValidate) {
      this.validate();
    }
  }
  /**
   * Handler for the keydown event.
   * @param {KeyboardEvent} event
   */
  _onKeydown(event) {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === 'Tab' && event.shiftKey) {
      this._onShiftTabDown(event);
      return;
    }
    const { type, preventInvalidInput } = this;
    if (!preventInvalidInput || ['number', 'file'].indexOf(type) !== -1) {
      return;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return;
    }
    // Handle special keys and backspace
    if (event.metaKey || event.ctrlKey || event.key === 'Backspace') {
      return;
    }
    // Check the pattern either here or in `_onInput`, but not in both.
    this._patternAlreadyChecked = true;
    const thisChar = event.key;
    if (this._isPrintable(event) && !regexp.test(thisChar)) {
      event.preventDefault();
      this._announceInvalidCharacter('Invalid character ' + thisChar + ' not entered.');
    }
  }
  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param {KeyboardEvent} e Event handled.
   */
  _onShiftTabDown(e) {
    if (e.target !== this) {
      return;
    }
    const oldTabIndex = this.getAttribute('tabindex');
    this._shiftTabPressed = true;
    this.setAttribute('tabindex', '-1');
    setTimeout(() => {
      this.setAttribute('tabindex', oldTabIndex);
      this._shiftTabPressed = false;
    }, 1);
  }
  /**
   * Calles when `isAutoValidate` changed
   * @param {Boolean} value
   */
  _autoValidateChanged(value) {
    if (value) {
      this.validate();
    }
  }
  /**
   * Restores the cursor to its original position after updating the value.
   * @param {string} newValue The value that should be saved.
   */
  @api
  updateValueAndPreserveCaret(newValue) {
    // Not all elements might have selection, and even if they have the
    // right properties, accessing them might throw an exception (like for
    // <input type=number>)
    const input = this.inputElement;
    try {
      const start = input.selectionStart;
      this.value = newValue;
      input.value = newValue;
      // The cursor automatically jumps to the end after re-setting the value,
      // so restore it to its original position.
      input.selectionStart = start;
      input.selectionEnd = start;
    } catch (e) {
      // Just set the value and give up on the caret.
      this.value = newValue;
    }
  }

  _updateAriaLabelledBy() {
    const slot = this.template.querySelector('slot[name="label"]');
    const nodes = slot.assignedNodes();
    if (!nodes.length) {
      return;
    }
    let label;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        label = nodes[i];
        break;
      }
    }
    if (!label) {
      this._ariaLabelledBy = '';
      return;
    }
    let labelledBy;
    if (label.id) {
      labelledBy = label.id;
    } else {
      labelledBy = 'anypoint-input-label-' + nextLabelID++;
      label.id = labelledBy;
    }
    this._ariaLabelledBy = labelledBy;
  }

  changeHandler(event) {
    // In the Shadow DOM, the `change` event is not leaked into the
    // ancestor tree, so we must do this manually.
    // See https://w3c.github.io/webcomponents/spec/shadow/
    // #events-that-are-not-leaked-into-ancestor-trees.
    if (this.template) {
      this.dispatchEvent(new CustomEvent(event.type, {
        detail: {
          sourceEvent: event
        },
        bubbles: event.bubbles,
        cancelable: event.cancelable
      }));
    }
  }

  inputHandler(e) {
    let value = e.target.value;
    // Need to validate each of the characters pasted if they haven't
    // been validated inside `_onKeydown` already.
    let valid = true;
    if ((this.preventInvalidInput || this.allowedPattern) && !this._patternAlreadyChecked) {
      valid = this._checkPatternValidity(value);
      if (!valid) {
        this._announceInvalidCharacter('Invalid string of characters entered.');
        value = this._previousValidInput;
      }
    }
    this._patternAlreadyChecked = false;
    this._previousValidInput = value;
    const isNotFile = e.target.type !== 'file';
    if (isNotFile && e.target.value !== value) {
      e.target.value = value;
    }
    if (isNotFile) {
      this.bindValue = value;
    }
    if (this.isAutoValidate) {
      this.validate();
    }
  }

  /**
   * Retargets an event that does not bubble
   *
   * @param {Event} e The event to retarget
   */
  retargetEvent(e) {
    this.dispatchEvent(new CustomEvent(e.type));
  }

  /**
   * Checks validity for oattern, if any
   * @param {?String} value The value to test for pattern
   * @return {Boolean}
   */
  _checkPatternValidity(value) {
    if (!value) {
      return true;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return true;
    }
    value = String(value);
    for (let i = 0; i < value.length; i++) {
      if (!regexp.test(value[i])) {
        return false;
      }
    }
    return true;
  }

  _announceInvalidCharacter(text) {
    this.dispatchEvent(new CustomEvent('announce', {
      detail: {
        text
      },
      bubbles: true,
      composed: true
    }));
  }

  _isPrintable(event) {
    // What a control/printable character is varies wildly based on the browser.
    // - most control characters (arrows, backspace) do not send a `keypress` event
    //   in Chrome, but they *do* on Firefox
    // - in Firefox, when they do send a `keypress` event, control chars have
    //   a charCode = 0, keyCode = xx (for ex. 40 for down arrow)
    // - printable characters always send a keypress event.
    // - in Firefox, printable chars always have a keyCode = 0. In Chrome, the keyCode
    //   always matches the charCode.
    // None of this makes any sense.

    // For these keys, ASCII code == browser keycode.
    const anyNonPrintable =
      (event.keyCode === 8) || // backspace
      (event.keyCode === 9) || // tab
      (event.keyCode === 13) || // enter
      (event.keyCode === 27); // escape

    // For these keys, make sure it's a browser keycode and not an ASCII code.
    const mozNonPrintable =
      (event.keyCode === 19) || // pause
      (event.keyCode === 20) || // caps lock
      (event.keyCode === 45) || // insert
      (event.keyCode === 46) || // delete
      (event.keyCode === 144) || // num lock
      (event.keyCode === 145) || // scroll lock
      (event.keyCode > 32 && event.keyCode < 41) || // page up/down, end, home, arrows
      (event.keyCode > 111 && event.keyCode < 124); // fn keys

    return !anyNonPrintable && !(event.charCode === 0 && mozNonPrintable);
  }
  /**
   * Called when `autofocus` property changed.
   * @param {Boolean} value Current `autofocus` value
   */
  _autofocusChanged(value) {
    // Firefox doesn't respect the autofocus attribute if it's applied after
    // the page is loaded (Chrome/WebKit do respect it), preventing an
    // autofocus attribute specified in markup from taking effect when the
    // element is upgraded. As a workaround, if the autofocus property is set,
    // and the focus hasn't already been moved elsewhere, we take focus.
    if (value && this.inputElement) {
      // In IE 11, the default document.activeElement can be the page's
      // outermost html element, but there are also cases (under the
      // polyfill?) in which the activeElement is not a real HTMLElement, but
      // just a plain object. We identify the latter case as having no valid
      // activeElement.
      const activeElement = document.activeElement;
      const isActiveElementValid = activeElement instanceof HTMLElement;

      // Has some other element has already taken the focus?
      const isSomeElementActive = isActiveElementValid &&
          activeElement !== document.body &&
          activeElement !== document.documentElement; /* IE 11 */
      if (!isSomeElementActive) {
        // No specific element has taken the focus yet, so we can take it.
        this.inputElement.focus();
      }
    }
  }

  /**
   * Returns true if `value` is valid.
   * @return {boolean} True if the value is valid.
   */
  @api
  validate() {
    if (!this.inputElement) {
      this.invalid = false;
      return true;
    }
    let valid = this._checkInputValidity();

    // Only do extra checking if the browser thought this was valid.
    if (valid) {
      // Empty, required input is invalid
      if (this.required && this.value === '') {
        valid = false;
      }
    }

    this.invalid = !valid;
    return valid;
  }
  /**
   * Because of the `value` property binding to the input element the value on
   * input element changes programatically which renders input element's validation
   * valiod even if it isn't. This function runs the steps as the regular input
   * validation would, including input validation.
   * @return {Boolean} True if the element is valid.
   */
  _checkInputValidity() {
    const { type, required } = this;
    const value = this.value;
    let valid = !required || (!!required && !!value);
    if (!valid) {
      return valid;
    }
    if (type === 'file') {
      return true;
    }
    valid = this.inputElement.checkValidity();
    if (!valid) {
      return valid;
    }
    valid = this._checkPatternValidity(value);
    if (!valid) {
      return valid;
    }
    const strValue = String(value);
    const { minLength, maxLength } = this;
    if (minLength && strValue.length < minLength) {
      return false;
    }
    if (maxLength && strValue.length > maxLength) {
      return false;
    }
    return true;
  }
};

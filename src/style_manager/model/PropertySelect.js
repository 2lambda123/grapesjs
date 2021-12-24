import Property from './Property';
import { isDef } from 'utils/mixins';

/**
 * @typedef PropertySelect
 * @property {Array<Object>} options Array of option definitions, eg `[{ id: '100', label: 'Set 100' }]`
 */
export default class PropertySelect extends Property {
  defaults() {
    return {
      ...Property.getDefaults(),
      options: [],
      full: 0,
    };
  }

  /**
   * Get available options.
   * @returns {Array<Object>} Array of options
   */
  getOptions() {
    // support old list property
    const { options, list } = this.attributes;
    return (options && options.length ? options : list) || [];
  }

  /**
   * Get current selected option or by id.
   * @param {String} [id] Option id.
   * @returns {Object | null}
   */
  getOption(id) {
    const idSel = id || this.getValue();
    return this.getOptions().filter(o => this.getOptionId(o) === idSel)[0] || null;
  }

  /**
   * Update options.
   * @param {Array<Object>} value New array of options, eg. `[{ id: 'val-1', label: 'Value 1' }]`
   */
  setOptions(value = []) {
    this.set('options', value);
    return this;
  }

  /**
   * Add new option.
   * @param {Object} value Option object, eg. `{ id: 'val-1', label: 'Value 1' }`
   */
  addOption(value) {
    if (value) {
      const opts = this.getOptions();
      this.setOptions([...opts, value]);
    }
    return this;
  }

  /**
   * Get the option id from the option object.
   * @param {Object} option Option object
   * @returns {String} Option id
   */
  getOptionId(option) {
    return isDef(option.id) ? option.id : option.value;
  }

  /**
   * Get option label.
   * @param {String} id Option id
   * @param {Object} [opts={}] Options
   * @param {Boolean} [opts.locale=true] Use the locale string from i18n module
   * @returns {String} Option label
   */
  getOptionLabel(id, opts = {}) {
    const { locale = true } = opts;
    const options = this.getOptions();
    const option = options.filter(o => this.getOptionId(o) === id)[0] || {};
    const label = option.label || option.name || id;
    const propId = this.getId();
    return (locale && this.em?.t(`styleManager.options.${propId}.${id}`)) || label;
  }

  initialize(...args) {
    Property.prototype.initialize.apply(this, args);
    this.listenTo(this, 'change:options', this.__onOptionChange);
  }

  __onOptionChange() {
    this.set('list', this.get('options'));
  }
}

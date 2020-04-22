import { buildCustomElementConstructor } from 'lwc';
import Input from 'awc/input';

// const app = createElement('awc-input', {
//   is: Input
// });
// // eslint-disable-next-line @lwc/lwc/no-document-query
// document.querySelector('#main')
//   .appendChild(app);
//
// if (typeof customElements !== 'undefined') {
// }
customElements.define('awc-input', buildCustomElementConstructor(Input));

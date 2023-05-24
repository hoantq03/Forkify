import icons from '../../img/icons.svg';
import View from './view.js';

export default class View {
  _parentElement = document.querySelector('.container');
  _errorMessage = 'We could not find that recipe. Please try another one !';
  _message = '';
  _data;

  _clearText() {
    this._searchField.value = '';
  }

  _clearHTML() {
    this._parentElement.innerHTML = '';
  }

  _render(data) {
    if (!data) return this._renderError();
    this._data = data;
    const markup = this._generateMarkup(this._data);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
    `;
    this._clearHTML(this._parentElement);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _renderError(message = this._errorMessage, parentElement) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _renderMessage(message = this._message) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clearHTML();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

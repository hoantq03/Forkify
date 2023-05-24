import icons from '../../img/icons.svg';
import View from './view.js';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerBookmark(handler) {
    let resultPreview = document.querySelector('.preview');
    resultPreview?.addEventListener('click', e => {
      e.preventDefault();
      console.log(hi);
      handler();
    });
  }

  _renderMessage() {
    const markup = this._generateMarkupMessage();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkupMessage() {
    return `
    <div class="message">
                  <div>
                    <svg>
                      <use href="${icons}#icon-smile"></use>
                    </svg>
                  </div>
                  <p>
                    ${this._errorMessage}
                  </p>
                </div>
    `;
  }

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return ` 
    <li class="preview">
    <a class="preview__link ${
      id === this._data.id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
        <div class="preview__user-generated">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>`;
  }
}

export default new bookmarkView();

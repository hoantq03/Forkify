import icons from '../../img/icons.svg';
import View from './view.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerPages(handler) {
    const prev = document.querySelector('.pagination__btn--prev');
    const next = document.querySelector('.pagination__btn--next');
    next?.addEventListener('click', () => {
      this._data.curPage++;
      handler();
    });
    prev?.addEventListener('click', () => {
      this._data.curPage--;
      handler();
    });
  }
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    this._data.maxPages = numPages;
    //page 1
    if (this._data.curPage === 1 && numPages > 1)
      return `
      <button class="btn--inline pagination__btn--next">
      <span>Page ${this._data.curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>
          `;
    if (this._data.curPage === numPages && numPages > 1)
      return `
    <button class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.curPage - 1}</span>
    </button>
    `;
    if (this._data.curPage < numPages && this._data.curPage > 1)
      return `
    <button class="btn--inline pagination__btn--next">
    <span>Page ${this._data.curPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
    </button>
    <button class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${this._data.curPage - 1}</span>
    </button>
    `;
    return;
  }
}
export default new paginationView();

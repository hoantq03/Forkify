import icons from 'url:../../img/icons.svg';
import View from './view.js';
class searchView extends View {
  _searchElement = document.querySelector('.search');
  _searchField = document.querySelector('.search__field');
  _data;
  //   method

  getQuery() {
    const query = document.querySelector('.search__field').value;
    this._clearText();
    return query;
  }

  addHandlerSearch(handler) {
    this._searchElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();

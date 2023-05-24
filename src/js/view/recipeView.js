import icons from 'url:../../img/icons.svg';
import View from './view.js';
// import fracty from 'fracty';
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _data;

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e =>
      window.addEventListener(e, () => {
        handler();
      })
    );
  }

  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  addHandlerServings(handler) {
    const increaseBtn = document.querySelector('.btn--increase-servings');
    const decreaseBtn = document.querySelector('.btn--decrease-servings');

    decreaseBtn?.addEventListener('click', e => {
      const newServings = this._data.servings - 1;
      // console.log(newServings);
      handler(newServings);
    });
    increaseBtn?.addEventListener('click', e => {
      const newServings = this._data.servings + 1;
      // console.log(newServings);
      handler(newServings);
    });
  }

  _generateMarkup(data) {
    console.log(data);
    return `
    <figure class="recipe__fig">
      <img src="${data.image}" alt="${data.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${data.title}</span>
      </h1>
    </figure>
  
    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          data.servings
        }</span>
        <span class="recipe__info-text">servings</span>
  
        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--decrease-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>
  
      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      data.isBookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>
  
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${data.ingredients
        .map(ingredient => {
          return `
        <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${
          ingredient.quantity ? ingredient.quantity : ''
        }</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ingredient.unit}</span>${
            ingredient.description
          }
        </div>
      </li>`;
        })
        .join('')}
      </ul>
    </div>
  
    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }
}

export default new RecipeView();

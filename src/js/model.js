// import { async } from 'regenerator-runtime';
import { API_KEY, API_URL } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { RESULTS_PER_PAGE } from './config.js';

export const state = {
  recipe: {
    isBookmarked: false,
  },
  searchResults: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    curPage: 1,
    maxPages: 0,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id.slice(1)}`);
    const { recipe } = data.data;
    state.recipe = createRecipeObject(data);
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      servings: recipe.servings,
      isBookmarked: false,
    };
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.searchResults.query = query;
    state.searchResults.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        publisher: recipe.publisher,
      };
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (
  page = state.searchResults.curPage
) {
  try {
    state.searchResults.curPage = page;
    let start = (page - 1) * state.searchResults.resultsPerPage;
    let end = page * state.searchResults.resultsPerPage;
    if (page === state.searchResults.maxPages)
      end =
        (page - 1) * state.searchResults.resultsPerPage +
        (state.searchResults.results.length %
          state.searchResults.resultsPerPage);
    return state.searchResults.results.slice(start, end);
  } catch (error) {
    throw error;
  }
};

export const updateServings = function (newServings) {
  if (newServings >= 1) {
    const oldServings = state.recipe.servings;
    console.log(oldServings);
    console.log(newServings);
    state.recipe.ingredients.forEach(ingredient => {
      ingredient.quantity = (ingredient.quantity / oldServings) * newServings;

      ingredient.quantity ? new Fraction(ingredient.quantity).toString() : '';
    });
    state.recipe.servings = newServings;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // set is marked to true
  state.recipe.isBookmarked = true;
  //push this bookmark to state.bookmarks array
  console.log(state.bookmarks);
  console.log('pushed');
  state.bookmarks.push(recipe);
  // storage new data to local storage
  persistBookmarks();
};

export const deleteBookmark = function (recipe) {
  //set is marked = false
  console.log('deleted');
  console.log(state.bookmarks);
  state.recipe.isBookmarked = false;
  //find index of bookmark we want to delete
  const index = state.bookmarks.findIndex(
    bookmark => bookmark.id === recipe.id
  );
  //delete
  state.bookmarks.splice(index, 1);
  //storage new data to localStorage
  persistBookmarks();
};

//
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].replaceAll(' ', '').split(',');
        if (ingArray.length !== 3) throw new Error('Wrong ingredient format !');
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    isBookmarked: false,
    ...(recipe.ket && { key: recipe.key }),
  };
};

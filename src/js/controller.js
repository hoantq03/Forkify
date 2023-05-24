import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import searchResultsView from './view/searchResultsView.js';
import pagination from './view/paginationView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addNewRecipe from './view/addNewRecipe.js';
import { MODAL_CLOSE_SECOND } from './config.js';
//
// https://forkify-api.herokuapp.com/v2/recipes/#5ed6604591c37cdc054bc886
///////////////////////////////////////

const controlRecipe = async function () {
  try {
    console.log(model.state.recipe);
    const id = window.location.hash;
    if (!id) return;
    recipeView._renderSpinner();
    // 1) Loading Recipe
    await model.loadRecipe(id);
    // 2) Rendering Recipe
    recipeView._clearHTML();

    const index = checkExistInBookmarks(model.state.recipe.id);

    if (index >= 0) {
      recipeView._render(model.state.bookmarks[index]);
    } else {
      recipeView._render(model.state.recipe);
    }
    // 3) checked preview
    searchResultsView.addHandlerResult(updateSearchResult);
    // 4) Handler servings
    recipeView.addHandlerServings(updateRecipeView);
    // 5) Handler Bookmark
    recipeView.addHandlerBookmark(controlAddBookmark);
  } catch (error) {
    recipeView._renderError(
      recipeView._errorMessage,
      recipeView._parentElement
    );
  }
};

const checkExistInBookmarks = function (recipeId) {
  const index = JSON.parse(localStorage.getItem('bookmarks'))?.findIndex(
    bookmark => bookmark.id === recipeId
  );
  console.log(index);
  return index;
};

const controlAddBookmark = function () {
  // if is bookmarked
  if (model.state.recipe.isBookmarked) {
    //delete this recipe from state and storage
    model.deleteBookmark(model.state.recipe);
    //check have bookmarks ?
    if (model.state.bookmarks) {
      //delete all HTML code before
      bookmarkView._clearHTML();
      //render all bookmarks
      model.state.bookmarks.forEach(bookmark => {
        bookmarkView._render(bookmark);
      });
      // rerender recipe view
      recipeView._render(model.state.recipe);
      //else don't have any bookmarks
    } else {
      //delete all HTML code before
      bookmarkView._clearHTML();
      // render error message
      bookmarkView._renderMessage();
    }
  }
  //else bookmark not marked
  else {
    // add this bookmark to state and local storage
    model.addBookmark(model.state.recipe);
    // rerender all bookmarks
    //delete all HTML content before
    bookmarkView._clearHTML();
    //render all bookmarks
    model.state.bookmarks.forEach(bookmark => {
      bookmarkView._render(bookmark);
    });
    // rerender recipe view
    recipeView._render(model.state.recipe);
  }
  console.log(model.state.bookmarks);
};

const controlSearchResults = async function () {
  try {
    // Get query from text field
    const query = searchView.getQuery();
    // Render Spinner
    searchResultsView._renderSpinner();
    // set default initial page
    model.state.searchResults.curPage = 1;
    // check query
    if (!query) return;
    // fetch data
    await model.loadSearchResults(query);
    // clear old results
    searchResultsView._clearHTML();
    // Clear pagination button
    paginationView._clearHTML();
    // check exist results
    if (
      model.state.searchResults.results.length === 0 ||
      !Array.isArray(model.state.searchResults.results)
    ) {
      // whether don't exist data => render error
      searchResultsView._renderError();
      return;
    }
    // render page results
    model.getSearchResultsPage().forEach(result => {
      searchResultsView._render(result);
    });
    // render pagination
    pagination._render(model.state.searchResults);
    // add handler pagination
    paginationView.addHandlerPages(loadNewPage);
    // click handler
    searchResultsView.addHandlerResult(controlRecipe);
    // checked handler
    recipeView.addHandlerRender(updateSearchResult);
  } catch (error) {
    throw error;
  }
};

const loadNewPage = function () {
  // render spinner
  searchResultsView._renderSpinner();
  // clear old results
  searchResultsView._clearHTML();
  // clear old button
  paginationView._clearHTML();
  // render results' current page
  model
    .getSearchResultsPage(model.state.searchResults.curPage)
    .forEach(result => {
      searchResultsView._render(result);
    });
  // render pagination button
  pagination._render(model.state.searchResults);
  // add handler for pagination button
  paginationView.addHandlerPages(loadNewPage);
};

const updateSearchResult = function () {
  // Render Spinner
  searchResultsView._renderSpinner();
  // clear old results
  searchResultsView._clearHTML();
  // render page results
  model.getSearchResultsPage().forEach(result => {
    searchResultsView._render(result);
  });
};

const updateRecipeView = function (newServings) {
  // 1) render spinner
  recipeView._renderSpinner();
  // 2) update recipe view
  recipeView._clearHTML();
  model.updateServings(newServings);
  recipeView._render(model.state.recipe);
  // 3) Handler servings
  recipeView.addHandlerServings(updateRecipeView);
};

//

const controlAddRecipe = async function (newRecipe) {
  try {
    addNewRecipe._renderSpinner();
    await model.uploadRecipe(newRecipe);
    //render
    recipeView._render(model.state.recipe);
    //close form
    setTimeout(function () {
      addNewRecipe.toggleWindow();
    }, MODAL_CLOSE_SECOND * 1000);
    //render success method
    addNewRecipe._renderMessage();
    //
    bookmarkView._render(model.state.bookmarks);
    // change ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()
  } catch (error) {
    addNewRecipe._renderError(error.message);
  }
};

//initial all event listener
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  bookmarkView._clearHTML();
  if (JSON.parse(localStorage.getItem('bookmarks')))
    model.state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  else model.state.bookmarks = [];
  if (model.state.bookmarks.length > 0) {
    model.state.bookmarks.forEach(bookmark => {
      bookmarkView._render(bookmark);
    });
  } else {
    bookmarkView._renderMessage();
  }

  addNewRecipe.addHandlerUpload(controlAddRecipe);
};

init();

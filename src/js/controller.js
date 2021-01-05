import 'regenerator-runtime/runtime';
import 'core-js/stable';
import {
	MODAL_CLOSE_SEC
} from "./config";
import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addrecipeView';
import {
	async
} from 'regenerator-runtime';
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if(module.hot){
// 	module.hot.accept();
// }

const controlRecipes = async function () {
	try {

		const id = window.location.hash.slice(1);
		if (!id) return;
		recipeView.renderSpinner();

		//0) Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());

		bookmarksView.update(model.state.bookmarks);

		//1) loading recipe
		await model.loadRecipe(id);

		// 2) Rendering Recipe
		recipeView.render(model.state.recipe);

	} catch (err) {
		recipeView.renderError();
	}
}

const controlSearchResults = async function () {

	try {

		resultsView.renderSpinner();
		// 1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		// 2) Load search results
		await model.loadSearchResults(query);

		// 3) Render results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// 4) Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
}

const controllPagination = function (goToPage) {
	// 1) Render new results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// 2) Render new pagination buttons
	paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
	// Update the recipe servings (in state)
	model.updateServings(newServings);

	// Update the recipe view
	// recipeView.render(model.state.recipe);
	recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
	// 1) Add/remove bookmark
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	//2) update recipeview
	recipeView.update(model.state.recipe);

	//3) render Bookmarks
	bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
	try {

		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload the new recipe data
		await model.uploadRecipe(newRecipe);
		
		// Render Recipe
		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in url
		window.history.pushState(null, "", `#${model.state.recipe.id}`);
		// window.history.back();
		
		// Close form window
		setTimeout(function(){
			addRecipeView.toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.error("🐱‍🐉", err);
		addRecipeView.renderError();
	}
}

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controllPagination);
	addRecipeView.addHandlerUploads(controlAddRecipe);
}

init();
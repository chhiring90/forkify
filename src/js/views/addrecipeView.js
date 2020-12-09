import View from "./View";
import icons from '../../img/icons.svg'; // parcel 1

class AddRecipeView extends View {
	_parentElement = document.querySelector(".upload");
	_message = "Recipe was succesfully uplaoded 😍😍";

	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");
	_btnOpen = document.querySelector(".nav__btn--add-recipe");
	_btnClose = document.querySelector(".btn--close-modal");

	constructor(){
		super();
		this._addHandlerShowWindow();
		this._addHandlerhideWindow();
	}

	toggleWindow(){
		this._overlay.classList.toggle("hidden");
		this._window.classList.toggle("hidden");
	}

	_addHandlerShowWindow(){
		this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
	}

	_addHandlerhideWindow(){
		this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
		this._overlay.addEventListener("click", this.toggleWindow.bind(this));
	}

	addHandlerUploads(handler){
		this._parentElement.addEventListener("submit", function(e){
			e.preventDefault();
			const dataArr = [...new FormData(this)];
			const data = Object.fromEntries(dataArr);
			handler(data);
		});
	}

	_generateMarkup() {

	}

}

export default new AddRecipeView();
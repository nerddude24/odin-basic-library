const showModalButton = document.querySelector("#btn-open-modal");
const closeModalButton = document.querySelector("#btn-close-modal");
const modal = document.querySelector("dialog");
const form = document.querySelector("form");
const formTitle = document.forms["form"]["title"];
const formAuthor = document.forms["form"]["author"];
const formPages = document.forms["form"]["pages"];
const formPrice = document.forms["form"]["price"];
const formRead = document.forms["form"]["read"];
const fromSubmitButton = document.querySelector("#form-submit-btn");

const myLibrary = [];

class Book {
	constructor(title, author, pages, price, read) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.price = price;
		this.read = read;

		this.info = function () {
			return `${title} by ${author}, ${pages} pages, bought for ${price}, ${
				read ? "read" : "not read yet"
			}.`;
		};
	}
}

/* Deprecated
function _addBookToLibrary() {
	const title = prompt("What's the title of the book?");
	const author = prompt("Who's the author?");
	const pages = prompt("How many pages is it?");
	const price = prompt("How much does it cost?");
	const read = prompt("Have you read it?");

	const newBook = new Book(title, author, pages, price, read);
	myLibrary.push(newBook);

	console.log("Added Book: ");
	console.log(newBook);
}
*/

function displayBooks() {
	console.log("Rebuilding table...");
	const table = document.getElementById("table");

	// Loop through the table element's rows and delete them,
	// starting from the second row
	var rowCount = table.rows.length;
	for (let i = rowCount - 1; i > 0; i--) {
		table.deleteRow(i);
	}

	for (let i = 0; i < myLibrary.length; i++) {
		// for each book object in the library list, make a table row with it's information.
		const book = myLibrary[i];
		const bookRow = document.createElement("tr");

		/* appropriate cells for the book row */
		const titleCell = document.createElement("td");
		titleCell.textContent = book.title;
		bookRow.appendChild(titleCell);

		const authorCell = document.createElement("td");
		authorCell.textContent = book.author;
		bookRow.appendChild(authorCell);

		const pagesCell = document.createElement("td");
		pagesCell.textContent = book.pages;
		bookRow.appendChild(pagesCell);

		const priceCell = document.createElement("td");
		priceCell.textContent = book.price;
		bookRow.appendChild(priceCell);

		const readCell = document.createElement("td");
		readCell.textContent = book.read ? "✅" : "❌";
		readCell.addEventListener("click", () => {
			book.read = !book.read;
			readCell.textContent = book.read ? "✅" : "❌";
		});
		bookRow.appendChild(readCell);

		const deleteButton = document.createElement("button");
		deleteButton.textContent = "X";
		deleteButton.addEventListener("click", () => {
			for (let i = 0; i < myLibrary.length; i++) {
				if (myLibrary[i].title === book.title) {
					myLibrary.splice(i, 1);
				}
				displayBooks();
			}
		});

		const deleteCell = document.createElement("td");
		deleteCell.appendChild(deleteButton);
		bookRow.appendChild(deleteCell);
		/*---------------------*/

		table.appendChild(bookRow);
	}
}

function getErrorSpanElement(sibling) {
	return sibling.parentElement.querySelector(".error");
}

function checkFormTitle() {
	const error = getErrorSpanElement(formTitle);

	if (formTitle.validity.valid) {
		error.textContent = "";
		error.className = "error";
		return true;
	}

	// else if the input is invalid:
	if (formTitle.validity.valueMissing) {
		error.textContent = "Please enter the book title!";
	}

	error.className = "error active";
	return false;
}

function checkFormAuthor() {
	const error = getErrorSpanElement(formAuthor);

	if (formAuthor.validity.valid) {
		error.textContent = "";
		error.className = "error";
		return true;
	}

	// else if the input is invalid:
	if (formAuthor.validity.valueMissing) {
		error.textContent = "Please enter the book author's name!";
	}

	error.className = "error active";
	return false;
}

function checkFormPages() {
	const error = getErrorSpanElement(formPages);

	if (formPages.validity.valid || formPages.value.length === 0) {
		error.textContent = "";
		error.className = "error";
		return true;
	}

	// else if the input is invalid:
	if (formPages.validity.rangeUnderflow) {
		error.textContent = `That's too small for a book! (min is ${formPages.min})`;
	}

	error.className = "error active";
	return false;
}

function checkFormPrice() {
	const error = getErrorSpanElement(formPrice);

	if (formPrice.value.length === 0) {
		error.textContent = "";
		error.className = "error";
		return true;
	}

	if (isNaN(formPrice.value)) {
		error.textContent = "That isn't a number!";
		error.className = "error active";
		return false;
	}

	if (Number(formPrice.value) <= 0) {
		error.textContent = "Price can't be negative!";
		error.className = "error active";
		return false;
	}

	error.textContent = "";
	error.className = "error";
	return true;
}

function validateBookForm(event) {
	// these return false if they find an error.
	if (
		!checkFormTitle() ||
		!checkFormAuthor() ||
		!checkFormPages() ||
		!checkFormPrice()
	) {
		event.preventDefault();
		return;
	}

	const book = new Book(
		formTitle.value,
		formAuthor.value,
		formPages.value,
		formPrice.value,
		formRead.checked
	);
	myLibrary.push(book);

	// update ui and reset the form
	displayBooks();
	form.reset();
}

function setupEvents() {
	// logic for form modal visibility
	showModalButton.addEventListener("click", () => {
		modal.showModal();
	});

	closeModalButton.addEventListener("click", () => {
		modal.close();
	});

	formTitle.addEventListener("input", checkFormTitle);
	formAuthor.addEventListener("input", checkFormAuthor);
	formPages.addEventListener("input", checkFormPages);
	formPrice.addEventListener("input", checkFormPrice);

	// form submission handling
	fromSubmitButton.addEventListener("click", validateBookForm);
}

function start() {
	const startingBook = new Book("A BOOK", "AN AUTHOR", 9001, 10255, true);
	myLibrary.push(startingBook);

	displayBooks();
	setupEvents();
	console.log("Setup is done!");
}

start();

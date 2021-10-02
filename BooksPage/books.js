import './books.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import {
	onAuthStateChanged,
	getAuth,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

import {
	getFirestore,
	collection,
	addDoc,
	onSnapshot,
	query,
	doc,
	setDoc,
	deleteDoc,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

//initializing firebase and firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function fetchingBooks() {
	let newBookList = [];
	const Book = {
		title: null,
		categories: null,
		author: null,
		description: null,
		image: null,
		publisher: null,
		publishedDate: null,
		id: null,
		info: null,
		price: 0,
	};

	//fetching book from the API
	fetch(
		'https://google-books.p.rapidapi.com/volumes?key=AIzaSyAOsteuaW5ifVvA_RkLXh0mYs6GLAD6ykc',
		{
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'google-books.p.rapidapi.com',
				'x-rapidapi-key': '7ecbb014b0mshc95dbe51b85f5d9p186b56jsn682d5e35fb85',
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			newBookList = [...data.items];
			newBookList.map((book, i) => {
				let fixedSaleability = book.saleInfo.saleability.replace(/_/g, ' ');
				if (book.volumeInfo.imageLinks === undefined) return;
				if (!book.volumeInfo.description)
					book.volumeInfo.description = 'This book has no discription';
				if (!book.volumeInfo.categories) book.volumeInfo.categories = 'unknown';
				if (!book.volumeInfo.publisher)
					book.volumeInfo.publisher = 'Unknown publisher';
				if (!book.volumeInfo.authors) book.volumeInfo.authors = 'Unknow author';
				!book.saleInfo.listPrice
					? (Book.price = fixedSaleability)
					: book.saleInfo.listPrice.amount === 0
					? (Book.price = 'FREE')
					: (Book.price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode}`);

				Book.title = book.volumeInfo.title;
				Book.categories = book.volumeInfo.categories[0];
				Book.author = book.volumeInfo.authors[0];
				Book.description = book.volumeInfo.description;
				Book.image = book.volumeInfo.imageLinks.smallThumbnail;
				Book.publisher = book.volumeInfo.publisher;
				Book.publishedDate = book.volumeInfo.publishedDate;
				Book.id = book.id;
				Book.info = book.volumeInfo.infoLink;
				displayBook(Book);
			});
			// handleAddBtn();
			storeInDb(data.items);
			return data;
		})
		// .then((data) => {
		// 	console.log(data);
		// })
		.catch((err) => {
			console.error(err);
		});
}

//display all the books on the screen
function displayBook(book) {
	const booksContainer = document.querySelector('.booksContainer');
	let imgPriceContainer = document.createElement('div');
	let buttonsContainer = document.createElement('div');
	let Book = document.createElement('div');

	let imgTag = document.createElement('img');
	let priceTag = document.createElement('p');

	let btn1 = document.createElement('a');
	let btn2 = document.createElement('button');

	btn1.classList.add(`link`);
	btn1.setAttribute('target', `_blank`);
	btn1.href = book.info;
	btn1.textContent = 'INFO';

	btn2.innerText = 'ADD';
	btn2.classList.add('btn');
	btn2.setAttribute('data-id', `${book.id}`);
	btn2.setAttribute('disabled', true);

	imgTag.classList.add('bookCover');
	priceTag.classList.add('price');
	Book.classList.add('book');

	imgPriceContainer.classList.add('img-price');
	buttonsContainer.classList.add('btnContainer');

	imgTag.src = book.image;
	priceTag.innerText = book.price;

	imgPriceContainer.appendChild(imgTag);
	imgPriceContainer.appendChild(priceTag);

	buttonsContainer.appendChild(btn1);
	buttonsContainer.appendChild(btn2);

	Book.appendChild(imgPriceContainer);
	Book.appendChild(buttonsContainer);

	booksContainer.appendChild(Book);
}

async function storeInDb(books) {
	const addBtn = document.querySelectorAll('.btn');

	auth.onAuthStateChanged(async (user) => {
		const booksInDb = await getDocs(collection(db, `${user.uid}`));
		const querySnapshot = await query(collection(db, `${user.uid}`));

		if (user) {
			addBtn.forEach((btn) => {
				btn.disabled = false;
				btn.addEventListener('click', async () => {
					await test(btn, user.uid);
					books.map(async (book) => {
						if (book.id === btn.dataset.id) {
							try {
								let docRef = await addDoc(collection(db, `${user.uid}`), {
									title: book.volumeInfo.title,
									categories: book.volumeInfo.categories[0],
									author: book.volumeInfo.authors[0],
									description: book.volumeInfo.description,
									image: book.volumeInfo.imageLinks.smallThumbnail,
									publisher: book.volumeInfo.publisher,
									publishedDate: book.volumeInfo.publishedDate,
									id: book.id,
								});
								console.log('Document written with ID: ', docRef.id);
							} catch (e) {
								console.error('Error adding document: ', e);
							}
						}
					});
				});
			});
		} else {
			console.log('don know');
		}
	});
}

fetchingBooks();

async function test(btn, id) {
	const querySnapshot = await getDocs(collection(db, `${id}`));

	querySnapshot.forEach(async (book) => {
		if (book.data().id === btn.dataset.id) {
			await deleteDoc(doc(db, `${id}`, `${book.id}`));
			alert('You already add the book once');
			console.log(book.id);
		}
	});
}

// books.map(async (book) => {
// 	if (book.id === e.target.dataset.id) {
// 		try {
// 			let docRef = await addDoc(collection(db, 'Books'), {
// 				title: book.volumeInfo.title,
// 				categories: book.volumeInfo.categories[0],
// 				author: book.volumeInfo.authors[0],
// 				description: book.volumeInfo.description,
// 				image: book.volumeInfo.imageLinks.smallThumbnail,
// 				publisher: book.volumeInfo.publisher,
// 				publishedDate: book.volumeInfo.publishedDate,
// 				id: book.id,
// 			});
// 			console.log('Document written with ID: ', docRef.id);
// 		} catch (e) {
// 			console.error('Error adding document: ', e);
// 		}
// 	}
// });

// const booksRef = collection(db, 'Books');
// setDoc(doc(booksRef, `${auth.currentUser.uid}`), {
// 	title: book.volumeInfo.title,
// 	categories: book.volumeInfo.categories[0],
// 	author: book.volumeInfo.authors[0],
// 	description: book.volumeInfo.description,
// 	image: book.volumeInfo.imageLinks.smallThumbnail,
// 	publisher: book.volumeInfo.publisher,
// 	publishedDate: book.volumeInfo.publishedDate,
// 	id: book.id,
// });

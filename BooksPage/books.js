import './books.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import {
	signInWithPopup,
	signOut,
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
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
const provider = new GoogleAuthProvider();

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
			storeInDb(data.items);
			return data;
		})

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
	// btn2.setAttribute('disabled', true);

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

//add book to the fireStore if the user is loged in
async function storeInDb(books) {
	const addBtn = document.querySelectorAll('.btn');
	const outBtn = document.querySelector('.signOut');
	const inBtn = document.querySelector('.signIn');
	const disLink = document.querySelector('.disLink');

	auth.onAuthStateChanged(async (user) => {
		if (user) {
			// const booksInDb = await getDocs(collection(db, `${user.uid}`));
			// const querySnapshot = await query(collection(db, `${user.uid}`));

			inBtn.disabled = true;
			inBtn.classList.remove('inBtn');
			outBtn.disabled = false;
			outBtn.classList.add('outBtn');
			disLink.style.pointerEvents = 'all';

			addBtn.forEach((btn) => {
				btn.disabled = false;
				btn.addEventListener('click', async () => {
					await checkStore(btn, user.uid);
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
									read: false,
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
			addBtn.forEach((btn) => {
				btn.disabled = true;
			});
			inBtn.disabled = false;
			inBtn.classList.add('inBtn');
			outBtn.disabled = true;
			outBtn.classList.remove('outBtn');

			disLink.style.pointerEvents = 'none';
		}
	});
}

//check the store for similarity
async function checkStore(btn, id) {
	const temp = [];
	const querySnapshot = await getDocs(collection(db, `${id}`));
	querySnapshot.forEach(async (book) => {
		temp.push(book.data());
		if (book.data().id === btn.dataset.id) {
			await deleteDoc(doc(db, `${id}`, `${book.id}`));
			alert(`${book.data().title} - is already added to your collection`);
			console.log(book.id);
		}
	});
}

//log user in
document.querySelector('.signIn').addEventListener('click', () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			const user = result.user;
			greetingUser(user);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
			const credential = GoogleAuthProvider.credentialFromError(error);
		});
});

//log user out
const signOutBtn = document.querySelector('.signOut');
signOutBtn.addEventListener('click', () => {
	signOut(auth)
		.then(() => {
			console.log('user is sgin out');
		})
		.catch((error) => {
			console.log('something went wrong');
		});
});

function greetingUser(user) {
	const modalContainer = document.createElement('div');
	const userName = document.createElement('p');

	if (user) {
		modalContainer.classList.add('modal');

		userName.classList.add('userName');
		userName.textContent = `Welcome ${user.displayName}`;

		modalContainer.appendChild(userName);
		setTimeout(() => {
			modalContainer.classList.add('toggle');
		}, 500);
		setTimeout(() => {
			modalContainer.classList.remove('toggle');
		}, 2500);

		document.body.appendChild(modalContainer);
	}
}

fetchingBooks();

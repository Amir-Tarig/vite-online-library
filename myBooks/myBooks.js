import './myBooks.css';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';

import {
	signOut,
	getAuth,
	onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

import {
	getFirestore,
	collection,
	updateDoc,
	onSnapshot,
	query,
	doc,
	addDoc,
	deleteDoc,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

const booksContainer = document.createElement('div');
booksContainer.classList.add('bookContainer');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

auth.onAuthStateChanged(async (user) => {
	if (user) {
		await userInfo(user);
		userBooksInDb(user);
		handleFormInput(user);
	} else {
		console.log('donknow');
	}
});

//log user out
const signOutBtn = document.querySelector('.sign-out');
const redirectedLink = document.querySelector('.redirect');
signOutBtn.addEventListener('click', () => {
	window.location.replace('../index.html');
	signOut(auth)
		.then(() => {
			console.log('user is sgin out');
		})
		.catch((error) => {
			console.log('something went wrong');
			console.log(error.message);
		});
});

//displaying user image and name
async function userInfo(user) {
	if (user) {
		const userImg = document.querySelector('.userImg');
		const userName = document.querySelector('.userName');
		userImg.src = await user.photoURL;
		userName.textContent = await user.displayName;
	} else {
		userImg.src = '';
		userImg.style.background = 'white';
	}
}

//get user books from the fireStore db
async function userBooksInDb(user) {
	let books = [];
	let bookId = [];
	const booksLengthInDb = document.querySelector('.bookNumber');
	const q = query(collection(db, `${user.uid}`));
	// const querySnapshot = await getDocs(q);

	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		booksContainer.innerHTML = '';
		books = [];
		querySnapshot.forEach((doc) => {
			books.push(doc.data());
			bookId.push(doc.id);
		});
		// console.log(books.length);
		displayBooks(books, bookId, user.uid);
	});
}

//displaying userBooks
async function displayBooks(books, bookId, userId) {
	books.map((book, i) => {
		const userBook = document.createElement('div');
		let bookImg = document.createElement('img');
		const bookTitle = document.createElement('h3');
		const deleteBtn = document.createElement('p');
		const readBtn = document.createElement('button');

		userBook.classList.add('book');
		bookImg.classList.add('bookCover');
		bookTitle.classList.add('bookTitle');
		deleteBtn.classList.add('deleteBtn');
		readBtn.classList.add('readBtn');

		bookImg.src = book.image ? book.image : '';

		bookTitle.textContent = book.title;
		deleteBtn.textContent = 'x';
		deleteBtn.setAttribute('data-bookId', bookId[i]);
		deleteBtn.setAttribute('data-userId', userId);
		readBtn.textContent = book.read ? 'Read' : 'Not Read';
		readBtn.setAttribute('data-bookId', bookId[i]);
		readBtn.setAttribute('data-userId', userId);
		readBtn.setAttribute('data-state', book.read);

		userBook.appendChild(bookImg);
		userBook.appendChild(bookTitle);
		userBook.appendChild(deleteBtn);
		userBook.appendChild(readBtn);
		booksContainer.appendChild(userBook);
	});

	document.body.appendChild(booksContainer);
	const rBtn = document.querySelectorAll('.readBtn');
	const dBtn = document.querySelectorAll('.deleteBtn');
	toggleReadStatus(rBtn);
	deleteBtn(dBtn);
}

//toggle read status
function toggleReadStatus(btns) {
	btns.forEach((btn) => {
		btn.addEventListener('click', async () => {
			console.log(typeof btn.dataset.state);
			if (btn.dataset.state === 'false') {
				const book = doc(db, `${btn.dataset.userid}`, `${btn.dataset.bookid}`);
				await updateDoc(book, {
					read: true,
				});
			} else {
				const book = doc(db, `${btn.dataset.userid}`, `${btn.dataset.bookid}`);
				await updateDoc(book, {
					read: false,
				});
			}
		});
	});
}

function handleFormInput(user) {
	const BookTitle = document.querySelector('#BookTitle');
	const BookAuthor = document.querySelector('#BookAuthor');
	const TotalPages = document.querySelector('#totalPages');
	const BookDisc = document.querySelector('#disc');
	const isRead = document.querySelector('#read');
	const submitBtn = document.querySelector('.SubmitBtn');

	submitBtn.addEventListener('click', async (e) => {
		e.preventDefault();
		checkBooks();
	});

	async function checkBooks() {
		const querySnapshot = await getDocs(collection(db, `${user.uid}`));
		querySnapshot.forEach(async (doc) => {
			if (
				BookTitle.value === doc.data().title &&
				BookAuthor.value === doc.data().author &&
				BookDisc.value === doc.data().description
			) {
				alert('Book is exsist already ');
			} else {
				submitBook();
			}
		});
		BookTitle.value = '';
		BookAuthor.value = '';
		BookDisc.value = '';
		TotalPages.value = 0;
		isRead.checked = false;
	}

	async function submitBook() {
		try {
			let docRef = await addDoc(collection(db, `${user.uid}`), {
				title: BookTitle.value,
				categories: 'unknown',
				author: BookAuthor.value,
				description: BookDisc.value,
				pages: TotalPages.value,
				image: '../images/Untitled.png',
				read: isRead.checked,
			});
			BookTitle.value = '';
			BookAuthor.value = '';
			BookDisc.value = '';
			TotalPages.value = 0;
			isRead.checked = false;
			console.log('Document written with ID: ', docRef.id);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}
}

//handle the book delete button
function deleteBtn(btns) {
	btns.forEach((btn) => {
		btn.addEventListener('click', async () => {
			await deleteDoc(
				doc(db, `${btn.dataset.userid}`, `${btn.dataset.bookid}`)
			);
		});
	});
}

/**
 *
 */

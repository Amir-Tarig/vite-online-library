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
	addDoc,
	onSnapshot,
	query,
	doc,
	setDoc,
	deleteDoc,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

auth.onAuthStateChanged((user) => {
	if (user) {
		userInfo(user);
		userBooksInDb(user);
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
		userImg.src = await user.auth.currentUser.photoURL;
		userName.textContent = await user.displayName;
	} else {
		userImg.src = '';
		userImg.style.background = 'white';
	}

	console.log(user);
}

//get user books from the fireStore db
function userBooksInDb(user) {
	const booksLengthInDb = document.querySelector('.bookNumber');
	const q = query(collection(db, `${user.uid}`));
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		const books = [];
		querySnapshot.forEach((doc) => {
			books.push(doc.data());
		});
		booksLengthInDb.textContent = books.length;
		console.log(`Current books: ${books.length}`);
		displayBooks(books);
	});
}

//displaying userBooks
function displayBooks(books) {
	const booksContainer = document.createElement('div');
	booksContainer.classList.add('bookContainer');

	books.map((book) => {
		const userBook = document.createElement('div');
		userBook.classList.add('book');
		userBook.innerHTML = `
				<img class="bookCover" src='${book.image ? book.image : ''}'>
				<h3 class="bookTitle">${book.title}</h3>
				<p class="dbtn">x</p>
				<button  class="rBtn">${book.read ? 'READ' : 'NOT READ'}</button>
		`;
		booksContainer.appendChild(userBook);
	});

	document.body.appendChild(booksContainer);
	const rBtn = document.querySelectorAll('.rBtn');
	toggleReadStatus(rBtn);
}

//toggle read status
function toggleReadStatus(btns) {
	btns.forEach((btn) => {
		btn.addEventListener('click', () => {
			console.log('soosos');
		});
	});
}

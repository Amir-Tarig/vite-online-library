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
	setDoc,
	deleteDoc,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

auth.onAuthStateChanged(async (user) => {
	if (user) {
		await userInfo(user);
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
		userImg.src = await user.photoURL;
		userName.textContent = await user.displayName;
	} else {
		userImg.src = '';
		userImg.style.background = 'white';
	}
}

//get user books from the fireStore db
async function userBooksInDb(user) {
	const books = [];
	const bookId = [];

	const booksLengthInDb = document.querySelector('.bookNumber');
	const q = query(collection(db, `${user.uid}`));
	const querySnapshot = await getDocs(q);

	querySnapshot.forEach((doc) => {
		books.push(doc.data());
		bookId.push(doc.id);
	});

	const unsubscribe = onSnapshot(q, (snapshot) => {
		snapshot.docChanges().forEach((change) => {
			if (change.type === 'added') {
				// console.log('New city: ', change.doc.data());
			}
			if (change.type === 'modified') {
				books.map((book) => {
					if (book.id === change.doc.data().id) {
						books.slice(book);
						console.log(book);
						books.push(change.doc.data());
					}
				});
				// console.log('modified city: ', change.doc.data());
			}
		});
	});

	displayBooks(books, bookId, user.uid);
}

//displaying userBooks
function displayBooks(books, bookId, userId) {
	const booksContainer = document.createElement('div');
	booksContainer.classList.add('bookContainer');

	books.map((book, i) => {
		const userBook = document.createElement('div');
		userBook.classList.add('book');
		userBook.innerHTML = `
				<img class="bookCover" src='${book.image ? book.image : ''}'>
				<h3 class="bookTitle">${book.title}</h3>
				<p class="dbtn">x</p>
				<button data-userUid="${userId}" data-bookId="${
			bookId[i]
		}" class="rBtn">NOT READ</button>
		`;
		booksContainer.appendChild(userBook);
	});
	document.body.appendChild(booksContainer);
	const rBtn = document.querySelectorAll('.rBtn');
	toggleReadStatus(rBtn);
}

//toggle read status
function toggleReadStatus(btns) {
	console.log(btns);
	btns.forEach((btn) => {
		btn.addEventListener('click', async () => {
			const book = doc(db, `${btn.dataset.useruid}`, `${btn.dataset.bookid}`);
			// Set the "capital" field of the city 'DC'
			await updateDoc(book, {
				read: true,
			});
			console.log('so');
		});
	});
	// 	const washingtonRef = doc(db, `${userUid}`, "DC");
	// // Set the "capital" field of the city 'DC'
	// await updateDoc(washingtonRef, {
	//   capital: true
	// });
}

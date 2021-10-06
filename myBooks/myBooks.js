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

auth.onAuthStateChanged(async (user) => {
	if (user) {
		userInfo(user);
	} else {
		console.log('donknow');
	}
});

//log user out
const signOutBtn = document.querySelector('.sign-out');
signOutBtn.addEventListener('click', () => {
	signOut(auth)
		.then(() => {
			console.log('user is sgin out');
		})
		.catch((error) => {
			console.log('something went wrong');
		});
});

//displaying user image and name
function userInfo(user) {
	const userImg = document.querySelector('.userImg');
	userImg.src = user.photoURL;

	// console.log(user);
}

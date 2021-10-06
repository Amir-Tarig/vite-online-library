import './style.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';

import {
	signInWithPopup,
	onAuthStateChanged,
	signOut,
	getAuth,
	GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDdsJmYdOqZTbQaBH9eqyjAtHY2oGTtCAo',
	authDomain: 'online-library-f5697.firebaseapp.com',
	projectId: 'online-library-f5697',
	storageBucket: 'online-library-f5697.appspot.com',
	messagingSenderId: '54897299274',
	appId: '1:54897299274:web:7c5d011a4dd5988892fbb3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
auth.useDeviceLanguage();

document.querySelector('.signIn').addEventListener('click', () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			greetingUser(user);
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});
});

// user status change
auth.onAuthStateChanged((user) => {
	if (user) {
		handleBtns(user);
	} else {
		handleBtns(user);
	}
});

//handle Buttons and routs when the user sign in/out
function handleBtns(user) {
	const outBtn = document.querySelector('.signOut');
	const inBtn = document.querySelector('.signIn');
	const disLink = document.querySelector('.disLink');
	const disNavBtn = document.querySelector('.disNavBtn');

	if (user) {
		inBtn.disabled = true;
		inBtn.classList.remove('inBtn');

		outBtn.disabled = false;
		outBtn.classList.add('outBtn');

		disLink.style.pointerEvents = 'all';
		disNavBtn.disabled = 'false';
	} else {
		inBtn.disabled = false;
		inBtn.classList.add('inBtn');
		disLink.style.pointerEvents = 'none';
		disNavBtn.addEventListener('click', () => {
			alert(
				'You Need To Sign-in With Your Google Acount To Get Access To This Section'
			);
		});
		outBtn.disabled = true;
		outBtn.classList.remove('outBtn');
	}
}

//sign-out users
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

import './style.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import {
	signInWithPopup,
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

document.querySelector('.logIn').addEventListener('click', () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			console.log(user);
			// ...
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
console.log(auth);

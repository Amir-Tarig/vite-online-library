import"./modulepreload-polyfill.b7f2da20.js";import{initializeApp as e}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";import{getAuth as t,GoogleAuthProvider as o,signInWithPopup as i,signOut as n}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";import{getFirestore as s,addDoc as a,collection as l,getDocs as d,deleteDoc as c,doc as r}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";const u=e(firebaseConfig),m=s(u),p=t(u),h=new o;document.querySelector(".signIn").addEventListener("click",(()=>{i(p,h).then((e=>{o.credentialFromResult(e).accessToken;!function(e){const t=document.createElement("div"),o=document.createElement("p");e&&(t.classList.add("modal"),o.classList.add("userName"),o.textContent=`Welcome ${e.displayName}`,t.appendChild(o),setTimeout((()=>{t.classList.add("toggle")}),500),setTimeout((()=>{t.classList.remove("toggle")}),2500),document.body.appendChild(t))}(e.user)})).catch((e=>{e.code,e.message,e.email,o.credentialFromError(e)}))}));document.querySelector(".signOut").addEventListener("click",(()=>{n(p).then((()=>{console.log("user is sgin out")})).catch((e=>{console.log("something went wrong")}))})),function(){let e=[];const t={title:null,categories:null,author:null,description:null,image:null,publisher:null,publishedDate:null,id:null,info:null,price:0};fetch("https://google-books.p.rapidapi.com/volumes?key=AIzaSyAOsteuaW5ifVvA_RkLXh0mYs6GLAD6ykc",{method:"GET",headers:{"x-rapidapi-host":"google-books.p.rapidapi.com","x-rapidapi-key":"7ecbb014b0mshc95dbe51b85f5d9p186b56jsn682d5e35fb85"}}).then((e=>e.json())).then((o=>(e=[...o.items],e.map(((e,o)=>{let i=e.saleInfo.saleability.replace(/_/g," ");void 0!==e.volumeInfo.imageLinks&&(e.volumeInfo.description||(e.volumeInfo.description="This book has no discription"),e.volumeInfo.categories||(e.volumeInfo.categories="unknown"),e.volumeInfo.publisher||(e.volumeInfo.publisher="Unknown publisher"),e.volumeInfo.authors||(e.volumeInfo.authors="Unknow author"),e.saleInfo.listPrice?0===e.saleInfo.listPrice.amount?t.price="FREE":t.price=`${e.saleInfo.listPrice.amount} ${e.saleInfo.listPrice.currencyCode}`:t.price=i,t.title=e.volumeInfo.title,t.categories=e.volumeInfo.categories[0],t.author=e.volumeInfo.authors[0],t.description=e.volumeInfo.description,t.image=e.volumeInfo.imageLinks.smallThumbnail,t.publisher=e.volumeInfo.publisher,t.publishedDate=e.volumeInfo.publishedDate,t.id=e.id,t.info=e.volumeInfo.infoLink,function(e){const t=document.querySelector(".booksContainer");let o=document.createElement("div"),i=document.createElement("div"),n=document.createElement("div"),s=document.createElement("img"),a=document.createElement("p"),l=document.createElement("a"),d=document.createElement("button");l.classList.add("link"),l.setAttribute("target","_blank"),l.href=e.info,l.textContent="INFO",d.innerText="ADD",d.classList.add("btn"),d.setAttribute("data-id",`${e.id}`),s.classList.add("bookCover"),a.classList.add("price"),n.classList.add("book"),o.classList.add("img-price"),i.classList.add("btnContainer"),s.src=e.image,a.innerText=e.price,o.appendChild(s),o.appendChild(a),i.appendChild(l),i.appendChild(d),n.appendChild(o),n.appendChild(i),t.appendChild(n)}(t))})),async function(e){const t=document.querySelectorAll(".btn"),o=document.querySelector(".signOut"),i=document.querySelector(".signIn"),n=document.querySelector(".disLink");p.onAuthStateChanged((async s=>{s?(i.disabled=!0,i.classList.remove("inBtn"),o.disabled=!1,o.classList.add("outBtn"),n.style.pointerEvents="all",t.forEach((t=>{t.disabled=!1,t.addEventListener("click",(async()=>{await async function(e,t){const o=[];(await d(l(m,`${t}`))).forEach((async i=>{o.push(i.data()),i.data().id===e.dataset.id&&(await c(r(m,`${t}`,`${i.id}`)),alert(`${i.data().title} - is already added to your collection`),console.log(i.id))}))}(t,s.uid),e.map((async e=>{if(e.id===t.dataset.id)try{let t=await a(l(m,`${s.uid}`),{title:e.volumeInfo.title,categories:e.volumeInfo.categories[0],author:e.volumeInfo.authors[0],description:e.volumeInfo.description,image:e.volumeInfo.imageLinks.smallThumbnail,publisher:e.volumeInfo.publisher,publishedDate:e.volumeInfo.publishedDate,id:e.id,read:!1});console.log("Document written with ID: ",t.id)}catch(o){console.error("Error adding document: ",o)}}))}))}))):(t.forEach((e=>{e.disabled=!0})),i.disabled=!1,i.classList.add("inBtn"),o.disabled=!0,o.classList.remove("outBtn"),n.style.pointerEvents="none")}))}(o.items),o))).catch((e=>{console.error(e)}))}();

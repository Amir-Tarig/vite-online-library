import"./modulepreload-polyfill.b7f2da20.js";import{initializeApp as e}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";import{getAuth as t,GoogleAuthProvider as i,signInWithPopup as a,signOut as o}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";import{getFirestore as s,addDoc as n,collection as d,getDocs as c,deleteDoc as l,doc as r}from"https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";const u=e(firebaseConfig),p=s(u),m=t(u),h=new i;document.querySelector(".signIn").addEventListener("click",(()=>{a(m,h).then((e=>{i.credentialFromResult(e).accessToken;!function(e){const t=document.createElement("div"),i=document.createElement("p");e&&(t.classList.add("modal"),i.classList.add("userName"),i.textContent=`Welcome ${e.displayName}`,t.appendChild(i),setTimeout((()=>{t.classList.add("toggle")}),500),setTimeout((()=>{t.classList.remove("toggle")}),2500),document.body.appendChild(t))}(e.user)})).catch((e=>{e.code,e.message,e.email,i.credentialFromError(e)}))}));document.querySelector(".signOut").addEventListener("click",(()=>{o(m).then((()=>{console.log("user is sgin out")})).catch((e=>{console.log("something went wrong")}))})),function(){let e=[];const t={title:null,author:null,description:null,image:null,publishedDate:null,id:null,price:0};fetch("https://book4.p.rapidapi.com/",{method:"GET",headers:{"x-rapidapi-host":"book4.p.rapidapi.com","x-rapidapi-key":"6aff237c00msh14123fa15d54af3p182da9jsn75575ec65d61"}}).then((e=>e.json())).then((i=>(console.log(i.books),e=[...i.books],e.map(((e,i)=>{void 0!==e.url&&(e.detail||(e.detail="This book has no discription"),e.categories||(e.categories="unknown"),e.publisher||(e.publisher="Unknown publisher"),e.author||(e.author="Unknow author"),e.price?t.price=e.price:t.price="30$",t.title=e.title,t.author=e.author,t.description=e.detail,t.image=e.url,t.publishedDate=e.data,t.id=e.id,function(e){const t=document.querySelector(".booksContainer");let i=document.createElement("div"),a=document.createElement("div"),o=document.createElement("div"),s=document.createElement("img"),n=document.createElement("p"),d=document.createElement("button");d.innerText="ADD",d.classList.add("btn"),d.setAttribute("data-id",`${e.id}`),s.classList.add("bookCover"),n.classList.add("price"),o.classList.add("book"),i.classList.add("img-price"),a.classList.add("btnContainer"),s.src=e.image,n.innerText=e.price,i.appendChild(s),i.appendChild(n),a.appendChild(d),o.appendChild(i),o.appendChild(a),t.appendChild(o)}(t))})),async function(e){const t=document.querySelectorAll(".btn"),i=document.querySelector(".signOut"),a=document.querySelector(".signIn"),o=document.querySelector(".disLink");m.onAuthStateChanged((async s=>{s?(a.disabled=!0,a.classList.remove("inBtn"),i.disabled=!1,i.classList.add("outBtn"),o.style.pointerEvents="all",t.forEach((t=>{t.disabled=!1,t.addEventListener("click",(async()=>{await async function(e,t){const i=[];(await c(d(p,`${t}`))).forEach((async a=>{i.push(a.data()),a.data().id===e.dataset.id&&(await l(r(p,`${t}`,`${a.id}`)),alert(`${a.data().title} - is already added to your collection`),console.log(a.id))}))}(t,s.uid),e.map((async e=>{if(e.id===t.dataset.id)try{let t=await n(d(p,`${s.uid}`),{title:e.title,author:e.author,description:e.detail,image:e.url,publishedDate:e.date,id:e.id,read:!1});console.log("Document written with ID: ",t.id)}catch(i){console.error("Error adding document: ",i)}}))}))}))):(t.forEach((e=>{e.disabled=!0})),a.disabled=!1,a.classList.add("inBtn"),i.disabled=!0,i.classList.remove("outBtn"),o.style.pointerEvents="none")}))}(i.books),i))).catch((e=>{console.error(e)}))}();

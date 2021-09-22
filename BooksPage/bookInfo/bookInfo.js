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
		price: 0,
	};

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
			console.log(data);
			newBookList.map((book, i) => {
				let fixedSaleability = book.saleInfo.saleability.replace(/_/g, ' ');

				if (book.volumeInfo.imageLinks === undefined) return;
				if (!book.volumeInfo.description)
					book.volumeInfo.description = 'This book has no discription';
				if (!book.volumeInfo.categories) book.volumeInfo.categories = 'unknown';
				if (!book.volumeInfo.publisher)
					book.volumeInfo.publisher = 'Unknown publisher';
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
			});
		})
		.catch((err) => {
			console.error(err);
		});
}
fetchingBooks();

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				booksPage: resolve(__dirname, 'booksPage/books.html'),
				myBooks: resolve(__dirname, 'myBooks/myBooksPage.html'),
			},
		},
	},
});

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			base: '/vite-online-library/',
			input: {
				main: resolve(__dirname, 'index.html'),
				booksPage: resolve(__dirname, 'bookspage/books.html'),
				myBooks: resolve(__dirname, 'mybooks/mybookspage.html'),
			},
		},
	},
});

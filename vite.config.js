import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	base: '/vite-online-library/',
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				bookspage: resolve(__dirname, 'bookspage/books.html'),
				mybooks: resolve(__dirname, 'mybooks/mybookspage.html'),
			},
		},
	},
});

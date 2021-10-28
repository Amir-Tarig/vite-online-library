const { resolve } = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				nested: resolve(__dirname, 'BooksPage/books.html'),
				nested: resolve(__dirname, 'myBooks/myBooks.html'),
			},
		},
	},
});

/* eslint-disable consistent-return */
/* eslint-disable arrow-body-style */

const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, hapi) => {
  // eslint-disable-next-line object-curly-newline, max-len
  const { name = null, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const id = nanoid(12);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  /* Create Object */
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = hapi.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = hapi.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  /* add a new book */
  books.push(newBook);

  /* check */
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = hapi.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  /* if failed input */
  const response = hapi.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getBooksHandler = (req, hapi) => {
  const { name, reading, finished } = req.query;

  let booksFiltered = books;

  if (name) {
    booksFiltered = books.filter((book) => {
      return book.name.toLowerCase().includes(name.toLowerCase());
    });
  }

  if (reading) {
    booksFiltered = books.filter((book) => {
      return Number(book.reading) === Number(reading);
    });
  }

  if (finished) {
    booksFiltered = books.filter((book) => {
      return Number(book.finished) === Number(finished);
    });
  }

  const response = hapi.response({
    status: 'success',
    data: {
      books: booksFiltered.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getDetailBookHandler = (req, hapi) => {
  const { bookId } = req.params;
  const bookFiltered = books.filter((book) => book.id === bookId)[0];

  if (!bookFiltered) {
    const response = hapi.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = hapi.response({
    status: 'success',
    data: {
      book: bookFiltered,
    },
  });
  response.code(200);
  return response;
};

const editBookHandler = (req, hapi) => {
  // eslint-disable-next-line object-curly-newline, max-len
  const { name = null, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;
  const { bookId } = req.params;
  const updatedAt = new Date().toISOString();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = hapi.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (!name) {
    const response = hapi.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = hapi.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  /* edit book process */
  books[bookIndex] = {
    // insert old value
    ...books[bookIndex],

    // replace with new value
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = hapi.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookHandler = (req, hapi) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = hapi.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(bookIndex, 1);
  const response = hapi.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler, getBooksHandler, getDetailBookHandler, editBookHandler, deleteBookHandler,
};

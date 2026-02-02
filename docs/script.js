/**************************************************
 * GITHUB-ONLY DEMO MODE
 **************************************************/
const githubOnlyMode = true;

const LS_USERS_KEY = "demo_users";
const LS_BOOKS_KEY = "demo_books";

function loadFromLS(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveToLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**************************************************
 * USER SECTION
 **************************************************/
let allUsers = [];
let editUserId = null;
let isEditingUser = false;

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
  };

  if (!user.name || !user.email || !user.phone) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  try {
    if (githubOnlyMode) {
      let users = loadFromLS(LS_USERS_KEY);

      if (isEditingUser) {
        users = users.map(u =>
          u.id === editUserId ? { ...u, ...user } : u
        );
      } else {
        user.id = Date.now();
        users.push(user);
      }

      saveToLS(LS_USERS_KEY, users);
    }

    alert(isEditingUser ? "✅ User updated!" : "✅ User added!");

    e.target.reset();
    editUserId = null;
    isEditingUser = false;

    const btn = document.querySelector("#userForm button");
    btn.textContent = "Add User";
    btn.style.backgroundColor = "#3366cc";

    getUsers();

  } catch (err) {
    console.error(err);
    alert("❌ Error saving user");
  }
});

function editUser(id, name, email, phone) {
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("phone").value = phone;

  editUserId = id;
  isEditingUser = true;

  const btn = document.querySelector("#userForm button");
  btn.textContent = "Update User";
  btn.style.backgroundColor = "orange";
}

function getUsers() {
  allUsers = loadFromLS(LS_USERS_KEY);
  displayUsers(allUsers);
}

function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  const users = loadFromLS(LS_USERS_KEY).filter(u => u.id !== id);
  saveToLS(LS_USERS_KEY, users);
  getUsers();
}

function displayUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  users.forEach(u => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>
        <button onclick="editUser(${u.id}, '${u.name}', '${u.email}', '${u.phone}')">Edit</button>
        <button onclick="deleteUser(${u.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function searchUsers() {
  const q = document.getElementById("userSearch").value.toLowerCase();
  displayUsers(allUsers.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  ));
}

/**************************************************
 * BOOK SECTION
 **************************************************/
let allBooks = [];
let editBookId = null;
let isEditingBook = false;

document.getElementById("bookForm").addEventListener("submit", addOrUpdateBook);

function addOrUpdateBook(e) {
  e.preventDefault();

  const book = {
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    category: document.getElementById("category").value.trim(),
    available: true
  };

  if (!book.title || !book.author || !book.category) {
    alert("⚠️ Fill all fields!");
    return;
  }

  try {
    let books = loadFromLS(LS_BOOKS_KEY);

    if (isEditingBook) {
      books = books.map(b =>
        b.id === editBookId ? { ...b, ...book } : b
      );
    } else {
      book.id = Date.now();
      books.push(book);
    }

    saveToLS(LS_BOOKS_KEY, books);

    alert(isEditingBook ? "✅ Book updated!" : "✅ Book added!");

    resetBookForm();
    loadBooks();

  } catch (err) {
    console.error(err);
    alert("❌ Error saving book");
  }
}

function editBook(id, title, author, category) {
  document.getElementById("title").value = title;
  document.getElementById("author").value = author;
  document.getElementById("category").value = category;

  editBookId = id;
  isEditingBook = true;

  const btn = document.getElementById("addBookBtn");
  btn.textContent = "Update Book";
  btn.style.backgroundColor = "orange";
}

function deleteBook(id) {
  if (!confirm("Delete this book?")) return;

  const books = loadFromLS(LS_BOOKS_KEY).filter(b => b.id !== id);
  saveToLS(LS_BOOKS_KEY, books);
  loadBooks();
}

function loadBooks() {
  allBooks = loadFromLS(LS_BOOKS_KEY);
  displayBooks(allBooks);
}

function displayBooks(books) {
  const tbody = document.getElementById("bookList");
  tbody.innerHTML = "";

  books.forEach(b => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.category}</td>
      <td>${b.available ? "✅" : "❌"}</td>
      <td>
        <button onclick="editBook(${b.id}, '${b.title}', '${b.author}', '${b.category}')">Edit</button>
        <button onclick="deleteBook(${b.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function resetBookForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("category").value = "";

  editBookId = null;
  isEditingBook = false;

  const btn = document.getElementById("addBookBtn");
  btn.textContent = "Add Book";
  btn.style.backgroundColor = "#3366cc";
}

/**************************************************
 * INIT
 **************************************************/
window.onload = () => {
  getUsers();
  loadBooks();
};

// ===== USER SECTION =====
const userApi = "https://library-management-production-f838.up.railway.app/users";
let allUsers = [];

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
  };

  const method = isEditingUser ? "PUT" : "POST";
  const url = isEditingUser ? `${userApi}/${editUserId}` : userApi;

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    alert(isEditingUser ? "✅ User updated successfully!" : "✅ User added successfully!");
    e.target.reset();
    isEditingUser = false;
    editUserId = null;
    const btn = document.querySelector("#userForm button");
    btn.textContent = "Add User";
    btn.style.backgroundColor = "#3366cc";
    getUsers();
  } else {
    alert("❌ Failed to save user!");
  }
});

let editUserId = null;
let isEditingUser = false;

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

// Load all users
async function getUsers() {
  const response = await fetch(userApi);
  allUsers = await response.json();
  displayUsers(allUsers);
}

// Display users in table
function displayUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  users.forEach((u) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone}</td>
      <td>
        <button onclick="editUser(${u.id}, '${u.name}', '${u.email}', '${u.phone}')"
          style="background-color: orange; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Edit</button>
        <button onclick="deleteUser(${u.id})"
          style="background-color: red; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Delete user
function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;

  fetch(`${userApi}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete user");
      alert("🗑️ User deleted successfully!");
      return getUsers();
    })
    .catch((err) => console.error("Error deleting user:", err));
}

// ===== USER SEARCH =====
function searchUsers() {
  const query = document.getElementById("userSearch").value.toLowerCase();
  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
  );
  displayUsers(filtered);
}

// ===== BOOK SECTION =====
const apiUrl = "https://library-management-production-f838.up.railway.app/books";
let editMode = false;
let editBookId = null;
let allBooks = [];

// Load all books
function loadBooks() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((books) => {
      allBooks = books;
      displayBooks(allBooks);
    })
    .catch((err) => console.error("Error loading books:", err));
}

// Display books
function displayBooks(books) {
  const list = document.getElementById("bookList");
  list.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.category}</td>
      <td>${book.available ? "✅ Available" : "❌ Not Available"}</td>
      <td>
        <button onclick="editBook(${book.id}, '${book.title}', '${book.author}', '${book.category}')"
          style="background-color: orange; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Edit</button>
        <button onclick="deleteBook(${book.id})"
          style="background-color: red; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Delete</button>
      </td>
    `;
    list.appendChild(row);
  });
}

// Add / Update book
function addOrUpdateBook(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value.trim();

  if (!title || !author || !category) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const book = { title, author, category, available: true };

  const method = editMode ? "PUT" : "POST";
  const url = editMode ? `${apiUrl}/${editBookId}` : apiUrl;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to save book");
      return response.json();
    })
    .then(() => {
      alert(editMode ? "✅ Book updated successfully!" : "✅ Book added successfully!");
      resetForm();
      loadBooks();
    })
    .catch((err) => console.error("Error saving book:", err));
}

// Edit Book
function editBook(id, title, author, category) {
  document.getElementById("title").value = title;
  document.getElementById("author").value = author;
  document.getElementById("category").value = category;

  editMode = true;
  editBookId = id;

  const btn = document.getElementById("addBookBtn");
  btn.textContent = "Update Book";
  btn.style.backgroundColor = "orange";
}

// Delete Book
function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => {
      alert("🗑️ Book deleted successfully!");
      loadBooks();
    })
    .catch((err) => console.error("Error deleting book:", err));
}

// Reset form
function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("category").value = "";

  editMode = false;
  editBookId = null;

  const btn = document.getElementById("addBookBtn");
  btn.textContent = "Add Book";
  btn.style.backgroundColor = "#3366cc";
}

// ===== BOOK SEARCH & FILTER =====
function searchBooks() {
  const query = document.getElementById("bookSearch").value.toLowerCase();
  const categoryFilter = document.getElementById("filterCategory").value;
  const availabilityFilter = document.getElementById("filterAvailability").value;

  const filtered = allBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    const matchesCategory =
      categoryFilter === "" || book.category === categoryFilter;
    const matchesAvailability =
      availabilityFilter === "" ||
      (availabilityFilter === "available" && book.available) ||
      (availabilityFilter === "unavailable" && !book.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  displayBooks(filtered);
}

// Run on page load
window.onload = () => {
  getUsers();
  loadBooks();
};

// Attach book form event
document.getElementById("bookForm").addEventListener("submit", addOrUpdateBook);

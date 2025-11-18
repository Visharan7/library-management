// ===== DEPLOYED BACKEND URLs =====
const userApi = "https://library-management-production-f838.up.railway.app/users";
const bookApi = "https://library-management-production-f838.up.railway.app/books";

// ===== USER SECTION =====
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

  const method = isEditingUser ? "PUT" : "POST";
  const url = isEditingUser ? `${userApi}/${editUserId}` : userApi;

  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) throw new Error("Failed to save user");

    alert(isEditingUser ? "✅ User updated successfully!" : "✅ User added successfully!");
    e.target.reset();
    isEditingUser = false;
    editUserId = null;
    document.querySelector("#userForm button").textContent = "Add User";
    document.querySelector("#userForm button").style.backgroundColor = "#3366cc";

    getUsers();
  } catch (err) {
    console.error(err);
    alert("❌ Error saving user! Please try again.");
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

async function getUsers() {
  try {
    const res = await fetch(userApi);
    allUsers = await res.json();
    displayUsers(allUsers);
  } catch (err) {
    console.error("Error loading users:", err);
  }
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
        <button onclick="editUser(${u.id}, '${u.name}', '${u.email}', '${u.phone}')"
          style="background-color: orange; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Edit</button>
        <button onclick="deleteUser(${u.id})"
          style="background-color: red; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  try {
    const res = await fetch(`${userApi}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete user");
    alert("🗑️ User deleted successfully!");
    getUsers();
  } catch (err) {
    console.error("Error deleting user:", err);
    alert("❌ Error deleting user! Please try again.");
  }
}

function searchUsers() {
  const query = document.getElementById("userSearch").value.toLowerCase();
  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
  );
  displayUsers(filtered);
}

// ===== BOOK SECTION =====
let allBooks = [];
let editBookId = null;
let isEditingBook = false;

document.getElementById("bookForm").addEventListener("submit", addOrUpdateBook);

async function addOrUpdateBook(e) {
  e.preventDefault();

  const book = {
    title: document.getElementById("title").value.trim(),
    author: document.getElementById("author").value.trim(),
    category: document.getElementById("category").value.trim(),
    available: true
  };

  if (!book.title || !book.author || !book.category) {
    alert("⚠️ Please fill all fields!");
    return;
  }

  const method = isEditingBook ? "PUT" : "POST";
  const url = isEditingBook ? `${bookApi}/${editBookId}` : bookApi;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book)
    });
    if (!res.ok) throw new Error("Failed to save book");

    alert(isEditingBook ? "✅ Book updated successfully!" : "✅ Book added successfully!");
    resetBookForm();
    loadBooks();
  } catch (err) {
    console.error(err);
    alert("❌ Error saving book! Please try again.");
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

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  try {
    const res = await fetch(`${bookApi}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete book");
    alert("🗑️ Book deleted successfully!");
    loadBooks();
  } catch (err) {
    console.error(err);
    alert("❌ Error deleting book! Please try again.");
  }
}

async function loadBooks() {
  try {
    const res = await fetch(bookApi);
    allBooks = await res.json();
    displayBooks(allBooks);
  } catch (err) {
    console.error("Error loading books:", err);
  }
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
      <td>${b.available ? "✅ Available" : "❌ Not Available"}</td>
      <td>
        <button onclick="editBook(${b.id}, '${b.title}', '${b.author}', '${b.category}')"
          style="background-color: orange; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Edit</button>
        <button onclick="deleteBook(${b.id})"
          style="background-color: red; color: white; border: none; padding: 5px 8px; border-radius: 5px;">Delete</button>
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

function searchBooks() {
  const query = document.getElementById("bookSearch").value.toLowerCase();
  const categoryFilter = document.getElementById("filterCategory").value;
  const availabilityFilter = document.getElementById("filterAvailability").value;

  const filtered = allBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    const matchesAvailability =
      !availabilityFilter ||
      (availabilityFilter === "available" && book.available) ||
      (availabilityFilter === "unavailable" && !book.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  displayBooks(filtered);
}

// ===== INITIALIZE =====
window.onload = () => {
  getUsers();
  loadBooks();
};

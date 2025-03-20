document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    updateBorrowedList();
});

// Sample Book Data (This can be expanded)
const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", image: "images/gatsby.jpg" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", image: "images/mockingbird.jpg" },
    { title: "1984", author: "George Orwell", image: "images/1984.jpg" },
    { title: "Harry Potter", author: "J.K. Rowling", image: "images/harrypotter.jpg" },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", image: "images/lotr.jpg" }
];

// Function to load books dynamically into the page
function loadBooks() {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    books.forEach((book, index) => {
        bookList.innerHTML += `
            <div class="book" data-index="${index}">
                <img src="${book.image}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <button class="borrow-btn" onclick="borrowBook(${index})">Borrow</button>
            </div>`;
    });
}

// Search Functionality (Live Search)
function searchBooks() {
    const query = document.getElementById("searchBar").value.toLowerCase();
    document.querySelectorAll(".book").forEach(book => {
        const title = book.querySelector("h3").textContent.toLowerCase();
        book.style.display = title.includes(query) ? "block" : "none";
    });
}

// Function to Borrow a Book
function borrowBook(index) {
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    if (borrowed.length >= 3) {
        showNotification("⚠ You can only borrow up to 3 books!", "warning");
        return;
    }

    const book = { ...books[index], dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() };
    borrowed.push(book);
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));

    showNotification(`📖 You borrowed "${book.title}"!`, "success");
    updateBorrowedList();
}

// Function to Return a Book
function returnBook(index) {
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    const returnedBook = borrowed.splice(index, 1)[0];
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowed));

    showNotification(`🔄 You returned "${returnedBook.title}"!`, "info");
    updateBorrowedList();
}

// Function to Update Borrowed Books List
function updateBorrowedList() {
    const borrowedList = document.getElementById("borrowedList");
    borrowedList.innerHTML = "";
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

    borrowed.forEach((book, index) => {
        let dueDate = new Date(book.dueDate);
        let now = new Date();
        let daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        let alertClass = daysLeft <= 3 ? "alert" : "";

        borrowedList.innerHTML += `
            <li class="${alertClass}">
                📚 ${book.title} - <span>${daysLeft} days left</span>
                <button class="return-btn" onclick="returnBook(${index})">Return</button>
            </li>`;
    });

    checkDueDates();
}

// Function to Check Due Dates & Show Alerts
function checkDueDates() {
    let borrowed = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    let overdueBooks = borrowed.filter(book => new Date(book.dueDate) < new Date());

    if (overdueBooks.length > 0) {
        showNotification("⏳ You have overdue books! Please return them ASAP!", "error");
    }
}

// Function to Show Notifications
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.innerHTML = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Dark Mode Toggle
document.addEventListener("keydown", (event) => {
    if (event.key === "d") {
        document.body.classList.toggle("dark-mode");
        showNotification("🌙 Dark Mode Toggled!", "info");
    }
});

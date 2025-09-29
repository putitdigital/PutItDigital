console.log("builder main js online");

// ----------------------
// Initialize Feather Icons
// ----------------------
feather.replace();

// ----------------------
// Tab Switching
// ----------------------
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active-tab"));
    button.classList.add("active-tab");

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
    });

    const tabId = button.getAttribute("data-tab") + "-tab";
    document.getElementById(tabId).classList.remove("hidden");
  });
});

// ----------------------
// Drag & Drop
// ----------------------
const droppableArea = document.querySelector(".droppable-area");
const componentItems = document.querySelectorAll(".component-item");

componentItems.forEach((item) => {
  item.addEventListener("dragstart", () => item.classList.add("dragging"));
  item.addEventListener("dragend", () => item.classList.remove("dragging"));
});

droppableArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  droppableArea.classList.add("border-primary", "bg-primary/5");
});
droppableArea.addEventListener("dragleave", () => {
  droppableArea.classList.remove("border-primary", "bg-primary/5");
});
droppableArea.addEventListener("drop", (e) => {
  e.preventDefault();
  droppableArea.classList.remove("border-primary", "bg-primary/5");
  const componentType = document.querySelector(".dragging").dataset.type;
  addComponent(componentType);
});

// ----------------------
// Component Templates
// ----------------------
function getComponentHtml(type) {
  switch (type) {
    case "header":
      return `
        <header class="bg-white shadow-md">
          <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-gray-800 editable-text">My Website</h1>
            <nav class="nav-list flex space-x-6">
              <ul class="flex space-x-6 text-gray-600">
                <li><a href="#" class="nav-item editable-text">Home</a></li>
                <li><a href="#" class="nav-item editable-text">About</a></li>
                <li><a href="#" class="nav-item editable-text">Services</a></li>
                <li><a href="#" class="nav-item editable-text">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>
      `;
    case "hero":
      return `
        <section class="bg-primary text-white py-20 text-center rounded-lg">
          <h2 class="text-4xl font-bold mb-4">Welcome to My Website</h2>
          <p class="text-lg mb-6">Build your dream site easily</p>
          <button class="bg-white text-primary px-6 py-2 rounded-lg font-medium">Get Started</button>
        </section>
      `;
    case "text":
      return `
        <div class="text-section bg-white p-6 rounded-lg border border-gray-200 mb-4">
          <h2 class="text-xl font-bold mb-3">Section Title</h2>
          <p class="text-gray-600">This is a text block. You can edit this content to add your own text.</p>
        </div>
      `;
    case "features":
      return `
        <div class="features-section bg-white p-6 rounded-lg border border-gray-200 mb-4">
          <h2 class="text-xl font-bold mb-6 text-center">Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <i class="fas fa-star text-primary text-2xl mb-3"></i>
              <h3 class="font-bold mb-2">Feature 1</h3>
              <p class="text-gray-600 text-sm">Feature description goes here.</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <i class="fas fa-cog text-primary text-2xl mb-3"></i>
              <h3 class="font-bold mb-2">Feature 2</h3>
              <p class="text-gray-600 text-sm">Feature description goes here.</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <i class="fas fa-bolt text-primary text-2xl mb-3"></i>
              <h3 class="font-bold mb-2">Feature 3</h3>
              <p class="text-gray-600 text-sm">Feature description goes here.</p>
            </div>
          </div>
        </div>
      `;
    case "testimonials":
      return `
        <div class="testimonials-section bg-white p-6 rounded-lg border border-gray-200 mb-4">
          <h2 class="text-xl font-bold mb-6 text-center">Testimonials</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="italic text-gray-600 mb-3">"This is a testimonial from a satisfied customer."</p>
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 class="font-bold">Customer Name</h4>
                  <p class="text-gray-500 text-sm">Position, Company</p>
                </div>
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="italic text-gray-600 mb-3">"Another great testimonial goes here."</p>
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 class="font-bold">Customer Name</h4>
                  <p class="text-gray-500 text-sm">Position, Company</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    case "cta":
      return `
        <div class="cta-section bg-primary p-8 rounded-lg text-center text-white mb-4">
          <h2 class="text-2xl font-bold mb-3">Call to Action</h2>
          <p class="mb-6 opacity-90">Encourage your visitors to take action with this section.</p>
          <button class="bg-white text-primary px-6 py-2 rounded-md font-medium">Sign Up Now</button>
        </div>
      `;
    default:
      return "";
  }
}

// ----------------------
// Wrap Component with Edit/Delete Controls
// ----------------------
function wrapComponent(html) {
  return `
    <div class="component-wrapper relative group my-4 p-2 rounded-md">
      <div class="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition">
        <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
        <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
      </div>
      ${html}
    </div>
  `;
}

// ----------------------
// Add Component to Droppable Area
// ----------------------
function addComponent(type) {
  const componentHtml = getComponentHtml(type);
  if (!componentHtml) return;
  droppableArea.insertAdjacentHTML("beforeend", wrapComponent(componentHtml));
  droppableArea.classList.remove("border-dashed");
}

// ----------------------
// Single Global Edit/Delete Handler
// ----------------------
let currentEditWrapper = null;
let currentHeader = null;

document.addEventListener("click", (e) => {
  const wrapper = e.target.closest(".component-wrapper");

  // DELETE
  if (e.target.classList.contains("delete-btn") && wrapper) {
    wrapper.remove();
    return;
  }

  // EDIT
  if (e.target.classList.contains("edit-btn") && wrapper) {
    currentEditWrapper = wrapper;

    // Check if it's a header
    const navList = wrapper.querySelector(".nav-list");
    if (navList) {
      // Header edit modal
      currentHeader = wrapper;
      const navItems = [...navList.querySelectorAll(".nav-item")];
      const container = document.getElementById("nav-items-container");
      container.innerHTML = "";
      navItems.forEach((item) => {
        const div = document.createElement("div");
        div.className = "flex space-x-2";
        div.innerHTML = `
          <input type="text" class="flex-1 p-1 border rounded" value="${item.innerText}">
          <button class="remove-nav-item px-2 bg-red-500 text-white rounded hover:bg-red-600">X</button>
        `;
        container.appendChild(div);
      });

        const textElement = wrapper.querySelector("h1, h2, h3, p, blockquote");

        const bgColor = window.getComputedStyle(wrapper).backgroundColor;
        const textColor = textElement ? window.getComputedStyle(textElement).color : "#000000";

        document.getElementById("edit-text-header").value = textElement ? textElement.innerText : "";
        document.getElementById("edit-text-color-header").value = rgbToHex(textColor);
        document.getElementById("edit-bg-color-header").value = rgbToHex(bgColor);

        document.getElementById("header-modal").classList.remove("hidden");
        document.getElementById("header-modal").classList.add("flex");
    } else {
      // Generic edit modal
      const textElement = wrapper.querySelector("h1, h2, h3, p, blockquote");
      const bgColor = window.getComputedStyle(wrapper).backgroundColor;
      const textColor = textElement ? window.getComputedStyle(textElement).color : "#000000";

      document.getElementById("edit-text").value = textElement ? textElement.innerText : "";
      document.getElementById("edit-text-color").value = rgbToHex(textColor);
      document.getElementById("edit-bg-color").value = rgbToHex(bgColor);

      document.getElementById("edit-modal").classList.remove("hidden");
      document.getElementById("edit-modal").classList.add("flex");
    }

  }
});

// ----------------------
// Cancel/Save for Generic Modal
// ----------------------
document.getElementById("edit-cancel").addEventListener("click", () => {
  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("edit-modal").classList.remove("flex");
});

document.getElementById("edit-save").addEventListener("click", () => {
  if (!currentEditWrapper) return;

  const textElement = currentEditWrapper.querySelector("h1, h2, h3, p, blockquote");
  const newText = document.getElementById("edit-text").value;
  const newTextColor = document.getElementById("edit-text-color").value;
  const newBgColor = document.getElementById("edit-bg-color").value;

  if (textElement) {
    textElement.innerText = newText;
    textElement.style.color = newTextColor;
  }
  currentEditWrapper.style.backgroundColor = newBgColor;

  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("edit-modal").classList.remove("flex");
});

// ----------------------
// Header Modal Actions
// ----------------------
document.getElementById("add-nav-item").addEventListener("click", () => {
  const container = document.getElementById("nav-items-container");
  const div = document.createElement("div");
  div.className = "flex space-x-2";
  div.innerHTML = `
    <input type="text" class="flex-1 p-1 border rounded" value="New Item">
    <button class="remove-nav-item px-2 bg-red-500 text-white rounded hover:bg-red-600">X</button>
  `;
  container.appendChild(div);
});

document.getElementById("nav-items-container").addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-nav-item")) {
    e.target.parentElement.remove();
  }
});

document.getElementById("header-cancel").addEventListener("click", () => {
  document.getElementById("header-modal").classList.add("hidden");
  document.getElementById("header-modal").classList.remove("flex");
});

document.getElementById("header-save").addEventListener("click", () => {
  if (!currentHeader) return;

  const navContainer = currentHeader.querySelector(".nav-list");
  navContainer.innerHTML = "";
  const inputs = [...document.querySelectorAll("#nav-items-container input")];
  inputs.forEach((input) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "nav-item editable-text";
    a.innerText = input.value;
    navContainer.appendChild(a);
  });
    const textElement = currentHeader.querySelector("h1, h2, h3, p, blockquote");
    const newText = document.getElementById("edit-text-header").value;
    
    const newTextColor = document.getElementById("edit-text-color-header").value;
    const newBgColor = document.getElementById("edit-bg-color-header").value;

    if (textElement) {
        textElement.innerText = newText;
        textElement.style.color = newTextColor;
    }
    currentHeader.style.backgroundColor = newBgColor;

  document.getElementById("header-modal").classList.add("hidden");
  document.getElementById("header-modal").classList.remove("flex");
});

// ----------------------
// Utility
// ----------------------
function rgbToHex(rgb) {
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";
  return (
    "#" +
    result
      .map((x) => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// ----------------------
// Download HTML
// ----------------------
document.getElementById("download-btn").addEventListener("click", () => {
  const clonedArea = droppableArea.cloneNode(true);
  const placeholder = clonedArea.querySelector("p.text-center.text-gray-500");
  if (placeholder) placeholder.remove();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Website</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body>
      ${clonedArea.innerHTML}
    </body>
    </html>
  `;

  const blob = new Blob([htmlTemplate], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-website.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

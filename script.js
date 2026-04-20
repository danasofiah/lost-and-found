let items = JSON.parse(localStorage.getItem("items")) || [];

function addItem() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const contact = document.getElementById("contact").value;
  const imageFile = document.getElementById("image").files[0];

  if (!title || !category || !imageFile) {
    alert("Please fill all required fields");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const item = {
      title,
      category,
      location,
      contact,
      image: reader.result
    };

    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));

    displayItems();
  };

  reader.readAsDataURL(imageFile);
}

function displayItems() {
  const container = document.getElementById("items");
  const search = document.getElementById("search").value.toLowerCase();
  const filterCategory = document.getElementById("filterCategory").value;

  container.innerHTML = "";

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search);
    const matchCategory = filterCategory === "" || item.category === filterCategory;

    return matchSearch && matchCategory;
  });

  filtered.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.image}">
        <h3>${item.title}</h3>
        <p>🏷 ${item.category}</p>
        <p>📍 ${item.location}</p>
        <p>📞 ${item.contact}</p>
      </div>
    `;
  });
}

displayItems();

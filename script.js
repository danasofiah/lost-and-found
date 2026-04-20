const supabaseUrl = "https://ixztiesdlechcemjukkc.supabase.co";
const supabaseKey = "sb_publishable_DncSJwEji60UuWaoZ3VdIA_VT_01qqm";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function addItem() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const contact = document.getElementById("contact").value;
  const imageFile = document.getElementById("image").files[0];

  if (!title || !category || !imageFile) {
    alert("Please fill all fields");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
    const img = new Image();
    img.src = reader.result;

    img.onload = async function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // compress image
      const maxWidth = 300;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedImage = canvas.toDataURL("image/jpeg", 0.5);

      const { error } = await supabase
        .from("items")
        .insert([{
          title,
          category,
          location,
          contact,
          image: compressedImage
        }]);

      if (error) {
        alert(error.message);
        console.log(error);
      } else {
        alert("Upload successful!");
        displayItems();
      }
    };
  };

  reader.readAsDataURL(imageFile);
}

// 🧠 DISPLAY ITEMS
async function displayItems() {
  const container = document.getElementById("items");
  const search = document.getElementById("search").value.toLowerCase();
  const filterCategory = document.getElementById("filterCategory").value;

  container.innerHTML = "";

  const { data, error } = await supabase.from("items").select("*");

  if (error) {
    console.log(error);
    return;
  }

  data.forEach(item => {
    const matchSearch = item.title.toLowerCase().includes(search);
    const matchCategory = filterCategory === "" || item.category === filterCategory;

    if (matchSearch && matchCategory) {
      container.innerHTML += `
        <div class="card">
          <img src="${item.image}">
          <h3>${item.title}</h3>
          <p>🏷 ${item.category}</p>
          <p>📍 ${item.location}</p>
          <p>📞 ${item.contact}</p>
        </div>
      `;
    }
  });
}

displayItems();

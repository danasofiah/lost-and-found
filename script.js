const supabaseUrl = "https://ixztiesdlechcemjukkc.supabase.co";
const supabaseKey = "sb_publishable_DncSJwEji60UuWaoZ3VdIA_VT_01qqm";

// ✅ correct client creation
const client = window.supabase.createClient(supabaseUrl, supabaseKey);

// =====================
// 🧠 ADD ITEM
// =====================
async function addItem() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const contact = document.getElementById("contact").value;
  const imageFile = document.getElementById("image").files[0];

  if (!title || !category || !imageFile) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const fileName = Date.now() + "_" + imageFile.name;

    // upload image
    const { error: uploadError } = await client
      .storage
      .from("image")
      .upload(fileName, imageFile);

    if (uploadError) {
      console.log(uploadError);
      alert("Image upload failed");
      return;
    }

    // get URL
    const { data: urlData } = client
      .storage
      .from("image")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // insert data
    const { error } = await client
      .from("items")
      .insert([{
        title,
        category,
        location,
        contact,
        image: imageUrl
      }]);

    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      alert("Upload successful!");
      displayItems();
    }

  } catch (err) {
    console.error(err);
    alert(err.message || "Something went wrong");
  }
}

// =====================
// 🧠 DISPLAY ITEMS
// =====================
async function displayItems() {
  const container = document.getElementById("items");
  const search = document.getElementById("search").value.toLowerCase();
  const filterCategory = document.getElementById("filterCategory").value;

  container.innerHTML = "";

  const { data, error } = await client
    .from("items")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  data.forEach(item => {
    const matchSearch = item.title.toLowerCase().includes(search);
    const matchCategory =
      filterCategory === "" || item.category === filterCategory;

    if (matchSearch && matchCategory) {
      container.innerHTML += `
        <div class="card">
          <img src="${item.image}" style="width:100%; border-radius:10px;">
          <h3>${item.title}</h3>
          <p>🏷 ${item.category}</p>
          <p>📍 ${item.location || "-"}</p>
          <p>📞 ${item.contact || "-"}</p>
        </div>
      `;
    }
  });
}

// =====================
// 🔄 EVENTS
// =====================
document.getElementById("search").addEventListener("input", displayItems);
document.getElementById("filterCategory").addEventListener("change", displayItems);

// =====================
// 🚀 INIT
// =====================
displayItems();

const islands = [
  {
    name: "Aruba",
    details: "Zonzeker eiland met witte stranden, bruisende boulevard en watersport.",
  },
  {
    name: "Bonaire",
    details: "Paradijs voor duikers en rustzoekers met beschermde natuur en helder water.",
  },
  {
    name: "Curaçao",
    details: "Kleurrijke cultuur, historische binnenstad en verborgen baaien.",
  },
];

const defaultHotels = [
  {
    id: crypto.randomUUID(),
    name: "Palm Beach Resort",
    island: "Aruba",
    description: "All-inclusive resort direct aan Palm Beach.",
    price: "Vanaf € 189 p.n.",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: crypto.randomUUID(),
    name: "Coral Dive Lodge",
    island: "Bonaire",
    description: "Charmant duikhotel met eigen steiger en duikcentrum.",
    price: "Vanaf € 149 p.n.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: crypto.randomUUID(),
    name: "Willemstad Boutique",
    island: "Curaçao",
    description: "Stijlvol boutiquehotel dichtbij Pietermaai en het centrum.",
    price: "Vanaf € 169 p.n.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  },
];

const state = {
  isLoggedIn: localStorage.getItem("abcEmployee") === "true",
  editingHotelId: null,
  hotels: JSON.parse(localStorage.getItem("abcHotels") || "null") || defaultHotels,
};

const islandsSection = document.getElementById("islandsSection");
const hotelGrid = document.getElementById("hotelGrid");
const loginDialog = document.getElementById("loginDialog");
const hotelDialog = document.getElementById("hotelDialog");
const loginForm = document.getElementById("loginForm");
const hotelForm = document.getElementById("hotelForm");
const loginError = document.getElementById("loginError");

function renderIslands() {
  islandsSection.innerHTML = "";
  islands.forEach((island) => {
    const card = document.createElement("article");
    card.className = "island-card";
    card.innerHTML = `<h3>${island.name}</h3><p>${island.details}</p>`;
    islandsSection.appendChild(card);
  });
}

function saveHotels() {
  localStorage.setItem("abcHotels", JSON.stringify(state.hotels));
}

function renderHotels() {
  hotelGrid.innerHTML = "";
  const template = document.getElementById("hotelCardTemplate");

  state.hotels.forEach((hotel) => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".hotel-image").src = hotel.image;
    clone.querySelector(".hotel-name").textContent = hotel.name;
    clone.querySelector(".hotel-island").textContent = hotel.island;
    clone.querySelector(".hotel-description").textContent = hotel.description;
    clone.querySelector(".hotel-price").textContent = hotel.price;

    const actions = clone.querySelector(".hotel-actions");
    if (state.isLoggedIn) {
      actions.classList.remove("hidden");
      clone.querySelector(".edit-hotel").addEventListener("click", () => openHotelDialog(hotel));
      clone.querySelector(".delete-hotel").addEventListener("click", () => deleteHotel(hotel.id));
    }

    hotelGrid.appendChild(clone);
  });
}

function syncAuthUI() {
  document.getElementById("logoutBtn").classList.toggle("hidden", !state.isLoggedIn);
  document.getElementById("addHotelBtn").classList.toggle("hidden", !state.isLoggedIn);
}

function openHotelDialog(hotel = null) {
  state.editingHotelId = hotel?.id || null;
  document.getElementById("hotelDialogTitle").textContent = hotel ? "Hotel bewerken" : "Hotel toevoegen";
  hotelForm.name.value = hotel?.name || "";
  hotelForm.island.value = hotel?.island || "Aruba";
  hotelForm.description.value = hotel?.description || "";
  hotelForm.price.value = hotel?.price || "";
  hotelForm.image.value = hotel?.image || "";
  hotelDialog.showModal();
}

function deleteHotel(id) {
  state.hotels = state.hotels.filter((hotel) => hotel.id !== id);
  saveHotels();
  renderHotels();
}

document.getElementById("openLoginBtn").addEventListener("click", () => {
  loginError.textContent = "";
  loginDialog.showModal();
});

document.getElementById("cancelLogin").addEventListener("click", () => loginDialog.close());
document.getElementById("cancelHotel").addEventListener("click", () => hotelDialog.close());

document.getElementById("addHotelBtn").addEventListener("click", () => openHotelDialog());

document.getElementById("logoutBtn").addEventListener("click", () => {
  state.isLoggedIn = false;
  localStorage.setItem("abcEmployee", "false");
  syncAuthUI();
  renderHotels();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const username = data.get("username");
  const password = data.get("password");

  if (username === "admin" && password === "abc123") {
    state.isLoggedIn = true;
    localStorage.setItem("abcEmployee", "true");
    loginDialog.close();
    syncAuthUI();
    renderHotels();
    return;
  }

  loginError.textContent = "Onjuiste gegevens. Probeer opnieuw.";
});

hotelForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(hotelForm);

  const payload = {
    id: state.editingHotelId || crypto.randomUUID(),
    name: String(data.get("name")),
    island: String(data.get("island")),
    description: String(data.get("description")),
    price: String(data.get("price")),
    image: String(data.get("image")),
  };

  if (state.editingHotelId) {
    state.hotels = state.hotels.map((hotel) => (hotel.id === payload.id ? payload : hotel));
  } else {
    state.hotels.push(payload);
  }

  saveHotels();
  renderHotels();
  hotelDialog.close();
});

renderIslands();
syncAuthUI();
renderHotels();

// Sigma Coffe Store - fungsi katalog, keranjang, dan checkout WhatsApp.
// Ganti nomor di bawah dengan nomor WhatsApp toko (format internasional tanpa +).
const NOMOR_WHATSAPP_TOKO = "6281227398074";

const daftarProduk = {
  coffee250: { nama: "Sigma Coffe Latte 250 ml", harga: 15000 },
  coffee500: { nama: "Sigma Coffe Latte 500 ml", harga: 25000 },
  coffee1l: { nama: "Sigma Coffe Latte 1 Liter", harga: 45000 },
  glassesBlue: { nama: "Kacamata Hitam Blue Ray", harga: 175000 },
  glassesGrey: { nama: "Kacamata Frame Abu", harga: 165000 },
  frameBlack: { nama: "Frame Hitam", harga: 95000 },
  frameGrey: { nama: "Frame Abu Modern", harga: 165000 }
};

let keranjang = [];

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);

function simpanKeranjang() {
  try {
    localStorage.setItem("sigmaCoffeCart", JSON.stringify(keranjang));
  } catch (error) {
    // Website tetap bisa digunakan walau penyimpanan browser tidak tersedia.
  }
}

function muatKeranjang() {
  try {
    const data = JSON.parse(localStorage.getItem("sigmaCoffeCart") || "[]");
    if (Array.isArray(data)) {
      keranjang = data.filter(item =>
        daftarProduk[item.id] &&
        Number.isInteger(item.jumlah) &&
        item.jumlah > 0
      );
    }
  } catch (error) {
    keranjang = [];
  }
}

function tambahKeranjang(id) {
  const produk = daftarProduk[id];
  if (!produk) return;

  const itemAda = keranjang.find(item => item.id === id);
  if (itemAda) {
    itemAda.jumlah += 1;
  } else {
    keranjang.push({ id, jumlah: 1 });
  }

  simpanKeranjang();
  tampilkanKeranjang();
  tampilkanNotifikasi(`${produk.nama} ditambahkan ke keranjang.`);
}

function ubahJumlah(id, perubahan) {
  const item = keranjang.find(entry => entry.id === id);
  if (!item) return;

  item.jumlah += perubahan;
  if (item.jumlah <= 0) {
    keranjang = keranjang.filter(entry => entry.id !== id);
  }
  simpanKeranjang();
  tampilkanKeranjang();
}

function hapusDariKeranjang(id) {
  keranjang = keranjang.filter(item => item.id !== id);
  simpanKeranjang();
  tampilkanKeranjang();
}

function kosongkanKeranjang() {
  if (!keranjang.length) {
    tampilkanNotifikasi("Keranjang sudah kosong.");
    return;
  }
  if (confirm("Yakin ingin mengosongkan keranjang?")) {
    keranjang = [];
    simpanKeranjang();
    tampilkanKeranjang();
  }
}

function hitungTotal() {
  return keranjang.reduce((total, item) => {
    return total + daftarProduk[item.id].harga * item.jumlah;
  }, 0);
}

function tampilkanKeranjang() {
  const wadah = document.getElementById("cartItems");
  const jumlahItem = keranjang.reduce((total, item) => total + item.jumlah, 0);
  const total = hitungTotal();

  document.getElementById("cartCount").textContent = jumlahItem;
  document.getElementById("itemCount").textContent = jumlahItem;
  document.getElementById("cartTotal").textContent = formatRupiah(total);

  if (!keranjang.length) {
    wadah.innerHTML = '<p class="cart-empty">Keranjangmu masih kosong. Yuk, pilih produk!</p>';
    return;
  }

  wadah.innerHTML = keranjang.map(item => {
    const produk = daftarProduk[item.id];
    return `
      <article class="cart-item">
        <div>
          <h3>${produk.nama}</h3>
          <p>${formatRupiah(produk.harga)} per item</p>
        </div>
        <div class="quantity-controls" aria-label="Atur jumlah ${produk.nama}">
          <button type="button" data-action="minus" data-id="${item.id}" aria-label="Kurangi jumlah">−</button>
          <span>${item.jumlah}</span>
          <button type="button" data-action="plus" data-id="${item.id}" aria-label="Tambah jumlah">+</button>
        </div>
        <button class="remove-item" type="button" data-action="remove" data-id="${item.id}" aria-label="Hapus ${produk.nama}">×</button>
      </article>`;
  }).join("");
}

function tampilkanNotifikasi(pesan) {
  const lama = document.getElementById("toast");
  if (lama) lama.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.textContent = pesan;
  Object.assign(toast.style, {
    position: "fixed", left: "50%", bottom: "28px", transform: "translateX(-50%)",
    zIndex: "100", maxWidth: "90%", padding: "12px 18px", borderRadius: "9px",
    background: "#102d54", color: "#fff", fontSize: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,.18)"
  });
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

function terapkanFilter() {
  const kataKunci = document.getElementById("searchInput").value.trim().toLowerCase();
  const filterAktif = document.querySelector(".filter-button.active")?.dataset.filter || "all";
  let terlihat = 0;

  document.querySelectorAll(".product-card").forEach(kartu => {
    const cocokNama = kartu.dataset.name.toLowerCase().includes(kataKunci);
    const cocokKategori = filterAktif === "all" || kartu.dataset.category === filterAktif;
    const tampil = cocokNama && cocokKategori;
    kartu.hidden = !tampil;
    if (tampil) terlihat++;
  });

  document.getElementById("emptyState").hidden = terlihat !== 0;
}

function buatPesanWhatsApp(nama, alamat, telepon) {
  const rincian = keranjang.map(item => {
    const produk = daftarProduk[item.id];
    return `- ${produk.nama} x${item.jumlah} = ${formatRupiah(produk.harga * item.jumlah)}`;
  }).join("\n");

  return [
    "Halo Sigma Coffe, saya ingin memesan:",
    "",
    rincian,
    "",
    `Total: ${formatRupiah(hitungTotal())}`,
    "",
    "Data pemesan:",
    `Nama: ${nama}`,
    `Alamat: ${alamat}`,
    `Nomor WhatsApp: ${telepon}`
  ].join("\n");
}

function checkoutWhatsApp(event) {
  event.preventDefault();

  if (!keranjang.length) {
    alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
    document.getElementById("produk").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const nama = document.getElementById("customerName").value.trim();
  const alamat = document.getElementById("customerAddress").value.trim();
  const telepon = document.getElementById("customerPhone").value.trim();

  if (!nama || !alamat || !telepon) {
    alert("Mohon lengkapi semua data pemesanan.");
    return;
  }

  if (NOMOR_WHATSAPP_TOKO === "6281234567890") {
    const lanjut = confirm("Nomor WhatsApp toko masih menggunakan nomor contoh di script.js. Tetap buka WhatsApp dengan nomor contoh?");
    if (!lanjut) return;
  }

  const pesan = buatPesanWhatsApp(nama, alamat, telepon);
  const url = `https://wa.me/${NOMOR_WHATSAPP_TOKO}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

document.addEventListener("click", event => {
  const tambah = event.target.closest(".add-button");
  if (tambah) {
    tambahKeranjang(tambah.dataset.id);
    return;
  }

  const aksi = event.target.closest("[data-action]");
  if (aksi) {
    const { action, id } = aksi.dataset;
    if (action === "plus") ubahJumlah(id, 1);
    if (action === "minus") ubahJumlah(id, -1);
    if (action === "remove") hapusDariKeranjang(id);
  }
});

document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    terapkanFilter();
  });
});

document.getElementById("searchInput").addEventListener("input", terapkanFilter);
document.getElementById("clearCart").addEventListener("click", kosongkanKeranjang);
document.getElementById("checkoutForm").addEventListener("submit", checkoutWhatsApp);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const terbuka = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(terbuka));
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("whatsappFloat").addEventListener("click", event => {
  event.currentTarget.href = `https://wa.me/${NOMOR_WHATSAPP_TOKO}`;
});

muatKeranjang();
tampilkanKeranjang();
terapkanFilter();

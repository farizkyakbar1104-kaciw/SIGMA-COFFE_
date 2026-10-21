# Sigma Coffe Store

Website katalog dan pemesanan sederhana untuk Sigma Coffe, dengan produk kopi botolan dan kacamata.

## File
- `index.html` — struktur halaman.
- `style.css` — tampilan dan desain responsif.
- `script.js` — pencarian, filter kategori, keranjang, dan checkout WhatsApp.
- `image/` — gambar produk.

## Cara menjalankan
Buka `index.html` di browser. Untuk pengalaman pengembangan, bisa memakai ekstensi Live Server.

## Pengaturan nomor WhatsApp
Sebelum dipublikasikan, buka `script.js` lalu ubah nilai `NOMOR_WHATSAPP_TOKO` menjadi nomor WhatsApp toko dengan kode negara, tanpa tanda `+`, spasi, atau angka nol di depan. Contoh format Indonesia: `62812xxxxxxxx`.

## Publikasi melalui GitHub Pages
1. Unggah seluruh isi folder ini ke repository GitHub.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
5. Tunggu proses publikasi selesai dan buka tautan yang ditampilkan GitHub Pages.

Catatan: ini adalah website statis. Data keranjang tersimpan pada browser pengguna dan pesanan diteruskan melalui WhatsApp; website ini belum memiliki server, database, atau pembayaran online.

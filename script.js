// ===== DATA MANAGEMENT =====

// Variabel global untuk menyimpan data kelulusan
let dataKelulusan = [];
let currentData = null;

// Load data dari file JSON saat halaman dimuat
async function loadData() {
  try {
    const response = await fetch('data-kelulusan.json');
    
    if (!response.ok) {
      throw new Error('Gagal memuat file data-kelulusan.json');
    }
    
    dataKelulusan = await response.json();
    console.log(`✅ Berhasil memuat ${dataKelulusan.length} data siswa`);
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    alert('Gagal memuat data siswa. Pastikan file data-kelulusan.json ada di folder yang sama dengan index.html');
  }
}

// Panggil loadData saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', loadData);

// ===== FORM VALIDATION & SEARCH =====

// Fungsi untuk cek kelulusan
function cekKelulusan() {
  // Ambil input dari form
  const nama = document.getElementById('nama').value.trim();
  const nisn = document.getElementById('nisn').value.trim();

  // Validasi input kosong
  if (!nama || !nisn) {
    alert('Nama dan NISN harus diisi!');
    return;
  }

  // Validasi data sudah di-load
  if (dataKelulusan.length === 0) {
    alert('Data siswa belum dimuat. Silakan tunggu atau refresh halaman.');
    return;
  }

  // Cari data siswa (case-insensitive untuk nama)
  const data = dataKelulusan.find(d => 
    d.nama.toLowerCase() === nama.toLowerCase() && 
    d.nisn === nisn
  );

  // Jika data tidak ditemukan
  if (!data) {
    alert('Data tidak ditemukan. Periksa kembali Nama dan NISN Anda.');
    return;
  }

  // Simpan data yang ditemukan
  currentData = data;

  // Pindah ke layar amplop
  document.getElementById('formScreen').style.display = 'none';
  document.getElementById('amplopScreen').style.display = 'flex';
}

// ===== AMPLOP ANIMATION =====

// Fungsi untuk buka amplop
function bukaAmplop() {
  const envelope = document.querySelector('.envelope');
  envelope.classList.add('open');

  // Tunggu animasi amplop selesai (2 detik)
  setTimeout(() => {
    // Sembunyikan amplop, tampilkan surat
    document.getElementById('amplopScreen').style.display = 'none';
    document.getElementById('suratScreen').style.display = 'flex';

    // Isi data siswa ke surat
    document.getElementById('sNama').innerText = currentData.nama;
    document.getElementById('sNisn').innerText = currentData.nisn;

    // Elemen status
    const statusElement = document.getElementById('sStatus');
    
    // Tentukan teks dan styling berdasarkan status
    if (currentData.status === 'LULUS') {
      statusElement.innerText = 'Berdasarkan hasil rapat dewan guru, peserta didik tersebut dinyatakan LULUS dan diterima di SMAN 8 Nusa Arutala.';
      statusElement.className = 'status-text status-lulus';
      document.getElementById('btnGrup').style.display = 'block';
    } else {
      statusElement.innerText = 'Berdasarkan hasil rapat dewan guru, peserta didik tersebut dinyatakan BELUM LULUS seleksi penerimaan.';
      statusElement.className = 'status-text status-tidak-lulus';
      document.getElementById('btnGrup').style.display = 'none';
    }
  }, 2000); // 2000ms = 2 detik (sesuai durasi animasi amplop)
}

// ===== GRUP SCREEN =====

// Fungsi pindah ke screen grup
function keGrup() {
  document.getElementById('suratScreen').style.display = 'none';
  document.getElementById('grupScreen').style.display = 'flex';
}

// ===== RESET FUNCTION =====

// Fungsi untuk kembali ke form awal
function kembali() {
  // Sembunyikan semua screen
  document.getElementById('suratScreen').style.display = 'none';
  document.getElementById('amplopScreen').style.display = 'none';
  document.getElementById('grupScreen').style.display = 'none';
  
  // Tampilkan form
  document.getElementById('formScreen').style.display = 'flex';
  
  // Reset animasi amplop
  document.querySelector('.envelope').classList.remove('open');
  
  // Reset input form
  document.getElementById('nama').value = '';
  document.getElementById('nisn').value = '';
  
  // Reset current data
  currentData = null;
}

// ===== OPTIONAL: ENTER KEY SUPPORT =====

// Biar bisa tekan Enter untuk submit form
document.addEventListener('DOMContentLoaded', function() {
  const inputs = document.querySelectorAll('#nama, #nisn');
  
  inputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        cekKelulusan();
      }
    });
  });
});
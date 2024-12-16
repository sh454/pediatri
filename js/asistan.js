// Sabit Asistanlar Listesi
const fixedAsistantList = [
    { name: "Dr. Ahmet Yılmaz", email: "ahmet.yilmaz@example.com", phone: "+90 555 123 4567", department: "Çocuk Acil Nöbetleri", image: "img/asistan1.jpg" },
    { name: "Dr. Ayşe Demir", email: "ayse.demir@example.com", phone: "+90 555 987 6543", department: "Çocuk Yoğun Bakımı", image: "img/asistan2.jpg" },
    { name: "Dr. Kaan Yılmaz", email: "kaan.yilmaz@example.com", phone: "+90 555 654 3210", department: "Çocuk Yoğun Bakımı", image: "img/asistan3.jpg" },
    { name: "Dr. Aylin Yıldız", email: "aylin.yildiz@example.com", phone: "+90 555 321 9876", department: "Çocuk Yoğun Bakımı", image: "img/asistan4.jpg" },
    { name: "Dr. Arda Tunç", email: "arda.tunc@example.com", phone: "+90 555 789 0123", department: "Çocuk Yoğun Bakımı", image: "img/asistan5.jpg" }
];

let asistantList = [...fixedAsistantList]; // Sabit asistanları başlangıçta ekle
// LocalStorage'dan verileri yükle
function loadAsistants() {
    const storedData = localStorage.getItem("asistantList");
    if (storedData) {
        asistantList = JSON.parse(storedData);
    }
}

// LocalStorage'a verileri kaydet
function saveAsistantsToStorage() {
    localStorage.setItem("asistantList", JSON.stringify(asistantList));
}

// Geçerli Asistanlar Listesi (validAssistants) - Takvim.js dosyasına aktarılacak
function getValidAssistants() {
    return asistantList.map(asistant => asistant.name);
}

// Asistan Kartlarını Ekrana Yansıtma
function displayAsistants() {
    const asistantCards = document.getElementById("asistantCards");
    asistantCards.innerHTML = ""; // Mevcut kartları temizle

    asistantList.forEach((asistant, index) => {
        // Sadece ad ve soyadı gösteriyoruz
        const deleteButtonHTML = index >= 5 ? `<button class="btn btn-danger mt-2" onclick="deleteAsistant(${index})">Sil</button>` : "";

        const cardHTML = `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <img src="${asistant.image}" class="card-img-top" alt="Asistan">
                    <div class="card-body text-center">
                        <h5 class="card-title">${asistant.name}</h5>
                        <button class="btn btn-primary" onclick="showPopup('${asistant.name}', '${asistant.email}', '${asistant.phone}', '${asistant.department}')">Detaylı Bilgi</button>
                        ${deleteButtonHTML}
                    </div>
                </div>
            </div>
        `;
        asistantCards.innerHTML += cardHTML;
    });
}

// Asistan Silme
function deleteAsistant(index) {
    const authCode = prompt("Lütfen Yetki Kodunuzu Girin:");
    if (authCode !== "12345") {
        alert("Geçersiz yetki kodu!");
        return;
    }

    asistantList.splice(index, 1);
    saveAsistantsToStorage(); // Veriyi sakla
    displayAsistants();
}

// Yeni Asistan Ekleme
function addAsistant(event) {
    event.preventDefault();

    const authCode = prompt("Lütfen Yetki Kodunuzu Girin:");
    if (authCode !== "12345") {
        alert("Geçersiz yetki kodu!");
        return;
    }

    const name = document.getElementById("asistantName").value;
    const email = document.getElementById("asistantEmail").value;
    const phone = document.getElementById("asistantPhone").value;
    const department = document.getElementById("asistantDepartment").value;
    const imageInput = document.getElementById("asistantImage");

    if (!department) {
        alert("Lütfen geçerli bir bölüm seçin!");
        return;
    }

    // Varsayılan resim
    let image = "img/default.jpg";

    // Kullanıcı fotoğraf yüklediyse işle
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            image = e.target.result; // Fotoğraf base64 formatında alınır
            saveNewAssistant(name, email, phone, department, image);
        };
        reader.readAsDataURL(imageInput.files[0]); // Fotoğrafı base64 formatına çevir
    } else {
        saveNewAssistant(name, email, phone, department, image);
    }
}

// Yeni Asistanı Kaydet ve Listeye Ekle
function saveNewAssistant(name, email, phone, department, image) {
    if (name && email && phone && department) {
        asistantList.push({ name, email, phone, department, image });
        saveAsistantsToStorage(); // Veriyi sakla
        displayAsistants();
        hideAddForm();
        alert("Yeni asistan başarıyla eklendi!");

        // Yeni eklenen asistanı validAssistants listesine de ekleyelim
        const validAssistants = getValidAssistants(); // Geçerli asistanları al
        localStorage.setItem('validAssistants', JSON.stringify(validAssistants));
    } else {
        alert("Lütfen tüm alanları doldurun!");
    }
}

// Asistan Formu Göster
function showAddForm() {
    document.getElementById("addAsistantForm").classList.remove("d-none");
}

// Asistan Formu Gizle
function hideAddForm() {
    document.getElementById("addAsistantForm").classList.add("d-none");
    // Formdaki verileri temizle
    document.getElementById("asistantForm").reset();
}

// Popup Gösterme
function showPopup(name, email, phone, department) {
    const authCode = prompt("Detaylı bilgi için yetki kodunu girin:");
    if (authCode !== "12345") {
        alert("Geçersiz yetki kodu!");
        return;
    }

    // Yetki kodu doğruysa popup detayları göster
    document.getElementById("popup-title").innerText = name;
    document.getElementById("popup-info").innerHTML = `
        E-posta: ${email}<br>
        Telefon: ${phone}<br>
        Bölüm: ${department}
    `;
    document.getElementById("popup").classList.remove("d-none");
}

// Popup Kapatma
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
}

// Sayfa Yüklenirken Asistanları Yükle ve Göster
loadAsistants();
displayAsistants();
function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

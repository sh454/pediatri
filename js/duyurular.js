// Navbar toggle fonksiyonu
function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

// Yetki doğrulama kodu
const AUTH_CODE = "12345"; // Örnek yetki kodu
const announcementsKey = "announcements";

function showAuthPrompt() {
    document.getElementById('authPrompt').style.display = "block";
    document.getElementById('announcementFormContainer').style.display = "none";
    document.getElementById('deleteFormContainer').style.display = "none";
}

function checkAuthCode() {
    const enteredCode = document.getElementById('authCodeInput').value;
    if (enteredCode === AUTH_CODE) {
        document.getElementById('authPrompt').style.display = "none";
        document.getElementById('announcementFormContainer').style.display = "block";
        document.getElementById('deleteFormContainer').style.display = "block"; // Silme formunu da aç
    } else {
        alert("Yetki kodu yanlış!");
    }
}

function addAnnouncement() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('image');

    if (imageInput.files.length === 0) {
        alert("Lütfen bir resim seçin!");
        return;
    }

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const imageBase64 = event.target.result; // Base64 verisi

        const newAnnouncement = {
            title,
            description,
            image: imageBase64, // Base64 verisi saklanır
        };

        // LocalStorage'da sakla
        const announcements = JSON.parse(localStorage.getItem(announcementsKey)) || [];
        announcements.push(newAnnouncement);
        localStorage.setItem(announcementsKey, JSON.stringify(announcements));

        // Slider'a ekle
        addSlideToCarousel(newAnnouncement);

        alert("Duyuru başarıyla eklendi!");
        document.getElementById('announcementForm').reset();
    };

    reader.readAsDataURL(file); // Dosyayı Base64'e çevirir
}

function addSlideToCarousel(announcement) {
    const carouselContainer = document.getElementById('carouselContainer');
    const newSlide = document.createElement('div');
    newSlide.className = 'carousel-item';
    newSlide.innerHTML = `
        <img src="${announcement.image}" class="d-block w-100" alt="${announcement.title}">
        <div class="carousel-caption d-none d-md-block">
            <h5>${announcement.title}</h5>
            <p>${announcement.description}</p>
        </div>
    `;
    carouselContainer.appendChild(newSlide);

    // İlk duyuruysa, aktif sınıfını ekle
    if (carouselContainer.children.length === 1) {
        newSlide.classList.add('active');
    }
}

function deleteAnnouncement() {
    const title = document.getElementById('deleteTitle').value.trim();
    const code = document.getElementById('deleteCode').value;

    if (code !== AUTH_CODE) {
        alert("Yetki kodu yanlış!");
        return;
    }

    // LocalStorage'dan duyuruyu sil
    let announcements = JSON.parse(localStorage.getItem(announcementsKey)) || [];
    const updatedAnnouncements = announcements.filter(a => a.title !== title);

    if (announcements.length === updatedAnnouncements.length) {
        alert("Başlık bulunamadı. Lütfen kontrol edin.");
        return;
    }

    localStorage.setItem(announcementsKey, JSON.stringify(updatedAnnouncements));

    // Slider'dan duyuruyu kaldır
    const carouselContainer = document.getElementById('carouselContainer');
    const slides = Array.from(carouselContainer.children);
    for (const slide of slides) {
        const slideTitle = slide.querySelector('h5')?.textContent;
        if (slideTitle === title) {
            slide.remove();
            break;
        }
    }

    alert("Duyuru başarıyla silindi!");
    document.getElementById('deleteForm').reset();
}

// Sayfa yüklendiğinde localStorage'daki duyuruları yükle
window.onload = function () {
    const announcements = JSON.parse(localStorage.getItem(announcementsKey)) || [];
    announcements.forEach(addSlideToCarousel);
};

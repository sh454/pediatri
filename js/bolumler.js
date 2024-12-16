let currentSection = null; // Hangi bölümün düzenlendiğini takip etmek için
const AUTH_CODE = "12345"; // Yetki kodu
let isAuthorized = false; // Yetki kodunun doğrulanıp doğrulanmadığını takip eder

// Bölüm düzenleme pop-up'ını açar
function editSection(sectionId) {
    currentSection = sectionId;

    // Eğer daha önce yetki kodu doğrulanmışsa, doğrudan bilgi düzenleme pop-up'ını aç
    if (isAuthorized) {
        openEditPopup();
    } else {
        // Yetki kodu isteme pop-up'ını aç
        const authPopup = document.getElementById("auth-popup");
        authPopup.classList.remove("d-none");
    }
}

// Yetki kodunu kontrol eder
function checkAuthCode() {
    const inputCode = document.getElementById("auth-code").value;
    if (inputCode === AUTH_CODE) {
        // Yetki kodu doğruysa, yetki verildiğini kaydet ve bilgi düzenleme pop-up'ını aç
        isAuthorized = true;
        openEditPopup();
    } else {
        alert("Yetki kodu yanlış!");
    }
    closeAuthPopup();
}

// Bilgi düzenleme pop-up'ını açar
function openEditPopup() {
    const popup = document.getElementById("popup");
    popup.classList.remove("d-none");

    // Mevcut bilgileri yükle
    const data = JSON.parse(localStorage.getItem(currentSection)) || {
        patientCount: 0,
        emptyBeds: 0,
        responsiblePerson: "Belirtilmemiş"
    };
    document.getElementById("popup-title").textContent = currentSection.replace(/Cocuk/, "Çocuk ");
    document.getElementById("popup-patients").value = data.patientCount;
    document.getElementById("popup-beds").value = data.emptyBeds;
    document.getElementById("popup-responsible").value = data.responsiblePerson;
}

// Yetki kodu pop-up'ını kapatır
function closeAuthPopup() {
    document.getElementById("auth-popup").classList.add("d-none");
}

// Pop-up'taki bilgileri kaydeder
function savePopupData() {
    const patientCount = document.getElementById("popup-patients").value;
    const emptyBeds = document.getElementById("popup-beds").value;
    const responsiblePerson = document.getElementById("popup-responsible").value;

    // Verileri localStorage'a kaydet
    const sectionData = {
        patientCount,
        emptyBeds,
        responsiblePerson
    };
    localStorage.setItem(currentSection, JSON.stringify(sectionData));

    // Güncellemeleri uygula
    updateSection(currentSection);
    closePopup();
}

// Belirli bir bölümü günceller
function updateSection(sectionId) {
    const data = JSON.parse(localStorage.getItem(sectionId));
    if (data) {
        const section = document.getElementById(sectionId);
        section.querySelector(".patients").textContent = data.patientCount;
        section.querySelector(".beds").textContent = data.emptyBeds;
        section.querySelector(".responsible").textContent = data.responsiblePerson;
    }
}

// Sayfa yüklendiğinde tüm bölümleri günceller
document.addEventListener("DOMContentLoaded", () => {
    ["CocukAcil", "CocukYogunBakim", "CocukHematoloji"].forEach(updateSection);
});

// Pop-up'ı kapatır
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
}

function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show');
}

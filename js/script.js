function closePopup() {
    document.getElementById("popup").classList.add("d-none");
}
function showPopup(department, patients, beds, head) {
    document.getElementById("popup-title").innerText = department;
    document.getElementById("popup-info").innerHTML = `
        <strong>Hasta Sayısı:</strong> ${patients}<br>
        <strong>Boş Yatak:</strong> ${beds}<br>
        <strong>Sorumlu:</strong> ${head}
    `;
    document.getElementById("popup").classList.remove("d-none");
}

function closePopup() {
    document.getElementById("popup").classList.add("d-none");
}

function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}
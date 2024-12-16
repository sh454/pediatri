// DOM elemanlarına referanslar
const assistantForm = document.getElementById('assistantForm');
const generateScheduleButton = document.getElementById('generateSchedule');
const calendarTable = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
const downloadCalendarButton = document.getElementById('downloadCalendar');

// Takvim verilerini saklayacak dizi
let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];

// Sayfa yüklendiğinde tabloyu güncelle
document.addEventListener('DOMContentLoaded', function () {
    updateCalendarTable();
});
// Takvim tablosunu güncelleyen fonksiyon
function updateCalendarTable() {
    // Blink animasyonu için gerekli CSS ekleniyor
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        .blink {
            animation: blink 1s infinite;
            color:rgb(255, 0, 0);
            font-size: 1.1em;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style); // CSS sayfanın head kısmına ekleniyor

    // Verileri ters çevirerek sıralıyoruz (en yeni duyurular başta olacak)
    const reversedData = [...scheduleData].reverse(); // Veriyi ters çeviriyoruz ama orijinalini değiştirmiyoruz

    calendarTable.innerHTML = ''; // Tabloyu temizle

    reversedData.forEach(function (schedule, index) {
        const row = calendarTable.insertRow(); // Yeni bir satır ekle
        row.innerHTML = `
            <p style="background-color:transparent;color:white;">
                <span class="blink">Yeni duyuru:</span> 
                Sayın <b>${schedule.assistantName}</b>, <b>${schedule.department}</b> bölümünde görevlendirilmiştir. <br> 
                Başlangıç: <i>${schedule.startDate} ${schedule.startTime}</i> 
                Bitiş: <i>${schedule.endDate} ${schedule.endTime}</i>
            </p>
        `;
    });
}

function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

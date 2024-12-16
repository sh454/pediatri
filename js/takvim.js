// DOM elemanlarına referanslar
const assistantForm = document.getElementById('assistantForm');
const generateScheduleButton = document.getElementById('generateSchedule');
const calendarTable = document.getElementById('calendarTable').getElementsByTagName('tbody')[0];
const downloadCalendarButton = document.getElementById('downloadCalendar');
const newsSliderCaption = document.querySelector('.carousel-item.active .carousel-caption');  // Duyuru alanı

// Geçerli asistan isimleri
// Geçerli asistan isimlerini LocalStorage'dan yükle
let validAssistants = JSON.parse(localStorage.getItem('validAssistants')) || [
    'Dr. Ahmet Yılmaz',
    'Dr. Ayşe Demir',
    'Dr. Kaan Yılmaz',
    'Dr. Aylin Yıldız',
    'Dr. Arda Tunç',
];

// Takvim verilerini saklayacak dizi
let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || [];

// Sayfa yüklendiğinde tabloyu güncelle
document.addEventListener('DOMContentLoaded', function () {
    // Geçmiş tarihleri engelle
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihini YYYY-MM-DD formatında al
    document.getElementById('startDate').setAttribute('min', today); // Başlangıç tarihi input
    document.getElementById('endDate').setAttribute('min', today);   // Bitiş tarihi input
    
    updateCalendarTable();
});

// Kod ile yetkilendirme işlemi
function requestAuthorization(callback) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;">
            <div style="background: white; padding: 20px; border-radius: 5px; text-align: center; max-width: 400px; width: 90%;">
                <h4>Yetki Kodu Girişi</h4>
                <p>Lütfen yetki kodunu girin:</p>
                <input type="password" id="permissionCode" class="form-control mb-3" placeholder="Yetki Kodu">
                <button id="submitCode" class="btn btn-success">Onayla</button>
                <button id="cancelCode" class="btn btn-danger">İptal</button>
            </div>
        </div>`;
    document.body.appendChild(modal);

    document.getElementById('submitCode').addEventListener('click', function () {
        const code = document.getElementById('permissionCode').value;
        if (code === '12345') { // Doğru kod: 12345
            document.body.removeChild(modal);
            callback(); // Yetkilendirme başarılı, işlem yapılır
        } else {
            alert('Yetki kodu hatalı!');
        }
    });

    document.getElementById('cancelCode').addEventListener('click', function () {
        document.body.removeChild(modal);
    });
}

// Duyuru ekleme fonksiyonu
function addNewsToSlider(message) {
    const p = document.createElement("p");
    p.textContent = message;
    newsSliderCaption.appendChild(p);
}

// Asistan ekleme işlemi
assistantForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const assistantName = document.getElementById('assistantName').value;

    // Geçerli asistan olup olmadığını kontrol et
    if (!validAssistants.includes(assistantName)) {
        alert('Bu asistan sisteme eklenemez! Lütfen geçerli bir asistan adı girin.');
        return; // Asistan adı geçerli değilse işlemi durdur
    }

    requestAuthorization(() => {
        const department = document.getElementById('department').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const startTime = document.getElementById('startTime').value; // Dinamik başlangıç saati
        const endTime = document.getElementById('endTime').value;   // Dinamik bitiş saati

        // Zaman farkını hesapla (Başlangıç saati ve bitiş saati arasındaki farkı)
        const startDateTime = new Date(`${startDate}T${startTime}`);
        const endDateTime = new Date(`${endDate}T${endTime}`);
        const durationInHours = (endDateTime - startDateTime) / (1000 * 60 * 60); // Farkı saat cinsinden hesapla

        // Eğer süre 24 saatten farklıysa, uyarı göster
        if (durationInHours !== 24) {
            alert('Nöbet süresi yalnızca 24 saat olabilir!');
            return;
        }

        // Aynı asistanın aynı tarihte ve saat aralığında görevlendirilip görevlendirilmediğini kontrol et
        const conflictingSchedule = scheduleData.some(schedule => {
            const existingStart = new Date(`${schedule.startDate}T${schedule.startTime}`);
            const existingEnd = new Date(`${schedule.endDate}T${schedule.endTime}`);

            // Tarih ve saat aralığının çakışıp çakışmadığını kontrol et
            return schedule.assistantName === assistantName && (
                (startDateTime >= existingStart && startDateTime < existingEnd) ||
                (endDateTime > existingStart && endDateTime <= existingEnd) ||
                (startDateTime <= existingStart && endDateTime >= existingEnd)
            );
        });

        if (conflictingSchedule) {
            alert('Bu asistan bu tarihte ve zaman aralığında zaten görevlendirilmiş!');
            return;
        }

        const newSchedule = {
            startDate: startDate,
            endDate: endDate,
            assistantName: assistantName,
            department: department,
            startTime: startTime,
            endTime: endTime
        };

        scheduleData.push(newSchedule);
        localStorage.setItem('scheduleData', JSON.stringify(scheduleData));

        assistantForm.reset();
        updateCalendarTable();

        // Duyuru ekleme
        const message = `Asistan "${assistantName}" (${department}) görevlendirildi.`;
        addNewsToSlider(message); // Duyuruyu slider'a ekle
    });
});

// Asistan silme işlemi
function deleteAssistant(index) {
    requestAuthorization(() => {
        const removedAssistant = scheduleData[index];
        scheduleData.splice(index, 1); // Asistanı sil
        localStorage.setItem('scheduleData', JSON.stringify(scheduleData)); // Veriyi güncelle
        updateCalendarTable(); // Tabloyu tekrar güncelle
    });
}

// Takvim tablosunu güncelleyen fonksiyon
function updateCalendarTable() {
    calendarTable.innerHTML = '';
    scheduleData.forEach(function (schedule, index) {
        const row = calendarTable.insertRow();
        row.innerHTML = `
            <td>${schedule.startDate}</td>
            <td>${schedule.endDate}</td>
            <td>${schedule.assistantName}</td>
            <td>${schedule.department}</td>
            <td>${schedule.startTime}</td>
            <td>${schedule.endTime}</td>
            <td><button class="btn btn-danger" onclick="deleteAssistant(${index})" >Sil</button></td>
        `;
    });
}

// Takvimi PDF olarak indirme butonuna tıklama işlemi
downloadCalendarButton.addEventListener('click', function () {
    if (scheduleData.length === 0) {
        alert('İndirilecek takvim verisi yok.');
        return;
    }

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();
    pdf.setFontSize(12);

    pdf.text('Asistan Organizasyon Takvimi', 14, 10);

    const columns = ["Başlangıç Tarihi", "Bitiş Tarihi", "Asistan Adı", "Bölüm", "Nöbet Başlama", "Nöbet Bitiş"];
    const rows = scheduleData.map(schedule => [
        schedule.startDate,
        schedule.endDate,
        schedule.assistantName,
        schedule.department,
        schedule.startTime,
        schedule.endTime
    ]);

    pdf.autoTable({
        head: [columns],
        body: rows,
        startY: 20
    });

    pdf.save('takvim.pdf');
});

// Başlangıç saati seçildiğinde bitiş saatini otomatik olarak aynı yap
document.getElementById('startTime').addEventListener('change', function () {
    const startTime = document.getElementById('startTime').value;
    document.getElementById('endTime').value = startTime; // Bitiş saatini başlangıç saati ile aynı yap
});

function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

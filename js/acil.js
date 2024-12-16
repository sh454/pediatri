// Görev Listesi
const taskList = document.getElementById("taskList");
const emergencyForm = document.getElementById("emergencyForm");

// Görevleri LocalStorage'a kaydetme
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll("li");
    
    taskItems.forEach((item) => {
        const taskName = item.querySelector(".fw-bold").innerText;
        const taskDetails = item.querySelector(".ms-2").innerText;
        tasks.push({ taskName, taskDetails });
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Görevleri LocalStorage'dan yükleme
function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    
    if (savedTasks) {
        savedTasks.forEach((task) => {
            // Görev Elemanı Oluştur
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-start";

            const taskContent = document.createElement("div");
            taskContent.className = "ms-2 me-auto";
            taskContent.innerHTML = `<div class="fw-bold">${task.taskName}</div>${task.taskDetails}`;

            // Sil Butonu
            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.innerText = "Sil";
            deleteButton.addEventListener("click", () => {
                listItem.remove();
                saveTasksToLocalStorage(); // Silme işleminden sonra listeyi kaydet
            });

            // Görevi Listeye Ekle
            listItem.appendChild(taskContent);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    }
}

// Sayfa yüklendiğinde görevleri yükle
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

// Yeni Görev Ekleme
emergencyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskDetails = document.getElementById("taskDetails").value;

    if (taskName && taskDetails) {
        // Görev Elemanı Oluştur
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-start";

        const taskContent = document.createElement("div");
        taskContent.className = "ms-2 me-auto";
        taskContent.innerHTML = `<div class="fw-bold">${taskName}</div>${taskDetails}`;

        // Sil Butonu
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.innerText = "Sil";
        deleteButton.addEventListener("click", () => {
            listItem.remove();
            saveTasksToLocalStorage(); // Silme işleminden sonra listeyi kaydet
        });

        // Görevi Listeye Ekle
        listItem.appendChild(taskContent);
        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);

        // Görevleri kaydet
        saveTasksToLocalStorage();

        // Formu Temizle
        emergencyForm.reset();
    }
});

// Navbar Toggle (varsa)
function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

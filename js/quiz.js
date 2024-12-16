const questions = [
    { question: "Çocuklarda en sık görülen enfeksiyon?", options: ["Boğaz", "Akciğer", "Kulak", "Deri"], answer: 0 },
    { question: "Hangi vitamin büyüme için kritiktir?", options: ["A vitamini", "B vitamini", "C vitamini", "D vitamini"], answer: 3 },
    { question: "Kızamık aşısı kaç yaşında yapılır?", options: ["1", "2", "3", "4"], answer: 0 },
    { question: "Demir eksikliği hangi yaş grubunda sık?", options: ["Bebek", "Çocuk", "Ergen", "Yetişkin"], answer: 1 },
    { question: "Pediatri alanı hangi yaş grubunu kapsar?", options: ["0-1", "0-5", "0-12", "0-18"], answer: 3 }
];

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

function startQuiz() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    if (!firstName || !lastName) {
        alert("Lütfen adınızı ve soyadınızı giriniz!");
        return;
    }

    userName = `${firstName} ${lastName}`;
    document.getElementById("user-info").style.display = "none";
    document.getElementById("questionPopup").style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById("questionTitle").innerText = questionData.question;
    const optionsHtml = questionData.options
        .map((option, index) => `<button class="btn btn-secondary mt-2" onclick="checkAnswer(${index})">${option}</button>`)
        .join("");
    document.getElementById("questionOptions").innerHTML = optionsHtml;
}

function checkAnswer(selectedIndex) {
    if (selectedIndex === questions[currentQuestionIndex].answer) {
        score++;
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById("questionPopup").style.display = "none";
    document.getElementById("result").classList.remove("d-none");
    document.getElementById("score").innerText = `${userName}, Skorunuz: ${score}/${questions.length}`;
    saveResult();
}

function saveResult() {
    const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    storedResults.push({ name: userName, score: `${score}/${questions.length}` });
    localStorage.setItem("quizResults", JSON.stringify(storedResults));
    displayResults();
}

function displayResults() {
    const storedResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    const resultsList = document.getElementById("quizHistory");
    resultsList.innerHTML = storedResults
        .map(result => `<li>${result.name} - Skor: ${result.score}</li>`)
        .join("");
}

function openAuthPopup() {
    document.getElementById("authPopup").style.display = "block";
}

function closeAuthPopup() {
    document.getElementById("authPopup").style.display = "none";
}

function authorizeClear() {
    const authCode = document.getElementById("authCode").value.trim();
    const correctCode = "12345"; // Yetki kodu
    if (authCode === correctCode) {
        localStorage.removeItem("quizResults");
        displayResults();
        alert("Sonuçlar başarıyla temizlendi.");
        closeAuthPopup();
    } else {
        alert("Yetki kodu hatalı!");
    }
}
function toggleNavbar() {
    const navbar = document.querySelector('.side-navbar');
    navbar.classList.toggle('show'); // 'show' sınıfını ekler veya kaldırır
}

// İlk yüklemede sonuçları göster
displayResults();

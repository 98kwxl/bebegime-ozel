document.addEventListener("DOMContentLoaded", function () {
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const endingScreen = document.getElementById("endingScreen");
    const startButton = document.getElementById("startButton");
    const continueButton = document.getElementById("continueButton");
    const chapter = document.getElementById("chapter");
    const hearts = document.getElementById("hearts");
    const nameBox = document.getElementById("name");
    const textBox = document.getElementById("text");
    const choicesBox = document.getElementById("choices");
    const yesButton = document.getElementById("yesButton");
    const noButton = document.getElementById("noButton");
    const finalMessage = document.getElementById("finalMessage");
    let current = 0;
    let heartCount = 0;
    let waitingForContinue = false;
    // ==============================
    // HİKÂYE
    // ==============================
    const story = [
        {
            chapter: "BÖLÜM 1",
            name: "O",
            text: "Bir gün telefonuna garip bir mesaj geldi. Mesajda sadece bir adres ve şu yazıyordu: 'Beni bul.'",
            choices: [
                {
                    text: "Mesaja git.",
                    next: 1,
                    correct: false
                },
                {
                    text: "Mesajı görmezden gel.",
                    restart: true
                }
            ]
        },
        // ==============================
        // SORU 1
        // ==============================
        {
            chapter: "SORU 1",
            name: "Efe",
            text: "Bizi en çok anlatan şarkı?",
            choices: [
                {
                    text: "Mystery of Love",
                    restart: true
                },
                {
                    text: "Friends",
                    next: 2,
                    correct: true
                },
                {
                    text: "Futile Devices",
                    restart: true
                }
            ]
        },
        // ==============================
        // SORU 2
        // ==============================
        {
            chapter: "SORU 2",
            name: "Efe",
            text: "Efe Cle’ye kızınca ne der?",
            choices: [
                {
                    text: "Kes",
                    restart: true
                },
                {
                    text: "Kes bok",
                    restart: true
                },
                {
                    text: "Kes bok sana ne sus defol",
                    next: 3,
                    correct: true
                }
            ]
        },
        // ==============================
        // SORU 3
        // ==============================
        {
            chapter: "SORU 3",
            name: "Efe",
            text: "Efe’yi bu hayatta en çok kim sever?",
            choices: [
                {
                    text: "Arkadaşları",
                    restart: true
                },
                {
                    text: "Cle",
                    next: 4,
                    correct: true
                },
                {
                    text: "Nisa’nın annesi",
                    restart: true
                }
            ]
        }
    ];
    // ==============================
    // KALPLERİ GÜNCELLE
    // ==============================
    function updateHearts() {
        let result = "";
        for (let i = 0; i < 3; i++) {
            if (i < heartCount) {
                result += "♥ ";
            } else {
                result += "♡ ";
            }
        }
        hearts.textContent = result;
    }
    // ==============================
    // TAM EKRAN PEMBE + KONFETİ
    // ==============================
    function correctAnswerEffect() {
        // Tam ekran pembe katman
        const pink = document.createElement("div");
        pink.style.position = "fixed";
        pink.style.left = "0";
        pink.style.top = "0";
        pink.style.width = "100vw";
        pink.style.height = "100vh";
        pink.style.background = "#ff69a6";
        pink.style.zIndex = "99998";
        pink.style.pointerEvents = "none";
        pink.style.opacity = "1";
        document.body.appendChild(pink);
        // 0.4 saniye sonra konfeti
        setTimeout(function () {
            confettiEffect();
        }, 400);
        // 1.4 saniye sonra pembe ekranı kaldır
        setTimeout(function () {
            pink.style.transition = "opacity 0.3s ease";
            pink.style.opacity = "0";
            setTimeout(function () {
                pink.remove();
            }, 300);
        }, 1400);
    }
    // ==============================
    // KONFETİ
    // ==============================
    function confettiEffect() {
        const emojis = [
            "💗",
            "💕",
            "💖",
            "❤️",
            "💘",
            "✨",
            "🎀"
        ];
        for (let i = 0; i < 120; i++) {
            const piece = document.createElement("div");
            piece.textContent =
                emojis[Math.floor(Math.random() * emojis.length)];
            piece.style.position = "fixed";
            piece.style.left = "50%";
            piece.style.top = "50%";
            piece.style.fontSize =
                (14 + Math.random() * 20) + "px";
            piece.style.zIndex = "99999";
            piece.style.pointerEvents = "none";
            document.body.appendChild(piece);
            const angle =
                Math.random() * Math.PI * 2;
            const distance =
                200 + Math.random() * 500;
            const x =
                Math.cos(angle) * distance;
            const y =
                Math.sin(angle) * distance + 150;
            const rotation =
                Math.random() * 720 - 360;
            piece.animate(
                [
                    {
                        transform:
                            "translate(-50%, -50%) scale(0)",
                        opacity: 1
                    },
                    {
                        transform:
                            `translate(${x}px, ${y}px)
                             rotate(${rotation}deg)
                             scale(1)`,
                        opacity: 0
                    }
                ],
                {
                    duration:
                        1300 + Math.random() * 800,
                    easing:
                        "cubic-bezier(.15,.75,.35,1)"
                }
            );
            setTimeout(function () {
                piece.remove();
            }, 2300);
        }
    }
    // ==============================
    // OYUNU EN BAŞA AL
    // ==============================
    function restartGame() {
        current = 0;
        heartCount = 0;
        waitingForContinue = false;
        continueButton.style.display = "none";
        gameScreen.classList.remove("active");
        endingScreen.classList.remove("active");
        startScreen.classList.add("active");
        updateHearts();
    }
    // ==============================
    // HİKÂYEYİ GÖSTER
    // ==============================
    function showStory() {
        if (current >= story.length) {
            showEnding();
            return;
        }
        waitingForContinue = false;
        const part = story[current];
        chapter.textContent =
            part.chapter;
        nameBox.textContent =
            part.name;
        textBox.textContent =
            part.text;
        choicesBox.innerHTML = "";
        // Başlangıçta DEVAM ET yok
        continueButton.style.display = "none";
        part.choices.forEach(function (choice) {
            const button =
                document.createElement("button");
            button.className = "choice";
            button.textContent =
                choice.text;
            button.addEventListener("click", function () {
                if (waitingForContinue) {
                    return;
                }
                // ==============================
                // YANLIŞ / OLUMSUZ CEVAP
                // ==============================
                if (choice.restart) {
                    restartGame();
                    return;
                }
                // Seçenekleri kilitle
                const allChoices =
                    choicesBox.querySelectorAll("button");
                allChoices.forEach(function (btn) {
                    btn.disabled = true;
                });
                // ==============================
                // DOĞRU CEVAP
                // ==============================
                if (choice.correct) {
                    heartCount++;
                    if (heartCount > 3) {
                        heartCount = 3;
                    }
                    updateHearts();
                    // PEMBE + KONFETİ
                    correctAnswerEffect();
                }
                // Bir sonraki bölüme hazırlan
                current = choice.next;
                waitingForContinue = true;
                // Efekt bittikten sonra DEVAM ET
                setTimeout(function () {
                    continueButton.style.display = "block";
                }, 1700);
            });
            choicesBox.appendChild(button);
        });
        updateHearts();
    }
    // ==============================
    // DEVAM ET
    // ==============================
    continueButton.addEventListener("click", function () {
        if (!waitingForContinue) {
            return;
        }
        waitingForContinue = false;
        continueButton.style.display = "none";
        showStory();
    });
    // ==============================
    // FİNAL EKRANI
    // ==============================
    function showEnding() {
        gameScreen.classList.remove("active");
        endingScreen.classList.add("active");
        continueButton.style.display = "none";
    }
    // ==============================
    // HİKÂYEYE BAŞLA
    // ==============================
    startButton.addEventListener("click", function () {
        startScreen.classList.remove("active");
        endingScreen.classList.remove("active");
        gameScreen.classList.add("active");
        current = 0;
        heartCount = 0;
        waitingForContinue = false;
        continueButton.style.display = "none";
        updateHearts();
        showStory();
    });
    // ==============================
    // EVET
    // ==============================
    yesButton.addEventListener("click", function () {
        finalMessage.textContent =
            "İyi ki benimsin bebeğim.";
        confettiEffect();
        yesButton.textContent =
            "❤️";
    });
    // ==============================
    // HAYIR BUTONU KAÇSIN
    // ==============================
    function moveNoButton() {
        noButton.style.position = "fixed";
        const maxX =
            window.innerWidth -
            noButton.offsetWidth -
            20;
        const maxY =
            window.innerHeight -
            noButton.offsetHeight -
            20;
        const x =
            Math.random() *
            Math.max(maxX, 20);
        const y =
            Math.random() *
            Math.max(maxY, 20);
        noButton.style.left =
            x + "px";
        noButton.style.top =
            y + "px";
    }
    noButton.addEventListener(
        "mouseover",
        moveNoButton
    );
    noButton.addEventListener(
        "click",
        moveNoButton
    );
});

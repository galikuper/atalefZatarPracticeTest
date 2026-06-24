let questions = [
    // {
    //     number: 0,
    //     top: ["src", "assets/q0.png"],
    //     head: "מהו עקרון הזט״ר הבולט ביותר בתמונה?",
    //     type: "open",
    //     option: [],
    //     answer: "הבדלים בין תצ״א למציאות"
    // },
    // {
    //     number: 1,
    //     top: ["src", "assets/q1.png"],
    //     head: "מדוע נוצר ההבדל בין 2 התוצאות? סמן 2 תשובות נכונות",
    //     type: "multiple-choice",
    //     option: ["חבלה חמה/קרה", "⁠בניית מנהרות תת קרקעיות חדשות", "⁠הפעלת אש כבדה של כוחות שונים טרם כניסה קרקעית של כוחותינו", "התרסקות מטוס בסביבה", "הצפת מנהרות במי ים"],
    //     answer: ["חבלה חמה/קרה", "⁠הפעלת אש כבדה של כוחות שונים טרם כניסה קרקעית של כוחותינו"]
    // },
    // {
    //     number: 2,
    //     top: ["src", "assets/q2.png"],
    //     head: "איזה עקרון זט״ר בולט בתמונה ותוכל להיעזר בו כדי לאפיין מבנה מיוחד בתמונה?",
    //     type: "open",
    //     option: [],
    //     answer: "כיוון מבנים"
    // },
    // {
    //     number: 3,
    //     top: ["src", "assets/q3.png"],
    //     head: "מהו עקרון הזט״ר הבולט ביותר בתמונה?",
    //     type: "american",
    //     option: ["מיקום עצמי", "צורת גג", "⁠כיוון מבנים", "שימוש בצירים"],
    //     answer: "שימוש בצירים"
    // },
    {
        number: 4,
        top: ["src", "assets/q4.png"],
        head: "בחר 3 עקרונות זט״ר המופיעים בתמונה:",
        type: "multiple-choice",
        option: ["כיווני שמיים", "פרספקטיבה", "כיוון מבנים", "רחובות וצירים", "צורת גג", "מיקום עצמי", "הבדלים בין תצ״א למציאות"],
        answer: ["כיווני שמיים", "פרספקטיבה", "רחובות וצירים", "צורת גג"]
    },
    {
        number: 5,
        top: ["table", ""],
        head: "גרור לעמודה המתאימה:",
        type: "table",
        option: ["כביש", "מים", "בניין רב קומות", "גיא", "רכס הרים", "עץ", "כיכר", "גבעה", "ציר"],
        answer: {
            relief: [
                "גיא",
                "רכס הרים",
                "גבעה"
            ],
            cover: [
                "כביש",
                "מים",
                "בניין רב קומות",
                "עץ",
                "כיכר",
                "ציר"
            ]
        }
    },
    {
        number: 6,
        top: ["compass", ""],
        head: "שבץ את כיווני השמיים:",
        type: "dir",
        option: ["מערב", "מזרח", "צפון", "דרום"],
        answer: {
            north: "צפון",
            south: "דרום",
            east: "מזרח",
            west: "מערב"
        }
    },
];

let startBtn;
let restartBtn;
let formBtn;
let quizData;
quizData = {
    user: {
        name: "",
        id: 0
    },
    answers: [],
    score: 0,
    currentQuestion: 0
};
let isAnswered = false;
let isChecked = false;
let countQuest;
let formState = false;
let userAnswer;
let questionScore = 0;
let correctCount = 0;

window.addEventListener("load", () => {
    // INDEX
    if (document.getElementById("open-title")) {
        startBtn = document.getElementById("start-practice");
        startBtn.addEventListener("click", () => { window.location.href = "userInfo.html" });
    }
    // USER INFO
    else if (document.getElementById("user-info")) {
        document.getElementById("user-info").addEventListener("submit", saveUserInfo);

        document.getElementById("soldier-name").addEventListener("input", function () {
            this.value = this.value.replace(/[^א-תa-zA-Z\s]/g, "");
            document.getElementById("name-error").textContent = "";
            this.classList.remove("input-error");
        });
        document.getElementById("soldier-personal-number").addEventListener("input", function () {
            this.value = this.value.replace(/\D/g, "");
            document.getElementById("id-error").textContent = "";
            this.classList.remove("input-error");
        });

    }
    // INSTRUCTIONS
    else if (document.getElementById("instructions")) {
        questions.forEach(q => {
            if (q.top[0] === "src") {
                const imgLoad = new Image();
                imgLoad.src = q.top[1];
            }
        });

        closeBtn = document.getElementById("close-instructions");
        closeBtn.addEventListener("click", () => { window.location.href = "practice.html" });
    }
    // PRACTICE
    else if (document.getElementById("question")) {
        quizData = JSON.parse(localStorage.getItem("quizData"));
        countQuest = quizData.currentQuestion || 0;
        showQuestion(countQuest);
        handleForm(countQuest);
    }
    // FINISH
    else if (document.getElementById("close-title")) {
        showScore();

        restartBtn = document.getElementById("restart-practice");
        restartBtn.addEventListener("click", () => { window.location.href = "index.html" });

        quizData = JSON.parse(localStorage.getItem("quizData"));
        if (quizData) {
            document.getElementById("finish-name").textContent = quizData.user.name;
            document.getElementById("finish-number").textContent = quizData.user.id;
        }
        else {
            document.getElementById("finish-name").textContent = "";
            document.getElementById("finish-number").textContent = "";
        }
    }

    setupImageViewer();                       //remove for pinch to zoom
});
function saveUserInfo(event) {
    event.preventDefault();
    const nameInput = document.getElementById("soldier-name");
    const idInput = document.getElementById("soldier-personal-number");
    const nameError = document.getElementById("name-error");
    const idError = document.getElementById("id-error");
    nameError.textContent = "";
    idError.textContent = "";
    nameInput.classList.remove("input-error");
    idInput.classList.remove("input-error");
    let valid = true;

    if (nameInput.value.trim() === "") {
        nameError.textContent = "יש להזין שם";
        nameInput.classList.add("input-error");
        valid = false;
    }

    if (!/^\d{7}$/.test(idInput.value.trim())) {
        idError.textContent =
            "המספר האישי חייב להכיל 7 ספרות";
        idInput.classList.add("input-error");
        valid = false;
    }

    if (!valid) return;
    quizData = {
        user: {
            name: document.getElementById("soldier-name").value,
            id: document.getElementById("soldier-personal-number").value
        },
        answers: [],
        score: 0,
        currentQuestion: 0
    };

    localStorage.setItem(
        "quizData",
        JSON.stringify(quizData)
    );

    window.location.href = "instructions.html";
}
function showQuestion(q) {
    isAnswered = false;
    document.getElementById("form-btn").src = "assets/unAnsweredBtn.svg";

    // TOP
    const top = document.getElementById("top");
    container = document.getElementById("top");
    top.innerHTML = "";
    if (questions[q].top[0] === "src") {






        top.innerHTML = `
            <img src="${questions[q].top[1]}" class="question-image">
            <img src="assets/enlarge.svg" id="zoom-btn">
        `;
        let img = top.querySelector(".question-image");

        img.onclick = () => {
            openImage(img.src);
        };
        document.getElementById("zoom-btn").onclick = (e) => {
            e.stopPropagation(); // prevents double-trigger with image click
            openImage(img.src);
        };









    }
    else if (questions[q].top[0] === "table") {
        showDragTable(q);
    }
    else if (questions[q].top[0] === "compass") {
        showCompass(q);
    }

    // HEADER
    document.getElementById("header").innerHTML = questions[q].head

    // INPUT
    const type = questions[q].type;
    const inputDiv = document.getElementById("input-div");
    inputDiv.className = "";
    inputDiv.classList.add(type);

    switch (type) {
        case "open":
            showOpenInput(q);
            break;
        case "multiple-choice":
            showMultipleChoiceInput(q);
            break;
        case "american":
            showAmericanInput(q);
            break;
        case "table":
            showDragTable(q);
            break;
        case "dir":
            showDirInput(q);
            break;
        default:
            alert("404");
    }

    // BUTTON
    formBtn = document.getElementById("form-btn")
    formBtn.alt = "check"
    formBtn.name = "check"
    formBtn.src = "assets/unAnsweredBtn.svg"

    // PROGRESS
    document.getElementById("progress-bar").src = `assets/progress=${questions[q].number}.svg`;
};

// QUESTION TYPES
function showOpenInput(q) {
    const inputDiv = document.getElementById('input-div');
    inputDiv.innerHTML = "";

    const textInput = document.createElement('input');
    textInput.type = "text";
    textInput.placeholder = "הקלד פה";
    textInput.id = "answer-input";

    const answerBox = document.createElement("div");
    answerBox.id = "correct-answer";
    answerBox.style.display = "none";

    inputDiv.appendChild(textInput);
    inputDiv.appendChild(answerBox);

    textInput.addEventListener("input", () => {
        // isAnswered = textInput.value.trim() !== "";
        setAnswered(textInput.value.trim() !== "");
    });
};
function showMultipleChoiceInput(q) {
    const inputDiv = document.getElementById('input-div');
    inputDiv.innerHTML = "";
    questions[q].option.forEach((option, index) => {
        const wrapper = document.createElement("label");
        wrapper.className = "option-wrapper";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `option-${index}`;
        checkbox.value = option;

        const text = document.createElement("span");
        text.textContent = option;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(text);
        inputDiv.appendChild(wrapper);


        checkbox.addEventListener("change", () => {
            wrapper.classList.toggle("selected", checkbox.checked);

            const checked = document.querySelectorAll('input[type="checkbox"]:checked').length;
            // isAnswered = checked > 0;
            setAnswered(checked > 0)
        });
    })
};
function showAmericanInput(q) {
    const inputDiv = document.getElementById('input-div');
    inputDiv.innerHTML = "";

    questions[q].option.forEach((option) => {
        const americanBtn = document.createElement("button");
        americanBtn.type = "button";
        americanBtn.className = "american-option";
        americanBtn.textContent = option;
        americanBtn.value = option;

        americanBtn.addEventListener("click", () => {
            document
                .querySelectorAll(".american-option")
                .forEach(btn => {
                    btn.classList.remove("selected");
                });
            americanBtn.classList.add("selected");

            // isAnswered = true;
            setAnswered(true)

        });
        inputDiv.appendChild(americanBtn);
    });
};
function showDragTable(q) {
    const oldTable = document.getElementById("drag-table");
    if (oldTable) {
        oldTable.remove();
    }

    const table = document.createElement("div");
    table.id = "drag-table";
    table.innerHTML = `
        <div class="table-side">
            <img src="assets/relief.svg" alt='תבליט' id="relief-title" class="zone-title"/>
            <div class="drop-zone" id="relief">
                <div class="zone-content"></div>
            </div>
        </div>
        
        <div class="table-side">
            <img src="assets/cover.svg" alt='תכסית' id="cover-title" class="zone-title"/>
            <div class="drop-zone" id="cover">
                <div class="zone-content"></div>
            </div>
        </div>
    `;

    document.getElementById("question").insertBefore(table, document.getElementById("header"));
    const dropZones = document.querySelectorAll(".zone-content");
    dropZones.forEach(zone => {
    });
    showTableInput(q);
}
function showTableInput(q) {
    const inputDiv = document.getElementById("input-div");
    inputDiv.innerHTML = "";
    inputDiv.className = "word-bank";

    questions[q].option.forEach((option, index) => {
        const item = document.createElement("div");

        item.className = "drag-item";
        item.textContent = option;
        item.id = `drag-item-${index}`;

        enablePointerDrag(item);

        inputDiv.appendChild(item);
    });

    inputDiv.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    inputDiv.addEventListener("drop", (event) => {
        event.preventDefault();
        const itemId = event.dataTransfer.getData("text/plain");
        const item = document.getElementById(itemId);
        if (item) {
            inputDiv.appendChild(item);
        }
    });

}
function showCompass(q) {
    const oldTable = document.getElementById("drag-table");
    if (oldTable) {
        oldTable.remove();
    }
    const oldCompass = document.getElementById("compass-container");
    if (oldCompass) {
        oldCompass.remove();
    }

    const compass = document.createElement("div");
    compass.id = "compass-container";

    compass.innerHTML = `
        <img src="assets/compass.svg" id="compass-img">

        <div class="compass-drop north" data-direction="צפון"></div>
        <div class="compass-drop east" data-direction="מזרח"></div>
        <div class="compass-drop south" data-direction="דרום"></div>
        <div class="compass-drop west" data-direction="מערב"></div>
    `;

    document.getElementById("question").insertBefore(compass, document.getElementById("header"));

    document.querySelectorAll(".compass-drop").forEach(zone => {
    });
    showDirInput(q);
}
function showDirInput(q) {
    const inputDiv = document.getElementById("input-div");
    inputDiv.innerHTML = "";
    inputDiv.className = "dir-bank";

    questions[q].option.forEach((option, index) => {
        const item = document.createElement("div");
        item.className = "dir-item";
        item.textContent = option;
        item.id = `direction-${index}`;

        enablePointerDrag(item);

        inputDiv.appendChild(item);
    });
};

// FORM STUFF
function handleForm(questionNumber) {
    document.getElementById('question').addEventListener('submit', function (event) {
        event.preventDefault();

        if (isAnswered) {
            if (!isChecked) handleCheck();
            else handleContinue();
        }
    });

}
function handleCheck() {
    questionScore = 0;
    const inputDiv = document.getElementById("input-div");
    const current = questions[countQuest];
    const type = current.type;

    switch (type) {
        case "open":
            userAnswer = document.getElementById("answer-input").value;
            const answerBox = document.getElementById("correct-answer");
            answerBox.innerHTML = `<strong>תשובה:</strong> ${current.answer}`;
            answerBox.style.display = "block";
            document.getElementById("answer-input").disabled = true;

            // to consider open answer correct
            // questionScore = 1;//מחשיב את התשובה הפתוחה כציון מלא-------------------------------! ! ! ! ! 
            // to consider open answer false
            questionScore = 0;











            break;

        case "multiple-choice":
            userAnswer = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
            const wrappers = document.querySelectorAll(".option-wrapper");

            wrappers.forEach(wrapper => {
                const checkbox = wrapper.querySelector("input");
                const value = checkbox.value;
                const isCorrect = current.answer.includes(value);
                const isSelected = checkbox.checked;
                if (isCorrect) {
                    wrapper.classList.add("correct-answer");
                }
                if (isSelected && !isCorrect) {
                    wrapper.classList.add("wrong-answer");
                }
                checkbox.disabled = true;
            });

            correctCount = 0;
            userAnswer.forEach(answer => {
                if (current.answer.includes(answer)) correctCount++;
            });
            questionScore = correctCount / current.answer.length;
            break;

        case "american":
            const selected = document.querySelector(".american-option.selected");
            if (selected) userAnswer = selected.value;
            else userAnswer = "";
            if (userAnswer === current.answer) questionScore = 1;

            document.querySelectorAll(".american-option").forEach(button => {
                const wasSelected = button.classList.contains("selected");
                if (button.value === current.answer) {
                    button.classList.add("correct-answer");
                }
                if (
                    button.classList.contains("selected") &&
                    button.value !== current.answer
                ) {
                    button.classList.add("wrong-answer");
                }
                button.classList.remove("selected");
                button.disabled = true;
            });
            break;

        case "table":
            const reliefZone = document.querySelector("#relief .zone-content");
            const coverZone = document.querySelector("#cover .zone-content");
            const reliefAnswers = [...reliefZone.children].map(item => item.textContent.trim());
            const coverAnswers = [...coverZone.children].map(item => item.textContent.trim());

            userAnswer = {
                relief: reliefAnswers,
                cover: coverAnswers
            };

            const correctRelief = current.answer.relief;
            const correctCover = current.answer.cover;
            correctCount = 0;

            document.querySelectorAll(".drag-item").forEach((item, index) => {
                const text = item.textContent.trim();
                const parentZone = item.closest(".zone-content");
                if (!parentZone) return;
                const zoneId = parentZone.parentElement.id;
                const correctZone = correctRelief.includes(text)
                    ? reliefZone : correctCover.includes(text)
                        ? coverZone : null;

                const isCorrect =
                    (zoneId === "relief" && correctRelief.includes(text)) ||
                    (zoneId === "cover" && correctCover.includes(text));

                if (isCorrect) {
                    item.classList.add("correct-answer");
                    correctCount++;
                }
                else item.classList.add("wrong-answer");
                item.draggable = false;

                setTimeout(() => {
                    if (!isCorrect && correctZone) {
                        setTimeout(() => {
                            animateMove(item, correctZone);

                            item.classList.add("wrong-answer-corrected");//---test - correcting color

                        }, index * 400);
                    }
                }, 1000);
            });
            questionScore = correctCount / current.option.length;
            break;

        case "dir":
            const northZone = document.querySelector(".north");
            const southZone = document.querySelector(".south");
            const eastZone = document.querySelector(".east");
            const westZone = document.querySelector(".west");
            userAnswer = {
                north: northZone.textContent.trim(),
                south: southZone.textContent.trim(),
                east: eastZone.textContent.trim(),
                west: westZone.textContent.trim()
            };
            const correct = current.answer;

            document.querySelectorAll(".compass-drop").forEach((zone, index) => {
                const item = zone.querySelector(".dir-item");
                if (!item) return;

                const direction = [...zone.classList].find(c =>
                    ["north", "south", "east", "west"].includes(c)
                );

                const isCorrect = item.textContent.trim() === correct[direction];


                if (item.textContent.trim() === correct[direction]) {
                    item.classList.add("correct-answer");
                    questionScore += 1 / 4;
                }
                else {
                    item.classList.add("wrong-answer");
                    const correctDirection = Object.keys(correct).find(
                        key => correct[key] === item.textContent.trim()
                    );
                    const correctZone = document.querySelector(
                        `.${correctDirection}`
                    );
                    setTimeout(() => {
                        animateCompassMove(item, correctZone);
                        // item.classList.remove("wrong-answer");
                        item.classList.add("wrong-answer-corrected");
                    }, 800);
                }
                item.draggable = false;
            });
            break;

        default:
            alert("404");
            break;
    }

    isChecked = true;
    quizData = JSON.parse(localStorage.getItem("quizData"));
    quizData.score += questionScore;

    localStorage.setItem("quizData", JSON.stringify(quizData));
    saveAnswer(countQuest, userAnswer, questionScore);
    inputDiv.classList.add("show-result");
    setToContinue();
}
function saveAnswer(questionNumber, userAnswer, questionScore) {
    quizData = JSON.parse(localStorage.getItem("quizData"));

    quizData.answers[questionNumber] = {
        question: questionNumber,
        answer: userAnswer,
        score: questionScore
    };

    localStorage.setItem(
        "quizData",
        JSON.stringify(quizData)
    );

    quizData = JSON.parse(localStorage.getItem("quizData"));
}
function handleContinue() {
    isChecked = false;
    countQuest++;
    quizData.currentQuestion = countQuest;
    localStorage.setItem("quizData", JSON.stringify(quizData));

    if (countQuest < questions.length) {
        showQuestion(countQuest);
        // resetButton();
    }
    else {
        window.location.href = "finish.html";
    }
}
function setToContinue() {
    formBtn = document.getElementById("form-btn");
    formBtn.src = "assets/nextBtn.svg";
    formBtn.alt = "continue";
}
function handleAnswer(userAnswer) {
    quizData = JSON.parse(localStorage.getItem("quizData"));

    quizData.answers.push({
        question: countQuest,
        answer: userAnswer
    });

    countQuest++;
    quizData.currentQuestion = countQuest;

    localStorage.setItem(
        "quizData",
        JSON.stringify(quizData)
    );

    if (countQuest < questions.length) showQuestion(countQuest);
    else window.location.href = "finish.html";
}
function showScore() {
    quizData = JSON.parse(localStorage.getItem("quizData"));




    // //     -      if open question answer is considered correct      -
    // //{--
    // const maxScore = questions.length;
    // //--}

    //     -      if open question answer is not considered in score     -
    //{--
    let countOpenQuestions = 0;
    questions.forEach(question => {
        if (question.type === "open") {
            countOpenQuestions++;
        }
    });
    const maxScore = questions.length - (countOpenQuestions);
    //--}






    const percent = Math.round((quizData.score / maxScore) * 100);
    const score = `${percent}%`;
    document.getElementById("score").textContent = score;
}

// helper
function animateMove(item, destination) {
    const first = item.getBoundingClientRect();
    destination.appendChild(item);

    const last = item.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    item.animate(
        [
            {
                transform: `translate(${dx}px, ${dy}px) scale(1.1)`
            },
            {
                transform: "translate(0,0) scale(1)"
            }
        ],
        {
            duration: 650,
            easing: "cubic-bezier(.34,1.56,.64,1)",
            fill: "both"
        }
    );

}
function animateCompassMove(item, destination) {
    const first = item.getBoundingClientRect();
    destination.appendChild(item);
    const last = item.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    item.animate(
        [
            {
                transform: `translate(${dx}px, ${dy}px) scale(1.15)`
            },
            {
                transform: "translate(0, 0) scale(1)"
            }
        ],
        {
            duration: 700,
            easing: "cubic-bezier(.22,.61,.36,1)",
            fill: "both"
        }
    );
}
function setAnswered(answered) {
    isAnswered = answered;
    document.getElementById("form-btn").src =
        answered
            ? "assets/checkBtn.svg"
            : "assets/unAnsweredBtn.svg";
}
function enablePointerDrag(item) {
    let offsetX = 0;
    let offsetY = 0;

    item.addEventListener("pointerdown", startDrag);

    function startDrag(e) {
        e.preventDefault();

        const rect = item.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        item.classList.add("dragging");

        item.style.position = "fixed";
        item.style.zIndex = "9999";
        item.style.left = rect.left + "px";
        item.style.top = rect.top + "px";

        document.addEventListener("pointermove", drag);
        document.addEventListener("pointerup", endDrag);
    }

    function drag(e) {
        item.style.left = e.clientX - offsetX + "px";
        item.style.top = e.clientY - offsetY + "px";
    }

    function endDrag(e) {
        const dropTarget = document.elementFromPoint(
            e.clientX,
            e.clientY
        );

        const zone =
            dropTarget?.closest(".zone-content") ||
            dropTarget?.closest(".compass-drop") ||
            dropTarget?.closest(".dir-bank");

        if (zone) {
            if (
                zone.classList.contains("compass-drop")
            ) {
                const existing = zone.querySelector(".dir-item");

                if (existing && existing !== item) {
                    document.querySelector(".dir-bank").appendChild(existing);
                }
            }

            zone.appendChild(item);
            updateAnsweredState();
        }

        item.classList.remove("dragging");
        item.style.position = "";
        item.style.zIndex = "";
        item.style.left = "";
        item.style.top = "";

        document.removeEventListener("pointermove", drag);
        document.removeEventListener("pointerup", endDrag);
    }
}
function updateAnsweredState() {
    // Compass question
    if (document.getElementById("compass-container")) {
        const placed = document.querySelectorAll(".compass-drop .dir-item").length;
        // setAnswered(placed === 4);
        setAnswered(placed >= 1);
        return;
    }

    // Table question
    if (document.getElementById("drag-table")) {
        const placed = document.querySelectorAll("#relief .drag-item, #cover .drag-item").length;
        const total = document.querySelectorAll(".drag-item").length;
        // setAnswered(placed === total);
        setAnswered(placed >= 1);
    }
}


function setupImageViewer() {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const closeBtn = document.getElementById("close-modal");

    // open
    window.openImage = function (src) {
        modalImg.src = src;
        modal.classList.remove("hidden");
    };

    // close
    function closeModal() {
        modal.classList.add("hidden");
        modalImg.src = "";
    }

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

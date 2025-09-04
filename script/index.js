function createElements(arr) {
    const htmlElements = arr.map((el) => `<span class="opacity-80 text-[16px] p-4 bg-[#EDF7FF] rounded-md w-fit">${el}</span>`);
    return htmlElements.join(" ");
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

function manageSpinner(status) {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

function loadLessons() {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then(response => response.json())
        .then(data => displayLessons(data.data))
}

function loadLevelWord(id) {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url).then(response => response.json()).then(data => {
        const clickedBtn = document.getElementById(`lesson-btn-${id}`);
        const lessonButtons = document.querySelectorAll(".lesson-btn");
        lessonButtons.forEach(btn => btn.classList.remove("active"));
        clickedBtn.classList.add("active");
        displayLevelWord(data.data);
    })
}

async function loadWordDetail(id) {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    displayWordDetails(data.data);
}

function displayWordDetails(word) {
    const detailsBox = document.getElementById("details-container");

    detailsBox.innerHTML = `
                <div class="p-6 border border-[#EDF7FF] rounded-xl">
                    <h2 class="text-3xl font-semibold mb-8">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
                    <p class="font-semibold text-xl mb-2">Meaning</p>
                    <p class="font-medium text-xl mb-8">${word.meaning}</p>
                    <p class="font-semibold text-2xl mb-2">Example</p>
                    <p class="opacity-80 text-xl mb-8">${word.sentence}</p>
                    <p class="text-xl font-medium mb-3">সমার্থক শব্দ গুলো</p>
                    <div class="flex gap-2">
                        ${createElements(word.synonyms)}
                    </div>
                </div>
                <button class="btn btn-primary w-[70%] md:w-auto mt-6">Complete Learning</button>
            
    `

    document.getElementById("word_modal").showModal();
}

function displayLevelWord(words) {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerText = "";


    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full">
        <img class="mx-auto" src="assets/alert-error.png"/>
            <p class="font-bangla text-[#79716B] pt-8 pb-6">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="text-4xl font-bangla font-medium pb-16">নেক্সট Lesson এ যান</h2>
        </div>
        `
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5">
                <h2 class="font-bold text-2xl mb-6">${word.word ? word.word : "Couldn't find the word"}</h2>
                <p class="text-sm mb-6">Meaning /Pronounciation</p>
                <div class="font-bangla font-semibold text-2xl text-[#18181B] opacity-80 mb-14">"${word.meaning ? word.meaning : "Couldn't find the word"} / ${word.pronunciation ? word.pronunciation : "Couldn't find the word"}"</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetail(${word.id})" class="btn p-3 rounded-md bg-[#1a90ff10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn p-3 rounded-md bg-[#1a90ff10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `
        wordContainer.appendChild(card)
    })
    manageSpinner(false);
}

function displayLessons(lessons) {
    // 1. get the container && empty the container
    // 2. get into every lessons
    // 3. create element
    // 4. Append into container

    const levelContainer = document.getElementById("level-container");
    levelContainer.innerText = "";

    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" href="" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}</button>
        `

        levelContainer.appendChild(btnDiv);
    }
}
loadLessons();

document.getElementById("btn-search").addEventListener("click", function () {
    const input = document.getElementById("input-search");
    const inputValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json()).then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(inputValue));
            displayLevelWord(filterWords);
        });
})
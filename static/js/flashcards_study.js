let studyCards = [];
let currentCardIndex = 0;
let isShuffled = false;
let isQuizMode = false;
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let totalQuestions = 10;
let userAnswers = []; // Store user answers for review

async function loadStudyData() {
    try {
        const selectedTopics = JSON.parse(sessionStorage.getItem('studyTopics') || '[]');
        const studyMode = sessionStorage.getItem('studyMode'); // Get the study mode

        // FIX: Properly check if it's quiz mode
        isQuizMode = studyMode === 'quiz';

        if (selectedTopics.length === 0) {
            window.location.href = '/pipe-flashcards';
            return;
        }

        const response = await fetch('/get-flashcards-data');
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        studyCards = [];
        let cardNumber = 1;

        selectedTopics.forEach(topicKey => {
            const topicData = data[topicKey];
            if (topicData && topicData.questions) {
                for (const [questionId, questionData] of Object.entries(topicData.questions)) {
                    studyCards.push({
                        number: cardNumber++,
                        question: questionData.question,
                        choices: questionData.choices,
                        answer: questionData.answer,
                        topic: topicKey,
                        topicName: topicData.category || topicKey // Store topic name for display
                    });
                }
            }
        });

        if (studyCards.length === 0) {
            alert('No cards found for selected topics.');
            window.location.href = '/pipe-flashcards';
            return;
        }

        if (isQuizMode) {
            const quizItems = parseInt(sessionStorage.getItem('quizItems')) || 10;
            initializeQuizMode(quizItems);
        } else {
            initializeFlashcardMode();
        }

    } catch (error) {
        console.error('Error loading study data:', error);
        alert('Failed to load study data.');
    }
}

function initializeFlashcardMode() {
    document.getElementById('mode-title').textContent = 'Study Mode';
    document.getElementById('flashcard-mode').style.display = 'block';
    document.getElementById('quiz-mode').style.display = 'none';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('mistakes-screen').style.display = 'none';

    updateCardCounter();
    displayCurrentCard();
    updateProgressBar();
    updateButtonStates();
}

function initializeQuizMode(quizItems) {
    document.getElementById('mode-title').textContent = 'Quiz Mode';
    document.getElementById('flashcard-mode').style.display = 'none';
    document.getElementById('quiz-mode').style.display = 'block';
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('mistakes-screen').style.display = 'none';

    shuffleArray(studyCards);

    const numQuestions = Math.min(quizItems, studyCards.length);
    studyCards = studyCards.slice(0, numQuestions);
    totalQuestions = studyCards.length;
    userAnswers = []; // Reset user answers

    document.getElementById('total-questions').textContent = totalQuestions;

    displayQuestion();
    updateQuizProgress();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayCurrentCard() {
    if (studyCards.length === 0) return;

    const card = studyCards[currentCardIndex];
    const flashcard = document.getElementById('flashcard');

    flashcard.classList.remove('flipped');

    document.getElementById('question-text').textContent = card.question;
    document.getElementById('answer-text').textContent = card.answer;

    const choicesList = document.getElementById('choices-list');
    choicesList.innerHTML = card.choices.map(choice =>
        `<li>${choice}</li>`
    ).join('');
}

function displayQuestion() {
    if (currentQuestionIndex >= studyCards.length) {
        showResults();
        return;
    }

    const currentCard = studyCards[currentQuestionIndex];
    answered = false;

    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('quiz-question-text').textContent = currentCard.question;

    const shuffledChoices = [...currentCard.choices];
    shuffleArray(shuffledChoices);

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    shuffledChoices.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice;
        button.onclick = () => selectAnswer(choice, button);
        choicesContainer.appendChild(button);
    });

    // Hide the feedback message
    document.getElementById('answer-feedback').style.display = 'none';
    document.getElementById('next-question-btn').disabled = true;

    updateQuizProgress();
}

function selectAnswer(selectedChoice, buttonElement) {
    if (answered) return;

    answered = true;
    const currentCard = studyCards[currentQuestionIndex];
    const isCorrect = selectedChoice === currentCard.answer;

    // Store user answer for review
    userAnswers.push({
        question: currentCard.question,
        userChoice: selectedChoice,
        correctAnswer: currentCard.answer,
        isCorrect: isCorrect,
        choices: currentCard.choices,
        topic: currentCard.topic,
        topicName: currentCard.topicName
    });

    if (isCorrect) {
        score++;
    }

    const allButtons = document.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => {
        btn.classList.add('disabled');

        // Only show correct answer and mark incorrect if wrong choice was selected
        if (btn.textContent === currentCard.answer) {
            btn.classList.add('correct');
        }

        if (btn === buttonElement && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // REMOVED: The feedback message display
    document.getElementById('next-question-btn').disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex >= studyCards.length) {
        showResults();
    } else {
        displayQuestion();
    }
}

function updateQuizProgress() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
}

function showResults() {
    document.getElementById('quiz-mode').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';
    document.getElementById('mistakes-screen').style.display = 'none';

    document.getElementById('score').textContent = score;
    document.getElementById('total-score').textContent = totalQuestions;

    const percentage = Math.round((score / totalQuestions) * 100);
    document.getElementById('percentage').textContent = `${percentage}% Correct`;
}

function showMistakes() {
    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('mistakes-screen').style.display = 'block';

    // Add class to body to hide main scrollbar
    document.body.classList.add('mistakes-screen-active');

    const mistakesContainer = document.getElementById('mistakes-container');
    mistakesContainer.innerHTML = '';

    const wrongAnswers = userAnswers.filter(answer => !answer.isCorrect);

    if (wrongAnswers.length === 0) {
        mistakesContainer.innerHTML = `
            <div class="no-mistakes-message">
                <h3>🎉 Perfect Score!</h3>
                <p>You didn't make any mistakes. Great job!</p>
            </div>
        `;
        return;
    }

    wrongAnswers.forEach((answer, index) => {
        const mistakeCard = document.createElement('div');
        mistakeCard.className = 'mistake-card';
        mistakeCard.innerHTML = `
            <div class="mistake-header">
                <h4>Question ${index + 1}</h4>
                <span class="topic-badge">${answer.topicName}</span>
            </div>
            <div class="mistake-question">${answer.question}</div>
            <div class="mistake-answers">
                <div class="answer-row wrong-answer">
                    <span class="answer-label">Your answer:</span>
                    <span class="answer-text">${answer.userChoice}</span>
                </div>
                <div class="answer-row correct-answer">
                    <span class="answer-label">Correct answer:</span>
                    <span class="answer-text">${answer.correctAnswer}</span>
                </div>
            </div>
        `;
        mistakesContainer.appendChild(mistakeCard);
    });
}

function backToResults() {
    document.getElementById('mistakes-screen').style.display = 'none';
    document.getElementById('results-screen').style.display = 'block';

    // Remove class from body to restore main scrollbar
    document.body.classList.remove('mistakes-screen-active');
}

function retryQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answered = false;
    userAnswers = [];

    shuffleArray(studyCards);

    document.getElementById('results-screen').style.display = 'none';
    document.getElementById('mistakes-screen').style.display = 'none';
    document.getElementById('quiz-mode').style.display = 'block';

    displayQuestion();
    updateQuizProgress();
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
}

function nextCard() {
    if (currentCardIndex < studyCards.length - 1) {
        currentCardIndex++;
        displayCurrentCard();
        updateCardCounter();
        updateProgressBar();
        updateButtonStates();
    }
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        displayCurrentCard();
        updateCardCounter();
        updateProgressBar();
        updateButtonStates();
    }
}

function shuffleCards() {
    for (let i = studyCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [studyCards[i], studyCards[j]] = [studyCards[j], studyCards[i]];
    }

    isShuffled = true;
    currentCardIndex = 0;
    displayCurrentCard();
    updateCardCounter();
    updateProgressBar();
    updateButtonStates();

    const shuffleBtn = document.querySelector('.btn-shuffle');
    shuffleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        shuffleBtn.style.transform = '';
    }, 150);
}

function updateCardCounter() {
    document.getElementById('current-card').textContent = currentCardIndex + 1;
    document.getElementById('total-cards').textContent = studyCards.length;
}

function updateProgressBar() {
    const progress = ((currentCardIndex + 1) / studyCards.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

function updateButtonStates() {
    document.getElementById('prev-btn').disabled = currentCardIndex === 0;
    document.getElementById('next-btn').disabled = currentCardIndex === studyCards.length - 1;
}

document.addEventListener('keydown', function(event) {
    if (isQuizMode) return;

    if (event.key === 'ArrowLeft') {
        previousCard();
    } else if (event.key === 'ArrowRight') {
        nextCard();
    } else if (event.key === ' ' || event.key === 'Enter') {
        flipCard();
    } else if (event.key === 's' || event.key === 'S') {
        shuffleCards();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadStudyData();
});
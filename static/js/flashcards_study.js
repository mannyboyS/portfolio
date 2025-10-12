let studyCards = [];
let currentCardIndex = 0;
let isShuffled = false;

// Load study data when the page loads
async function loadStudyData() {
    try {
        // Get selected topics from sessionStorage
        const selectedTopics = JSON.parse(sessionStorage.getItem('studyTopics') || '[]');

        if (selectedTopics.length === 0) {
            // If no topics selected, redirect back
            window.location.href = '/pipe-flashcards';
            return;
        }

        // Load all flashcards data
        const response = await fetch('/get-flashcards-data');
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Filter cards based on selected topics
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
                        topic: topicKey
                    });
                }
            }
        });

        if (studyCards.length === 0) {
            document.querySelector('.flashcard-container').innerHTML =
                '<div class="error-message">No cards found for selected topics.</div>';
            return;
        }

        // Initialize the study session
        initializeStudySession();

    } catch (error) {
        console.error('Error loading study data:', error);
        document.querySelector('.flashcard-container').innerHTML =
            '<div class="error-message">Failed to load study data.</div>';
    }
}

function initializeStudySession() {
    updateCardCounter();
    displayCurrentCard();
    updateProgressBar();
    updateButtonStates();
}

function displayCurrentCard() {
    if (studyCards.length === 0) return;

    const card = studyCards[currentCardIndex];
    const flashcard = document.getElementById('flashcard');

    // Reset card to front
    flashcard.classList.remove('flipped');

    // Update question and choices
    document.getElementById('question-text').textContent = card.question;
    document.getElementById('answer-text').textContent = card.answer;

    const choicesList = document.getElementById('choices-list');
    choicesList.innerHTML = card.choices.map(choice =>
        `<li>${choice}</li>`
    ).join('');
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
    // Fisher-Yates shuffle algorithm
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

    // Visual feedback for shuffle
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

// Keyboard navigation
document.addEventListener('keydown', function(event) {
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStudyData();
});
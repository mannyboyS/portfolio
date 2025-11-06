let flashcardsData = [];
let filteredFlashcardsData = [];
let topics = [];
const CARDS_PER_PAGE = 30;
let currentPage = 1;
let flippedCards = new Set();
let currentTopic = 'all';
let selectedStudyTopics = [];

// Modern Modal Variables
let selectedMode = 'flashcard';
let allTopicsSelected = false;
let isMaxQuestionsEnabled = false; // NEW: Track if max toggle is active

// Load data from JSON file via Flask route
async function loadFlashcardsData() {
    try {
        const response = await fetch('/get-flashcards-data');
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Process the JSON data into our flashcards format
        flashcardsData = [];
        topics = [];
        let globalQuestionNumber = 1;

        // DYNAMIC TOPIC LOADING - Remove hardcoded topic order
        Object.keys(data).forEach(topicKey => {
            const topicData = data[topicKey];
            if (topicData && topicData.questions) {
                const topicName = topicData.category || formatTopicName(topicKey);
                const topicId = topicData.id || topicKey;
                topics.push({
                    key: topicKey,
                    name: topicName,
                    id: topicId
                });

                for (const [questionId, questionData] of Object.entries(topicData.questions)) {
                    flashcardsData.push({
                        number: globalQuestionNumber,
                        originalNumber: parseInt(questionId),
                        question: questionData.question,
                        choices: questionData.choices,
                        answer: questionData.answer,
                        topic: topicKey,
                        topicId: topicId
                    });
                    globalQuestionNumber++;
                }
            }
        });

        topics.sort((a, b) => a.id.localeCompare(b.id));
        filteredFlashcardsData = [...flashcardsData];
        populateTopicDropdown();
        renderFlashcards();

    } catch (error) {
        console.error('Error loading flashcards data:', error);
        document.getElementById('flashcards-container').innerHTML =
            '<div class="error-message">Failed to load flashcards data. Please try again later.</div>';
    }
}

function formatTopicName(topicKey) {
    return topicKey
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function populateTopicDropdown() {
    const topicSelect = document.getElementById('topicSelect');

    while (topicSelect.children.length > 1) {
        topicSelect.removeChild(topicSelect.lastChild);
    }

    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.key;
        option.textContent = topic.name;
        topicSelect.appendChild(option);
    });
}

// Modern Modal Functions
function openStudyModal() {
    const modal = document.getElementById('studyModal');
    modal.style.display = 'block';
    populateStudyTopicsChecklist();

    // Reset max toggle state
    isMaxQuestionsEnabled = false;
    const toggleBtn = document.getElementById('toggle-max-btn');
    if (toggleBtn) {
        toggleBtn.classList.remove('active');
    }

    const validationMessage = document.getElementById('quiz-validation-message');
    validationMessage.innerHTML = '<span style="color: white;">0 cards selected</span>';
    validationMessage.style.display = 'block';

    selectMode('flashcard');

    const topicItems = document.querySelectorAll('.topic-item');
    topicItems.forEach(item => {
        item.classList.remove('selected');
    });
    updateSelectAllButton();
}

function closeStudyModal() {
    const modal = document.getElementById('studyModal');
    modal.style.display = 'none';
}

function selectMode(mode) {
    selectedMode = mode;

    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.mode-card[data-mode="${mode}"]`).classList.add('active');
}

function adjustQuizItems(change) {
    if (isMaxQuestionsEnabled) return; // Don't adjust if max is enabled

    const input = document.getElementById('quiz-items');
    let value = parseInt(input.value) || 10;
    value = Math.max(1, value + change);
    input.value = value;
    validateQuizSettings();
}

// NEW: Toggle max questions function
function toggleMaxQuestions() {
    isMaxQuestionsEnabled = !isMaxQuestionsEnabled;

    const toggleBtn = document.getElementById('toggle-max-btn');
    const input = document.getElementById('quiz-items');
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');

    if (isMaxQuestionsEnabled) {
        // Enable max mode
        toggleBtn.classList.add('active');
        input.disabled = true;
        minusBtn.disabled = true;
        plusBtn.disabled = true;

        // Set to max available questions
        updateMaxQuestions();
    } else {
        // Disable max mode
        toggleBtn.classList.remove('active');
        input.disabled = false;
        minusBtn.disabled = false;
        plusBtn.disabled = false;
    }

    validateQuizSettings();
}

// NEW: Update the number to max available
function updateMaxQuestions() {
    const selectedTopicItems = document.querySelectorAll('.topic-item.selected');
    const selectedTopics = Array.from(selectedTopicItems).map(item => item.getAttribute('data-topic'));

    if (selectedTopics.length > 0) {
        const maxAvailable = getTotalFlashcardsFromSelectedTopics(selectedTopics);
        const input = document.getElementById('quiz-items');
        input.value = maxAvailable;
    }
}

function populateStudyTopicsChecklist() {
    const checklist = document.getElementById('topicsChecklist');
    checklist.innerHTML = '';

    topics.forEach(topic => {
        const flashcardCount = flashcardsData.filter(card => card.topic === topic.key).length;

        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.setAttribute('data-topic', topic.key);
        topicItem.onclick = function() { toggleTopicModern(this); };

        topicItem.innerHTML = `
            <div class="topic-name">${topic.name}</div>
            <div class="topic-count">${flashcardCount} flashcards</div>
            <div class="topic-check">✓</div>
        `;

        checklist.appendChild(topicItem);
    });

    updateSelectAllButton();
}

function toggleTopicModern(topicElement) {
    topicElement.classList.toggle('selected');

    // Update max questions if toggle is active
    if (isMaxQuestionsEnabled) {
        updateMaxQuestions();
    }

    validateQuizSettings();
    updateSelectAllButton();
}

function toggleAllTopicsModern() {
    const topicItems = document.querySelectorAll('.topic-item');
    allTopicsSelected = !allTopicsSelected;

    topicItems.forEach(item => {
        if (allTopicsSelected) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });

    // Update max questions if toggle is active
    if (isMaxQuestionsEnabled) {
        updateMaxQuestions();
    }

    updateSelectAllButton();
    validateQuizSettings();
}

function updateSelectAllButton() {
    const topicItems = document.querySelectorAll('.topic-item');
    const selectedCount = document.querySelectorAll('.topic-item.selected').length;
    const totalCount = topicItems.length;
    const selectAllBtn = document.querySelector('.select-all-btn');

    if (selectedCount === totalCount) {
        selectAllBtn.classList.add('all-selected');
        selectAllBtn.querySelector('.btn-text').textContent = 'Deselect All';
        allTopicsSelected = true;
    } else if (selectedCount > 0) {
        selectAllBtn.classList.remove('all-selected');
        selectAllBtn.querySelector('.btn-text').textContent = 'Select All';
        allTopicsSelected = false;
    } else {
        selectAllBtn.classList.remove('all-selected');
        selectAllBtn.querySelector('.btn-text').textContent = 'Select All';
        allTopicsSelected = false;
    }
}

function getTotalFlashcardsFromSelectedTopics(selectedTopics) {
    let totalFlashcards = 0;
    selectedTopics.forEach(topicKey => {
        const topicFlashcards = flashcardsData.filter(card => card.topic === topicKey);
        totalFlashcards += topicFlashcards.length;
    });
    return totalFlashcards;
}

function validateQuizSettings() {
    const validationMessage = document.getElementById('quiz-validation-message');

    const selectedTopicItems = document.querySelectorAll('.topic-item.selected');
    const selectedTopics = Array.from(selectedTopicItems).map(item => item.getAttribute('data-topic'));

    if (selectedTopics.length === 0) {
        validationMessage.innerHTML = '<span style="color: #ff6b6b;">Please select at least one topic</span>';
        return false;
    }

    const totalAvailableFlashcards = getTotalFlashcardsFromSelectedTopics(selectedTopics);
    const requestedFlashcards = parseInt(document.getElementById('quiz-items').value) || 10;

    if (isMaxQuestionsEnabled) {
        // When max is enabled, show that we're using all available
        validationMessage.innerHTML = `<span style="color: #51cf66;">Using all ${totalAvailableFlashcards} cards from ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''}</span>`;
        return true;
    }

    if (requestedFlashcards > totalAvailableFlashcards) {
        validationMessage.innerHTML = `<span style="color: #ff6b6b;">Not enough flashcards! Selected topics only have ${totalAvailableFlashcards} flashcards.</span>`;
        return false;
    } else {
        validationMessage.innerHTML = `<span style="color: #51cf66;">${totalAvailableFlashcards} cards available from ${selectedTopics.length} topic${selectedTopics.length > 1 ? 's' : ''}</span>`;
        return true;
    }
}

function startStudySession() {
    const selectedTopicItems = document.querySelectorAll('.topic-item.selected');
    selectedStudyTopics = Array.from(selectedTopicItems).map(item => item.getAttribute('data-topic'));

    if (selectedStudyTopics.length === 0) {
        alert('Please select at least one topic to study.');
        return;
    }

    if (!validateQuizSettings()) {
        return;
    }

    sessionStorage.setItem('studyTopics', JSON.stringify(selectedStudyTopics));

    const studyItems = parseInt(document.getElementById('quiz-items').value) || 10;

    sessionStorage.setItem('studyItems', studyItems);
    sessionStorage.setItem('quizItems', studyItems);
    sessionStorage.setItem('studyMode', selectedMode);

    window.location.href = '/pipe-flashcards-study';
}

window.onclick = function(event) {
    const modal = document.getElementById('studyModal');
    if (event.target === modal) {
        closeStudyModal();
    }
}

function filterByTopic(topic) {
    currentTopic = topic;
    currentPage = 1;

    if (topic === 'all') {
        filteredFlashcardsData = [...flashcardsData];
    } else {
        const topicQuestions = flashcardsData.filter(card => card.topic === topic);
        filteredFlashcardsData = topicQuestions.map((card, index) => ({
            ...card,
            number: index + 1
        }));
    }

    flippedCards.clear();
    renderFlashcards();
}

function getTotalPages() {
    return Math.ceil(filteredFlashcardsData.length / CARDS_PER_PAGE);
}

function getCurrentPageCards() {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return filteredFlashcardsData.slice(startIndex, endIndex);
}

function createFlashcard(data, globalIndex) {
    const choicesList = data.choices.map(choice => `<li>${choice}</li>`).join('');

    return `
        <div class="flashcard" onclick="flipCard(${globalIndex})">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div class="card-content">
                        <div class="question-number">Question ${data.number}</div>
                        <div class="question-text">${data.question}</div>
                        <ul class="choices">
                            ${choicesList}
                        </ul>
                    </div>
                </div>
                <div class="flashcard-back">
                    <div class="card-content">
                        <div class="answer">${data.answer}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderFlashcards() {
    const pageCards = getCurrentPageCards();
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

    const container = document.getElementById('flashcards-container');

    if (pageCards.length === 0) {
        container.innerHTML = '<div class="no-cards-message">No flashcards found for the selected topic.</div>';
    } else {
        container.innerHTML = pageCards
            .map((card, localIndex) => createFlashcard(card, startIndex + localIndex))
            .join('');
    }

    updatePagination();
    updateStats();
}

function updatePagination() {
    const totalPages = getTotalPages();
    document.getElementById('page-cards').textContent = getCurrentPageCards().length;

    const prevBtnTop = document.getElementById('prev-page-btn-top');
    const nextBtnTop = document.getElementById('next-page-btn-top');
    const firstBtnTop = document.getElementById('first-btn-top');
    const lastBtnTop = document.getElementById('last-btn-top');

    if (prevBtnTop) {
        prevBtnTop.disabled = currentPage === 1;
        prevBtnTop.classList.toggle('disabled', currentPage === 1);
    }

    if (nextBtnTop) {
        nextBtnTop.disabled = currentPage === totalPages;
        nextBtnTop.classList.toggle('disabled', currentPage === totalPages);
    }

    if (firstBtnTop) {
        firstBtnTop.disabled = currentPage === 1;
        firstBtnTop.classList.toggle('disabled', currentPage === 1);
    }

    if (lastBtnTop) {
        lastBtnTop.disabled = currentPage === totalPages;
        lastBtnTop.classList.toggle('disabled', currentPage === totalPages);
    }

    const prevBtnBottom = document.getElementById('prev-page-btn-bottom');
    const nextBtnBottom = document.getElementById('next-page-btn-bottom');
    const firstBtnBottom = document.getElementById('first-btn-bottom');
    const lastBtnBottom = document.getElementById('last-btn-bottom');

    if (prevBtnBottom) {
        prevBtnBottom.disabled = currentPage === 1;
        prevBtnBottom.classList.toggle('disabled', currentPage === 1);
    }

    if (nextBtnBottom) {
        nextBtnBottom.disabled = currentPage === totalPages;
        nextBtnBottom.classList.toggle('disabled', currentPage === totalPages);
    }

    if (firstBtnBottom) {
        firstBtnBottom.disabled = currentPage === 1;
        firstBtnBottom.classList.toggle('disabled', currentPage === 1);
    }

    if (lastBtnBottom) {
        lastBtnBottom.disabled = currentPage === totalPages;
        lastBtnBottom.classList.toggle('disabled', currentPage === totalPages);
    }

    generatePageNumbers(totalPages, 'page-numbers-top');
    generatePageNumbers(totalPages, 'page-numbers-bottom');
}

function generatePageNumbers(totalPages, containerId) {
    const pageNumbersContainer = document.getElementById(containerId);
    if (!pageNumbersContainer) return;

    let maxVisible;
    if (window.innerWidth < 480) {
        maxVisible = 3;
    } else if (window.innerWidth < 768) {
        maxVisible = 5;
    } else {
        maxVisible = 7;
    }

    let pages = [];

    if (totalPages <= maxVisible) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        pages.push(1);

        let startPage, endPage;

        if (currentPage <= Math.floor(maxVisible / 2) + 1) {
            startPage = 2;
            endPage = maxVisible - 1;
        } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
            startPage = totalPages - maxVisible + 2;
            endPage = totalPages - 1;
        } else {
            startPage = currentPage - Math.floor((maxVisible - 2) / 2);
            endPage = currentPage + Math.floor((maxVisible - 2) / 2);
        }

        if (startPage > 2) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        pages.push(totalPages);
    }

    pageNumbersContainer.innerHTML = pages.map(page => {
        if (page === '...') {
            return '<span class="page-number ellipsis">...</span>';
        }

        const isActive = page === currentPage;
        const activeClass = isActive ? 'active' : '';

        let mobileClass = '';
        if (window.innerWidth < 480) {
            if (page !== 1 && page !== totalPages && page !== currentPage) {
                mobileClass = 'mobile-hidden-sm';
            }
        } else if (window.innerWidth < 768) {
            if (page !== 1 && page !== totalPages &&
                Math.abs(page - currentPage) > 1) {
                mobileClass = 'mobile-hidden';
            }
        }

        return `<button class="page-number ${activeClass} ${mobileClass}" onclick="goToPage(${page})">${page}</button>`;
    }).join('');
}

function goToPage(pageNumber) {
    const totalPages = getTotalPages();
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        renderFlashcards();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function flipCard(globalIndex) {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const localIndex = globalIndex - startIndex;
    const card = document.querySelectorAll('.flashcard')[localIndex];

    if (!card) return;

    card.classList.toggle('flipped');

    if (card.classList.contains('flipped')) {
        flippedCards.add(globalIndex);
    } else {
        flippedCards.delete(globalIndex);
    }

    updateStats();
}

function flipAll() {
    const cards = document.querySelectorAll('.flashcard');
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

    cards.forEach((card, localIndex) => {
        const globalIndex = startIndex + localIndex;
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
            flippedCards.add(globalIndex);
        }
    });
    updateStats();
}

function resetAll() {
    const cards = document.querySelectorAll('.flashcard');
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;

    cards.forEach((card, localIndex) => {
        const globalIndex = startIndex + localIndex;
        card.classList.remove('flipped');
        flippedCards.delete(globalIndex);
    });
    updateStats();
}

function updateStats() {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + getCurrentPageCards().length;

    let pageFlippedCount = 0;
    for (let i = startIndex; i < endIndex; i++) {
        if (flippedCards.has(i)) {
            pageFlippedCount++;
        }
    }

    document.getElementById('flipped-count').textContent = pageFlippedCount;
}

function nextPage() {
    const totalPages = getTotalPages();
    if (currentPage < totalPages) {
        currentPage++;
        renderFlashcards();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderFlashcards();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function firstPage() {
    currentPage = 1;
    renderFlashcards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function lastPage() {
    currentPage = getTotalPages();
    renderFlashcards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('resize', function() {
    const totalPages = getTotalPages();
    generatePageNumbers(totalPages, 'page-numbers-top');
    generatePageNumbers(totalPages, 'page-numbers-bottom');
});

document.addEventListener('DOMContentLoaded', function() {
    const quizItemsInput = document.getElementById('quiz-items');
    if (quizItemsInput) {
        quizItemsInput.addEventListener('input', function() {
            if (!isMaxQuestionsEnabled) {
                validateQuizSettings();
            }
        });
        quizItemsInput.addEventListener('change', function() {
            if (!isMaxQuestionsEnabled) {
                validateQuizSettings();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadFlashcardsData();
});
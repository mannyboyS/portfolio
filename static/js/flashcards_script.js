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

        // Define the exact topic order from JSON
        const topicOrder = [
            'diesel_plant',
            'gas_turbine',
            'steam_power_plant',
            'geothermal_plant',
            'nuclear_plant',
            'boilers',
            'hydroelectric_plant',
            'variable_load_environmental_eng',
            'fluid_mechanics',
            'fluid_machinery',
            'heat_transfer',
            'refrigeration',
            'air_conditioning',
            'machine_foundation_and_chimney',
            'instrumentation',
            'basic_electrical_engineering',
            'latest_board_question'
        ];

        // Process topics in the defined order
        topicOrder.forEach(topicKey => {
            const topicData = data[topicKey];
            if (topicData) {
                const topicName = topicData.category || topicKey;
                topics.push({ key: topicKey, name: topicName });

                // Convert questions to our format with sequential numbering
                for (const [questionId, questionData] of Object.entries(topicData.questions)) {
                    flashcardsData.push({
                        number: globalQuestionNumber, // Use sequential numbering
                        originalNumber: parseInt(questionId), // Keep original for reference
                        question: questionData.question,
                        choices: questionData.choices,
                        answer: questionData.answer,
                        topic: topicKey
                    });
                    globalQuestionNumber++;
                }
            }
        });

        // Initialize with all data
        filteredFlashcardsData = [...flashcardsData];

        // Populate topic dropdown
        populateTopicDropdown();

        // Render the flashcards
        renderFlashcards();

    } catch (error) {
        console.error('Error loading flashcards data:', error);
        document.getElementById('flashcards-container').innerHTML =
            '<div class="error-message">Failed to load flashcards data. Please try again later.</div>';
    }
}

function populateTopicDropdown() {
    const topicSelect = document.getElementById('topicSelect');

    // Clear existing options except "All Topics"
    while (topicSelect.children.length > 1) {
        topicSelect.removeChild(topicSelect.lastChild);
    }

    // Define the exact order from your JSON
    const topicOrder = [
        'diesel_plant',
        'gas_turbine',
        'steam_power_plant',
        'geothermal_plant',
        'nuclear_plant',
        'boilers',
        'hydroelectric_plant',
        'variable_load_environmental_eng',
        'fluid_mechanics',
        'fluid_machinery',
        'heat_transfer',
        'refrigeration',
        'air_conditioning',
        'machine_foundation_and_chimney',
        'instrumentation',
        'basic_electrical_engineering',
        'latest_board_question'
    ];

    // Add topics in the exact JSON order
    topicOrder.forEach(topicKey => {
        const topic = topics.find(t => t.key === topicKey);
        if (topic) {
            const option = document.createElement('option');
            option.value = topic.key;
            option.textContent = topic.name;
            topicSelect.appendChild(option);
        }
    });
}

// Modern Modal Functions
function openStudyModal() {
    const modal = document.getElementById('studyModal');
    modal.style.display = 'block';
    populateStudyTopicsChecklist();

    // Show "0 cards selected" in white text initially
    const validationMessage = document.getElementById('quiz-validation-message');
    validationMessage.innerHTML = '<span style="color: white;">0 cards selected</span>';
    validationMessage.style.display = 'block';

    // Reset to default mode - NO auto-select
    selectMode('flashcard');

    // Clear all selections by default
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

    // Update mode cards
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`.mode-card[data-mode="${mode}"]`).classList.add('active');
}

function adjustQuizItems(change) {
    const input = document.getElementById('quiz-items');
    let value = parseInt(input.value) || 10;
    value = Math.max(1, value + change);
    input.value = value;
    validateQuizSettings();
}

function populateStudyTopicsChecklist() {
    const checklist = document.getElementById('topicsChecklist');
    checklist.innerHTML = '';

    topics.forEach(topic => {
        // Count flashcards for this topic
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

// Function to count total available flashcards from selected topics
function getTotalFlashcardsFromSelectedTopics(selectedTopics) {
    let totalFlashcards = 0;
    selectedTopics.forEach(topicKey => {
        const topicFlashcards = flashcardsData.filter(card => card.topic === topicKey);
        totalFlashcards += topicFlashcards.length;
    });
    return totalFlashcards;
}

// Function to validate quiz settings
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

    // Validate settings before proceeding
    if (!validateQuizSettings()) {
        return;
    }

    // Store selected topics in sessionStorage
    sessionStorage.setItem('studyTopics', JSON.stringify(selectedStudyTopics));

    // Get number of flashcards/quiz items
    const studyItems = parseInt(document.getElementById('quiz-items').value) || 10;

    // FIXED: Changed from 'studyItems' to 'quizItems' to match flashcards_study.js
    sessionStorage.setItem('quizItems', studyItems);

    // Store mode
    sessionStorage.setItem('studyMode', selectedMode);

    // Redirect to study mode
    window.location.href = '/pipe-flashcards-study';
}

// Close modal when clicking outside
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
        // For individual topics, renumber starting from 1
        const topicQuestions = flashcardsData.filter(card => card.topic === topic);
        filteredFlashcardsData = topicQuestions.map((card, index) => ({
            ...card,
            number: index + 1 // Renumber within topic
        }));
    }

    // Reset flipped cards when changing topic
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

    // Update button states for TOP pagination
    const prevBtnTop = document.getElementById('prev-page-btn-top');
    const nextBtnTop = document.getElementById('next-page-btn-top');
    const firstBtnTop = document.getElementById('first-btn-top');
    const lastBtnTop = document.getElementById('last-btn-top');

    if (prevBtnTop) {
        prevBtnTop.disabled = currentPage === 1;
        if (currentPage === 1) {
            prevBtnTop.classList.add('disabled');
        } else {
            prevBtnTop.classList.remove('disabled');
        }
    }

    if (nextBtnTop) {
        nextBtnTop.disabled = currentPage === totalPages;
        if (currentPage === totalPages) {
            nextBtnTop.classList.add('disabled');
        } else {
            nextBtnTop.classList.remove('disabled');
        }
    }

    if (firstBtnTop) {
        firstBtnTop.disabled = currentPage === 1;
        if (currentPage === 1) {
            firstBtnTop.classList.add('disabled');
        } else {
            firstBtnTop.classList.remove('disabled');
        }
    }

    if (lastBtnTop) {
        lastBtnTop.disabled = currentPage === totalPages;
        if (currentPage === totalPages) {
            lastBtnTop.classList.add('disabled');
        } else {
            lastBtnTop.classList.remove('disabled');
        }
    }

    // Update button states for BOTTOM pagination
    const prevBtnBottom = document.getElementById('prev-page-btn-bottom');
    const nextBtnBottom = document.getElementById('next-page-btn-bottom');
    const firstBtnBottom = document.getElementById('first-btn-bottom');
    const lastBtnBottom = document.getElementById('last-btn-bottom');

    if (prevBtnBottom) {
        prevBtnBottom.disabled = currentPage === 1;
        if (currentPage === 1) {
            prevBtnBottom.classList.add('disabled');
        } else {
            prevBtnBottom.classList.remove('disabled');
        }
    }

    if (nextBtnBottom) {
        nextBtnBottom.disabled = currentPage === totalPages;
        if (currentPage === totalPages) {
            nextBtnBottom.classList.add('disabled');
        } else {
            nextBtnBottom.classList.remove('disabled');
        }
    }

    if (firstBtnBottom) {
        firstBtnBottom.disabled = currentPage === 1;
        if (currentPage === 1) {
            firstBtnBottom.classList.add('disabled');
        } else {
            firstBtnBottom.classList.remove('disabled');
        }
    }

    if (lastBtnBottom) {
        lastBtnBottom.disabled = currentPage === totalPages;
        if (currentPage === totalPages) {
            lastBtnBottom.classList.add('disabled');
        } else {
            lastBtnBottom.classList.remove('disabled');
        }
    }

    // Generate page numbers for both top and bottom
    generatePageNumbers(totalPages, 'page-numbers-top');
    generatePageNumbers(totalPages, 'page-numbers-bottom');
}

function generatePageNumbers(totalPages, containerId) {
    const pageNumbersContainer = document.getElementById(containerId);
    if (!pageNumbersContainer) return;

    // Determine max visible pages based on screen size
    let maxVisible;
    if (window.innerWidth < 480) {
        maxVisible = 3; // Very small screens: show only 3 numbers
    } else if (window.innerWidth < 768) {
        maxVisible = 5; // Small screens: show 5 numbers
    } else {
        maxVisible = 7; // Larger screens: show 7 numbers
    }

    let pages = [];

    if (totalPages <= maxVisible) {
        // Show all pages if total is less than max visible
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        // Always show first page
        pages.push(1);

        let startPage, endPage;

        if (currentPage <= Math.floor(maxVisible / 2) + 1) {
            // Near the beginning
            startPage = 2;
            endPage = maxVisible - 1;
        } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
            // Near the end
            startPage = totalPages - maxVisible + 2;
            endPage = totalPages - 1;
        } else {
            // In the middle
            startPage = currentPage - Math.floor((maxVisible - 2) / 2);
            endPage = currentPage + Math.floor((maxVisible - 2) / 2);
        }

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);
    }

    pageNumbersContainer.innerHTML = pages.map(page => {
        if (page === '...') {
            return '<span class="page-number ellipsis">...</span>';
        }

        const isActive = page === currentPage;
        const activeClass = isActive ? 'active' : '';

        // Add mobile classes for responsive hiding - ALL elements stay in same row
        let mobileClass = '';
        if (window.innerWidth < 480) {
            // On very small screens, only show first, current, and last pages
            if (page !== 1 && page !== totalPages && page !== currentPage) {
                mobileClass = 'mobile-hidden-sm';
            }
        } else if (window.innerWidth < 768) {
            // On small screens, hide some middle pages
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

// Add resize listener to regenerate pagination on screen size change
window.addEventListener('resize', function() {
    const totalPages = getTotalPages();
    generatePageNumbers(totalPages, 'page-numbers-top');
    generatePageNumbers(totalPages, 'page-numbers-bottom');
});

// Add event listener for quiz items input change
document.addEventListener('DOMContentLoaded', function() {
    // This will run after the modal content is available
    const quizItemsInput = document.getElementById('quiz-items');
    if (quizItemsInput) {
        quizItemsInput.addEventListener('input', validateQuizSettings);
        quizItemsInput.addEventListener('change', validateQuizSettings);
    }
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadFlashcardsData();
});
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavIcon = mobileNavToggle.querySelector('i');
    const header = document.getElementById('header');
    const body = document.body;

    function toggleMobileNav() {
        header.classList.toggle('mobile-nav-active');
        body.classList.toggle('mobile-nav-active');

        if (header.classList.contains('mobile-nav-active')) {
            mobileNavIcon.classList.remove('bi-list');
            mobileNavIcon.classList.add('bi-x');
        } else {
            mobileNavIcon.classList.remove('bi-x');
            mobileNavIcon.classList.add('bi-list');
        }
    }

    mobileNavToggle.addEventListener('click', toggleMobileNav);

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let isScrolling = false;

    function updateActiveNavLink() {
        if (isScrolling) return;
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            isScrolling = true;

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop;
                const adjustment = targetId === 'hero' ? 0 : 100;

                window.scrollTo({
                    top: offsetTop - adjustment,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }

            if (header.classList.contains('mobile-nav-active')) {
                toggleMobileNav();
            }
        });
    });

    updateActiveNavLink();

    document.addEventListener('click', function(e) {
        if (body.classList.contains('mobile-nav-active') &&
            !e.target.closest('#header') &&
            !e.target.closest('.mobile-nav-toggle')) {
            toggleMobileNav();
        }
    });

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        if (typeof Waypoint !== 'undefined') {
            new Waypoint({
                element: skillsSection,
                handler: function() {
                    animateSkills();
                },
                offset: '80%'
            });
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkills();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.8
            });

            observer.observe(skillsSection);
        }
    }

    function animateSkills() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }

    const portfolioItems = document.querySelectorAll('.portfolio-wrap');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.style.opacity = '1';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.querySelector('.btn-text');
    const btnSpinner = document.querySelector('.btn-spinner');
    const formMessages = document.getElementById('form-messages');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnSpinner.style.display = 'inline';

        formMessages.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        const formData = new FormData(form);

        fetch('/send-mail', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok');
        })
        .then(data => {
            formMessages.style.display = 'block';
            successMessage.style.display = 'block';
            form.reset();
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                formMessages.style.display = 'none';
                successMessage.style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);

            formMessages.style.display = 'block';
            errorMessage.style.display = 'block';
            errorText.textContent = 'Failed to send message. Please try again or contact me directly.';

            setTimeout(() => {
                formMessages.style.display = 'none';
                errorMessage.style.display = 'none';
            }, 7000);
        })
        .finally(() => {
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnSpinner.style.display = 'none';
        });
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
        animation: slideDown 0.3s ease-out;
    }

    .alert-success {
        color: #155724;
        background-color: #d4edda;
        border-color: #c3e6cb;
    }

    .alert-danger {
        color: #721c24;
        background-color: #f8d7da;
        border-color: #f5c6cb;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const portfolioItems = document.querySelectorAll('.portfolio-wrap');

    const modalTitle = document.getElementById('modalTitle');
    const modalRole = document.getElementById('modalRole');
    const modalSummary = document.getElementById('modalSummary');
    const modalTools = document.getElementById('modalTools');
    const modalResult = document.getElementById('modalResult');
    const modalLearned = document.getElementById('modalLearned');
    const modalImages = document.getElementById('modalImages');

    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.getAttribute('data-project-id');
            openModal(projectId);
        });
    });

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(projectId) {
    const project = window.portfolioData.find(p => p.id == projectId);

    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    modalTitle.textContent = project.title;

    modalSummary.innerHTML = '';
    if (project.summary) {
        const paragraphs = project.summary.split('\n\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                const p = document.createElement('p');
                p.textContent = paragraph.trim();
                modalSummary.appendChild(p);
            }
        });
    }

    modalResult.innerHTML = '';
    if (project.result) {
        const paragraphs = project.result.split('\n\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                const p = document.createElement('p');
                p.textContent = paragraph.trim();
                modalResult.appendChild(p);
            }
        });
    }

    modalLearned.innerHTML = '';
    if (project.learnings) {
        const paragraphs = project.learnings.split('\n\n');
        paragraphs.forEach(paragraph => {
            if (paragraph.trim()) {
                const p = document.createElement('p');
                p.textContent = paragraph.trim();
                modalLearned.appendChild(p);
            }
        });
    }

    modalRole.innerHTML = '';
    if (project.roles && project.roles.length > 0) {
        project.roles.forEach(role => {
            const roleElement = document.createElement('span');
            roleElement.classList.add('modal-role-item');
            roleElement.textContent = role;
            modalRole.appendChild(roleElement);
        });
    } else {
        modalRole.textContent = 'No roles specified';
    }

    modalTools.innerHTML = '';
    if (project.tools_used && project.tools_used.length > 0) {
        project.tools_used.forEach(tool => {
            const toolElement = document.createElement('span');
            toolElement.classList.add('modal-tool-item');
            toolElement.textContent = tool;
            modalTools.appendChild(toolElement);
        });
    } else {
        modalTools.textContent = 'No tools specified';
    }

    modalImages.innerHTML = '';
    if (project.project_imgs && project.project_imgs.length > 0) {
        project.project_imgs.forEach((imgUrl, index) => {
            if (imgUrl.trim()) { // Only add non-empty URLs
                const img = document.createElement('img');
                img.src = imgUrl.trim();
                img.alt = `${project.title} - Image ${index + 1}`;
                img.className = 'modal-image';
                img.loading = 'lazy';
                img.onerror = function() {
                    this.style.display = 'none';
                };

                modalImages.appendChild(img);
            }
        });
    } else {
        modalImages.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No project images available</p>';
    }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

modalImages.innerHTML = '';
if (project.project_imgs && project.project_imgs.length > 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-images-wrapper';

    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'modal-images';

    const column1 = document.createElement('div');
    column1.className = 'modal-images-column';

    const column2 = document.createElement('div');
    column2.className = 'modal-images-column';

    imagesContainer.appendChild(column1);
    imagesContainer.appendChild(column2);
    wrapper.appendChild(imagesContainer);
    modalImages.appendChild(wrapper);

    project.project_imgs.forEach((imgUrl, index) => {
        if (imgUrl.trim()) {
            const img = document.createElement('img');
            img.src = imgUrl.trim();
            img.alt = `${project.title} - Image ${index + 1}`;
            img.className = 'modal-image';
            img.loading = 'lazy';

            img.onerror = function() {
                this.style.display = 'none';
            };

            if (index % 2 === 0) {
                column1.appendChild(img);
            } else {
                column2.appendChild(img);
            }
        }
    });
} else {
    modalImages.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No project images available</p>';
}
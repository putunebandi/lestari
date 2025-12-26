document.addEventListener('DOMContentLoaded', function () {
    const articlesUrl = 'data/articles.json';
    const eventsUrl = 'data/events.json';
    const donationsUrl = 'data/donasi.json';
    const itemsPerPage = 6;
    let allArticlesData = [];
    let allEventsData = [];

    const homeContainer = document.getElementById('home-articles-container');
    if (homeContainer) fetchHomeArticles(articlesUrl, homeContainer);

    const listArticlesContainer = document.getElementById('articles-list-container');
    if (listArticlesContainer) initArticlePagination(articlesUrl);

    const listEventsContainer = document.getElementById('events-list-container');
    if (listEventsContainer) initEventPagination(eventsUrl);

    const articleDetailContainer = document.getElementById('article-detail-container');
    if (articleDetailContainer) loadArticleDetail(articlesUrl);

    const eventDetailContainer = document.getElementById('event-detail-container');
    if (eventDetailContainer) loadEventDetail(eventsUrl);

    const leaderboardContainer = document.getElementById('leaderboard-list');
    if (leaderboardContainer) {
        fetchDonationData(donationsUrl);
        setupDonationForm();
    }

    async function fetchHomeArticles(url, container) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            data.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderArticles(data.slice(0, 3), container);
        } catch (error) {
            console.error(error);
        }
    }

    async function initArticlePagination(url) {
        try {
            const response = await fetch(url);
            allArticlesData = await response.json();
            allArticlesData.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderArticlesPage(1);

            const container = document.getElementById('articles-list-container');
            const paginationContainer = document.getElementById('pagination-container');
            setupSearch(allArticlesData, renderArticles, container, paginationContainer, 'article');
        } catch (error) {
            console.error(error);
        }
    }

    function renderArticlesPage(page) {
        const container = document.getElementById('articles-list-container');
        const paginationContainer = document.getElementById('pagination-container');
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = allArticlesData.slice(start, end);
        renderArticles(paginatedItems, container);
        renderPaginationControls(allArticlesData.length, page, paginationContainer, renderArticlesPage);
    }

    async function loadArticleDetail(url) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) return;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const article = data.find(item => item.id == id);
            if (article) {
                document.title = `${article.title} - Lestari`;
                document.getElementById('detail-title').innerText = article.title;
                document.getElementById('detail-author').innerText = article.author;
                document.getElementById('detail-date').innerText = formatDate(article.date);
                document.getElementById('detail-content').innerHTML = article.content;
                const badge = document.getElementById('detail-category');
                badge.innerText = article.category;
                badge.className = `badge ${getBadgeClass(article.category)} mb-3`;
                const img = document.getElementById('detail-image');
                img.src = article.image;
                img.style.display = 'block';
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function initEventPagination(url) {
        try {
            const response = await fetch(url);
            allEventsData = await response.json();
            allEventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderEventsPage(1);

            const container = document.getElementById('events-list-container');
            const paginationContainer = document.getElementById('pagination-container');
            setupSearch(allEventsData, renderEvents, container, paginationContainer, 'event');
        } catch (error) {
            console.error(error);
        }
    }

    function renderEventsPage(page) {
        const container = document.getElementById('events-list-container');
        const paginationContainer = document.getElementById('pagination-container');
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = allEventsData.slice(start, end);
        renderEvents(paginatedItems, container);
        renderPaginationControls(allEventsData.length, page, paginationContainer, renderEventsPage);
    }

    async function loadEventDetail(url) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const btnShare = document.getElementById('share-btn');
        if (btnShare) {
            btnShare.addEventListener('click', function () {
                navigator.clipboard.writeText(window.location.href);
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#fff',
                    color: '#333',
                    iconColor: '#2E7D32',
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                    customClass: {
                        popup: 'shadow-sm rounded-4'
                    }
                });
                Toast.fire({
                    icon: 'success',
                    title: 'Tautan berhasil disalin!'
                });
            });
        }
        if (!id) return;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const event = data.find(item => item.id == id);
            if (event) {
                document.title = `${event.title} - Lestari`;
                document.getElementById('event-title').innerText = event.title;
                document.getElementById('event-organizer').innerText = event.organizer;
                document.getElementById('event-category').innerText = event.category;
                document.getElementById('event-date').innerText = formatDate(event.date);
                document.getElementById('event-time').innerText = event.time;
                document.getElementById('event-location').innerText = event.location;
                document.getElementById('event-desc').innerText = event.description;
                document.getElementById('event-image').src = event.image;
                const btnRegister = document.getElementById('event-register-btn');
                if (btnRegister) {
                    btnRegister.href = event.link;
                    if (event.link !== '#') btnRegister.target = "_blank";
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function fetchDonationData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const sortedDonors = data.donors.sort((a, b) => b.amount - a.amount).slice(0, 10);
            const leaderboardList = document.getElementById('leaderboard-list');
            let leaderboardHTML = '';

            sortedDonors.forEach((donor, index) => {
                let badgeRank = '';
                if (index === 0) badgeRank = '<i class="bi bi-trophy-fill text-warning fs-5 me-3"></i>';
                else if (index === 1) badgeRank = '<i class="bi bi-award-fill text-secondary fs-5 me-3"></i>';
                else if (index === 2) badgeRank = '<i class="bi bi-award-fill text-danger fs-5 me-3"></i>';
                else badgeRank = `<span class="fw-bold me-3 text-muted ms-1" style="width: 24px; display:inline-block; text-align:center;">${index + 1}</span>`;

                let typeBadge = donor.type === 'Perusahaan' ? 'bg-primary' : (donor.type === 'Organisasi' ? 'bg-info text-dark' : 'bg-success');

                leaderboardHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center py-3">
                    <div class="d-flex align-items-center">
                        ${badgeRank}
                        <div>
                            <h6 class="fw-bold mb-0">${donor.name}</h6>
                            <span class="badge ${typeBadge} rounded-pill" style="font-size: 0.7rem;">${donor.type}</span>
                        </div>
                    </div>
                    <div class="fw-bold text-success">${formatRupiah(donor.amount)}</div>
                </div>
                `;
            });
            leaderboardList.innerHTML = leaderboardHTML;

            const reportBody = document.getElementById('report-table-body');
            let reportHTML = '';
            data.reports.forEach(item => {
                reportHTML += `
                <tr>
                    <td class="text-center">${item.no}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.description}</td>
                    <td class="text-end fw-bold">${formatRupiah(item.amount)}</td>
                    <td class="text-center">
                        <a href="${item.link}" class="btn btn-sm btn-outline-secondary"><i class="bi bi-file-earmark-text"></i> Cek</a>
                    </td>
                </tr>
                `;
            });
            reportBody.innerHTML = reportHTML;
        } catch (error) {
            console.error('Error loading donation data:', error);
        }
    }

    function setupDonationForm() {
        const form = document.getElementById('donation-form');
        const amountInput = document.getElementById('amount');
        const amountText = document.getElementById('amount-text');

        amountInput.addEventListener('input', function () {
            if (this.value < 20000) {
                amountText.classList.replace('text-success', 'text-danger');
                amountText.innerText = "Minimal donasi Rp 20.000 ya kak :)";
            } else {
                amountText.classList.replace('text-danger', 'text-success');
                amountText.innerText = "Nominal yang luar biasa!";
            }
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const amount = parseInt(amountInput.value);
            const donorName = document.getElementById('name').value;

            if (amount < 20000) {
                Swal.fire('Oops', 'Minimal donasi Rp 20.000 ya.', 'warning');
                return;
            }

            const orderID = `LST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;
            showSmartPaymentGateway(amount, orderID, donorName, form);
        });
    }

    function showSmartPaymentGateway(amount, orderID, donorName, form) {
        let timerInterval;
        const totalTime = 15 * 60;
        const randomQRData = generateRandomString(150);

        Swal.fire({
            title: 'Pembayaran Donasi',
            html: `
                <div class="payment-summary">
                    <div class="order-id">Order ID: <strong>${orderID}</strong></div>
                    <div class="payment-amount">${formatRupiah(amount)}</div>
                    <small class="text-muted">Metode: QRIS (Scan & Bayar)</small>
                </div>

                <div class="qris-container">
                    <div id="qris-loading" class="text-center text-muted py-4">
                        <div class="spinner-border text-success mb-3" style="width: 3rem; height: 3rem;" role="status"></div>
                        <p class="mb-0 small fw-bold">Menghasilkan Kode QRIS...</p>
                        <small>Mohon tunggu sebentar</small>
                    </div>

                    <img id="qris-image" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${randomQRData}" alt="QRIS" class="img-fluid rounded d-none shadow-sm">
                </div>

                <div class="payment-timer" id="countdown-timer">
                    <i class="bi bi-stopwatch"></i> Menunggu: 15:00
                </div>

                <p class="small text-muted mb-0">Otomatis mengecek status pembayaran...</p>
            `,
            showCancelButton: true,
            cancelButtonText: 'Batal',
            cancelButtonColor: '#6c757d',
            showConfirmButton: true,
            confirmButtonText: '<i class="bi bi-arrow-repeat"></i> Cek Status Pembayaran',
            confirmButtonColor: '#2E7D32',
            allowOutsideClick: false,
            didOpen: () => {
                const timerDisplay = Swal.getHtmlContainer().querySelector('#countdown-timer');
                let remainingTime = totalTime;

                timerInterval = setInterval(() => {
                    remainingTime--;
                    const minutes = Math.floor(remainingTime / 60);
                    const seconds = remainingTime % 60;
                    timerDisplay.innerHTML = `<i class="bi bi-stopwatch"></i> Menunggu: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                    if (remainingTime <= 0) {
                        clearInterval(timerInterval);
                        Swal.fire('Waktu Habis', 'Silakan ulangi donasi.', 'error');
                    }
                }, 1000);

                const qrisLoading = Swal.getHtmlContainer().querySelector('#qris-loading');
                const qrisImage = Swal.getHtmlContainer().querySelector('#qris-image');
                setTimeout(() => {
                    if (qrisLoading && qrisImage) {
                        qrisLoading.classList.add('d-none');
                        qrisImage.classList.remove('d-none');
                        qrisImage.classList.add('qris-fade-in');
                    }
                }, 2000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
            preConfirm: () => {
                return new Promise((resolve) => {
                    const btn = Swal.getConfirmButton();
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Mengecek...';
                    btn.disabled = true;
                    setTimeout(() => {
                        resolve(true);
                    }, 2000);
                });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pembayaran Berhasil!',
                    html: `
                        <p>Terima kasih <strong>${donorName}</strong>!</p>
                        <p class="text-muted small">Donasi sebesar <strong>${formatRupiah(amount)}</strong> telah kami terima.</p>
                        <hr>
                        <p class="small">Bukti transaksi telah dikirim ke email Anda.</p>
                    `,
                    confirmButtonText: 'Selesai',
                    confirmButtonColor: '#2E7D32'
                });
                form.reset();
            }
        });
    }

    function renderArticles(items, container) {
        let htmlContent = '';
        items.forEach(article => {
            let badgeClass = getBadgeClass(article.category);
            let displayDate = formatDate(article.date);
            htmlContent += `
            <div class="col-md-4 fade-in">
                <div class="card card-custom h-100">
                    <img src="${article.image}" class="card-img-top" alt="${article.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge ${badgeClass}">${article.category}</span>
                            <small class="text-muted" style="font-size: 0.8rem;">
                                <i class="bi bi-calendar3 me-1"></i> ${displayDate}
                            </small>
                        </div>
                        <h5 class="card-title mt-1 fw-bold">${article.title}</h5>
                        <p class="card-text text-muted small">${article.summary}</p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-4">
                        <a href="artikel-detail.html?id=${article.id}" class="text-success fw-bold text-decoration-none">
                            Baca Selengkapnya <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>`;
        });
        container.innerHTML = htmlContent;
    }

    function renderEvents(items, container) {
        let htmlContent = '';
        items.forEach(event => {
            let displayDate = formatDate(event.date);
            htmlContent += `
            <div class="col-md-4 fade-in">
                <div class="card card-custom h-100">
                    <div class="position-relative">
                        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
                        <div class="position-absolute top-0 end-0 m-2">
                            <span class="badge bg-light text-dark shadow-sm">${event.category}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${event.title}</h5>
                        <div class="d-flex align-items-center text-muted small mb-2 mt-3">
                            <i class="bi bi-calendar-event me-2 text-success"></i>
                            <span>${displayDate}</span>
                        </div>
                        <div class="d-flex align-items-center text-muted small mb-3">
                            <i class="bi bi-geo-alt me-2 text-success"></i>
                            <span>${event.location}</span>
                        </div>
                        <p class="card-text text-muted small border-top pt-3 text-truncate">${event.description}</p>
                    </div>
                    <div class="card-footer bg-white border-0 pb-4">
                         <a href="event-detail.html?id=${event.id}" class="btn btn-outline-success w-100 rounded-pill">
                            Detail Event
                        </a>
                    </div>
                </div>
            </div>`;
        });
        container.innerHTML = htmlContent;
    }

    function renderPaginationControls(totalItems, currentPage, container, onPageClick) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '';
        paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}"><i class="bi bi-chevron-left"></i></a></li>`;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        if (startPage > 1) {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link border-0">...</span></li>`;
        }
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link border-0">...</span></li>`;
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }
        paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}"><i class="bi bi-chevron-right"></i></a></li>`;
        container.innerHTML = paginationHTML;
        const pageLinks = container.querySelectorAll('a.page-link');
        pageLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const page = parseInt(this.getAttribute('data-page'));
                if (page > 0 && page <= totalPages && page !== currentPage) onPageClick(page);
            });
        });
    }

    function setupSearch(dataRaw, renderFunction, container, paginationContainer, type) {
        const searchInput = document.getElementById('search-input');
        const itemsPerPage = 6;

        if (!searchInput) return;

        let currentFilteredData = [];

        function renderSearchPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = currentFilteredData.slice(start, end);
            renderFunction(paginatedItems, container);
            renderPaginationControls(currentFilteredData.length, page, paginationContainer, renderSearchPage);
        }

        function restoreOriginalPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = dataRaw.slice(start, end);
            renderFunction(paginatedItems, container);
            renderPaginationControls(dataRaw.length, page, paginationContainer, restoreOriginalPage);
        }

        function performSearch() {
            const keyword = searchInput.value.toLowerCase().trim();

            if (!keyword) {
                restoreOriginalPage(1);
                return;
            }

            currentFilteredData = dataRaw.filter(item => {
                const title = item.title.toLowerCase();
                const category = item.category.toLowerCase();
                const content = type === 'article' ? item.summary.toLowerCase() : item.description.toLowerCase();
                return title.includes(keyword) || category.includes(keyword) || content.includes(keyword);
            });

            container.innerHTML = '';
            paginationContainer.innerHTML = '';

            if (currentFilteredData.length > 0) {
                renderSearchPage(1);
            } else {
                container.innerHTML = `
                    <div class="col-12 text-center py-5 fade-in">
                        <i class="bi bi-search text-muted display-4 mb-3 d-block"></i>
                        <h4 class="fw-bold text-muted">Oops, tidak ditemukan!</h4>
                        <p class="text-secondary">Tidak ada hasil untuk "<strong>${keyword}</strong>".</p>
                    </div>
                `;
            }
        }

        searchInput.addEventListener('input', performSearch);
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') e.preventDefault();
        });
    }

    function getBadgeClass(category) {
        if (category === 'Bencana') return 'bg-danger';
        if (category === 'Lingkungan') return 'bg-success';
        if (category === 'Sosial') return 'bg-warning text-dark';
        return 'bg-primary';
    }

    function formatDate(dateString) {
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date(dateString).toLocaleDateString('id-ID', options);
        }
        return dateString;
    }

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }

    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
});
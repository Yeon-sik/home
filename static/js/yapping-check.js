// 페이지 로드 시 bio 자동 표시
document.addEventListener('DOMContentLoaded', function() {
    const bio = document.querySelector('.bio');
    if (bio) bio.style.display = 'block';
    
    const allButtons = document.querySelectorAll('.category-btn');
    const koreaButtons = document.querySelectorAll('[data-category="korea-bonus"]');
    const liveEndButtons = document.querySelectorAll('[data-category="only-live"], [data-category="only-end"]');
    const yapsButtons = document.querySelectorAll('[data-category="0yaps"], [data-category="need-yaps"]');
    const ecoButtons = document.querySelectorAll('[data-category="eco"]');
    const payoutButtons = document.querySelectorAll('[data-category="monthly"], [data-category="weekly"]');
    
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            if (category === 'korea-bonus') {
                this.classList.toggle('active');
            }
            else if (category === 'monthly' || category === 'weekly') {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    payoutButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            }
            else if (category === 'only-live' || category === 'only-end') {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    liveEndButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            }
            else if (category === '0yaps' || category === 'need-yaps') {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    yapsButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            }
            else if (category === 'eco') {
                this.classList.toggle('active');
            }
            
            filterProjects();
        });
    });
    
    function filterProjects() {
        const projectItems = document.querySelectorAll('.project-item');
        const activeKoreaFilters = Array.from(koreaButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-category'));
        const activeLiveEndFilter = Array.from(liveEndButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        const activeYapsFilter = Array.from(yapsButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        const activeEcoFilters = Array.from(ecoButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-category'));
        const activePayoutFilter = Array.from(payoutButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        
        const hasAnyActiveFilter = activeKoreaFilters.length > 0 || activeLiveEndFilter || activeYapsFilter || activeEcoFilters.length > 0 || activePayoutFilter;
        
        projectItems.forEach(item => {
            if (item.classList.contains('coming-soon')) {
                item.style.display = 'flex';
                return;
            }
            
            if (!hasAnyActiveFilter) {
                item.style.display = 'flex';
                return;
            }
            
            const itemFilters = Array.from(item.querySelectorAll('[data-filter]'))
                .map(el => el.getAttribute('data-filter'));
            if (itemFilters.includes('none')) {
                item.style.display = 'none';
                return;
            }
            
            let shouldShow = true;
            
            if (activeKoreaFilters.length > 0) {
                const hasMatchingKoreaFilter = activeKoreaFilters.some(filter => 
                    itemFilters.includes(filter)
                );
                if (!hasMatchingKoreaFilter) {
                    shouldShow = false;
                }
            }
            
            if (activeLiveEndFilter && shouldShow) {
                if (activeLiveEndFilter === 'only-live') {
                    const hasLiveStatus = item.querySelector('.status-live');
                    if (!hasLiveStatus) {
                        shouldShow = false;
                    }
                } else if (activeLiveEndFilter === 'only-end') {
                    const hasEndStatus = item.querySelector('.status-end');
                    if (!hasEndStatus) {
                        shouldShow = false;
                    }
                }
            }
            
            if (activeYapsFilter && shouldShow) {
                if (!itemFilters.includes(activeYapsFilter)) {
                    shouldShow = false;
                }
            }
            if (activeEcoFilters.length > 0 && shouldShow) {
                const hasMatchingEcoFilter = activeEcoFilters.some(filter => 
                    itemFilters.includes(filter)
                );
                if (!hasMatchingEcoFilter) {
                    shouldShow = false;
                }
            }
            if (activePayoutFilter && shouldShow) {
                if (!itemFilters.includes(activePayoutFilter)) {
                    shouldShow = false;
                }
            }
            
            item.style.display = shouldShow ? 'flex' : 'none';
        });
        
        updateActiveCount();
    }
    
    function updateActiveCount() {
        const allItems = document.querySelectorAll('.project-item:not(.coming-soon)');
        const visibleItems = document.querySelectorAll('.project-item:not(.coming-soon)');
        let count = 0;
        
        const activeKoreaFilters = Array.from(koreaButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-category'));
        const activeLiveEndFilter = Array.from(liveEndButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        const activeYapsFilter = Array.from(yapsButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        const activeEcoFilters = Array.from(ecoButtons)
            .filter(btn => btn.classList.contains('active'))
            .map(btn => btn.getAttribute('data-category'));
        const activePayoutFilter = Array.from(payoutButtons)
            .find(btn => btn.classList.contains('active'))
            ?.getAttribute('data-category');
        
        const hasAnyActiveFilter = activeKoreaFilters.length > 0 || activeLiveEndFilter || activeYapsFilter || activeEcoFilters.length > 0 || activePayoutFilter;
        
        if (!hasAnyActiveFilter) {
            count = allItems.length;
        } else {
            visibleItems.forEach(item => {
                if (item.style.display !== 'none') {
                    count++;
                }
            });
        }
        
        const counter = document.getElementById('active-count');
        if (counter) counter.textContent = count;
    }
    
    updateActiveCount();
});



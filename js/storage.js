const STORAGE_KEYS = {
    reviews: "sunwise-reviews",
    inquiries: "sunwise-inquiries",
};

export function readInquiries() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.inquiries) || "[]");
    } catch {
        return [];
    }
}

export function readReviews() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.reviews) || "[]");
    } catch {
        return [];
    }
}

export function saveReview(review) {
    const reviews = readReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews));
}

export function saveInquiry(inquiry) {
    const inquiries = readInquiries();
    inquiries.push(inquiry);
    localStorage.setItem(STORAGE_KEYS.inquiries, JSON.stringify(inquiries));
}

import dayjs from 'dayjs'

export const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (days < 30) {
        return `${Math.floor(days / 7)} weeks ago`;
    } else if (months < 12) {
        return `${months} months ago`;
    } else {
        return `${years} years ago`;
    }
}

export const convertToTimeStringForDB = (dateString: string) => {
    const date = dayjs(dateString);
    return date.toISOString();
}

export const runWithTimeout = (promise: Promise<any>, ms=3000) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), ms)
    );
    return Promise.race([promise, timeout]);
};

export const timeToRead = (word_count: number) => {
    const wpm = 225;
    const time = Math.ceil(word_count / wpm);
    return time;
};


export const generateId = () => {
    // Use crypto.randomUUID() if available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback: random base36 string
    return Math.random().toString(36).substring(2, 10);
}


export const isTimeExpired = (time: string, expiry_in_hours: number) => {
    if (!time) {
        return true;
    }

    const lastRefreshTime = new Date(time);
    const currentTime = new Date();
    const timeDifference = currentTime - lastRefreshTime;

    const expiryDifference = expiry_in_hours * 60 * 60 * 1000;

    if (timeDifference > expiryDifference) {
        return true;
    }

    return false;
}

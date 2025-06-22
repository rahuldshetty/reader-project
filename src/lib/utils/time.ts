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

/**
 * Parse a SQLite timestamp string into a Date.
 * Supports:
 *  - ISO strings: "2025-06-22T15:30:00Z" or with offset.
 *  - SQLite default format: "YYYY-MM-DD HH:MM:SS" (assumed UTC here).
 * @param ts - the timestamp string from DB
 * @param assumeUTC - if true and format is "YYYY-MM-DD HH:MM:SS", treat as UTC by appending 'Z'
 * @returns Date object or null if invalid
 */
export function parseSQLiteTimestamp(ts: string, assumeUTC = true): Date | null {
    if (!ts) return null;
    let iso: string;
    // Match "YYYY-MM-DD HH:MM:SS"
    const sqlitePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (sqlitePattern.test(ts)) {
        // Convert space to 'T'; append 'Z' if UTC
        iso = ts.replace(' ', 'T') + (assumeUTC ? 'Z' : '');
    } else {
        // Assume it's already ISO-like (e.g., with 'T' and maybe offset or 'Z')
        iso = ts;
    }
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Extract time part "HH:MM:SS" from timestamp.
 * @param ts - timestamp string
 * @param assumeUTC - whether to interpret as UTC when parsing
 * @returns e.g. "15:30:00", or empty string if invalid
 */
export function extractTime(ts: string, assumeUTC = true): string {
    const d = parseSQLiteTimestamp(ts, assumeUTC);
    if (!d) return '';
        // Use Intl.DateTimeFormat for consistent zero-padding
        const opts: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: assumeUTC ? 'UTC' : undefined,
    };
    return new Intl.DateTimeFormat('en-US', opts).format(d);
}

/**
 * Extract formatted date "Month Day, Year" from timestamp.
 * @param ts - timestamp string
 * @param assumeUTC - whether to interpret as UTC when parsing
 * @returns e.g. "June 22, 2025", or empty string if invalid
*/
export function extractFormattedDate(ts: string, assumeUTC = true): string {
  const d = parseSQLiteTimestamp(ts, assumeUTC);
  if (!d) return '';
  const opts: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: assumeUTC ? 'UTC' : undefined,
  };
  return new Intl.DateTimeFormat('en-US', opts).format(d);
}


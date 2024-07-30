export const formatDate = (dateString: string, short = false) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
        return "Just now";
    } else if (diffMinutes < 60) {
        return `${diffMinutes}${(short ? "m" : ` minute${diffMinutes !== 1 ? "s" : ""}`)} ago`;
    } else if (diffHours < 24) {
        return `${diffHours}${short?"h":` hour${diffHours !== 1 ? "s" : ""}`} ago`;
    } else if (diffDays < 7) {
        return `${diffDays}${short ? "d" : ` day${diffDays !== 1 ? "s" : ""}`} ago`;
    } else {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()} ${monthNames[date.getMonth()]}`;
    }
};

export const formatNumber = (num: number): string => {
    if (num < 100) {
        return num.toString();
    } else if (num < 1000) {
        return '100+';
    } else if (num < 1000000) {
        return `${(num / 1000).toFixed(1)}K`;
    } else {
        return `${(num / 1000000).toFixed(1)}M`;
    }
};
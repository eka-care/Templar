// Mock implementation for htmlParser dependency
// This should be replaced with the actual implementation when building in the full project

export const parseHTMLToStringForPipeSeperated = (html: string): string => {
    // Simple HTML parsing fallback
    // In production, this should be the actual implementation
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
};

// Export for compatibility
export default {
    parseHTMLToStringForPipeSeperated,
};

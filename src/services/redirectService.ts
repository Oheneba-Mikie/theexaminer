/**
 * Service for handling redirects and URL management
 */
export const redirectService = {
  /**
   * Normalize an exam URL to ensure it works across different domains
   * @param examId The UUID of the exam
   * @returns The normalized URL for the exam
   */
  getExamUrl(examId: string): string {
    // Check if we're on the external domain
    const isExternalDomain =
      window.location.hostname === "theexaminer.theinvigilator.com";

    if (isExternalDomain) {
      // On external domain, use root path
      return `/${examId}`;
    } else {
      // On internal domain, use /exam/ path
      return `/exam/${examId}`;
    }
  },

  /**
   * Get the exam ID from the current URL
   * @returns The exam ID from the URL, if present
   */
  getExamIdFromUrl(): string | null {
    const path = window.location.pathname;

    // Check if URL is in format /exam/[examId]
    if (path.startsWith("/exam/")) {
      return path.split("/exam/")[1];
    }

    // Check if URL is in format /[examId] (for external domain)
    if (path.length > 1 && path.startsWith("/")) {
      const potentialId = path.substring(1);
      // Validate if it looks like a UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(potentialId)) {
        return potentialId;
      }
    }

    return null;
  },
};

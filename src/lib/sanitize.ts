/** Strip HTML tags and trim whitespace */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[^\S ]+/g, " ") // collapse non-space whitespace (tabs, newlines) into spaces
    .trim();
}

/** Validate and sanitize a nickname */
export function sanitizeNickname(input: string): { valid: boolean; value: string; error?: string } {
  const trimmed = input.trim();

  if (trimmed.length < 2) {
    return { valid: false, value: trimmed, error: "Nickname must be at least 2 characters" };
  }
  if (trimmed.length > 20) {
    return { valid: false, value: trimmed, error: "Nickname must be 20 characters or less" };
  }

  // Only allow letters, numbers, underscores, hyphens, and spaces
  if (!/^[a-zA-Z0-9_\- ]+$/.test(trimmed)) {
    return { valid: false, value: trimmed, error: "Nickname can only contain letters, numbers, spaces, - and _" };
  }

  // Must contain at least one letter or number
  if (!/[a-zA-Z0-9]/.test(trimmed)) {
    return { valid: false, value: trimmed, error: "Nickname must contain at least one letter or number" };
  }

  // Block admin impersonation (case-insensitive)
  if (/^admin/i.test(trimmed) && !["Adam", "Admin___James", "Admin___Levi"].includes(trimmed)) {
    return { valid: false, value: trimmed, error: "This nickname is reserved" };
  }

  return { valid: true, value: trimmed };
}

/** Validate a chat message */
export function sanitizeChatMessage(input: string): { valid: boolean; value: string; error?: string } {
  const cleaned = sanitizeText(input);

  if (!cleaned) {
    return { valid: false, value: cleaned, error: "Message cannot be empty" };
  }
  if (cleaned.length > 200) {
    return { valid: false, value: cleaned, error: "Message too long (max 200 characters)" };
  }

  return { valid: true, value: cleaned };
}

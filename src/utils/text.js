export const HASHTAG_REGEX = /#([a-zA-Z0-9_]+)/g;
export const MENTION_REGEX = /@([a-zA-Z0-9_.]+)/g;

export const extractHashtags = (text) => {
  if (!text) return [];
  const set = new Set();
  const regex = new RegExp(HASHTAG_REGEX.source, "g");
  let match;
  while ((match = regex.exec(text)) !== null) {
    set.add(match[1].toLowerCase());
  }
  return Array.from(set);
};

export const extractMentions = (text) => {
  if (!text) return [];
  const set = new Set();
  const regex = new RegExp(MENTION_REGEX.source, "g");
  let match;
  while ((match = regex.exec(text)) !== null) {
    set.add(match[1].toLowerCase());
  }
  return Array.from(set);
};

export const renderTextWithLinks = (text) => {
  if (!text) return [];
  const combined = new RegExp(`${HASHTAG_REGEX.source}|${MENTION_REGEX.source}`, "g");
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = combined.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[0].startsWith("#")) {
      parts.push({ type: "hashtag", value: match[1].toLowerCase() });
    } else {
      parts.push({ type: "mention", value: match[1] });
    }
    lastIndex = combined.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
};

export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
};

export const formatFullDateTime = (timestamp) => {
  if (!timestamp) return "";
  return `${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString()}`;
};

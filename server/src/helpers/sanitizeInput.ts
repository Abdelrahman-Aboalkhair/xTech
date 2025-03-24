import sanitizeHtml from "sanitize-html";

function sanitizeInput(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export default sanitizeInput;

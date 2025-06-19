
function createSafeHTMLRenderer(targetElement) {
  const host = document.createElement('div');
  const shadow = host.attachShadow({ mode: 'closed' });
  targetElement.appendChild(host);

  return {
    render(html) {
      const cleanNode = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['style', 'div', 'p', 'span', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'br'],
        ALLOWED_ATTR: ['href', 'title', 'alt', 'target'],
        ALLOW_UNKNOWN_PROTOCOLS: false,
        FORCE_BODY: true,
        RETURN_DOM: true,
        RETURN_DOM_FRAGMENT: true
      });
      shadow.innerHTML = '';
      shadow.appendChild(cleanNode);
    },
    clear() {
      shadow.innerHTML = '';
    }
  };
}

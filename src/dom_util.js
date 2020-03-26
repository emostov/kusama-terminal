// https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
// eslint-disable-next-line import/prefer-default-export
export function stringToNode(inner) {
  const template = document.createElement('template');
  const html = inner.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

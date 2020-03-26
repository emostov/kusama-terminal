// eslint-disable-next-line import/prefer-default-export
export function stringToNode(inner) {
  const template = document.createElement('template');
  const html = inner.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

import { getBaseDomain } from './domain';

const domainPlaceholder = /domain-placeholder/g;

const walkText = (node: Node): void => {
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.textContent != null && domainPlaceholder.test(node.textContent)) {
      node.textContent = node.textContent.replace(domainPlaceholder, getBaseDomain());
    }
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    if (element.nodeName === 'SCRIPT') {
      return;
    }
    if (element instanceof HTMLAnchorElement) {
      element.href = element.href.replace(domainPlaceholder, getBaseDomain());
    }
    element.childNodes.forEach(walkText);
  }
};

export function onRouteDidUpdate(): void {
  walkText(document.body);
}

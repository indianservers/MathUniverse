import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

// Scope the floor to lesson content, including lazily loaded workspaces.
// Keep the original cascade and responsive queries; do not flatten headings.
const scope = ':where([data-lesson-typography], [data-lesson-typography] *)';
const dimension = /^(?:\d*\.)?\d+(?:px|rem|em|ex|ch|%|vw|vh|vmin|vmax|cqi|cqw|pt)$/i;

function fontSize(declaration) {
  if (declaration.prop === 'font-size') return declaration.value;
  if (declaration.prop !== 'font') return null;
  const nodes = valueParser(declaration.value).nodes;
  const size = nodes.find(node =>
    (node.type === 'word' && dimension.test(node.value)) ||
    (node.type === 'function' && /^(?:calc|min|max|clamp|var)$/.test(node.value)));
  return size ? valueParser.stringify(size) : null;
}

function scopedSelector(selector) {
  return selectorParser(selectors => {
    selectors.each(item => {
      const lastPseudoElement = item.nodes.findLast(node =>
        node.type === 'pseudo' && /^::|^:(?:before|after|first-letter|first-line)$/.test(node.value));
      const scoped = selectorParser().astSync(scope).first.first.clone();
      if (lastPseudoElement) item.insertBefore(lastPseudoElement, scoped);
      else item.append(scoped);
    });
  }).processSync(selector);
}

export default function lessonFontFloor() {
  return {
    postcssPlugin: 'lesson-font-floor',
    OnceExit(root) {
      const rules = [];
      root.walkRules(rule => rules.push(rule));
      for (const rule of rules) {
        // Keyframe percentages are not selectors.
        if (rule.parent.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) continue;
        const declarations = rule.nodes.filter(node => node.type === 'decl' && fontSize(node));
        if (!declarations.length) continue;
        const override = rule.clone({ selector: scopedSelector(rule.selector), nodes: [] });
        for (const declaration of declarations) {
          const size = fontSize(declaration);
          // Zero-size accessibility/spacing boxes must stay hidden.
          if (/^0(?:px|em|rem|%)?$/.test(size) || /^(?:inherit|initial|unset|revert|revert-layer)$/.test(size)) continue;
          const keywordSizes = { 'xx-small': '9px', 'x-small': '10px', small: '13px', medium: '16px', large: '18px', 'x-large': '24px', 'xx-large': '32px', smaller: '.8333em', larger: '1.2em' };
          override.append(declaration.clone({ prop: 'font-size', value: `max(12px, ${keywordSizes[size] ?? size})` }));
        }
        if (override.nodes.length) rule.after(override);
      }
    },
  };
}
lessonFontFloor.postcss = true;

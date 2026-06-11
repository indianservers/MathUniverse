import { compileFunctionExpression } from "../utils/functionParser";
import type { MathObject, MathObjectProperties, MathObjectStyle } from "./types";

export type ObjectPropertyContext = {
  variables?: Record<string, number>;
  objectValues?: Record<string, number>;
};

export type EvaluatedObjectProperties = {
  visible: boolean;
  label: string;
  caption: string;
  layer: number;
  style: MathObjectStyle;
};

export function evaluateObjectProperties(object: MathObject, context: ObjectPropertyContext = {}): EvaluatedObjectProperties {
  const properties = normalizeObjectProperties(object.properties, object.label);
  const variables = { ...context.objectValues, ...context.variables };
  const visible = object.visible && evaluateCondition(properties.conditionalVisibility, variables);
  const dynamicStyle = evaluateDynamicStyle(properties, object.style ?? {}, variables);
  return {
    visible,
    label: displayLabel(object, properties),
    caption: properties.caption ?? "",
    layer: properties.layer ?? 0,
    style: dynamicStyle,
  };
}

export function applyObjectProperties(objects: MathObject[], context: ObjectPropertyContext = {}): MathObject[] {
  const objectValues = {
    ...Object.fromEntries(objects.map((object) => [object.label, numericValue(object.value)])),
    ...context.objectValues,
  };
  return objects
    .map((object) => {
      const evaluated = evaluateObjectProperties(object, { ...context, objectValues });
      return {
        ...object,
        visible: evaluated.visible,
        status: evaluated.visible ? object.status === "hidden" ? "ready" as const : object.status : "hidden" as const,
        style: evaluated.style,
        metadata: {
          ...object.metadata,
          evaluatedLabel: evaluated.label,
          caption: evaluated.caption,
          layer: evaluated.layer,
        },
      };
    })
    .sort((a, b) => ((a.properties?.layer ?? 0) - (b.properties?.layer ?? 0)) || b.updatedAt - a.updatedAt);
}

export function normalizeObjectProperties(properties: MathObjectProperties | undefined, fallbackLabel: string): MathObjectProperties {
  return {
    label: properties?.label ?? fallbackLabel,
    caption: properties?.caption ?? "",
    layer: Math.max(0, Math.round(properties?.layer ?? 0)),
    labelMode: properties?.labelMode ?? "name",
    conditionalVisibility: properties?.conditionalVisibility?.trim() || undefined,
    dynamicColor: properties?.dynamicColor,
    dynamicStyle: properties?.dynamicStyle,
  };
}

function evaluateDynamicStyle(properties: MathObjectProperties, style: MathObjectStyle, variables: Record<string, number>): MathObjectStyle {
  const color = properties.dynamicColor
    ? rgbaToHex(
      evaluateNumeric(properties.dynamicColor.red, variables, 0),
      evaluateNumeric(properties.dynamicColor.green, variables, 0),
      evaluateNumeric(properties.dynamicColor.blue, variables, 0)
    )
    : style.color;
  const opacity = properties.dynamicColor?.alpha
    ? clamp(evaluateNumeric(properties.dynamicColor.alpha, variables, style.opacity ?? 1), 0, 1)
    : properties.dynamicStyle?.opacity
      ? clamp(evaluateNumeric(properties.dynamicStyle.opacity, variables, style.opacity ?? 1), 0, 1)
      : style.opacity;
  const strokeWidth = properties.dynamicStyle?.strokeWidth
    ? clamp(evaluateNumeric(properties.dynamicStyle.strokeWidth, variables, style.strokeWidth ?? 2), 0.5, 32)
    : style.strokeWidth;
  return { ...style, color, stroke: color ?? style.stroke, opacity, strokeWidth };
}

function displayLabel(object: MathObject, properties: MathObjectProperties) {
  const label = properties.label ?? object.label;
  if (properties.labelMode === "hidden") return "";
  if (properties.labelMode === "value") return object.value;
  if (properties.labelMode === "caption") return properties.caption ?? "";
  if (properties.labelMode === "name-value") return `${label} = ${object.value}`;
  return label;
}

function evaluateCondition(expression: string | undefined, variables: Record<string, number>) {
  if (!expression) return true;
  const match = expression.match(/^(.+?)(<=|>=|==|!=|<|>)(.+)$/);
  if (!match) return Boolean(evaluateNumeric(expression, variables, 1));
  const left = evaluateNumeric(match[1], variables, 0);
  const right = evaluateNumeric(match[3], variables, 0);
  if (match[2] === "<") return left < right;
  if (match[2] === "<=") return left <= right;
  if (match[2] === ">") return left > right;
  if (match[2] === ">=") return left >= right;
  if (match[2] === "!=") return Math.abs(left - right) > 1e-9;
  return Math.abs(left - right) <= 1e-9;
}

function evaluateNumeric(expression: string | undefined, variables: Record<string, number>, fallback: number) {
  if (!expression?.trim()) return fallback;
  try {
    const rewritten = expression.replace(/\b[A-Za-z]\w*\b/g, (token) => token in variables ? String(variables[token]) : token);
    return compileFunctionExpression(rewritten)(variables.x ?? 0);
  } catch {
    return fallback;
  }
}

function rgbaToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function numericValue(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findSiteLink } from "../../data/siteLinks";

const defaultDescription = "Math Universe visualizes algebra, geometry, calculus, trigonometry, complex numbers, linear algebra, AI applications, and more.";
const defaultKeywords = ["math universe", "interactive mathematics", "visual learning", "math visualizations"];

function setMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

function setStructuredData(data: object) {
  const id = "math-universe-structured-data";
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export default function SeoMetadata() {
  const location = useLocation();

  useEffect(() => {
    const link = findSiteLink(location.pathname);
    const title = link ? `${link.title} | Math Universe` : "Math Universe Visualizations";
    const description = link?.description ?? defaultDescription;
    const keywords = (link?.keywords ?? defaultKeywords).join(", ");
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    document.title = title;
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", "index, follow");
    setMeta("author", "Math Universe");
    setMeta("application-name", "Math Universe");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setCanonical(canonicalUrl);
    setStructuredData({
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: link?.title ?? "Math Universe",
      description,
      url: canonicalUrl,
      educationalUse: "Interactive mathematics learning",
      learningResourceType: link?.category ?? "Visualization",
      keywords,
      provider: {
        "@type": "Organization",
        name: "Math Universe",
      },
    });
  }, [location.pathname]);

  return null;
}


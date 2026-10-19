import companyData from '../data/companyData';

export function updatePageMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
  jsonLd,
}) {
  const fullTitle = title.includes("DINQ")
    ? title
    : `${title} | DINQ ETHIOPIA TOURS`;

  document.title = fullTitle;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description || companyData.description;

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl || window.location.href;

  // Open Graph
  setMetaTag("property", "og:title", fullTitle);
  setMetaTag("property", "og:description", description || companyData.description);
  setMetaTag("property", "og:type", ogType);
  setMetaTag("property", "og:url", window.location.href);
  setMetaTag("property", "og:site_name", companyData.name);
  if (ogImage) {
    setMetaTag("property", "og:image", ogImage);
  }

  // Schema.org JSON-LD injection
  const existingScript = document.getElementById("json-ld-data");
  if (existingScript) {
    existingScript.remove();
  }

  if (jsonLd) {
    const script = document.createElement("script");
    script.id = "json-ld-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

function setMetaTag(attrName, attrVal, content) {
  let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrVal);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": companyData.name,
    "alternateName": ["Dinq Ethiopia", "Ambasel Tour and Travel"],
    "url": "https://dinqethiopiatours.com",
    "logo": "https://dinqethiopiatours.com/favicon.svg",
    "description": companyData.description,
    "telephone": companyData.contact.phone,
    "email": companyData.contact.primaryEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": companyData.headquarters.address,
      "addressLocality": companyData.headquarters.city,
      "addressCountry": "ET",
    },
    "founder": {
      "@type": "Person",
      "name": "Zerihun Alemayehu",
    },
    "sameAs": [
      companyData.social.facebook,
      companyData.social.instagram,
      companyData.social.linkedin,
    ],
  };
}

export function buildTourSchema(tour) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.overview.slice(0, 200) + "...",
    "touristType": ["AdventureSeeker", "CulturalTourist", "NatureTourist"],
    "offers": {
      "@type": "Offer",
      "price": tour.priceFromUSD.replace(/[^0-9]/g, ""),
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "provider": {
      "@type": "TravelAgency",
      "name": companyData.name,
      "telephone": companyData.contact.phone,
    },
  };
}

// Structured Data (JSON-LD) for SEO
// This file is loaded separately to reduce HTML file size

const schemas = [
  // WebApplication Schema
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Analog Film Exposure Calculator",
    "url": "<base-url>",
    "applicationCategory": "UtilitiesApplication",
    "applicationSubCategory": "Photography Calculator",
    "operatingSystem": "Any (Web-based)",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free analog film exposure calculator for manual cameras. Calculate aperture, shutter speed, ISO, and exposure value (EV). Designed for all manual film cameras.",
    "featureList": [
      "Calculate exposure value (EV) from aperture, ISO, and shutter speed",
      "Calculate aperture from EV, ISO, and shutter speed",
      "Calculate shutter speed from EV, ISO, and aperture",
      "Calculate ISO from EV, aperture, and shutter speed",
      "Analog camera shutter speed presets (1s to 1/1000s)",
      "Common film stock ISO values (ISO 25 to 3200)",
      "Light situation presets (EV -2 to EV 15)",
      "Full and half-stop aperture values",
      "Interactive exposure triangle formulas with MathJax",
      "Educational content about exposure photography"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Photographers using manual film cameras"
    }
  },

  // FAQPage Schema
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an exposure calculator for film photography?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An exposure calculator helps analog film photographers determine the correct exposure settings for their camera by calculating the relationship between aperture, shutter speed, ISO, and exposure value (EV). It's essential for manual cameras without built-in light meters."
        }
      },
      {
        "@type": "Question",
        "name": "How do I calculate exposure for my analog camera?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Enter any three values (light situation/EV, aperture, ISO film speed, or shutter speed) and the calculator will compute the fourth. For example: if you're shooting in sunny conditions (EV 14) with ISO 400 film at f/16, the calculator will tell you to use 1/500s shutter speed."
        }
      },
      {
        "@type": "Question",
        "name": "What is the exposure triangle?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The exposure triangle is the relationship between three variables that control exposure: aperture (f-stop), shutter speed (time), and ISO (film sensitivity). These three factors work together to determine the correct exposure value (EV) for a scene."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Sunny 16 rule?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Sunny 16 rule states that on a sunny day (EV 14), with aperture set to f/16, your shutter speed should be the reciprocal of your ISO. For example, with ISO 100 film, use 1/100s (or closest speed like 1/125s). This calculator automatically applies this principle."
        }
      },
      {
        "@type": "Question",
        "name": "What is a typical flash sync speed for analog cameras?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A common flash sync speed for analog cameras is 1/50s to 1/60s, which is typically the fastest shutter speed you can use with electronic flash. Using faster speeds may result in partial frame exposure (shutter curtain appearing in photos) depending on your camera model."
        }
      }
    ]
  },

  // HowTo Schema
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Film Exposure Settings",
    "description": "Step-by-step guide to using the exposure calculator for analog film photography",
    "totalTime": "PT2M",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Select your film ISO speed",
        "text": "Choose your film stock from the ISO dropdown (e.g., ISO 400 for Kodak Portra 400 or Ilford HP5)",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Choose lighting conditions or EV",
        "text": "Select the light situation from the EV dropdown (e.g., 'Sunny, clear sky' for outdoor shooting)",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Select either aperture or shutter speed",
        "text": "Choose your desired aperture (e.g., f/2.8 for shallow depth of field) OR shutter speed (e.g., 1/250s for freezing motion)",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Calculate the missing value",
        "text": "Click the Calculate button to find the fourth value. The calculator will highlight the computed result and show the closest standard camera setting.",
        "position": 4
      }
    ]
  }
];

// Inject schemas into the document head
schemas.forEach(schema => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
});

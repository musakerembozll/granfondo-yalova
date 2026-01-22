export function EventSchema() {
    const eventData = {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": "GranFondo Yalova 2026",
        "description": "Türkiye'nin en prestijli bisiklet yarışı. 98 km uzun parkur ve 55 km kısa parkur seçenekleriyle eşsiz doğa manzaraları eşliğinde pedal çevirin.",
        "startDate": "2026-04-14T08:00:00+03:00",
        "endDate": "2026-04-14T18:00:00+03:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": "Yalova Sahil Parkı",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Sahil Yolu",
                "addressLocality": "Yalova",
                "addressRegion": "Marmara",
                "postalCode": "77100",
                "addressCountry": "TR"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.6565",
                "longitude": "29.2752"
            }
        },
        "image": [
            "https://www.sporlayalova.com/og-image.jpg"
        ],
        "organizer": {
            "@type": "Organization",
            "name": "GranFondo Yalova",
            "url": "https://www.sporlayalova.com",
            "email": "info@sporlayalova.com",
            "telephone": "+905521961677"
        },
        "performer": {
            "@type": "Organization",
            "name": "GranFondo Yalova"
        },
        "offers": [
            {
                "@type": "Offer",
                "name": "Uzun Parkur (98 km)",
                "price": "350",
                "priceCurrency": "TRY",
                "availability": "https://schema.org/InStock",
                "url": "https://www.sporlayalova.com/basvuru",
                "validFrom": "2026-01-01T00:00:00+03:00"
            },
            {
                "@type": "Offer",
                "name": "Kısa Parkur (55 km)",
                "price": "350",
                "priceCurrency": "TRY",
                "availability": "https://schema.org/InStock",
                "url": "https://www.sporlayalova.com/basvuru",
                "validFrom": "2026-01-01T00:00:00+03:00"
            }
        ],
        "sport": "Cycling"
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(eventData) }}
        />
    )
}

export function OrganizationSchema() {
    const orgData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "GranFondo Yalova",
        "url": "https://www.sporlayalova.com",
        "logo": "https://www.sporlayalova.com/og-image.jpg",
        "image": "https://www.sporlayalova.com/og-image.jpg",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sahil Yolu",
            "addressLocality": "Yalova",
            "addressRegion": "Marmara",
            "postalCode": "77100",
            "addressCountry": "TR"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+90-552-196-16-77",
            "contactType": "customer service",
            "email": "info@sporlayalova.com",
            "availableLanguage": ["Turkish", "English"]
        },
        "sameAs": [
            "https://www.instagram.com/granfondoyalova",
            "https://www.facebook.com/granfondoyalova"
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
        />
    )
}

export function WebsiteSchema() {
    const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "GranFondo Yalova",
        "url": "https://www.sporlayalova.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.sporlayalova.com/haberler?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
    )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
    )
}

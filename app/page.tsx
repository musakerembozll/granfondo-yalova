import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { CountdownTimer } from "@/components/landing/countdown-timer";
import { ParticipantCounter } from "@/components/landing/participant-counter";
import { InfoSection } from "@/components/landing/info-section";
import { GallerySection } from "@/components/landing/gallery-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { NewsSection } from "@/components/landing/news-section";
import { FaqSection } from "@/components/landing/faq-section";
import { SponsorsSection } from "@/components/landing/sponsors-section";
import { SocialFeedSection } from "@/components/landing/social-feed-section";
import { Footer } from "@/components/landing/footer";
import { EventSchema, OrganizationSchema, WebsiteSchema } from "@/components/seo/structured-data";
import { getGalleryItems, getTestimonials, getSponsors, getNews, getSiteSettings } from "@/app/content-actions";
import { getSiteData } from "@/lib/site-content";
import { formatEventDate } from "@/lib/date-utils";

export const revalidate = 30; // Revalidate every 30 seconds

export default async function Home() {
  const galleryItems = await getGalleryItems()
  const testimonials = await getTestimonials()
  const sponsors = await getSponsors()
  const news = await getNews(3)
  const siteSettings = await getSiteSettings()
  const { content, images } = await getSiteData()
  const formattedDate = formatEventDate(siteSettings.event_date)

  return (
    <>
      {/* SEO Structured Data */}
      <EventSchema />
      <OrganizationSchema />
      <WebsiteSchema />

      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
        <Navbar />
        <HeroSection
          eventDate={formattedDate}
          subtitle={content.hero_subtitle}
          ctaText={content.hero_cta}
          videoUrl={images.hero_video}
          imageUrl={images.hero_image}
        />
        <CountdownTimer targetDate={siteSettings.event_date} />
        <ParticipantCounter />
        <InfoSection />
        <GallerySection items={galleryItems} />
        <TestimonialsSection items={testimonials} />
        <NewsSection items={news} />
        <FaqSection siteSettings={siteSettings} />
        <SocialFeedSection />
        <SponsorsSection items={sponsors} />
        <Footer siteSettings={siteSettings} />
      </main>
    </>
  );
}

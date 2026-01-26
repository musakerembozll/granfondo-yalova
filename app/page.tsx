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
import { getGalleryItems, getTestimonials, getSponsors, getNews, getSiteSettings, getSectionSettings } from "@/app/content-actions";
import { getSiteData } from "@/lib/site-content";
import { formatEventDate } from "@/lib/date-utils";
import { getActiveEvent } from "@/app/actions";

export const revalidate = 60; // Revalidate every 1 minute

export default async function Home() {
  const galleryItems = await getGalleryItems()
  const testimonials = await getTestimonials()
  const sponsors = await getSponsors()
  const news = await getNews(3)
  const siteSettings = await getSiteSettings()
  const sectionSettings = await getSectionSettings()
  const { content, images } = await getSiteData()
  const activeEvent = await getActiveEvent()

  // Use active event data
  const eventDate = activeEvent ? formatEventDate(activeEvent.date) : formatEventDate(siteSettings.event_date)
  const heroImageUrl = activeEvent?.background_image_url || images.hero_image
  const defaultVideo = "https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4"
  const heroVideoUrl = activeEvent?.hero_video_url || (images.hero_video && images.hero_video.trim() !== '' ? images.hero_video : defaultVideo)
  
  // Hero content from active event
  const heroTitle = activeEvent?.hero_title || activeEvent?.title || 'GRAN FONDO YALOVA 2026'
  const heroSubtitle = activeEvent?.hero_subtitle || content.hero_subtitle
  const heroCtaText = activeEvent?.hero_cta_text || content.hero_cta || 'Hemen Başvur'

  // Helper function to check if section is visible (default to true if not set)
  const isSectionVisible = (key: string) => sectionSettings[key] !== false

  return (
    <>
      {/* SEO Structured Data */}
      <EventSchema />
      <OrganizationSchema />
      <WebsiteSchema />

      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
        <Navbar activeEvent={activeEvent} />
        {isSectionVisible('hero') && (
          <HeroSection
            eventDate={eventDate}
            title={heroTitle}
            subtitle={heroSubtitle}
            ctaText={heroCtaText}
            videoUrl={heroVideoUrl}
            imageUrl={heroImageUrl}
            activeEvent={activeEvent}
          />
        )}
        <CountdownTimer targetDate={activeEvent?.date || siteSettings.event_date} activeEvent={activeEvent} />
        {isSectionVisible('counter') && <ParticipantCounter activeEvent={activeEvent} />}
        <InfoSection activeEvent={activeEvent} />
        {isSectionVisible('gallery') && <GallerySection items={galleryItems} />}
        {isSectionVisible('testimonials') && <TestimonialsSection items={testimonials} />}
        {isSectionVisible('news') && <NewsSection items={news} />}
        {isSectionVisible('faq') && <FaqSection activeEvent={activeEvent} />}
        {isSectionVisible('social') && <SocialFeedSection />}
        {isSectionVisible('sponsors') && <SponsorsSection items={sponsors} />}
        <Footer activeEvent={activeEvent} />
      </main>
    </>
  );
}

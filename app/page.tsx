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

export const revalidate = 300; // Revalidate every 5 minutes

export default async function Home() {
  const galleryItems = await getGalleryItems()
  const testimonials = await getTestimonials()
  const sponsors = await getSponsors()
  const news = await getNews(3)
  const siteSettings = await getSiteSettings()
  const sectionSettings = await getSectionSettings()
  const { content, images } = await getSiteData()
  const activeEvent = await getActiveEvent()

  // Use active event data if available, otherwise fall back to site settings
  const eventDate = activeEvent ? formatEventDate(activeEvent.date) : formatEventDate(siteSettings.event_date)
  const heroImageUrl = activeEvent?.background_image_url || images.hero_image
  // Use video from active event first, then site_images, then default
  const defaultVideo = "https://videos.pexels.com/video-files/5793953/5793953-uhd_2560_1440_30fps.mp4"
  const heroVideoUrl = activeEvent?.hero_video_url || (images.hero_video && images.hero_video.trim() !== '' ? images.hero_video : defaultVideo)

  // Helper function to check if section is visible (default to true if not set)
  const isSectionVisible = (key: string) => sectionSettings[key] !== false

  return (
    <>
      {/* SEO Structured Data */}
      <EventSchema />
      <OrganizationSchema />
      <WebsiteSchema />

      <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30 flex flex-col">
        <Navbar />
        {isSectionVisible('hero') && (
          <HeroSection
            eventDate={eventDate}
            subtitle={content.hero_subtitle}
            ctaText={content.hero_cta}
            videoUrl={heroVideoUrl}
            imageUrl={heroImageUrl}
          />
        )}
        <CountdownTimer targetDate={activeEvent?.date || siteSettings.event_date} />
        {isSectionVisible('counter') && <ParticipantCounter />}
        <InfoSection />
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

import { AnnouncementBar, NavbarPreview, TabsPreview } from "@/components/navigation/NavigationPreview";
import { Badge } from "@/components/primitives/Badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";

export function NavigationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Components / Navigation"
        title="Navigation should feel light, calm, and unmistakably premium."
        description="Rather than relying on heavy marketplace chrome, the navigation system uses blur, hierarchy, and image-led categorization to guide customers through a luxury browsing flow."
      />

      <SurfaceCard title="Announcement bar">
        <AnnouncementBar />
      </SurfaceCard>

      <SurfaceCard title="Navbar and tabs">
        <div className="space-y-6">
          <NavbarPreview />
          <TabsPreview />
        </div>
      </SurfaceCard>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Mega Menu", "Editorial columns, curated category imagery, and premium storytelling blocks."],
          ["Mobile Navigation", "Drawer-based, layered, thumb-friendly, and always calm in density."],
          ["Breadcrumbs / Pagination", "Minimal text-led utility patterns that stay secondary to product imagery."],
        ].map(([title, body]) => (
          <SurfaceCard key={title} title={title}>
            <Badge tone="soft">System pattern</Badge>
            <p className="mt-4 text-sm leading-7 text-[color:var(--color-text-secondary)]">{body}</p>
          </SurfaceCard>
        ))}
      </section>
    </>
  );
}

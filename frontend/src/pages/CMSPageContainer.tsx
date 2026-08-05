import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/shop/Breadcrumb";
import axios from "@/lib/api/axios";

export function CMSPageContainer({ slugOverride }: { slugOverride?: string }) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = slugOverride || routeSlug || "privacy";

  const [page, setPage] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/cms/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <p className="text-sm text-[color:var(--color-text-secondary)]">Loading page...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-8">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)]">Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8">
      <Breadcrumb items={[{ label: page.title }]} />
      <div className="mt-8 mx-auto max-w-4xl rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 md:p-12">
        <h1 className="font-display text-3xl text-[color:var(--color-text-primary)] md:text-5xl">{page.title}</h1>
        <div 
          className="mt-6 prose dark:prose-invert max-w-none text-base leading-8 text-[color:var(--color-text-secondary)]"
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    </div>
  );
}

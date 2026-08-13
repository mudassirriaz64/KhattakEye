import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Search, Download, Eye, MapPin, Star, X, CheckCircle, ImagePlus, Video, Trash2 } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import { getMyOrdersApi } from "@/lib/api/orders";
import { getOrderStatusLabel } from "@/lib/utils/enum-labels";
import axios from "@/lib/api/axios";

interface DbOrderItem {
  product: string;
  name: string;
  brand?: string;
  color?: string;
  quantity: number;
  price: number;
  image: string;
}

interface DbOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
  items: DbOrderItem[];
}

const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600",
  processing: "bg-[color:var(--color-accent-blue)]/10 text-[color:var(--color-accent-blue)]",
  shipped: "bg-[color:var(--color-accent-teal)]/10 text-[color:var(--color-accent-teal)]",
  delivered: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-emerald-500/10 text-emerald-700 font-bold",
  cancelled: "bg-red-500/10 text-red-600",
};

export function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dbOrders, setDbOrders] = useState<DbOrder[]>([]);

  // Review Modal State
  const [reviewOrder, setReviewOrder] = useState<DbOrder | null>(null);
  const [reviewingItem, setReviewingItem] = useState<DbOrderItem | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setVideos((prev) => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    getMyOrdersApi().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: DbOrder[] = data.map((o) => ({
          id: o._id || o.id,
          orderNumber: o.orderNumber,
          date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          status: o.status || "pending",
          total: o.total || 0,
          itemCount: o.items ? o.items.length : 1,
          items: (o.items || []).map((i: any) => ({
            product: i.product?._id || i.product || i.id,
            name: i.name,
            brand: i.brand,
            color: i.color,
            quantity: i.quantity,
            price: i.price,
            image: i.image
          }))
        }));
        setDbOrders(mapped);
      }
    }).catch(() => {});
  }, []);

  const openReviewModal = (order: DbOrder) => {
    setReviewOrder(order);
    if (order.items && order.items.length > 0) {
      setReviewingItem(order.items[0]);
    }
    setRating(5);
    setTitle("");
    setText("");
    setReviewSuccess(null);
    setReviewError(null);
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder || !reviewingItem) return;
    if (!text.trim()) {
      setReviewError("Please enter your review text.");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    try {
      await axios.post("/reviews", {
        orderId: reviewOrder.id,
        productId: reviewingItem.product,
        rating,
        title: title.trim(),
        text: text.trim(),
        images,
        videos
      });

      setReviewSuccess("Thank you! Your verified product review with media has been published.");
      setTimeout(() => {
        setReviewOrder(null);
        setReviewingItem(null);
        setReviewSuccess(null);
        setImages([]);
        setVideos([]);
      }, 2000);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      setReviewError(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filtered = dbOrders.filter((o) => {
    const matchFilter = activeFilter === "All" || o.status.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = !search || o.orderNumber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <AccountLayout title="My Orders" subtitle={`${dbOrders.length} total orders`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-accent-teal)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus-ring)]" />
        </div>
        <div className="flex gap-1.5">
          {filters.map((f) => (
            <button key={f} type="button" onClick={() => setActiveFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", activeFilter === f ? "bg-[color:var(--color-brand-primary)] text-white" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-primary)]")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--color-surface-muted)]"><Package className="h-8 w-8 text-[color:var(--color-text-tertiary)]" /></div>
          <h3 className="mt-4 font-display text-xl text-[color:var(--color-text-primary)]">No orders found</h3>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((order, i) => {
            const isCanReview = order.status === "delivered" || order.status === "closed";
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5 backdrop-blur-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-surface-muted)]">
                        <Package className="h-5 w-5 text-[color:var(--color-text-tertiary)]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{order.orderNumber}</p>
                        <p className="text-xs text-[color:var(--color-text-tertiary)]">{order.date} · {order.itemCount} item{order.itemCount > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold ${statusColor[order.status] || "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]"}`}>{getOrderStatusLabel(order.status)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--color-border)] pt-3">
                    <span className="text-sm font-bold text-[color:var(--color-text-primary)]">Rs. {order.total.toLocaleString()}</span>
                    <div className="flex flex-wrap gap-2">
                      {isCanReview && (
                        <button
                          type="button"
                          onClick={() => openReviewModal(order)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-[11px] font-bold text-amber-600 transition-colors hover:bg-amber-500/20"
                        >
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Write Review
                        </button>
                      )}
                      <Link to={`/track-order?id=${order.orderNumber}`} className="flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                        <MapPin className="h-3 w-3" /> Track
                      </Link>
                      <Link to={`/invoice?id=${order.id || order.orderNumber}`} target="_blank" className="flex items-center gap-1 rounded-lg border border-[color:var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-surface-muted)]">
                        <Download className="h-3 w-3" /> Invoice
                      </Link>
                      <Link to={`/account/orders/${order.id}`} className="flex items-center gap-1 rounded-lg bg-[color:var(--color-brand-primary)] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-black">
                        <Eye className="h-3 w-3" /> View
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Review Creation Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-[color:var(--color-text-primary)]">Write a Product Review</h3>
                <p className="text-xs text-[color:var(--color-text-tertiary)]">Order #{reviewOrder.orderNumber}</p>
              </div>
              <button type="button" onClick={() => setReviewOrder(null)} className="rounded-lg p-1 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="my-6 rounded-2xl bg-emerald-500/10 p-6 text-center text-emerald-600">
                <CheckCircle className="mx-auto h-10 w-10" />
                <p className="mt-2 font-display text-base font-bold">{reviewSuccess}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Product Selection if multiple items */}
                {reviewOrder.items.length > 1 && (
                  <div>
                    <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">Select Product to Review</label>
                    <div className="grid grid-cols-2 gap-2">
                      {reviewOrder.items.map((item) => (
                        <button
                          key={item.product}
                          type="button"
                          onClick={() => setReviewingItem(item)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border p-2 text-left transition-all",
                            reviewingItem?.product === item.product
                              ? "border-[color:var(--color-brand-primary)] bg-[color:var(--color-surface-muted)]"
                              : "border-[color:var(--color-border)]"
                          )}
                        >
                          <img src={item.image} alt="" className="h-9 w-9 rounded-lg object-cover bg-white" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[color:var(--color-text-primary)] truncate">{item.name}</p>
                            <p className="text-[10px] text-[color:var(--color-text-tertiary)]">{item.color}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {reviewingItem && (
                  <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-3">
                    <img src={reviewingItem.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-white" />
                    <div>
                      <p className="text-xs font-bold text-[color:var(--color-text-primary)]">{reviewingItem.name}</p>
                      <p className="text-[11px] text-[color:var(--color-text-tertiary)]">{reviewingItem.brand || "Khattak Eyewear"}</p>
                    </div>
                  </div>
                )}

                {reviewError && (
                  <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-500 font-medium">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Overall Rating</label>
                  <div className="mt-1.5 flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)}>
                        <Star className={cn("h-7 w-7 transition-all hover:scale-110", star <= rating ? "fill-amber-400 text-amber-400" : "text-[color:var(--color-text-tertiary)]")} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Review Headline (Optional)</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Exceptional frame quality and crystal clear optics!"
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-xs text-[color:var(--color-text-primary)] focus:border-[color:var(--color-brand-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[color:var(--color-text-secondary)]">Detailed Review</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Describe frame fit, lens clarity, comfort, packaging, or customer service..."
                    className="mt-1 w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3.5 py-2 text-xs text-[color:var(--color-text-primary)] focus:border-[color:var(--color-brand-primary)] focus:outline-none"
                  />
                </div>

                {/* Photo & Video Upload Section */}
                <div>
                  <label className="block text-xs font-semibold text-[color:var(--color-text-secondary)] mb-1.5">Attach Photos & Videos</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)] cursor-pointer transition-colors">
                      <ImagePlus className="h-4 w-4 text-[color:var(--color-brand-primary)]" />
                      <span>Add Photos</span>
                      <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <label className="flex items-center gap-1.5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-xs font-medium text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-panel)] cursor-pointer transition-colors">
                      <Video className="h-4 w-4 text-purple-600" />
                      <span>Add Video</span>
                      <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Previews */}
                  {(images.length > 0 || videos.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-[color:var(--color-border)] group">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {videos.map((vid, idx) => (
                        <div key={idx} className="relative h-14 w-14 rounded-lg overflow-hidden border border-[color:var(--color-border)] bg-black group">
                          <video src={vid} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setVideos((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 border-t border-[color:var(--color-border)] pt-4">
                  <Button variant="outline" onClick={() => setReviewOrder(null)} className="text-xs">
                    Cancel
                  </Button>
                  <Button variant="primary" disabled={submittingReview || !text} onClick={handleSubmitReview} className="text-xs">
                    {submittingReview ? "Submitting..." : "Publish Review"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AccountLayout>
  );
}

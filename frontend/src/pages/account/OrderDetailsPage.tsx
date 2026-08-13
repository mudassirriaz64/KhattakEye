import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, CreditCard, User, MapPin, FileText, HeadphonesIcon, Download, ShieldAlert, ExternalLink, Star, X, CheckCircle, ImagePlus, Video, Trash2 } from "lucide-react";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { AccountLayout } from "@/components/account/AccountLayout";
import { Button } from "@/components/primitives/Button";
import { getOrderByIdApi } from "@/lib/api/orders";
import { getPaymentMethodLabel } from "@/lib/utils/enum-labels";
import { cn } from "@/lib/utils";
import axios from "@/lib/api/axios";

export function AccountOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingProduct, setReviewingProduct] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      getOrderByIdApi(id)
        .then((data) => setOrder(data))
        .catch((err) => console.error("Failed to load order details:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

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

  const handleSubmitReview = async () => {
    if (!reviewingProduct || !text) return;
    setSubmittingReview(true);
    setReviewError("");
    try {
      const pId = reviewingProduct.product?._id || reviewingProduct.product || reviewingProduct.id;
      await axios.post("/reviews", {
        productId: pId,
        orderId: order._id,
        rating,
        title,
        text,
        images,
        videos
      });
      setReviewSuccess("Thank you! Your verified product review with media has been published.");
      setTimeout(() => {
        setReviewingProduct(null);
        setReviewSuccess("");
        setTitle("");
        setText("");
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

  if (loading) {
    return (
      <AccountLayout title="Order Details" subtitle="Loading...">
        <div className="py-20 text-center">
          <p className="text-sm text-[color:var(--color-text-tertiary)]">Loading your order details...</p>
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout title="Order Details" subtitle="Order not found">
        <div className="py-20 text-center">
          <p className="text-base text-[color:var(--color-text-primary)]">Order not found</p>
          <Link to="/account/orders" className="mt-4 inline-block text-xs font-semibold text-[color:var(--color-brand-primary)] hover:underline">
            Back to Orders
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const shippingAddrStr = order.shippingAddress
    ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.area || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.province || ''}`
    : "Standard Address";

  const details = [
    { icon: CreditCard, label: "Payment Method", value: `${getPaymentMethodLabel(order.paymentMethod)} (${order.paymentType === 'advance' ? '50% Advance Policy' : 'Full Payment'})` },
    { icon: User, label: "Customer", value: `${order.customerName}\n${order.customerEmail}\n${order.customerPhone}` },
    { icon: MapPin, label: "Shipping Address", value: shippingAddrStr },
    { icon: FileText, label: "Order Number", value: order.orderNumber },
  ];

  const isPendingQuote = order.status === "pending-quote" || order.items?.some((i: any) => i.customization?.priceOnRequest && i.customization?.priceAdded === null);

  return (
    <AccountLayout title="Order Details" subtitle={`${order.orderNumber} — ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}`}>
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]">
          <ArrowLeft className="h-3 w-3" /> Back to Orders
        </Link>
        <Link to={`/track-order?id=${order.orderNumber}`}>
          <Button variant="outline" iconLeft={<Package className="h-3.5 w-3.5" />} className="text-xs">Track Order</Button>
        </Link>
        <Link to={`/invoice?id=${order._id || order.id || order.orderNumber}`}>
          <Button variant="outline" iconLeft={<Download className="h-3.5 w-3.5" />} className="text-xs">Invoice</Button>
        </Link>
      </div>

      {isPendingQuote && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold">Custom Lens Price Pending Quote</p>
            <p className="mt-0.5">Your order contains custom high-index lenses. Our optician team will confirm the final price for your prescription and update your order total shortly.</p>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Order Timeline</h3>
        <div className="mt-4">
          <OrderTimeline entries={order.timeline || []} currentStatus={order.status} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
        <h3 className="font-display text-lg text-[color:var(--color-text-primary)]">Items</h3>
        <div className="mt-4 space-y-4">
          {order.items?.map((item: any, i: number) => {
            const c = item.customization;
            const lensChain = [
              c?.lensCoatingName || c?.lensCoating,
              c?.lensOptionCollectionName || c?.lensOptionCollectionSlug,
              c?.lensOptionBrandName || c?.lensOptionBrandSlug,
              c?.lensOptionTypeName || c?.lensOptionTypeSlug,
              c?.tintColor ? `Tint: ${c.tintColor} (${c.tintStrength || ''})` : null
            ].filter(Boolean).join(" → ");

            return (
              <div key={i} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-app-bg)] p-4">
                <div className="flex items-start gap-4">
                  <img src={item.image} alt={item.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{item.name}</p>
                    <p className="text-xs text-[color:var(--color-text-tertiary)]">{item.brand} · {item.color} · Qty: {item.quantity}</p>

                    {lensChain && (
                      <div className="mt-2 rounded-lg bg-[color:var(--color-surface-muted)] p-2.5 text-xs">
                        <p className="font-semibold text-[color:var(--color-text-primary)]">Lens Selection:</p>
                        <p className="text-[color:var(--color-text-secondary)]">{lensChain}</p>
                        {c?.usageType && <p className="mt-0.5 text-[10px] text-[color:var(--color-text-tertiary)]">Usage: {c.usageType} {c.multifocalSubtype ? `(${c.multifocalSubtype})` : ''}</p>}
                      </div>
                    )}

                    {c?.prescriptionType && c.prescriptionType !== "none" && (
                      <div className="mt-2 rounded-lg bg-[color:var(--color-surface-muted)] p-2.5 text-xs">
                        <p className="font-semibold text-[color:var(--color-text-primary)]">Prescription ({c.prescriptionType}):</p>
                        {c.prescriptionType === "manual" && c.prescriptionData && (
                          <div className="mt-1 grid grid-cols-5 gap-2 text-center text-[10px]">
                            <div><span className="font-medium">OD SPH:</span> {c.prescriptionData.od?.sph ?? '-'}</div>
                            <div><span className="font-medium">CYL:</span> {c.prescriptionData.od?.cyl ?? '-'}</div>
                            <div><span className="font-medium">AXIS:</span> {c.prescriptionData.od?.axis ?? '-'}</div>
                            <div><span className="font-medium">ADD:</span> {c.prescriptionData.od?.add ?? '-'}</div>
                            <div><span className="font-medium">PD:</span> {typeof c.prescriptionData.pd === 'object' ? `${c.prescriptionData.pdTwo?.od || '-'}/${c.prescriptionData.pdTwo?.os || '-'}` : c.prescriptionData.pd || '-'}</div>
                            <div><span className="font-medium">OS SPH:</span> {c.prescriptionData.os?.sph ?? '-'}</div>
                            <div><span className="font-medium">CYL:</span> {c.prescriptionData.os?.cyl ?? '-'}</div>
                            <div><span className="font-medium">AXIS:</span> {c.prescriptionData.os?.axis ?? '-'}</div>
                            <div><span className="font-medium">ADD:</span> {c.prescriptionData.os?.add ?? '-'}</div>
                          </div>
                        )}
                        {c.prescriptionType === "written" && (
                          <p className="mt-0.5 italic text-[color:var(--color-text-secondary)]">{c.prescriptionText}</p>
                        )}
                        {c.prescriptionType === "file" && c.prescriptionFilePublicId && (
                          <a href={`https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'}/image/upload/${c.prescriptionFilePublicId}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-[color:var(--color-brand-primary)] hover:underline">
                            <ExternalLink className="h-3 w-3" /> View Uploaded Prescription Document
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold">
                      {c?.priceOnRequest && c?.priceAdded === null ? "Price Pending" : `Rs. ${(item.price * item.quantity).toLocaleString()}`}
                    </p>
                    {(order.status === "closed" || order.status === "delivered") && item.product && (
                      <button
                        type="button"
                        onClick={() => setReviewingProduct(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-brand-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-all"
                      >
                        <Star className="h-3.5 w-3.5 fill-white text-white" /> Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 space-y-2 border-t border-[color:var(--color-border)] pt-5 text-sm">
          <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Subtotal</span><span>Rs. {order.subtotal?.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-[color:var(--color-text-secondary)]">Shipping</span><span>{order.shipping === 0 ? "Free" : `Rs. ${order.shipping}`}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent-teal)]"><span>Discount</span><span>-Rs. {order.discount?.toLocaleString()}</span></div>}
          <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-semibold">
            <span>Total</span><span>Rs. {order.total?.toLocaleString()}</span>
          </div>

          {order.paymentType === "advance" && (
            <div className="mt-2 rounded-xl bg-[color:var(--color-surface-muted)] p-3 text-xs space-y-1">
              <div className="flex justify-between"><span>50% Advance Expected:</span><span className="font-semibold">Rs. {Math.round(order.total / 2).toLocaleString()}</span></div>
              {order.paymentProof?.amountPaid && (
                <div className="flex justify-between text-emerald-600"><span>Amount Paid:</span><span className="font-semibold">Rs. {order.paymentProof.amountPaid.toLocaleString()}</span></div>
              )}
              <div className="flex justify-between text-[color:var(--color-text-tertiary)]"><span>Remaining Balance at Delivery:</span><span>Rs. {(order.total - (order.paymentProof?.amountPaid || Math.round(order.total / 2))).toLocaleString()}</span></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
              <item.icon className="h-3 w-3" /> {item.label}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-[color:var(--color-text-primary)]">{item.value}</p>
          </div>
        ))}
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
            <HeadphonesIcon className="h-3 w-3" /> Need Help?
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" className="flex-1 text-xs">Live Chat</Button>
            <Button variant="outline" className="flex-1 text-xs">Call Support</Button>
          </div>
        </div>
      </div>

      {/* Product Review Modal */}
      {reviewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] pb-4">
              <div className="flex items-center gap-3">
                <img src={reviewingProduct.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <h3 className="font-display text-base font-bold text-[color:var(--color-text-primary)]">Write a Product Review</h3>
                  <p className="text-xs text-[color:var(--color-text-tertiary)]">{reviewingProduct.name}</p>
                </div>
              </div>
              <button type="button" onClick={() => setReviewingProduct(null)} className="rounded-lg p-1 text-[color:var(--color-text-tertiary)] hover:bg-[color:var(--color-surface-muted)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="my-6 rounded-2xl bg-emerald-500/10 p-6 text-center text-emerald-600">
                <CheckCircle className="mx-auto h-10 w-10" />
                <p className="mt-2 font-display text-base font-bold">{reviewSuccess}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
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
                  <Button variant="outline" onClick={() => setReviewingProduct(null)} className="text-xs">
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

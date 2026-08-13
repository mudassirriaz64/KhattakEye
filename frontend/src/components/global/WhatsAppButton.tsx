import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "@/lib/api/axios";

export function WhatsAppButton() {
  const [waNumber, setWaNumber] = useState("923001234567");

  useEffect(() => {
    axios.get("/settings").then((res) => {
      if (res.data?.contact) {
        const raw = res.data.contact.whatsapp || res.data.contact.phone || "923001234567";
        setWaNumber(raw.replace(/[^0-9]/g, ""));
      }
    }).catch(() => {});
  }, []);

  return (
    <motion.a
      href={`https://wa.me/${waNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.4 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] ring-4 ring-white/60 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" style={{ animationDuration: "3s" }} />
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}

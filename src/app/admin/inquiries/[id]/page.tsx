import type { Metadata } from "next";
import { InquiryDetailClient } from "@/components/admin/InquiryDetailClient";
export const metadata: Metadata = { title: "Inquiry Detail" };
export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  return <InquiryDetailClient id={params.id} />;
}

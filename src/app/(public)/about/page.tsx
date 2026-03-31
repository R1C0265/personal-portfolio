import type { Metadata } from "next";
import { AboutClient } from "@/components/public/AboutClient";
export const metadata: Metadata = { title: "About Us" };
export default function AboutPage() { return <AboutClient />; }

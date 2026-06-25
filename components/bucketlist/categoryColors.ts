import { BucketCategory } from "@/lib/types";

export const BUCKET_CATEGORIES: BucketCategory[] = [
  "Travel",
  "Career",
  "Experience",
  "Personal",
  "Health",
  "Creative",
  "Financial",
];

export const CATEGORY_COLOR_CLASSES: Record<BucketCategory, string> = {
  Travel: "bg-ice/15 text-ice border-ice/30",
  Career: "bg-sage/15 text-sage border-sage/30",
  Experience: "bg-[#c7b8f0]/15 text-[#c7b8f0] border-[#c7b8f0]/30",
  Personal: "bg-grey/15 text-grey border-grey/30",
  Health: "bg-[#e3a0a8]/15 text-[#e3a0a8] border-[#e3a0a8]/30",
  Creative: "bg-[#f0c98a]/15 text-[#f0c98a] border-[#f0c98a]/30",
  Financial: "bg-[#8fc4e3]/15 text-[#8fc4e3] border-[#8fc4e3]/30",
};

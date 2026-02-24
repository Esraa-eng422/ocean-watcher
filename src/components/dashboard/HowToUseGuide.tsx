import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

const steps = [
  "📡 الخطوة 1: ارفع صورة SAR من القمر الصناعي Sentinel-1 (GeoTIFF) لاكتشاف بقع الزيت المحتملة.",
  "🌊 الخطوة 2: شاهد خريطة التنبؤ بالانجراف مع انتشار الجسيمات (يتطلب اتصال بالإنترنت للخريطة).",
  "🔬 الخطوة 3: راجع نتائج التحقق من الفيزياء، الـ ML، والسياق التاريخي.",
  "📄 الخطوة 4: أنشئ تقرير PDF رسمي لاستخدام حرس السواحل.",
];

const HowToUseGuide = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="glass-card p-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-accent/15 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            How to Use This Dashboard — كيفية استخدام لوحة التحكم
          </span>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors">
          {open ? (
            <>
              Hide Guide <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show Guide <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </span>
      </button>

      {open && (
        <ul className="mt-4 space-y-2.5 pr-2" dir="rtl">
          {steps.map((step, i) => (
            <li
              key={i}
              className="text-sm text-muted-foreground leading-relaxed border-r-2 border-accent/30 pr-3"
            >
              {step}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HowToUseGuide;

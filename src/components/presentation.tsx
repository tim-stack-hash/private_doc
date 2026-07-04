import { useState, useCallback, useRef } from "react";

interface PresentationProps {
  slides: React.ReactNode[];
  initialSlide?: number;
}

export function Presentation({ slides, initialSlide = 0 }: PresentationProps) {
  const [current, setCurrent] = useState(initialSlide);
  const [prevContent, setPrevContent] = useState<React.ReactNode | null>(null);
  const [animating, setAnimating] = useState(false);
  const dirRef = useRef<1 | -1>(1);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      if (index === current || index < 0 || index >= slides.length) return;

      dirRef.current = index > current ? 1 : -1;
      setPrevContent(slides[current]);
      setCurrent(index);
      setAnimating(true);

      setTimeout(() => {
        setAnimating(false);
        setPrevContent(null);
      }, 600);
    },
    [current, animating, slides],
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  const dir = dirRef.current;
  const enterDir = dir === 1 ? "slide-in-from-right" : "slide-in-from-left";
  const exitDir = dir === 1 ? "slide-out-to-left" : "slide-out-to-right";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative">
        {animating && prevContent && (
          <div
            className={`absolute inset-0 z-10 animate-out ${exitDir} fade-out duration-600 ease-in-out`}
            style={{ animationFillMode: "forwards" }}
          >
            {prevContent}
          </div>
        )}
        <div
          key={current}
          className={animating ? `animate-in ${enterDir} fade-in duration-600 ease-in-out` : ""}
        >
          {slides[current]}
        </div>
      </div>

      <SlideNavigation
        current={current}
        total={slides.length}
        onPrev={prev}
        onNext={next}
        onGoTo={goTo}
        disabled={animating}
      />
    </div>
  );
}

interface SlideNavigationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  disabled: boolean;
}

function SlideNavigation({
  current,
  total,
  onPrev,
  onNext,
  onGoTo,
  disabled,
}: SlideNavigationProps) {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
      {current > 0 && (
        <button
          onClick={onPrev}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium shadow-lg hover:bg-secondary active:scale-95 transition-all disabled:opacity-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
      )}

      <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-card/80 backdrop-blur border shadow">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            disabled={disabled}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? "w-6 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Слайд ${i + 1}`}
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground font-medium tabular-nums">
          {current + 1}/{total}
        </span>
      </div>

      {current < total - 1 && (
        <button
          onClick={onNext}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
        >
          Далее
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

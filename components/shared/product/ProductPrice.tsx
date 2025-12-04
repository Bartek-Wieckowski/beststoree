import CONTENT_PAGE from "@/lib/content-page";
import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p
      className={cn("text-2xl", className)}
      data-testid="product-price-wrapper"
    >
      <span className="text-xs align-super">
        {CONTENT_PAGE.GLOBAL.currencySymbol}
      </span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}

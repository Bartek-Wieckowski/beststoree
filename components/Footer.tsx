import { APP_NAME } from "@/lib/constants";
import CONTENT_PAGE from "@/lib/content-page";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t pb-20 md:pb-0 md:mt-10">
      <div className="p-5 text-center">
        <span data-testid="current-year">{currentYear}</span>
        <span>&nbsp;{APP_NAME}.&nbsp;</span>
        <span className="block md:inline">
          {CONTENT_PAGE.COMPONENT.FOOTER.allRightsReserved}
        </span>
      </div>
    </footer>
  );
}

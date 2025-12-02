import { APP_NAME } from "@/lib/constants";
import CONTENT_PAGE from "@/lib/content-page";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        <span data-testid="current-year">{currentYear}</span>
        <span>&nbsp;{APP_NAME}.&nbsp;</span>
        <span>{CONTENT_PAGE.FOOTER.allRightsReserved}</span>
      </div>
    </footer>
  );
}

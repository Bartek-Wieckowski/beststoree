import Image from "next/image";
import loader from "@/assets/loader.gif";
import CONTENT_PAGE from "@/lib/content-page";

export default function Loading() {
  return (
    <div
      data-testid="loader"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image
        src={loader}
        height={150}
        width={150}
        alt={CONTENT_PAGE.GLOBAL.loading}
      />
    </div>
  );
}

import Link from "next/link";

const videoEmbedUrl = "https://www.youtube.com/embed/_3zGXICwiL4";
const presentationPath = "/Paytm%20SmartShop%20AI%20By%20Optimizers.pdf";

export default function PitchPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcecff_0%,#f7fbff_45%,#f4f7fd_100%)] px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <section className="rounded-3xl border border-[#dbe7ff] bg-white p-6 shadow-[0_20px_44px_rgba(14,75,178,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5270a7]">Pitch Assets</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#163b79] md:text-4xl">Paytm SmartShop AI - Demo Video and Presentation</h1>
          <p className="mt-3 text-sm text-[#5c739f] md:text-base">
            This page contains the uploaded YouTube demo and the presentation file from your `public` directory.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-2xl bg-[#0066ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,102,255,0.28)] transition hover:bg-[#0a57d6]"
            >
              Back To Prototype
            </Link>
            <a
              href={presentationPath}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[#e9f2ff] px-4 py-2.5 text-sm font-semibold text-[#1d4ca0] transition hover:bg-[#dce9ff]"
            >
              Open Presentation
            </a>
            <a
              href={presentationPath}
              download
              className="rounded-2xl bg-[#e9f2ff] px-4 py-2.5 text-sm font-semibold text-[#1d4ca0] transition hover:bg-[#dce9ff]"
            >
              Download Presentation
            </a>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#dbe7ff] bg-white p-4 shadow-[0_16px_36px_rgba(14,75,178,0.1)] md:p-5">
            <h2 className="text-lg font-semibold text-[#1f447e]">Demo Video</h2>
            <p className="mt-1 text-sm text-[#60749d]">YouTube walkthrough of the SmartShop AI journey.</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#dce8ff] bg-[#eef5ff]">
              <iframe
                title="Paytm SmartShop AI demo video"
                src={videoEmbedUrl}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <a
              href="https://youtu.be/_3zGXICwiL4"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-[#0a57d6] underline-offset-2 hover:underline"
            >
              Open on YouTube
            </a>
          </article>

          <article className="rounded-3xl border border-[#dbe7ff] bg-white p-4 shadow-[0_16px_36px_rgba(14,75,178,0.1)] md:p-5">
            <h2 className="text-lg font-semibold text-[#1f447e]">Presentation</h2>
            <p className="mt-1 text-sm text-[#60749d]">Embedded file: Paytm SmartShop AI By Optimizers.pdf</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#dce8ff] bg-[#f5f8ff]">
              <iframe
                title="Paytm SmartShop AI presentation"
                src={presentationPath}
                className="h-[480px] w-full"
              />
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

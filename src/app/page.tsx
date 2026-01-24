import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-24">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#007BFF]" />
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-slate-900">
                Visibuy
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                Buyer Verification
              </div>
            </div>
          </div>

          <a
            href="https://visibuy.com.ng/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[#007BFF] hover:underline"
          >
            Visit Visibuy.com.ng
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-14 lg:px-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Confirm what you’re buying <span className="text-[#007BFF]">before</span>{" "}
              payment is released.
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-600">
              This page helps buyers review a seller’s verification media (images/videos),
              approve or reject the verification, and if escrow is enabled, securely hold
              payment until delivery is confirmed.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/how-it-works"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-[#007BFF] px-5 text-sm font-semibold text-white hover:bg-[#0065d6]"
              >
                How verification works
              </Link>

              <a
                href="https://visibuy.com.ng/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Learn more about Visibuy
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoPill title="1" text="View verification media" />
              <InfoPill title="2" text="Approve or reject verification" />
              <InfoPill title="3" text="If escrow: pay → confirm delivery → release" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Already have a verification link?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Open the link that the seller shared with you. It will contain a public token.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-[#F9FBFF] p-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">Example:</p>
              <p className="mt-1 font-mono text-[11px] text-slate-700">
                /verify/4639e969-5bb3-4dd2-840a-e1b5b1d30d5c
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                If you don’t have a link, ask the seller to share their Visibuy verification page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoPill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs font-bold text-[#007BFF]">{title}</div>
      <div className="mt-1 text-xs font-semibold text-slate-700">{text}</div>
    </div>
  );
}

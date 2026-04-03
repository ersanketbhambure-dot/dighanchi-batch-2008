import Link from "next/link";
import HomePhotoSlider from "@/components/HomePhotoSlider";

const expectations = [
  {
    text: "जुन्या मित्रांना भेटा",
    classes: "from-amber-50 via-white to-orange-50 border-amber-100/80",
  },
  {
    text: "शिक्षकांशी पुन्हा संवाद साधा",
    classes: "from-sky-50 via-white to-cyan-50 border-sky-100/80",
  },
  {
    text: "बालपणीचे खेळ पुन्हा खेळा",
    classes: "from-emerald-50 via-white to-lime-50 border-emerald-100/80",
  },
  {
    text: "आठवणींना उजाळा द्या",
    classes: "from-rose-50 via-white to-pink-50 border-rose-100/80",
  },
  {
    text: "खानपान आणि आनंदाचा आस्वाद घ्या",
    classes: "from-violet-50 via-white to-indigo-50 border-violet-100/80",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto flex w-full max-w-6xl items-center px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
        <div className="w-full space-y-12 text-center">
          <div className="space-y-6">
            <p className="mx-auto max-w-xs text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 sm:max-w-none sm:text-base sm:tracking-[0.28em]">
              Diganchi HighSchool Diganchi - Batch 2008
            </p>
            <h1 className="mx-auto max-w-5xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
              18 वर्षांनंतर... पुन्हा एकदा भेटूया
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-xl sm:leading-8">
              जुन्या आठवणींना उजाळा देत पुन्हा एकदा सगळे एकत्र येऊया.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 rounded-[2rem] border border-white/80 bg-white/90 p-6 text-left shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:grid-cols-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Event
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                May-2026
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Date
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                06 May 2026
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Time
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                09:00 AM onwards
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Location
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Diganchi Highschool Diganchi
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/rsvp"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-sky-200 px-8 py-4 text-base font-semibold text-sky-950 shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:bg-sky-300 sm:w-auto sm:min-w-[220px]"
            >
              <span className="whitespace-nowrap text-sky-950">
                उपस्थिती नोंदवा
              </span>
            </Link>
            <Link
              href="/people"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-sky-300 bg-sky-100/90 px-8 py-4 text-base font-semibold text-sky-950 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-200 sm:w-auto sm:min-w-[220px]"
            >
              <span className="whitespace-nowrap text-sky-950">
                मित्रमंडळी पहा
              </span>
            </Link>
          </div>

          <HomePhotoSlider />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              काय खास असेल?
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              हसरे क्षण, जुन्या आठवणी आणि मनात कायम राहतील असे सुंदर
              अनुभवांनी भरलेला एक खास दिवस.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {expectations.map((item) => (
              <div
                key={item.text}
                className={`rounded-3xl border bg-gradient-to-br p-6 text-center shadow-sm transition hover:-translate-y-1 ${item.classes}`}
              >
                <p className="text-base font-semibold text-slate-800">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

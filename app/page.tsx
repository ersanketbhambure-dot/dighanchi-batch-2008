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

const eventSchedule = [
  { time: "10 वाजता", activity: "शाळा सुरु" },
  {
    time: "10:30 वाजता",
    activity: "नाष्टा (समोसा, ढोकळा & कोल्ड्रिंक्स)",
  },
  { time: "11 ते 2:30 वाजता", activity: "कार्यक्रम & गेम्स" },
  { time: "दुपारी 3 ते 4 वा.", activity: "जेवण (व्हेज) & आईस्क्रीम" },
  { time: "4 वाजता", activity: "सांगता समारंभ & फोटो सेशन" },
  { time: "5 वाजता", activity: "पाणीपुरी & शीरखुर्मा" },
];

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="mx-auto flex w-full max-w-6xl items-center px-4 pb-14 pt-12 sm:px-6 sm:pt-20">
        <div className="w-full space-y-12 text-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700 sm:text-base">
              DIGANCHI HIGHSCHOOL DIGANCHI - BATCH 2007-08
            </p>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-5xl lg:text-7xl">
              18 वर्षांनंतर... पुन्हा एकदा भेटूया
            </h1>

            <p className="text-base text-slate-600 sm:text-xl">
              जुन्या आठवणींना उजाळा देत पुन्हा एकदा सगळे एकत्र येऊया.
            </p>
          </div>

          {/* EVENT INFO */}
          <div className="grid gap-4 rounded-3xl border bg-white p-6 shadow sm:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Event</p>
              <p className="font-semibold">May-2026</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-semibold">06 May 2026</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Time</p>
              <p className="font-semibold">09:00 AM onwards</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Location</p>
              <p className="font-semibold">
                Diganchi Highschool Diganchi
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/rsvp"
              className="rounded-full bg-sky-200 px-8 py-4 font-semibold text-sky-950 hover:bg-sky-300"
            >
              उपस्थिती नोंदवा
            </Link>

            <Link
              href="/people"
              className="rounded-full border border-sky-300 bg-sky-100 px-8 py-4 font-semibold text-sky-950 hover:bg-sky-200"
            >
              मित्रमंडळी पहा
            </Link>
          </div>

          <HomePhotoSlider />
        </div>
      </section>

      {/* EXPECTATIONS */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-white p-8 shadow">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              काय खास असेल?
            </h2>
            <p className="mt-2 text-slate-600">
              आठवणी, मित्र आणि आनंदाने भरलेला दिवस.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {expectations.map((item) => (
              <div
                key={item.text}
                className={`rounded-2xl border bg-gradient-to-br p-5 text-center ${item.classes}`}
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE SECTION */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-blue-50 p-6 sm:p-10 shadow">

          {/* Heading */}
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              DIGANCHI HIGHSCHOOL DIGANCHI BATCH 2007-08
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-5xl">
              गेट टू गेदर - 2026 वेळापत्रक
            </h2>
          </div>

          {/* Schedule Cards */}
          <div className="space-y-4">
            {eventSchedule.map((item) => (
              <div
                key={`${item.time}-${item.activity}`}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition"
              >
                {/* Time */}
                <p className="text-base font-semibold text-orange-600 sm:min-w-[160px]">
                  {item.time}
                </p>

                {/* Activity */}
                <p className="text-base text-slate-700">
                  {item.activity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
import { BatchmateStatus } from "@/data/batchmates";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const statusClasses = {
  Attending: "bg-emerald-100 text-emerald-700",
  "Not Attending": "bg-rose-100 text-rose-700",
  Pending: "bg-amber-100 text-amber-700",
};

type ContributionStatus = "Paid" | "Pending" | "Not Paid";
type GenderFlag = "Female" | "Male" | "Unknown";

const contributionStatusClasses = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Not Paid": "bg-rose-100 text-rose-700",
};

const priorityNames = [
  "Sanket Bhambure",
  "Sagar Chavan",
  "Shahid Jamadar",
  "Dhanashri More",
  "Kishori Patil",
];

type RsvpRow = {
  id: number;
  name: string;
  attending: string;
  contribution_status: string | null;
  gender_flag: string | null;
  created_at: string;
};

type PersonWithStatus = {
  name: string;
  status: BatchmateStatus;
  contributionStatus: ContributionStatus;
  genderFlag: GenderFlag;
};

const cardStylesByGender = {
  Female:
    "border-rose-200 bg-gradient-to-br from-rose-100/95 via-rose-50 to-pink-100/90",
  Male: "border-sky-200 bg-gradient-to-br from-sky-100/95 via-sky-50 to-blue-100/90",
  Unknown: "border-white/80 bg-white/90",
};

function getStatus(attending: string): BatchmateStatus {
  if (attending === "Yes") {
    return "Attending";
  }

  if (attending === "No") {
    return "Not Attending";
  }

  return "Pending";
}

function getStatusOrder(status: BatchmateStatus) {
  if (status === "Attending") {
    return 0;
  }

  if (status === "Pending") {
    return 1;
  }

  return 2;
}

function getContributionStatus(value: string | null): ContributionStatus {
  if (value === "Paid") {
    return "Paid";
  }

  if (value === "Not Paid") {
    return "Not Paid";
  }

  return "Pending";
}

function getPriorityIndex(name: string) {
  return priorityNames.findIndex(
    (priorityName) => priorityName.toLowerCase() === name.toLowerCase(),
  );
}

function getGenderOrder(genderFlag: GenderFlag) {
  if (genderFlag === "Female") {
    return 0;
  }

  if (genderFlag === "Male") {
    return 1;
  }

  return 2;
}

function getGenderFlag(value: string | null): GenderFlag {
  if (value === "Female") {
    return "Female";
  }

  if (value === "Male") {
    return "Male";
  }

  return "Unknown";
}

export default async function PeoplePage() {
  let rsvpRows: RsvpRow[] = [];
  let errorMessage = "";

  if (!isSupabaseConfigured || !supabase) {
    errorMessage =
      "Supabase is not configured yet. Add your keys in .env.local to load live data.";
  } else {
    const { data, error } = await supabase
      .from("rsvps")
      .select("id, name, attending, contribution_status, gender_flag, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      errorMessage = error.message;
    } else {
      rsvpRows = data ?? [];
    }
  }

  const latestStatusByName = new Map<
    string,
    {
      status: BatchmateStatus;
      contributionStatus: ContributionStatus;
      genderFlag: GenderFlag;
    }
  >();

  for (const row of rsvpRows) {
    if (!latestStatusByName.has(row.name)) {
      latestStatusByName.set(row.name, {
        status: getStatus(row.attending),
        contributionStatus: getContributionStatus(row.contribution_status),
        genderFlag: getGenderFlag(row.gender_flag),
      });
    }
  }

  const people: PersonWithStatus[] = Array.from(latestStatusByName.entries())
    .map(([name, value]) => ({
      name,
      status: value.status,
      contributionStatus: value.contributionStatus,
      genderFlag: value.genderFlag,
    }))
    .sort((firstPerson, secondPerson) => {
      const firstPriorityIndex = getPriorityIndex(firstPerson.name);
      const secondPriorityIndex = getPriorityIndex(secondPerson.name);

      if (firstPriorityIndex !== -1 || secondPriorityIndex !== -1) {
        if (firstPriorityIndex === -1) {
          return 1;
        }

        if (secondPriorityIndex === -1) {
          return -1;
        }

        return firstPriorityIndex - secondPriorityIndex;
      }

      const genderDifference =
        getGenderOrder(firstPerson.genderFlag) -
        getGenderOrder(secondPerson.genderFlag);

      if (genderDifference !== 0) {
        return genderDifference;
      }

      return firstPerson.name.localeCompare(secondPerson.name);
    });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          Reunion Circle
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Friends
        </h1>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
          आपल्या मित्रमंडळींची उपस्थिती आणि वर्गणीची स्थिती एकाच ठिकाणी पहा.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          {errorMessage}
        </div>
      )}

      {!errorMessage && people.length === 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          अद्याप कोणतीही नोंद उपलब्ध नाही.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {people.map((person) => (
          <article
            key={person.name}
            className={`rounded-[1.75rem] border p-5 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur transition hover:-translate-y-1 sm:p-6 ${cardStylesByGender[person.genderFlag]}`}
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Batchmate
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                    {person.name}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {person.genderFlag === "Unknown" ? "N/A" : person.genderFlag}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/90 px-4 py-3">
                  <span className="text-sm font-medium text-slate-500">
                    उपस्थिती
                  </span>
                  <span
                    className={`inline-flex shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${statusClasses[person.status]}`}
                  >
                    {person.status}
                  </span>
                </div>

              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

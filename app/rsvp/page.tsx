"use client";

import { FormEvent, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type FormData = {
  name: string;
  phone: string;
  attending: string;
};

type NameRow = {
  id: number;
  name: string | null;
  phone: string | null;
  attending: string | null;
  created_at: string;
};

function isPendingAttendingValue(value: string | null) {
  if (value === null) {
    return true;
  }

  const normalizedValue = value.trim().toLowerCase();

  return (
    normalizedValue === "" ||
    normalizedValue === "no" ||
    normalizedValue === "empty" ||
    normalizedValue === "null"
  );
}

const initialFormData: FormData = {
  name: "",
  phone: "",
  attending: "Yes",
};

export default function RsvpPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [latestRowsByName, setLatestRowsByName] = useState<Record<string, NameRow>>(
    {},
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);

  useEffect(() => {
    async function loadNames() {
      if (!isSupabaseConfigured || !supabase) {
        setNameOptions([]);
        return;
      }

      setIsLoadingNames(true);

      const { data, error } = await supabase
        .from("rsvps")
        .select("id, name, phone, attending, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setNameOptions([]);
        setErrorMessage("Could not load names from database.");
        setIsLoadingNames(false);
        return;
      }

      const latestMap: Record<string, NameRow> = {};

      for (const row of (data as NameRow[] | null) ?? []) {
        const trimmedName = row.name?.trim();

        if (!trimmedName || latestMap[trimmedName]) {
          continue;
        }

        latestMap[trimmedName] = {
          ...row,
          name: trimmedName,
        };
      }

      const namesToUse = Object.values(latestMap)
        .filter((row) => isPendingAttendingValue(row.attending))
        .map((row) => row.name as string)
        .sort((firstName, secondName) => firstName.localeCompare(secondName));

      setLatestRowsByName(latestMap);
      setNameOptions(namesToUse);
      setFormData((currentFormData) => ({
        ...currentFormData,
        name: currentFormData.name || "",
      }));
      setIsLoadingNames(false);
    }

    loadNames();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage(
        "Supabase is not configured yet. Add your keys in .env.local first.",
      );
      return;
    }

    const selectedRow = latestRowsByName[formData.name];

    if (!selectedRow?.id) {
      setErrorMessage("Selected name was not found in the existing list.");
      return;
    }

    const normalizedPhone = formData.phone.trim();

    if (!/^\d{10}$/.test(normalizedPhone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      phone: normalizedPhone,
      attending: formData.attending,
    };

    console.log("RSVP Update Data:", { id: selectedRow.id, ...payload });

    const { error } = await supabase
      .from("rsvps")
      .update(payload)
      .eq("id", selectedRow.id);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Your RSVP has been updated successfully.");
    setFormData(initialFormData);
    setIsSubmitting(false);
    setNameOptions((currentNames) =>
      currentNames.filter((name) => name !== formData.name),
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.2fr]">
        <div className="space-y-6 rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Reunion Registration
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            उपस्थिती नोंदवा
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            मेळाव्यास उपस्थित राहणार आहात का, हे नोंदवण्यासाठी खालील सोपा फॉर्म
            भरा.
          </p>

          <div className="space-y-4 rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Why register now?
            </h2>
            <ul className="space-y-3 text-sm leading-7 text-slate-600">
              <li>तुमची उपस्थिती आधीच कळली तर नियोजन सोपे होते.</li>
              <li>मित्रमंडळींची अचूक यादी तयार करता येते.</li>
              <li>प्रत्येक मित्राला खासपणे सहभागी करता येते.</li>
            </ul>
          </div>

          {!isSupabaseConfigured && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Add your Supabase URL and anon key in <code>.env.local</code> to save data.
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8"
        >
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Name
            </label>
            <select
              id="name"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              disabled={isLoadingNames || nameOptions.length === 0}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-amber-300 focus:bg-white"
            >
              <option value="">
                {nameOptions.length === 0 ? "No names available" : "Select Name"}
              </option>
              {nameOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {isLoadingNames && (
              <p className="text-sm text-slate-500">Loading names...</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChange={(event) =>
                setFormData({ ...formData, phone: event.target.value })
              }
              inputMode="numeric"
              maxLength={10}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-amber-300 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="attending"
              className="block text-sm font-semibold uppercase tracking-[0.14em] text-slate-500"
            >
              Attending
            </label>
            <select
              id="attending"
              value={formData.attending}
              onChange={(event) =>
                setFormData({ ...formData, attending: event.target.value })
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-amber-300 focus:bg-white"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {successMessage && (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !formData.name}
            className="inline-flex w-full items-center justify-center rounded-full bg-sky-200 px-8 py-4 text-base font-semibold text-sky-950 shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:bg-sky-300 sm:w-auto sm:min-w-[220px]"
          >
            {isSubmitting ? "Saving..." : "नोंदवा"}
          </button>
        </form>
      </div>
    </section>
  );
}

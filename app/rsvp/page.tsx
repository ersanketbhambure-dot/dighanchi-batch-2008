"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type FormData = {
  name: string;
  attending: string;
};

type NameRow = {
  id: number;
  name: string | null;
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
  attending: "Yes",
};

export default function RsvpPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [nameOptions, setNameOptions] = useState<string[]>([]);
  const [latestRowsByName, setLatestRowsByName] = useState<Record<string, NameRow>>(
    {},
  );
  const [nameSearch, setNameSearch] = useState("");
  const [isNameListOpen, setIsNameListOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const normalizedTypedName = (formData.name || nameSearch).trim();

  const filteredNameOptions = useMemo(() => {
    const normalizedSearch = nameSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return nameOptions;
    }

    return nameOptions.filter((name) =>
      name.toLowerCase().includes(normalizedSearch),
    );
  }, [nameOptions, nameSearch]);

  useEffect(() => {
    async function loadNames() {
      if (!isSupabaseConfigured || !supabase) {
        setNameOptions([]);
        return;
      }

      setIsLoadingNames(true);

      const { data, error } = await supabase
        .from("rsvps")
        .select("id, name, attending, created_at")
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

    const normalizedName = formData.name.trim() || nameSearch.trim();

    if (!normalizedName) {
      setErrorMessage("Please select a name or type your name.");
      return;
    }

    const selectedRow = latestRowsByName[normalizedName];

    setIsSubmitting(true);

    const payload = {
      name: normalizedName,
      attending: formData.attending,
    };

    const { error } = selectedRow?.id
      ? await supabase.from("rsvps").update({ attending: payload.attending }).eq("id", selectedRow.id)
      : await supabase.from("rsvps").insert(payload);

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage(
      selectedRow?.id
        ? "Your RSVP has been updated successfully."
        : "Your name has been added and RSVP saved successfully.",
    );
    setFormData(initialFormData);
    setNameSearch("");
    setIsNameListOpen(false);
    setIsSubmitting(false);
    setNameOptions((currentNames) => {
      const updatedNames = selectedRow?.id
        ? currentNames
        : Array.from(new Set([...currentNames, normalizedName]));

      return updatedNames.sort((firstName, secondName) =>
        firstName.localeCompare(secondName),
      );
    });
    setLatestRowsByName((currentRows) => ({
      ...currentRows,
      [normalizedName]: {
        id: selectedRow?.id ?? currentRows[normalizedName]?.id ?? 0,
        name: normalizedName,
        attending: payload.attending,
        created_at: currentRows[normalizedName]?.created_at ?? new Date().toISOString(),
      },
    }));
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
            <div className="relative">
              <input
                id="name"
                type="text"
                value={formData.name || nameSearch}
                onChange={(event) => {
                  setFormData((currentFormData) => ({
                    ...currentFormData,
                    name: "",
                  }));
                  setNameSearch(event.target.value);
                  setIsNameListOpen(true);
                }}
                onFocus={() => setIsNameListOpen(true)}
                disabled={isLoadingNames}
                placeholder={
                  nameOptions.length === 0 ? "No names available" : "Type Name"
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-4 text-lg text-slate-900 outline-none transition focus:border-amber-300 focus:bg-white"
                autoComplete="off"
              />

              {isNameListOpen && filteredNameOptions.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {filteredNameOptions.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setFormData((currentFormData) => ({
                          ...currentFormData,
                          name,
                        }));
                        setNameSearch("");
                        setIsNameListOpen(false);
                      }}
                      className="block w-full rounded-xl px-4 py-3 text-left text-base text-slate-700 transition hover:bg-slate-50"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isLoadingNames && (
              <p className="text-sm text-slate-500">Loading names...</p>
            )}
            {!isLoadingNames && isNameListOpen && filteredNameOptions.length === 0 && (
              <p className="text-sm text-slate-500">
                No matching names found. You can type your name and submit it.
              </p>
            )}
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
            disabled={isSubmitting || !normalizedTypedName}
            className="inline-flex w-full items-center justify-center rounded-full bg-sky-200 px-8 py-4 text-base font-semibold text-sky-950 shadow-lg shadow-sky-200/70 transition hover:-translate-y-0.5 hover:bg-sky-300 sm:w-auto sm:min-w-[220px]"
          >
            {isSubmitting ? "Saving..." : "नोंदवा"}
          </button>
        </form>
      </div>
    </section>
  );
}

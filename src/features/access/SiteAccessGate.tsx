import axios from "axios";
import { Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";

import { checkSiteAccess, unlockSite } from "@/api/siteAccess";
import {
  clearSiteAccessToken,
  setSiteAccessToken,
  SITE_ACCESS_REQUIRED_EVENT,
} from "@/api/siteAccessStorage";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";

type GateState = "checking" | "locked" | "unlocked" | "unavailable";

export function SiteAccessGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("checking");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const verifyAccess = useCallback(async () => {
    setState("checking");
    setError("");

    try {
      const result = await checkSiteAccess();
      setState(result.authenticated || !result.required ? "unlocked" : "locked");
    } catch {
      setState("unavailable");
      setError("We could not verify access right now. Please check your connection and try again.");
    }
  }, []);

  useEffect(() => {
    void verifyAccess();
  }, [verifyAccess]);

  useEffect(() => {
    const requireAccess = () => {
      clearSiteAccessToken();
      setPasscode("");
      setState("locked");
    };

    window.addEventListener(SITE_ACCESS_REQUIRED_EVENT, requireAccess);
    return () => window.removeEventListener(SITE_ACCESS_REQUIRED_EVENT, requireAccess);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passcode || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const result = await unlockSite(passcode);
      if (result.token) setSiteAccessToken(result.token);
      setPasscode("");
      setState("unlocked");
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 403) {
        setError("That passcode is incorrect. Please try again.");
      } else if (axios.isAxiosError(requestError) && requestError.response?.status === 429) {
        setError("Too many attempts. Please wait a minute before trying again.");
      } else {
        setError("We could not verify the passcode. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (state === "unlocked") return <>{children}</>;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f4ef] px-4 py-10">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-200/60 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent-100/70 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#183328_0.7px,transparent_0.7px)] [background-size:24px_24px] opacity-[0.06]" />
      </div>

      <main className="relative w-full max-w-md" aria-labelledby="access-title">
        <div className="mb-7 flex justify-center">
          <Wordmark className="h-11" withTagline />
        </div>

        <section className="rounded-2xl border border-white/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(24,51,40,0.14)] backdrop-blur sm:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            {state === "checking" ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            ) : (
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            )}
          </div>

          <p className="label-eyebrow mb-2">Private access</p>
          <h1 id="access-title" className="text-2xl font-bold text-charcoal-900 sm:text-3xl">
            {state === "checking" ? "Checking access" : "Enter your passcode"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-charcoal-500">
            {state === "checking"
              ? "Please wait while we securely verify this browser."
              : "This website is private. Enter the passcode you received to continue."}
          </p>

          {state === "locked" && (
            <form className="mt-7" onSubmit={handleSubmit}>
              <label htmlFor="site-passcode" className="text-sm font-medium text-charcoal-800">
                Passcode
              </label>
              <div className="relative mt-1.5">
                <input
                  id="site-passcode"
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(event) => setPasscode(event.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "access-error" : undefined}
                  className="h-12 w-full rounded-lg border border-charcoal-300 bg-white px-3 pe-12 text-base text-charcoal-900 placeholder:text-charcoal-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                  placeholder="Enter passcode"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode((visible) => !visible)}
                  className="absolute inset-y-0 end-0 flex w-12 items-center justify-center text-charcoal-400 transition-colors hover:text-charcoal-700"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <p id="access-error" role="alert" className="mt-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" loading={submitting} className="mt-5 w-full">
                Continue
              </Button>
            </form>
          )}

          {state === "unavailable" && (
            <div className="mt-6">
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
              <Button type="button" variant="outline" className="mt-4 w-full" onClick={verifyAccess}>
                Try again
              </Button>
            </div>
          )}

          <div className="mt-7 flex items-center gap-2 border-t border-charcoal-100 pt-5 text-xs text-charcoal-400">
            <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Your passcode is verified securely and is never stored in this browser.
          </div>
        </section>
      </main>
    </div>
  );
}

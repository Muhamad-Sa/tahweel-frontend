import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-700">404</p>
      <h1 className="mt-4 font-display text-xl font-semibold text-charcoal-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-charcoal-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <ButtonLink to="/" className="mt-6">
        Back to home
      </ButtonLink>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/api/endpoints";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  country: z.string().optional(),
  inquiry_type: z.enum([
    "general",
    "sales",
    "technical_support",
    "quotation",
    "material_submittal",
    "distributor",
  ]),
  project_name: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const INQUIRY_TYPES: { value: ContactFormValues["inquiry_type"]; label: string }[] = [
  { value: "general", label: "General inquiry" },
  { value: "sales", label: "Sales" },
  { value: "technical_support", label: "Technical support" },
  { value: "quotation", label: "Request a quotation" },
  { value: "material_submittal", label: "Material submittal" },
  { value: "distributor", label: "Distributor / partnership" },
];

export default function ContactPage() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiry_type: "general" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await api.contact.submit(values);
      toast.push("Thanks — your message has been sent. Our team will respond shortly.", "success");
      reset({ inquiry_type: "general" } as ContactFormValues);
    } catch (err: any) {
      const detail = err?.response?.data;
      const message =
        typeof detail === "object" && detail
          ? Object.values(detail).flat().join(" ")
          : "Something went wrong. Please try again.";
      toast.push(message || "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Contact" }]} />
      <h1 className="mt-3 font-display text-3xl font-bold text-charcoal-950">Contact Us</h1>
      <p className="mt-1 max-w-2xl text-sm text-charcoal-500">
        Get in touch for quotations, technical support, distributor inquiries or general questions.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 lg:col-span-2" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" required {...register("name")} error={errors.name?.message} />
            <Input label="Email" type="email" required {...register("email")} error={errors.email?.message} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Company" {...register("company")} />
            <Input label="Phone" {...register("phone")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Country" {...register("country")} />
            <Select label="Inquiry type" {...register("inquiry_type")}>
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <Input label="Project name" {...register("project_name")} />
          <Textarea
            label="Message"
            required
            rows={5}
            placeholder="Tell us about your project or question…"
            {...register("message")}
            error={errors.message?.message}
          />
          <Button type="submit" size="lg" loading={isSubmitting} className="self-start">
            Send message
          </Button>
        </form>

        <div className="flex flex-col gap-5">
          <ContactItem icon={UserRound} label="Contact" value="Youssef Samir" />
          <ContactItem icon={BriefcaseBusiness} label="Position" value="Area Projects Manager" />
          <ContactItem icon={Phone} label="Phone" value="0558567576" href="tel:0558567576" />
          <ContactItem
            icon={Mail}
            label="Email"
            value="youssef.samier@tahweel.com"
            href="mailto:youssef.samier@tahweel.com"
          />
          <ContactItem icon={MapPin} label="Address" value="Riyadh, Saudi Arabia" />
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded border border-charcoal-200 bg-white p-4">
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" strokeWidth={1.5} />
      <div>
        <p className="text-xs uppercase tracking-wide text-charcoal-400">{label}</p>
        {href ? (
          <a href={href} className="mt-0.5 block break-all text-sm font-semibold text-charcoal-900 hover:text-brand-700">
            {value}
          </a>
        ) : (
          <p className="mt-0.5 text-sm font-semibold text-charcoal-900">{value}</p>
        )}
      </div>
    </div>
  );
}

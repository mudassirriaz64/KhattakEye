import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import {
  CheckboxField,
  SearchField,
  SelectField,
  TextAreaField,
  TextField,
  ToggleField,
} from "@/components/primitives/FormControls";
import { PageHeader } from "@/components/shared/PageHeader";
import { SurfaceCard } from "@/components/shared/SurfaceCard";

export function FormsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Components / Forms"
        title="Quiet forms with sharp focus states and low visual friction."
        description="Inputs should disappear into the experience until users need them. Focus, error, and helper text patterns provide clarity without making the interface feel clinical."
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Field system">
          <div className="grid gap-5">
            <SearchField label="Search eyewear" placeholder="Search titanium, acetate, round..." helper="Large search input for collection discovery." />
            <TextField label="Full name" placeholder="Khattak Eyewear Client" helper="Use default state for personal details." />
            <TextField
              label="Phone number"
              placeholder="+92 300 1234567"
              error="Phone number needs a valid format."
              defaultValue="+92"
            />
            <SelectField label="Frame preference" defaultValue="titanium">
              <option value="titanium">Titanium</option>
              <option value="acetate">Acetate</option>
              <option value="rimless">Rimless</option>
            </SelectField>
            <TextAreaField label="Styling notes" placeholder="Mention face shape, lens needs, or frame reference." />
          </div>
        </SurfaceCard>

        <SurfaceCard title="Selection controls">
          <div className="grid gap-5">
            <CheckboxField label="Save this prescription for future orders" helper="Supports consent and account convenience flows." />
            <ToggleField label="Enable premium care reminders" helper="Useful for service follow-up and reminders." />
            <div className="rounded-[18px] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-secondary)]">
                Quantity selector
              </p>
              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-[color:var(--color-border)] bg-white px-3 py-2">
                <button type="button" className="rounded-full p-2 hover:bg-[color:var(--color-surface-muted)]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center font-medium text-[color:var(--color-text-primary)]">1</span>
                <button type="button" className="rounded-full p-2 hover:bg-[color:var(--color-surface-muted)]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="rounded-[18px] border border-dashed border-[color:var(--color-border-strong)] bg-[color:var(--color-panel)] p-5 text-sm leading-7 text-[color:var(--color-text-secondary)]">
              Upload zones for prescription images, payment slips, and support documents should use the same radius, border contrast, and helper messaging.
            </div>
            <Button variant="success">Apply coupon / upload state ready</Button>
          </div>
        </SurfaceCard>
      </section>
    </>
  );
}

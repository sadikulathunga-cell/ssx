import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Heart, MapPin, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const features = [
  {
    icon: MapPin,
    title: "Find local talent",
    body: "Browse trusted photographers by name and style, and connect with the right person for your story.",
  },
  {
    icon: Camera,
    title: "See real work",
    body: "Every photographer shares a living feed of photos and video updates — no stock, just their craft.",
  },
  {
    icon: Heart,
    title: "Book with confidence",
    body: "Compare devices, packages and pricing up front, then reach out directly. Simple and transparent.",
  },
];

const gallery = [gallery1, gallery3, gallery2];

function Index() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Wedding couple silhouetted in golden light"
          className="absolute inset-0 h-full w-full object-cover"
          width={1600}
          height={1100}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Storytelling through light
          </p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Beautiful photography for{" "}
            <span className="text-gradient">weddings, portraits & travel.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Aperture is where photographers showcase their craft and clients find
            the perfect person to capture their moments — honest, cinematic and
            personal.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/photographers">
                Browse photographers <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full"
            >
              <Link to="/dashboard">Join as a photographer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-card p-8 shadow-elegant"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mb-2 font-mono text-xs text-muted-foreground">
                0{i + 1}
              </p>
              <h3 className="text-xl">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Featured work</p>
            <h2 className="text-4xl md:text-5xl">Moments worth keeping</h2>
          </div>
          <Link
            to="/photographers"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline md:flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {gallery.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-border"
            >
              <img
                src={src}
                alt="Featured photography work"
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-center shadow-elegant md:p-20">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-accent)" }}
          />
          <p className="eyebrow mb-4">Let's connect</p>
          <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">
            Let's create something unforgettable.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Whether you're looking to book a shoot or share your own work, Aperture
            is your home.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/photographers">Find a photographer</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/dashboard">Set up my studio</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

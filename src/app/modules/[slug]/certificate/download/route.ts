import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { getModule } from "@/lib/modules";
import { CertificateDocument } from "@/lib/certificate/pdf";

// Rendering fonts and images from disk needs the Node runtime, not Edge.
export const runtime = "nodejs";

/** "Jane Smith" -> "jane-smith", for the download filename. */
function slugifyName(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "certificate"
  );
}

export async function GET(
  request: Request,
  ctx: RouteContext<"/modules/[slug]/certificate/download">,
) {
  const { slug } = await ctx.params;
  const mod = getModule(slug);
  if (!mod) return new Response("Not found", { status: 404 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorised", { status: 401 });

  const [{ data: profile }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, salon_name")
      .eq("id", user.id)
      .single(),
    supabase
      .from("module_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("module_slug", slug)
      .maybeSingle(),
  ]);

  if (!progress?.completed_at) {
    return new Response("Module not completed", { status: 403 });
  }

  const fullName = profile?.full_name || "Certificate holder";
  const completedDate = new Date(progress.completed_at).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const pdf = await renderToBuffer(
    CertificateDocument({
      fullName,
      salonName: profile?.salon_name || undefined,
      moduleTitle: mod.title,
      completedDate,
    }),
  );

  const filename = `its-not-gossip-certificate-${slugifyName(fullName)}.pdf`;

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(pdf.length),
      // Contains the holder's name: never let a shared cache keep it.
      "Cache-Control": "private, no-store",
    },
  });
}

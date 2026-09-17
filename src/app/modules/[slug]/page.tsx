import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModule } from "@/lib/modules";
import { ModulePlayer } from "@/components/ModulePlayer";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: progress }, { data: surveys }] = await Promise.all([
    supabase
      .from("module_progress")
      .select("current_step, answers, completed_at")
      .eq("user_id", user.id)
      .eq("module_slug", slug)
      .maybeSingle(),
    supabase
      .from("survey_responses")
      .select("phase")
      .eq("user_id", user.id)
      .eq("module_slug", slug),
  ]);

  const phases = new Set((surveys ?? []).map((s) => s.phase));

  return (
    <ModulePlayer
      module={mod}
      userId={user.id}
      initialStep={progress?.current_step ?? 0}
      initialQuizCorrect={
        (progress?.answers as Record<string, boolean>) ?? {}
      }
      initialSurveysDone={{
        pre: phases.has("pre"),
        post: phases.has("post"),
      }}
      alreadyCompleted={Boolean(progress?.completed_at)}
    />
  );
}

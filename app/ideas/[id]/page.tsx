import { Suspense } from "react";
import IdeaDetail from "./idea-detail";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <IdeaLoader params={params} />
    </Suspense>
  );
}

async function IdeaLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IdeaDetail id={Number(id)} />;
}
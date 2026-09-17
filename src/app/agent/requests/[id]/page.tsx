import { RequestDetail } from "@/components/agent/RequestDetail";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  return <RequestDetail id={id} />;
}

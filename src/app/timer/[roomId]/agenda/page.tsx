import { getRoom } from "@/features/timer/lib/rooms";
import { notFound } from "next/navigation";
import AgendaClient from "./agenda-client";

export const dynamic = "force-dynamic";

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();
  return <AgendaClient roomId={room.id} roomName={room.name} />;
}

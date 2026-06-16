import { getRoom } from "@/features/timer/lib/rooms";
import { notFound } from "next/navigation";
import ModeratorClient from "./moderator-client";

export const dynamic = "force-dynamic";

export default async function ModeratorPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();
  return <ModeratorClient roomId={room.id} roomName={room.name} />;
}

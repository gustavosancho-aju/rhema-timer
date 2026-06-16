import { getRoom } from "@/features/timer/lib/rooms";
import { notFound } from "next/navigation";
import ViewerClient from "./viewer-client";

export const dynamic = "force-dynamic";

export default async function ViewerPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await getRoom(roomId);
  if (!room) notFound();
  return <ViewerClient roomId={room.id} roomName={room.name} />;
}

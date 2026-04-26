import { getRoom } from "@/lib/timer/rooms";
import ControllerClient from "./controller-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ControllerPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = getRoom(roomId);
  if (!room) notFound();
  return <ControllerClient roomId={room.id} roomName={room.name} />;
}

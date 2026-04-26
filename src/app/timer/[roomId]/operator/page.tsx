import { getRoom } from "@/lib/timer/rooms";
import { notFound } from "next/navigation";
import OperatorClient from "./operator-client";

export const dynamic = "force-dynamic";

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = getRoom(roomId);
  if (!room) notFound();
  return <OperatorClient roomId={room.id} roomName={room.name} />;
}

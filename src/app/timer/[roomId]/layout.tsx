import { notFound } from "next/navigation";
import { getRoom } from "@/features/timer/lib/rooms";

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = getRoom(roomId);
  if (!room) notFound();
  return <>{children}</>;
}

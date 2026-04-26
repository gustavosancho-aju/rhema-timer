import { listRooms } from "@/lib/timer/rooms";
import RoomsClient from "./rooms-client";

export const dynamic = "force-dynamic";

export default function TimerPage() {
  const rooms = listRooms().map((r) => ({
    id: r.id,
    name: r.name,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
  return <RoomsClient initialRooms={rooms} />;
}

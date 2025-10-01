import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Rooms() {
  const mockRooms = [
    {
      id: "1",
      name: "Deluxe Suite 301",
      type: "Deluxe Suite",
      capacity: 2,
      price: "150",
      status: "available" as const,
    },
    {
      id: "2",
      name: "Standard Room 205",
      type: "Standard Room",
      capacity: 2,
      price: "80",
      status: "occupied" as const,
    },
    {
      id: "3",
      name: "Premium Suite 402",
      type: "Premium Suite",
      capacity: 4,
      price: "220",
      status: "available" as const,
    },
    {
      id: "4",
      name: "Standard Room 108",
      type: "Standard Room",
      capacity: 2,
      price: "80",
      status: "maintenance" as const,
    },
    {
      id: "5",
      name: "Deluxe Suite 305",
      type: "Deluxe Suite",
      capacity: 3,
      price: "180",
      status: "available" as const,
    },
    {
      id: "6",
      name: "Premium Suite 501",
      type: "Premium Suite",
      capacity: 4,
      price: "240",
      status: "occupied" as const,
    },
    {
      id: "7",
      name: "Standard Room 112",
      type: "Standard Room",
      capacity: 2,
      price: "85",
      status: "available" as const,
    },
    {
      id: "8",
      name: "Deluxe Suite 308",
      type: "Deluxe Suite",
      capacity: 3,
      price: "175",
      status: "available" as const,
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
            <p className="text-muted-foreground">Manage your room inventory and availability</p>
          </div>
          <Button data-testid="button-add-room">
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              className="pl-9"
              data-testid="input-search-rooms"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Room Types</SelectItem>
              <SelectItem value="standard">Standard Room</SelectItem>
              <SelectItem value="deluxe">Deluxe Suite</SelectItem>
              <SelectItem value="premium">Premium Suite</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockRooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </div>
    </div>
  );
}

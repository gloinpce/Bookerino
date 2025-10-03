import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Room } from "@shared/schema";
import { RoomCard } from "@/components/room-card";
import { RoomDialog } from "@/components/room-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Rooms() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/rooms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Succes",
        description: "Camera a fost ștearsă cu succes",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge camera",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sigur vrei să ștergi această cameră?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingRoom(undefined);
    setDialogOpen(true);
  };

  const filteredRooms = rooms?.filter((room) => {
    const matchesSearch =
      searchQuery === "" ||
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || room.type.toLowerCase().includes(typeFilter.toLowerCase());

    const matchesStatus = statusFilter === "all" || room.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-auto" data-scroll-container>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Camere</h1>
            <p className="text-muted-foreground">Gestionează inventarul și disponibilitatea camerelor</p>
          </div>
          <Button onClick={handleAddNew} data-testid="button-add-room">
            Adaugă Cameră
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Caută camere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-rooms"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Tipurile</SelectItem>
              <SelectItem value="standard">Cameră Standard</SelectItem>
              <SelectItem value="deluxe">Suită Deluxe</SelectItem>
              <SelectItem value="premium">Suită Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Statusurile</SelectItem>
              <SelectItem value="available">Disponibilă</SelectItem>
              <SelectItem value="occupied">Ocupată</SelectItem>
              <SelectItem value="maintenance">Întreținere</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-lg" data-testid={`skeleton-room-${i}`} />
            ))}
          </div>
        ) : filteredRooms && filteredRooms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                type={room.type}
                capacity={room.capacity}
                price={room.price}
                status={room.status as "available" | "occupied" | "maintenance"}
                onEdit={() => handleEdit(room)}
                onDelete={() => handleDelete(room.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="text-no-rooms">
            <p className="text-muted-foreground">
              {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                ? "Nu s-au găsit camere care să corespundă filtrelor"
                : "Nu există camere încă. Adaugă prima cameră pentru a începe."}
            </p>
          </div>
        )}
      </div>

      <RoomDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        room={editingRoom}
      />
    </div>
  );
}

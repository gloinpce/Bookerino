import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertRoomSchema, type Room, type InsertRoom } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room;
}

export function RoomDialog({ open, onOpenChange, room }: RoomDialogProps) {
  const { toast } = useToast();
  const isEdit = !!room;

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const uniqueRoomTypes = useMemo(() => {
    const types = new Set(rooms.map(r => r.type).filter(Boolean));
    return Array.from(types).sort();
  }, [rooms]);

  const form = useForm<InsertRoom>({
    resolver: zodResolver(insertRoomSchema),
    defaultValues: {
      name: "",
      type: "",
      capacity: 1,
      price: "0",
      status: "available",
    },
  });

  useEffect(() => {
    if (open) {
      if (room) {
        form.reset({
          name: room.name,
          type: room.type,
          capacity: room.capacity,
          price: room.price,
          status: room.status,
        });
      } else {
        form.reset({
          name: "",
          type: "",
          capacity: 1,
          price: "0",
          status: "available",
        });
      }
    }
  }, [open, room, form]);

  const createMutation = useMutation({
    mutationFn: (data: InsertRoom) => apiRequest("POST", "/api/rooms", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Succes",
        description: "Camera a fost adăugată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga camera",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertRoom) =>
      apiRequest("PATCH", `/api/rooms/${room?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      toast({
        title: "Succes",
        description: "Camera a fost actualizată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza camera",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRoom) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-room">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editează Camera" : "Adaugă Cameră Nouă"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifică detaliile camerei"
              : "Completează informațiile pentru noua cameră"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume Cameră</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ex: Deluxe Suite 301"
                      data-testid="input-room-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tip Cameră</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        list="room-types"
                        placeholder="Introduceți tipul (ex: Cameră dublă standard)"
                        data-testid="input-room-type"
                      />
                      <datalist id="room-types">
                        {uniqueRoomTypes.map((type) => (
                          <option key={type} value={type} />
                        ))}
                      </datalist>
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Introduceți exact tipul camerei de pe Booking.com sau alegeți din sugestii
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacitate</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-room-capacity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preț/Noapte (RON)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        data-testid="input-room-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-room-status">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Disponibilă</SelectItem>
                      <SelectItem value="occupied">Ocupată</SelectItem>
                      <SelectItem value="maintenance">Întreținere</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel"
              >
                Anulează
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                data-testid="button-save-room"
              >
                {isPending ? "Se salvează..." : isEdit ? "Salvează" : "Adaugă"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

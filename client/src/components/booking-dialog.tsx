import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertBookingSchema, type Booking, type InsertBooking, type Room } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
}

export function BookingDialog({ open, onOpenChange, booking }: BookingDialogProps) {
  const { toast } = useToast();
  const isEdit = !!booking;

  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["/api/rooms"],
  });

  const form = useForm<InsertBooking>({
    resolver: zodResolver(insertBookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      roomId: "",
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "pending",
      totalPrice: "0",
      source: "direct",
    },
  });

  useEffect(() => {
    if (open) {
      if (booking) {
        form.reset({
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
          roomId: booking.roomId,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
          status: booking.status,
          totalPrice: booking.totalPrice,
          source: booking.source || "direct",
        });
      } else {
        form.reset({
          guestName: "",
          guestEmail: "",
          roomId: "",
          checkIn: new Date(),
          checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "pending",
          totalPrice: "0",
          source: "direct",
        });
      }
    }
  }, [open, booking, form]);

  const createMutation = useMutation({
    mutationFn: (data: InsertBooking) => apiRequest("POST", "/api/bookings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Succes",
        description: "Rezervarea a fost creată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut crea rezervarea",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertBooking) =>
      apiRequest("PATCH", `/api/bookings/${booking?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Succes",
        description: "Rezervarea a fost actualizată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza rezervarea",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBooking) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-booking">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editează Rezervarea" : "Rezervare Nouă"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifică detaliile rezervării"
              : "Completează informațiile pentru noua rezervare"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nume Oaspete</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ex: Ion Popescu"
                        data-testid="input-guest-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Oaspete</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="ex: ion@example.com"
                        data-testid="input-guest-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cameră</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-room">
                        <SelectValue placeholder="Selectează camera" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms
                        ?.filter(r => r.status === 'available' || r.id === booking?.roomId)
                        .map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {room.price} RON/noapte
                          {room.status !== 'available' && ' (Ocupată)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                            data-testid="button-check-in"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Selectează data"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                            data-testid="button-check-out"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : "Selectează data"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preț Total (RON)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        step="0.01"
                        data-testid="input-total-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        <SelectTrigger data-testid="select-booking-status">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">În Așteptare</SelectItem>
                        <SelectItem value="confirmed">Confirmată</SelectItem>
                        <SelectItem value="checked-in">Check-in Efectuat</SelectItem>
                        <SelectItem value="checked-out">Check-out Efectuat</SelectItem>
                        <SelectItem value="cancelled">Anulată</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sursă Rezervare</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-booking-source">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="booking.com">Booking.com</SelectItem>
                      <SelectItem value="airbnb">Airbnb</SelectItem>
                      <SelectItem value="expedia">Expedia</SelectItem>
                      <SelectItem value="phone">Telefon</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="other">Altele</SelectItem>
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
                data-testid="button-save-booking"
              >
                {isPending ? "Se salvează..." : isEdit ? "Salvează" : "Creează"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

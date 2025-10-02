import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertMealSchema, type Meal, type InsertMeal } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface MealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal?: Meal;
}

const DAYS = [
  { id: "1", label: "Luni" },
  { id: "2", label: "Marți" },
  { id: "3", label: "Miercuri" },
  { id: "4", label: "Joi" },
  { id: "5", label: "Vineri" },
  { id: "6", label: "Sâmbătă" },
  { id: "7", label: "Duminică" },
];

export function MealDialog({ open, onOpenChange, meal }: MealDialogProps) {
  const { toast } = useToast();
  const isEdit = !!meal;

  const form = useForm<InsertMeal>({
    resolver: zodResolver(insertMealSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "0",
      validFrom: undefined,
      validTo: undefined,
      availableDays: "1,2,3,4,5,6,7",
      isActive: 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (meal) {
        form.reset({
          name: meal.name,
          description: meal.description,
          category: meal.category,
          price: meal.price,
          validFrom: meal.validFrom ? new Date(meal.validFrom) : undefined,
          validTo: meal.validTo ? new Date(meal.validTo) : undefined,
          availableDays: meal.availableDays,
          isActive: meal.isActive,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          category: "",
          price: "0",
          validFrom: undefined,
          validTo: undefined,
          availableDays: "1,2,3,4,5,6,7",
          isActive: 1,
        });
      }
    }
  }, [open, meal, form]);

  const createMutation = useMutation({
    mutationFn: (data: InsertMeal) => apiRequest("POST", "/api/meals", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Succes",
        description: "Masa a fost adăugată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga masa",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertMeal) =>
      apiRequest("PATCH", `/api/meals/${meal?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Succes",
        description: "Masa a fost actualizată cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza masa",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMeal) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedDays = (form.watch("availableDays") || "").split(",").filter(Boolean);

  const toggleDay = (dayId: string) => {
    const currentDays = selectedDays;
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId];
    
    form.setValue("availableDays", newDays.sort((a, b) => Number(a) - Number(b)).join(","));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="dialog-title-meal">
            {isEdit ? "Editează Masa" : "Adaugă Masă Nouă"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifică detaliile mesei și setările de valabilitate"
              : "Completează detaliile noii mese și setează valabilitatea"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume Masă *</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Pizza Margherita" {...field} data-testid="input-meal-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descriere *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrierea mesei..." 
                      {...field} 
                      data-testid="input-meal-description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie *</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Pizza" {...field} data-testid="input-meal-category" />
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
                    <FormLabel>Preț (RON) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        data-testid="input-meal-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valabil De La</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        data-testid="input-meal-valid-from"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valabil Până La</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? format(new Date(field.value), "yyyy-MM-dd") : ""}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        data-testid="input-meal-valid-to"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="availableDays"
              render={() => (
                <FormItem>
                  <FormLabel>Zile Disponibile</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {DAYS.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.id}`}
                          checked={selectedDays.includes(day.id)}
                          onCheckedChange={() => toggleDay(day.id)}
                          data-testid={`checkbox-day-${day.id}`}
                        />
                        <label
                          htmlFor={`day-${day.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === 1}
                      onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                      data-testid="checkbox-meal-active"
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Masă Activă</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-meal"
              >
                Anulează
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit-meal"
              >
                {isEdit ? "Salvează" : "Adaugă"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

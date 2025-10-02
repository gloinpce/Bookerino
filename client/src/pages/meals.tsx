import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Meal } from "@shared/schema";
import { MealDialog } from "@/components/meal-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Edit, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO, isWithinInterval } from "date-fns";

export default function Meals() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const { data: meals, isLoading } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/meals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Succes",
        description: "Masa a fost ștearsă cu succes",
      });
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge masa",
        variant: "destructive",
      });
    },
  });

  const consumeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/meals/${id}/consume`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Succes",
        description: "Consumul a fost înregistrat",
      });
    },
  });

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sigur vrei să ștergi această masă?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    setEditingMeal(undefined);
    setDialogOpen(true);
  };

  const handleConsume = (id: string) => {
    consumeMutation.mutate(id);
  };

  const isAvailableNow = (meal: Meal) => {
    const now = new Date();
    
    if (meal.validFrom && meal.validTo) {
      const validFrom = parseISO(meal.validFrom.toString());
      const validTo = parseISO(meal.validTo.toString());
      if (!isWithinInterval(now, { start: validFrom, end: validTo })) {
        return false;
      }
    }
    
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const availableDays = meal.availableDays.split(',').map(Number);
    
    return availableDays.includes(dayOfWeek) && meal.isActive === 1;
  };

  const categories = Array.from(new Set(meals?.map(m => m.category) || []));

  const filteredMeals = meals?.filter((meal) => {
    const matchesSearch =
      searchQuery === "" ||
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "all" || meal.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-auto" data-scroll-container>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Mese & Meniuri Restaurant</h1>
            <p className="text-muted-foreground">Gestionează meniurile restaurantului și valabilitatea acestora</p>
          </div>
          <Button onClick={handleAddNew} data-testid="button-add-meal">
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Masă
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Caută mese..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-meals"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate Categoriile</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredMeals && filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} data-testid={`meal-card-${meal.id}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" data-testid={`meal-name-${meal.id}`}>
                      {meal.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-xs" data-testid={`meal-category-${meal.id}`}>
                        {meal.category}
                      </Badge>
                      {isAvailableNow(meal) ? (
                        <Badge variant="default" className="text-xs bg-green-600">Disponibil</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Indisponibil</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(meal)}
                      data-testid={`button-edit-meal-${meal.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(meal.id)}
                      data-testid={`button-delete-meal-${meal.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`meal-description-${meal.id}`}>
                    {meal.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" data-testid={`meal-price-${meal.id}`}>
                      {parseFloat(meal.price).toFixed(2)} RON
                    </span>
                  </div>
                  {meal.validFrom && meal.validTo && (
                    <div className="text-xs text-muted-foreground">
                      <div>Valabil: {format(parseISO(meal.validFrom.toString()), "dd.MM.yyyy")} - {format(parseISO(meal.validTo.toString()), "dd.MM.yyyy")}</div>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Consum: <span className="font-semibold" data-testid={`meal-consumption-${meal.id}`}>{meal.consumptionCount || 0}</span> porții
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleConsume(meal.id)}
                    disabled={!isAvailableNow(meal)}
                    data-testid={`button-consume-meal-${meal.id}`}
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Înregistrează Consum
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">Nu există mese disponibile</p>
              <Button onClick={handleAddNew} className="mt-4" data-testid="button-add-first-meal">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă Prima Masă
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <MealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        meal={editingMeal}
      />
    </div>
  );
}

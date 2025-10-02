import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { type Review } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const responseSchema = z.object({
  response: z.string().min(1, "Răspunsul este obligatoriu"),
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface ReviewResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review;
}

export function ReviewResponseDialog({ open, onOpenChange, review }: ReviewResponseDialogProps) {
  const { toast } = useToast();

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: "",
    },
  });

  useEffect(() => {
    if (open && review) {
      form.reset({
        response: review.response || "",
      });
    }
  }, [open, review, form]);

  const updateMutation = useMutation({
    mutationFn: (data: ResponseFormData) =>
      apiRequest("PATCH", `/api/reviews/${review?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Succes",
        description: "Răspunsul a fost salvat cu succes",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva răspunsul",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResponseFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-review-response">
        <DialogHeader>
          <DialogTitle>Răspunde la recenzie</DialogTitle>
          <DialogDescription>
            Răspunde la recenzia de la {review?.guestName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Răspunsul tău</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Scrie un răspuns la recenzie..."
                      className="min-h-[120px]"
                      data-testid="textarea-response"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
                data-testid="button-cancel"
              >
                Anulează
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-save-response"
              >
                {updateMutation.isPending ? "Se salvează..." : "Salvează răspunsul"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

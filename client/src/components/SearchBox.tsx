import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Search, Loader2 } from "lucide-react";

interface SearchBoxProps {
  form: UseFormReturn<{ query: string }>;
  onSubmit: (data: { query: string }) => void;
  isLoading: boolean;
}

export function SearchBox({ form, onSubmit, isLoading }: SearchBoxProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Describe your use case (e.g., 'I need a model for summarizing medical texts')"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </form>
    </Form>
  );
}

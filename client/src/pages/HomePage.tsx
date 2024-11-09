import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { SearchBox } from "../components/SearchBox";
import { ComparisonTable } from "../components/ComparisonTable";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const searchSchema = z.object({
  query: z.string().min(1, "Please enter a search query"),
});

type SearchFormData = z.infer<typeof searchSchema>;

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, error, isLoading } = useSWR(
    searchQuery ? `/api/search?q=${encodeURIComponent(searchQuery)}` : null
  );

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchFormData) => {
    setSearchQuery(data.query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
        Llama 3 Model Finder
      </h1>

      <Card className="p-6 mb-8">
        <SearchBox form={form} onSubmit={onSubmit} isLoading={isLoading} />
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load results. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Llama 3 Models</h2>
            <ComparisonTable models={data.llama3Models} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Alternative Models</h2>
            <ComparisonTable models={data.alternatives} />
          </section>
        </div>
      )}
    </div>
  );
}

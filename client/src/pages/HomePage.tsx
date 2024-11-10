import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { SearchBox } from "../components/SearchBox";
import { ComparisonTable } from "../components/ComparisonTable";
import { SourcesList } from "../components/SourcesList";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (data: SearchFormData) => {
    setSearchQuery(data.query);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div 
        className="relative mb-8 py-12 -mx-4 px-4"
        style={{
          backgroundImage: 'url("/Team_Llama.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay for better text visibility */}
        <h1 className="relative text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent z-10">
          Llama 3 Finetune Finder
        </h1>
      </div>

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
            <h2 className="text-2xl font-semibold mb-4">Llama 3 Based</h2>
            <ComparisonTable models={data.llama3Models} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Alternative Models</h2>
            <ComparisonTable models={data.alternatives} />
          </section>

          {data.sources && data.sources.length > 0 && (
            <section>
              <Separator className="my-8" />
              <h2 className="text-xl font-semibold mb-4">Related Sources</h2>
              <SourcesList sources={data.sources} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

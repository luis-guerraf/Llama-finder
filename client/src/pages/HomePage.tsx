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
        className="relative mb-8 -mx-4"
        style={{
          backgroundImage: 'url("/Team_Llama.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '300px',
        }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5))',
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full py-16 px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-100 to-white bg-clip-text text-transparent">
            Llama 3 Finetune Finder
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Discover and compare the best Llama 3 fine-tuned models for your specific use case
          </p>
        </div>
      </div>

      <Card className="p-6 mb-8 shadow-lg">
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

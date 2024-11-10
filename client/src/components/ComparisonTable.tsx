import { ModelInfo } from "../types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface ComparisonTableProps {
  models: ModelInfo[];
}

export function ComparisonTable({ models }: ComparisonTableProps) {
  if (!models.length) {
    return <p className="text-muted-foreground">No models found.</p>;
  }

  function formatDate(dateString: string) {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Model</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Dataset</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Instruct</TableHead>
            <TableHead>Featherless</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.name}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {model.features}
                </div>
              </TableCell>
              <TableCell>{model.dataset}</TableCell>
              <TableCell>{model.size}</TableCell>
              <TableCell>
                {model.instruct ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {model.featherlessAvailable ? (
                  <Check className="text-green-500" />
                ) : (
                  <X className="text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {formatDate(model.lastUpdated)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Dataset</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Instruct</TableHead>
            <TableHead>Featherless</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.flavor}>
              <TableCell className="font-medium">{model.flavor}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {model.features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
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
              <TableCell className="max-w-md">{model.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

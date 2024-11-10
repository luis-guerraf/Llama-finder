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
import { Check, X, TrendingUp, BarChart, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  function formatNumber(num: number) {
    return new Intl.NumberFormat().format(num);
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
            <TableHead>Performance</TableHead>
            <TableHead>Popularity</TableHead>
            <TableHead>Instruct</TableHead>
            <TableHead>Featherless</TableHead>
            <TableHead className="min-w-[200px]">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.name}>
              <TableCell className="font-medium">{model.name}</TableCell>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4" />
                        <span className="sr-only">Performance Metrics</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        {model.trainingMetrics?.loss && (
                          <p>Loss: {model.trainingMetrics.loss.toFixed(4)}</p>
                        )}
                        {model.trainingMetrics?.perplexity && (
                          <p>Perplexity: {model.trainingMetrics.perplexity.toFixed(2)}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">
                          {formatNumber(model.downloads)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>Downloads: {formatNumber(model.downloads)}</p>
                        <p>Likes: {formatNumber(model.likes)}</p>
                        <p>Last Updated: {formatDate(model.lastUpdated)}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
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
              <TableCell className="max-w-md">
                <div className="flex items-center gap-2">
                  <span className="truncate">{model.details}</span>
                  <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(model.lastUpdated)}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

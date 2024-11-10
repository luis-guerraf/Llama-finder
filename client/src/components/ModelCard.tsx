import { ModelInfo } from "../types/api";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  X,
  Info,
  Database,
  Scale,
  BrainCircuit,
  Cloud,
  Download,
  ThumbsUp,
  Clock,
  BarChart,
} from "lucide-react";

interface ModelCardProps {
  model: ModelInfo;
  isLlama3: boolean;
}

export function ModelCard({ model, isLlama3 }: ModelCardProps) {
  function formatNumber(num: number) {
    return new Intl.NumberFormat().format(num);
  }

  function formatDate(dateString: string) {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <Card className={`h-full ${isLlama3 ? "border-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{model.name}</h3>
            {isLlama3 && (
              <Badge className="mt-1" variant="default">
                Llama 3
              </Badge>
            )}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{model.details}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {model.features.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Dataset:</span>
            <span className="font-medium">{model.dataset}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Size:</span>
            <span className="font-medium">{model.size}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Instruct:</span>
            {model.instruct ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Cloud className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Featherless:</span>
            {model.featherlessAvailable ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Downloads:</span>
            <span className="font-medium">{formatNumber(model.downloads)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Likes:</span>
            <span className="font-medium">{formatNumber(model.likes)}</span>
          </div>

          {(model.trainingMetrics?.loss || model.trainingMetrics?.perplexity) && (
            <div className="flex items-center gap-2 text-sm">
              <BarChart className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Performance:</span>
              <div className="space-x-2">
                {model.trainingMetrics.loss && (
                  <span>Loss: {model.trainingMetrics.loss.toFixed(4)}</span>
                )}
                {model.trainingMetrics.perplexity && (
                  <span>PPL: {model.trainingMetrics.perplexity.toFixed(2)}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Updated:</span>
            <span className="font-medium">{formatDate(model.lastUpdated)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open(`https://huggingface.co/${model.name}`, "_blank")
          }
        >
          View on HuggingFace
        </Button>
      </CardFooter>
    </Card>
  );
}

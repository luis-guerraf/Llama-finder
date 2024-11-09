import { ModelInfo } from "../types/api";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
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
} from "lucide-react";

interface ModelCardProps {
  model: ModelInfo;
  isLlama3: boolean;
}

export function ModelCard({ model, isLlama3 }: ModelCardProps) {
  return (
    <Card className={`h-full ${isLlama3 ? "border-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-2">{model.flavor}</h3>
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
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            window.open(`https://huggingface.co/${model.flavor}`, "_blank")
          }
        >
          View on HuggingFace
        </Button>
      </CardFooter>
    </Card>
  );
}

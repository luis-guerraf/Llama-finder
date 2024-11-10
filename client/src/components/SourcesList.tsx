import { SourceInfo } from "../types/api";
import { Card } from "./ui/card";
import { ExternalLink, Calendar, Globe, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface SourcesListProps {
  sources: SourceInfo[];
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-2">
      {sources.map((source, index) => (
        <Card key={index} className="p-3 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <a 
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline text-primary flex items-center gap-1"
              >
                {source.title}
                <ExternalLink className="h-3 w-3" />
              </a>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{source.domain}</span>
                </div>
                {source.published_date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(source.published_date).toLocaleDateString()}</span>
                  </div>
                )}
                {source.domain_authority && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <TrendingUp className="h-3 w-3" />
                          <span>
                            {source.domain_authority.rank ? `Rank: ${source.domain_authority.rank}` : ''}
                            {source.domain_authority.backlinks ? ` • ${source.domain_authority.backlinks} backlinks` : ''}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Domain Authority Metrics</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">{source.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

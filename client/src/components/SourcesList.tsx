import { SourceInfo } from "../types/api";
import { Card } from "./ui/card";
import { ExternalLink } from "lucide-react";

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
              <p className="text-xs text-gray-500 mt-1">{source.domain}</p>
              {source.published_date && (
                <p className="text-xs text-gray-400">
                  Published: {new Date(source.published_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

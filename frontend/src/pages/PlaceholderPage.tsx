import React from "react";
import { Sparkles, Layers, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface PlaceholderPageProps {
  title: string;
  moduleName: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  moduleName,
  description = "This module is part of the HRFlow enterprise SaaS foundation and will be fully generated in the upcoming phases.",
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
              SaaS Foundation
            </span>
            <span className="text-xs text-muted-foreground font-medium">Enterprise v1.0</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <span>Documentation</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase Ready</span>
          </Button>
        </div>
      </div>

      <Card className="border-dashed border-2 bg-card/50">
        <CardHeader className="text-center py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <Layers className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">{moduleName} Module</CardTitle>
          <CardDescription className="max-w-md mx-auto mt-2 text-base">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-12">
          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-xs font-mono text-muted-foreground border">
            <span>Status: Foundation Ready & Initialized</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;

import { ExternalLink, Map, Layers, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QuickmapModule = () => {
  const openQuickmap = () => {
    window.open('https://quickmap.lroc.im-ldi.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full w-full p-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">LROC Quickmap</h1>
          <p className="text-muted-foreground text-lg">Interactive Lunar Reconnaissance Orbiter Camera mapping tool</p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              About LROC Quickmap
            </CardTitle>
            <CardDescription>
              High-resolution interactive mapping platform for lunar surface exploration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80">
              LROC Quickmap provides access to the Lunar Reconnaissance Orbiter Camera (LROC) imagery 
              and allows you to explore the Moon's surface in unprecedented detail.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <Layers className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Multiple Layers</h3>
                <p className="text-sm text-muted-foreground">Browse various data layers and imagery</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <Navigation className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">Interactive Navigation</h3>
                <p className="text-sm text-muted-foreground">Pan, zoom, and explore the lunar surface</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-muted/30">
                <Map className="h-8 w-8 text-primary" />
                <h3 className="font-semibold">High Resolution</h3>
                <p className="text-sm text-muted-foreground">Access detailed imagery and measurements</p>
              </div>
            </div>

            <Button 
              onClick={openQuickmap}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Launch LROC Quickmap
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Opens in a new window at quickmap.lroc.im-ldi.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickmapModule;

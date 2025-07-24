import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Database, Microscope, Rocket, Waves } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-celestial">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/21fa0edb-b252-42c1-bd21-38a5e74baa22.png" 
                alt="Potomac Scientific Database" 
                className="h-24 w-auto animate-swan-float"
              />
            </div>
            
            {/* Hero Text */}
            <div className="space-y-6 flow-in">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Unleashing a New Wave 
                <br />
                of Science
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Potomac empowers researchers with secure, compliant, and intelligent 
                data management across lunar surfaces, seabed ecosystems, and material sciences.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6 glow-on-hover">
                <Link to="/dashboard">
                  Explore Data Modules
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Scientific Data Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced data management solutions built for the most demanding scientific research environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Lunar Data Module */}
            <Card className="module-card group cursor-pointer">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Lunar Surface Analysis
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive lunar geological data, surface composition analysis, and mission-critical research datasets.
                </p>
              </div>
            </Card>

            {/* Seabed Ecology Module */}
            <Card className="module-card group cursor-pointer">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-data/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Waves className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Seabed Ecology Research
                </h3>
                <p className="text-muted-foreground">
                  Deep ocean ecosystem data, marine biodiversity analysis, and environmental monitoring systems.
                </p>
              </div>
            </Card>

            {/* Material Science Module */}
            <Card className="module-card group cursor-pointer">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">
                  Material Sciences
                </h3>
                <p className="text-muted-foreground">
                  Advanced material properties, structural analysis, and cutting-edge research data management.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <Database className="h-16 w-16 text-primary mx-auto sparkle" />
            <h2 className="text-4xl font-bold text-foreground">
              CMMC Level 3 Compliant
            </h2>
            <p className="text-xl text-muted-foreground">
              Enterprise-grade security with role-based access control, ensuring your sensitive 
              scientific data meets the highest government and institutional standards.
            </p>
            <div className="flex justify-center pt-6">
              <Button asChild variant="outline" size="lg">
                <Link to="/security">
                  View Security Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;